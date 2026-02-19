const express = require('express');
const cors = require('cors');
const inventory = require('./data');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET /api/search
app.get('/api/search', (req, res) => {
    try {
        let { q, category, minPrice, maxPrice } = req.query;

        let results = inventory;

        // Filter by Product Name (q) - Partial match, case-insensitive
        if (q) {
            const searchTerm = q.toLowerCase();
            results = results.filter(item => 
                item.name.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by Category - Exact match (case-insensitive for robustness)
        if (category) {
            results = results.filter(item => 
                item.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by Price Range
        if (minPrice) {
            results = results.filter(item => item.price >= Number(minPrice));
        }
        if (maxPrice) {
            results = results.filter(item => item.price <= Number(maxPrice));
        }

        res.json(results);
    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
