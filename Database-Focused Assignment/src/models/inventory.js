const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    },
    product_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0.01
    }
}, { timestamps: true });

// Optional Index for faster lookups by supplier
inventorySchema.index({ supplier: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);
