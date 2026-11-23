from pydantic import BaseModel, Field, model_validator


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=64)
    password: str = Field(..., min_length=1, max_length=128)


class LoginResponse(BaseModel):
    access_token: str = Field(..., description="JWT to send as Bearer token on admin requests.")
    token_type: str = Field("bearer", description="Always 'bearer'.")
    expires_in: int = Field(..., description="Token lifetime in seconds.")


class AdminMeResponse(BaseModel):
    username: str


class LogoutResponse(BaseModel):
    ok: bool = True





from datetime import datetime


class AdminOrderSummary(BaseModel):
    id: int
    created_at: str = Field(..., description="ISO 8601 timestamp.")
    customer_name: str
    customer_phone: str
    wilaya: str
    city: str
    total: float
    status: str
    item_count: int


class AdminOrderListResponse(BaseModel):
    items: list[AdminOrderSummary]
    total: int
    page: int
    page_size: int
    has_next: bool


class AdminOrderItemDetail(BaseModel):
    id: int
    category: str
    product_id: int
    brand: str
    name: str
    specification: str
    size: str | None
    unit_price: float
    quantity: int
    line_total: float


class AdminOrderDetail(BaseModel):
    id: int
    created_at: str
    customer_name: str
    customer_phone: str
    customer_email: str | None
    wilaya: str
    city: str
    notes: str | None
    total: float
    status: str
    items: list[AdminOrderItemDetail]


class OrderStatusResponse(BaseModel):
    order_id: int
    status: str




class AdminStockItem(BaseModel):
    category: str
    id: int
    brand: str
    name: str
    specification: str
    viscosity: str | None = None
    size: str | None = None
    price: float
    quantity: int
    in_stock: bool
    image_front_url: str | None = None
    image_back_url: str | None = None


class AdminStockListResponse(BaseModel):
    items: list[AdminStockItem]
    total: int
    page: int
    page_size: int
    has_next: bool


class AdminStockUpdate(BaseModel):
    brand: str | None = Field(None, min_length=1, max_length=64)
    specification: str | None = Field(None, min_length=1, max_length=500)
    viscosity: str | None = Field(None, max_length=16)
    size: str | None = Field(None, max_length=16)
    price: float | None = Field(None, ge=0)
    quantity: int | None = Field(None, ge=0)
    category_type: str | None = Field(None, max_length=64)

class AdminCacheRecord(BaseModel):
    category: str
    id: int
    brand: str
    model: str
    start_year: int
    end_year: int
    engine: str | None = None
    fuel_type: str | None = None
    gearbox: str | None = None
    transmission_type: str | None = None
    viscosity: str | None = None
    capacity_liters: str | None = None
    oem: str


class AdminCacheListResponse(BaseModel):
    items: list[AdminCacheRecord]
    total: int
    page: int
    page_size: int
    has_next: bool


class AdminCacheCreate(BaseModel):
    category: str = Field(..., pattern="^(engine|transmission)$")
    brand: str = Field(..., min_length=1, max_length=64)
    model: str = Field(..., min_length=1, max_length=500)
    start_year: int = Field(..., ge=1886, le=2200)
    end_year: int = Field(..., ge=1886, le=2200)
    engine: str | None = Field(None, max_length=500)
    fuel_type: str | None = Field(None, max_length=64)
    gearbox: str | None = Field(None, max_length=500)
    transmission_type: str | None = Field(None, max_length=64)
    viscosity: str | None = Field(None, max_length=16)
    capacity_liters: str | None = Field(None, max_length=16)
    oem: str = Field(..., min_length=1, max_length=500)

    @model_validator(mode="after")
    def validate_years_and_fields(self):
        if self.end_year < self.start_year:
            raise ValueError("end_year must be greater than or equal to start_year")
        if self.category == "engine" and not self.engine:
            raise ValueError("engine is required for engine records")
        if self.category == "transmission" and not self.gearbox:
            raise ValueError("gearbox is required for transmission records")
        return self


class AdminCacheUpdate(BaseModel):
    brand: str | None = Field(None, min_length=1, max_length=64)
    model: str | None = Field(None, min_length=1, max_length=500)
    start_year: int | None = Field(None, ge=1886, le=2200)
    end_year: int | None = Field(None, ge=1886, le=2200)
    engine: str | None = Field(None, max_length=500)
    fuel_type: str | None = Field(None, max_length=64)
    gearbox: str | None = Field(None, max_length=500)
    transmission_type: str | None = Field(None, max_length=64)
    viscosity: str | None = Field(None, max_length=16)
    capacity_liters: str | None = Field(None, max_length=16)
    oem: str | None = Field(None, min_length=1, max_length=500)


class AdminStockCreate(BaseModel):
    category: str = Field(..., pattern="^(engine_oil|gearbox_oil|oil_filter|additional)$")
    brand: str = Field(..., min_length=1, max_length=64)
    specification: str = Field(..., min_length=1, max_length=500)
    viscosity: str | None = Field(None, max_length=16)
    size: str | None = Field(None, max_length=16)
    price: float = Field(..., ge=0)
    quantity: int = Field(0, ge=0)
    # Only meaningful for category == "additional"
    category_type: str | None = Field(
        None, max_length=64,
        description="Required for 'additional' category (e.g., 'liquide de frein', 'additif').",
    )
