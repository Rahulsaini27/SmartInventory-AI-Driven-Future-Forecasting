const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// DB connection imports
const { connectToDatabase } = require('./config/dbConnection');

// Custom routes imports
const productRoutes = require('./routes/ProductRoutes');
const userRoutes = require('./routes/UserRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const categoryRoutes = require('./routes/CategoryRoutes'); 
const transactionRoutes = require('./routes/TransactionRoutes'); 
const authRoutes = require('./routes/authRoutes');
const forecastRoutes = require('./routes/forecastRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173', 
  'https://your-frontend-domain.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy does not allow access from this origin.';
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true, // allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

connectToDatabase();

// Custom Routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes); 
app.use('/transactions', transactionRoutes); 
app.use('/ai', forecastRoutes); 


// Default route
app.get('/', (req, res) => {
    res.send('SmartInventory API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});