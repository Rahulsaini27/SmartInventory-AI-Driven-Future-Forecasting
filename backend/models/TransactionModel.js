// const mongoose = require('mongoose');

// const transactionSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
//     totalPrice: { type: Number, required: true },
//     transactionDate: { type: Date, default: Date.now },
// });

// const Transaction = mongoose.model('Transaction', transactionSchema);

// module.exports = Transaction;

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'online'],
        required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    status: {
        type: String,
        enum: ['initiated', 'completed', 'failed'],
        default: 'initiated'
    },
    transactionDate: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDetails: {
        type: Object,
        default: {}
        // Yeh extra field tum QR code scan se ya online gateway response save karne ke liye use kar sakte ho.
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
