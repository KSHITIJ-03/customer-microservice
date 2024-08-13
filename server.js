const mongoose = require('mongoose')

const express = require('express')
const app = require('./app')

const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD)

mongoose.connect(DB).then(con => {
    console.log('DB connected');
}).catch(err => {
    console.log(err);
})


const PORT = process.env.PORT || 8001
app.listen(PORT, () => {
    console.log(`server on port ${PORT}`);
})
