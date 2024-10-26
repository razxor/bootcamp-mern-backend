const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express()
const bcrypt = require('bcrypt');
const salt = 10;
const port = process.env.PORT || 3000

app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Welcome to my site');
})


// app.get('/api/courses/:id', (req, res) => {
//     let id = req.params.id
//     let data = courses.find((item) => {
//         return item.course_id == id
//     })
//     res.send(data);
// })

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

