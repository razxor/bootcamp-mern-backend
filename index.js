const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const bcrypt = require('bcryptjs');
const salt = 10;
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Welcome to my site');
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

