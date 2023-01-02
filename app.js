require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log('DB CONNECTED'))
    .catch(() => console.log('ERROR CONNECTING DB'));

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started at port ${PORT}`));
