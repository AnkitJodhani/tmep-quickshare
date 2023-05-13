
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const db = require('./config/db');
const app = express();

const filesRoute = require('./routes/files');
const welcome = require('./routes/welcome');
// configuration
dotenv.config();
// app.use(cors({
//     origin: '*'
//   }));


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','https://share.ankitjodhani.club')
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    if(req.method==='OPTIONS'){
        res.header('Acess-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET ');
        return res.status(200).json({ });
    }
    next();
})


// connectDB();
app.use(morgan('common'));
app.use(express.json());

app.use('/public',express.static('public'));
app.set('views', path.join(__dirname,'/views'));
app.set('view engine','ejs');



// app.use('/api/files',filesRoute);
app.use('/files',filesRoute);
app.use('/',welcome)



const PORT = process.env.PORT || 3000;
// app.listen(PORT,()=>{
//     console.log(`Server is listening on Port : ${PORT}`);
// })

db.connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Lestning to port ${PORT}`);
    })
})