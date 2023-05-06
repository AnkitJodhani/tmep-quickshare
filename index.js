
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');
const app = express();

const filesRoute = require('./routes/files');
// configuration
dotenv.config();
app.use(cors());

// connectDB();
app.use(morgan('common'));
app.use(express.json());

app.use('/public',express.static('public'));
app.set('views', path.join(__dirname,'/views'));
app.set('view engine','ejs');



// app.use('/api/files',filesRoute);
app.use('/files',filesRoute);



const PORT = process.env.PORT || 3000;
// app.listen(PORT,()=>{
//     console.log(`Server is listening on Port : ${PORT}`);
// })


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Lestning to port ${PORT}`);
    })
})