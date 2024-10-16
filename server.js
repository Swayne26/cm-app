const express = require('express');
const connectDb = require('./config/dbConnection');
const dotenv = require("dotenv").config();
const app = express();
connectDb();
const port = process.env.PORT;
app.use(express.json())

app.use("/api/contacts", require("./routes/contactroutes"))

app.use("/api/contacts", require("./routes/userRoutes"))
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})

