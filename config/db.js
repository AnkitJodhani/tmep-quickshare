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



exports.connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    const db_status = true;
    exports.db_status = db_status;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
