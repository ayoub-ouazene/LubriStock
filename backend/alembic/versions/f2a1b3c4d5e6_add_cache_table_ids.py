"""Add missing primary keys to vehicle specification cache tables.

Revision ID: f2a1b3c4d5e6
Revises: e59a9581299f
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "f2a1b3c4d5e6"
down_revision: Union[str, Sequence[str], None] = "e59a9581299f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    for table in ("oil_engine_cache", "transmission_oil_cache"):
        columns = {column["name"] for column in inspector.get_columns(table)}
        if "id" not in columns:
            op.add_column(table, sa.Column("id", sa.Integer(), nullable=True))
            # Existing cache rows need deterministic IDs before the primary key
            # can be installed. PostgreSQL sequences provide unique values.
            sequence_name = f"{table}_id_seq"
            op.execute(sa.text(f"CREATE SEQUENCE IF NOT EXISTS {sequence_name}"))
            op.execute(sa.text(f"UPDATE {table} SET id = nextval('{sequence_name}') WHERE id IS NULL"))
            op.execute(sa.text(f"ALTER SEQUENCE {sequence_name} OWNED BY {table}.id"))
            op.alter_column(table, "id", nullable=False)
            op.create_primary_key(f"pk_{table}", table, ["id"])
            op.execute(sa.text(f"ALTER TABLE {table} ALTER COLUMN id SET DEFAULT nextval('{sequence_name}')"))


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    for table in ("oil_engine_cache", "transmission_oil_cache"):
        columns = {column["name"] for column in inspector.get_columns(table)}
        if "id" in columns:
            op.drop_constraint(f"pk_{table}", table_name=table, type_="primary")
            op.drop_column(table, "id")
