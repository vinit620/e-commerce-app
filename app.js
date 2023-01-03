require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth');

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started at port ${PORT}`));
