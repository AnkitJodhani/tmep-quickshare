const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    sender: { type: String, required: false },
    receiver: { type: String, required: false },
    uuid: { type: String, required: true },
    status:{type:String,default:"Saved"}
}, { timestamps: true });

module.exports = mongoose.model('File',fileSchema);
