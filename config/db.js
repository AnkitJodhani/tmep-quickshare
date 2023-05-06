const mongoose = require('mongoose');

// const connectDB = ()=>{
//     // database connection
//     mongoose.connect(process.env.MONGO_URL)
//     .then(()=>{
//         console.log("Database connected successfully");
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// }



const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URL);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }


module.exports = connectDB;