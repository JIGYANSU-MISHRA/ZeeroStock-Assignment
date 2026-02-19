# ZeeroStock — Inventory Search API & UI

A full-stack inventory search application with a **Node.js/Express** backend and a **React (Vite)** frontend. Users can search products by name, filter by category, and narrow results by price range — all in real time.

---

## Tech Stack


Backend:  Node.js, Express 5, CORS 
Frontend: React 18, Vite           
Data: In-memory JS array (15 items) 

---

## How to Run

### Backend

```bash
cd Backend
npm install
node server.js      
```

### Frontend

```bash
cd Frontend
npm install
npm run dev         
```

---

## Search Logic Explanation

The entire search is handled by a single `GET /api/search` endpoint in **`Backend/server.js`**. Filters are applied sequentially on the in-memory inventory array through a chain of `Array.filter()` calls:

1. **Text Search (`q`)** — Case-insensitive **partial match** on the product name.  
   `item.name.toLowerCase().includes(searchTerm)` allows matching any substring (e.g., querying `"steel"` matches both *"Industrial Steel Pipes"* and *"Stainless Steel Bolts"*).

2. **Category Filter (`category`)** — Case-insensitive **exact match** on the category field.  
   Only items whose category string equals the selected category are kept.

3. **Price Range (`minPrice` / `maxPrice`)** — Numeric comparison filters.  
   Items with `price >= minPrice` and `price <= maxPrice` are retained. Either bound can be omitted independently.

Each filter is **optional and additive**: if a query parameter is absent, its corresponding filter step is skipped entirely, so providing no parameters returns the full dataset.

### Frontend Integration

The React frontend (`App.jsx`) builds a `URLSearchParams` object from the current search state and fetches `/api/search?...` on every change. A **300 ms debounce** (`setTimeout` in a `useEffect` cleanup) prevents excessive API calls while the user is still typing.

---

## One Performance Improvement for Large Datasets

**Implement server-side indexing with a search library like Fuse.js or a database with full-text search (e.g., PostgreSQL `tsvector`, MongoDB Atlas Search, or Elasticsearch).**

Currently, every search request iterates over the entire inventory array with `Array.filter()` + `String.includes()` — this is **O(n)** per request. For thousands or millions of products this becomes a bottleneck because:

- Each text search performs a linear scan with substring matching on every item.
- Multiple filters chain additional full-array passes.

By introducing an **inverted index** (what libraries like Fuse.js or Elasticsearch provide), text lookups drop to roughly **O(1)** / **O(log n)** instead of O(n). Combined with database-level indexed queries for category and price-range filtering, response times stay consistently fast regardless of dataset size.

A practical first step would be **moving the data into a database** (e.g., MongoDB or PostgreSQL), adding indexes on `category` and `price`, and leveraging its built-in text search — keeping the same API contract while dramatically improving scalability.

---
