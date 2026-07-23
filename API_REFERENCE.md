# API Endpoints Reference

## Base URL
```
http://localhost:3000/api/admin
```

## Authentication Headers (Required for all endpoints)
```javascript
{
  'Content-Type': 'application/json',
  'x-system-key': process.env.NEXT_PUBLIC_SYSTEM_API_KEY,
  'Authorization': `Bearer ${authToken}`
}
```

---

## PRODUCTS

### GET All Products
```http
GET /products
```
**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "price": 1200,
      "stock": 50,
      "category": "Korean Skincare",
      "brand": "COSRX",
      "image": "url",
      "description": "...",
      "active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "COSRX Snail Essence",
  "slug": "cosrx-snail-essence",
  "price": 1200,
  "stock": 50,
  "category": "Korean Skincare",
  "brand": "COSRX",
  "description": "Hydrating snail essence",
  "image": "https://...",
  "featured": false
}
```
**Response:** `201 Created`

### PATCH Update Product
```http
PATCH /products
Content-Type: application/json

{
  "id": "product-uuid",
  "updates": {
    "name": "Updated Name",
    "price": 1500,
    "stock": 30
  }
}
```
**Response:** `200 OK`

### DELETE Delete Product
```http
DELETE /products?id=product-uuid
x-system-key: your-api-key
Authorization: Bearer token
```
**Response:** `200 OK`
```json
{ "success": true }
```

---

## BRANDS

### GET All Brands
```http
GET /brands
```
**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "COSRX",
      "slug": "cosrx",
      "logo": "url",
      "country": "South Korea",
      "description": "...",
      "is_korean": true,
      "featured": true,
      "product_count": 8,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST Create Brand
```http
POST /brands
Content-Type: application/json

{
  "name": "COSRX",
  "slug": "cosrx",
  "logo": "https://...",
  "country": "South Korea",
  "description": "Science-driven skincare",
  "is_korean": true,
  "featured": true
}
```
**Response:** `201 Created`

### PATCH Update Brand
```http
PATCH /brands
Content-Type: application/json

{
  "id": "brand-uuid",
  "updates": {
    "description": "Updated description",
    "featured": false
  }
}
```
**Response:** `200 OK`

### DELETE Delete Brand
```http
DELETE /brands?id=brand-uuid
```
**Response:** `200 OK`

---

## CATEGORIES

### GET All Categories
```http
GET /categories
```
**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Korean Skincare",
      "slug": "korean-skincare",
      "description": "K-beauty products",
      "image": "url",
      "icon": "🌸",
      "product_count": 120,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST Create Category
```http
POST /categories
Content-Type: application/json

{
  "name": "Korean Skincare",
  "slug": "korean-skincare",
  "description": "Authentic K-beauty",
  "image": "https://...",
  "icon": "🌸"
}
```
**Response:** `201 Created`

### PATCH Update Category
```http
PATCH /categories
Content-Type: application/json

{
  "id": "category-uuid",
  "updates": {
    "description": "Updated description"
  }
}
```
**Response:** `200 OK`

### DELETE Delete Category
```http
DELETE /categories?id=category-uuid
```
**Response:** `200 OK`

---

## COUPONS

### GET All Coupons
```http
GET /coupons
```
**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "code": "WELCOME10",
      "discount_type": "percentage",
      "discount_value": 10,
      "min_order_value": 500,
      "max_uses": 100,
      "used_count": 45,
      "expires_at": "2025-12-31",
      "active": true,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST Create Coupon
```http
POST /coupons
Content-Type: application/json

{
  "code": "SUMMER20",
  "discount_type": "percentage",
  "discount_value": 20,
  "min_order_value": 1000,
  "max_uses": 50,
  "expires_at": "2025-12-31"
}
```
**Response:** `201 Created`

### PATCH Update Coupon
```http
PATCH /coupons
Content-Type: application/json

{
  "id": "coupon-uuid",
  "updates": {
    "active": false,
    "max_uses": 100
  }
}
```
**Response:** `200 OK`

### DELETE Delete Coupon
```http
DELETE /coupons?id=coupon-uuid
```
**Response:** `200 OK`

---

## SETTINGS

### GET All Settings
```http
GET /settings
```
**Response:** `200 OK`
```json
{
  "data": {
    "free_shipping_threshold": 3000,
    "delivery_charge": 100,
    "max_order_value": 500000,
    "store_email": "support@beautydokanbd.com"
  }
}
```

### PATCH Update Setting
```http
PATCH /settings
Content-Type: application/json

{
  "key": "free_shipping_threshold",
  "value": 5000
}
```
**Response:** `200 OK`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized: Invalid system key"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden: Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 500 Server Error
```json
{
  "error": "Unable to save product"
}
```

---

## cURL Examples

### Create Product
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "x-system-key: your-api-key" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "name": "COSRX Essence",
    "slug": "cosrx-essence",
    "price": 1200,
    "stock": 50,
    "category": "Korean Skincare",
    "brand": "COSRX",
    "description": "Hydrating essence",
    "image": "https://..."
  }'
```

### Get All Products
```bash
curl http://localhost:3000/api/admin/products
```

### Update Product
```bash
curl -X PATCH http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -H "x-system-key: your-api-key" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "id": "product-uuid",
    "updates": {
      "price": 1500,
      "stock": 30
    }
  }'
```

### Delete Product
```bash
curl -X DELETE "http://localhost:3000/api/admin/products?id=product-uuid" \
  -H "x-system-key: your-api-key" \
  -H "Authorization: Bearer your-token"
```

---

## Rate Limiting
Currently no rate limiting. For production, implement:
- 100 requests per minute per IP
- 1000 requests per hour per API key

---

## Pagination
Currently returns all results. For large datasets, implement:
```http
GET /products?page=1&limit=20
```

---

## Filtering Examples
Currently manual client-side filtering. Backend can support:
```http
GET /products?category=Korean%20Skincare&min_price=500&max_price=5000
GET /brands?is_korean=true
GET /coupons?active=true
```
