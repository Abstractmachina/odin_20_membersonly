const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type:String, required: true},
    body: {type: String, required:true},
    author: {type: Schema.Types.ObjectId, ref: "Author", required: true},
    timestamp: {type: Date, default: Date.now},
});

module.exports = mongoose.model("Message", MessageSchema);