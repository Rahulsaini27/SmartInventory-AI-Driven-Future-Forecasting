// controllers/TransactionController.js
const Order = require('../models/OrderModel');
const Transaction = require('../models/TransactionModel');
const User = require('../models/UserModel');

// const getAllTransactions = async (req, res) => {
//     try {
//         const transactions = await Transaction.find();
//         res.json(transactions);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


const getAllTransactions = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 0; // Limit default to 0 (no limit)
        const transactions = await Transaction.find().limit(limit);
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};






const createTransaction = async (req, res) => {
    try {
        const { paymentMethod, user, order, products, amount } = req.body;

        // Find order by order ID
        const foundOrder = await Order.findById(order);
        if (!foundOrder) return res.status(404).json({ message: 'Order not found' });

        // Find user by user ID
        const foundUser = await User.findById(user);
        if (!foundUser) return res.status(404).json({ message: 'User not found' });

        // Create new transaction
        const newTransaction = new Transaction({
            order: foundOrder._id,
            paymentMethod,
            user: foundUser._id,
            products,
            amount,
            status: 'completed', // Assuming status is 'completed' here
            transactionDate: new Date(),
            paymentDetails: {}  // Add payment details if necessary
        });

        await newTransaction.save();

        // Update order status to completed
        foundOrder.status = 'completed';
        await foundOrder.save();

        res.status(200).json({ message: 'Transaction Completed', transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllTransactions,
    createTransaction,
};
