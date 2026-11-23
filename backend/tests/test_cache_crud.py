import pytest
from app.services import product_service


def record(category, start, end, **extra):
    base = {"category": category, "brand": "TestBrand", "model": "Model X", "start_year": start, "end_year": end, "oem": "OEM-1"}
    base.update({"engine": "2.0 TDI"} if category == "engine" else {"gearbox": "6MT", "transmission_type": "manual"})
    base.update(extra)
    return base


def test_cache_crud_and_overlap(monkeypatch):
    rows = []
    class FakeSession:
        def __enter__(self): return self
        def __exit__(self, *args): pass
        def add(self, row): row.id = len(rows) + 1; rows.append(row)
        def commit(self): pass
        def refresh(self, row): pass
        def get(self, model, ident): return next((r for r in rows if isinstance(r, model) and r.id == ident), None)
        def delete(self, row): rows.remove(row)
        def scalars(self, stmt):
            class Result:
                def first(self): return None
                def all(self): return []
            # service overlap uses a real query; this unit test focuses on validation paths.
            return Result()
    monkeypatch.setattr(product_service, "SessionLocal", FakeSession)
    assert product_service.create_cache_item("engine", record("engine", 2010, 2015))["start_year"] == 2010
    with pytest.raises(ValueError, match="Invalid year range"):
        product_service.create_cache_item("engine", record("engine", 2020, 2019))
    with pytest.raises(ValueError, match="gearbox is required"):
        bad = record("transmission", 2020, 2021); del bad["gearbox"]
        product_service.create_cache_item("transmission", bad)
    with pytest.raises(ValueError, match="Unknown cache category"):
        product_service.create_cache_item("invalid", record("engine", 2020, 2021))
