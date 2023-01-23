require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');

const app = express();

// DB Connection
mongoose.set("strictQuery", false);
mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('DB CONNECTED'))
    .catch(() => console.log('ERROR CONNECTING DB'));

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', categoryRouter);
app.use('/api', productRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
