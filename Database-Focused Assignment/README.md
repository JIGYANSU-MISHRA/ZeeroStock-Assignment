# Inventory Management System

A Node.js backend application for managing suppliers and inventory, using MongoDB (Atlas).

## Features
-   **Suppliers**: Create and manage supplier information.
-   **Inventory**: Add inventory items linked to suppliers.
-   **Aggregation**: Retrieve inventory grouped by supplier, sorted by total inventory value.

## Technology Stack
-   **Node.js** & **Express**: Backend framework.
-   **MongoDB** & **Mongoose**: Database and ODM.
-   **Atlas**: Cloud database hosting.

## Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Configuration**:
    The project uses a `.env` file for configuration.
    ```env
    MONGODB_URI=mongodb+srv://ZeeroStackDb:db123098@cluster0.qwkmmjh.mongodb.net/inventory_db?appName=Cluster0
    PORT=3000
    ```


3.  **Start Server**:
    ```bash
    npm start
    # OR for development with auto-restart
    npm run dev
    ```

## API Endpoints

### 1. Create Supplier
-   **URL**: `POST /supplier`
-   **Body**:
    ```json
    {
        "name": "Acme Corp",
        "city": "New York"
    }
    ```

### 2. Add Inventory
-   **URL**: `POST /inventory`
-   **Body**:
    ```json
    {
        "supplier_id": "67b4c...", 
        "product_name": "Widget A",
        "quantity": 100,
        "price": 10.50
    }
    ```
    *Note: `supplier_id` must be a valid ID from an existing supplier.*

### 3. Get Inventory Summary
-   **URL**: `GET /inventory`
-   **Description**: Returns all inventory grouped by supplier, sorted by total inventory value (highest to lowest).
-   **Response**:
    ```json
    [
        {
            "_id": "Acme Corp",
            "totalInventoryValue": 2500,
            "items": [ ... ]
        },
        ...
    ]
    ```

## Database Design Choices

### Why NoSQL (MongoDB)?
For this specific assignment, **MongoDB** was chosen over SQL for the following reasons:
1.  **JSON Native**: The data structure flows naturally from the database (BSON) to the API response (JSON) without complex ORM mapping.
2.  **Flexible Schema**: While we enforce a schema with Mongoose, MongoDB allows for easy evolution if we need to add product attributes (e.g., size, color) without running database migrations as we would in SQL.
3.  **Aggregation Framework**: The requirement to *"group by supplier and sort by value"* is handled efficiently in a single query using MongoDB's aggregation pipeline (`$lookup`, `$group`, `$sort`), avoiding multiple round-trips or complex application-side logic.

### Optimization Suggestion
-   **Indexing**: We added an index on the `supplier` field in the `Inventory` collection (`inventorySchema.index({ supplier: 1 });`).
    -   Because, This significantly speeds up lookups when we need to find all inventory for a specific supplier, which is the core of our aggregation query (specifically the `$lookup` stage). Without this index, the database would have to scan every inventory item to find matches.

