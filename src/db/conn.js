const mongoose = require("mongoose");

const DB = process.env.DATA_BASE;


mongoose.connect(DB)
.then(() => console.log('Connected to Database'))
.catch((err) => console.log(err.message))
