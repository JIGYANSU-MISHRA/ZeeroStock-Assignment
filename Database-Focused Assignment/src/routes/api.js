const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplier');
const Inventory = require('../models/inventory');

// POST /supplier
router.post('/supplier', async (req, res) => {
    try {
        const { name, city } = req.body;
        const supplier = new Supplier({ name, city });
        const savedSupplier = await supplier.save();
        res.status(201).json(savedSupplier);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /inventory
router.post('/inventory', async (req, res) => {
    try {
        const { supplier_id, product_name, quantity, price } = req.body;

        // Check if supplier exists
        const supplierExists = await Supplier.findById(supplier_id);
        if (!supplierExists) {
            return res.status(400).json({ error: 'Invalid supplier_id' });
        }

        const inventory = new Inventory({
            supplier: supplier_id,
            product_name,
            quantity,
            price
        });

        const savedInventory = await inventory.save();
        res.status(201).json(savedInventory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /inventory
router.get('/inventory', async (req, res) => {
    try {
        const pipeline = [
            // Join with Suppliers collection
            {
                $lookup: {
                    from: 'suppliers',
                    localField: 'supplier',
                    foreignField: '_id',
                    as: 'supplierDetails'
                }
            },
            // Unwind supplier array (lookup returns an array)
            { $unwind: '$supplierDetails' },
            // Project needed fields and calculate total value
            {
                $project: {
                    _id: 1,
                    product_name: 1,
                    quantity: 1,
                    price: 1,
                    supplier_name: '$supplierDetails.name', 
                    totalValue: { $multiply: ['$quantity', '$price'] }
                }
            },
            // Group by Supplier Name
            {
                $group: {
                    _id: '$supplier_name',
                    totalInventoryValue: { $sum: '$totalValue' },
                    items: { $push: '$$ROOT' }
                }
            },
            // Sort by Total Inventory Value (Descending)
            { $sort: { totalInventoryValue: -1 } }
        ];

        const results = await Inventory.aggregate(pipeline);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
