const express = require('express');

const app = express();

app.use(express.json())

const router = require('./router')

app.use('/demo', router)

const db = require('./db');


// Start server
app.listen(2000, () => {
    console.log(`Server running at http://localhost:${2000}`);
});