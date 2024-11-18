var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var app = express();

// Add CORS middleware to allow cross-origin requests
const cors = require('cors');
app.use(cors());
//db
const connectDB = require('./config/db');
connectDB()



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const voucherRoutes = require('./routes/voucherRoutes');
const brandRoutes = require('./routes/brandRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const styleRoutes = require('./routes/styleRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/brands', brandRoutes);  
app.use('/api/categories', categoryRoutes);
app.use('/api/styles', styleRoutes);
app.use('/api/products', productRoutes);

//documentation
const swaggerUi = require("swagger-ui-express");
const specs = require("./docs/swagger"); // Import the Swagger configuration

// ... (previous code)
// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));



// app.use('/api/products', productRoutes);

module.exports = app;
