const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const nodemailer = require('nodemailer');

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// const createOrder = async (req, res) => {
//     try {
//         const { products, totalPrice, user: userId } = req.body;

//         if (!userId) {
//             return res.status(400).json({ message: 'User ID is required' });
//         }

//         for (const item of products) {
//             const product = await Product.findById(item.product);
//             if (!product) {
//                 return res.status(404).json({ message: `Product not found: ${item.product}` });
//             }
//             if (product.quantity < item.quantity) {
//                 return res.status(400).json({ message: `Not enough stock for product: ${product.name}` });
//             }
//             product.quantity -= item.quantity;
//             await product.save();
//         }

//         const newOrder = new Order({
//             products,
//             totalPrice,
//             user: userId,
//             status: 'pending',  // status must be explicitly set
//             orderDate: new Date()
//         });

//         await newOrder.save();

//         res.status(201).json(newOrder);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server Error" });
//     }
// };


const createOrder = async (req, res) => {
    try {
        const { products, totalPrice, user: userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for product: ${product.name}` });
            }
            product.quantity -= item.quantity;
            
            // Check if stock is below threshold (e.g., 10)
            if (product.quantity < 10) {
                // Send email notification to admin
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'rahulsaini42854@gmail.com',  // Your email address
                        pass: 'cxko kjgz iaow utvx'     // Your email password
                    }
                });

                const mailOptions = {
                    from: 'rahulsaini42854@gmail.com',
                    to: 'rahultestingrequin@gmail.com', // Admin's email
                    subject: 'Low Stock Alert!',
                    text: `The product "${product.name}" is running low on stock. Remaining stock: ${product.quantity}. Please restock it soon.`
                };

                // Send the email
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error("Error sending email:", err);
                    } else {
                        console.log('Low stock email sent: ' + info.response);
                    }
                });
            }

            await product.save();
        }

        // Create new order
        const newOrder = new Order({
            products,
            totalPrice,
            user: userId,
            status: 'pending',  // status must be explicitly set
            orderDate: new Date()
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};


const updateOrder = async (req, res) => {
    try {
        const allowedUpdates = ['products', 'totalPrice', 'user', 'status']; // Restrict fields
        const updates = Object.keys(req.body);

        const isValidOperation = updates.every(update => allowedUpdates.includes(update));
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid updates!' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
};
