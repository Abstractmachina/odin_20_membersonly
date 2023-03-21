const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true, maxLength: 100},
    lastName: {type: String, required: true, maxLength: 100},
    userName: {type: String, required: true, maxLength: 100},
    isMember: {type: Boolean, required: true},
    password_temp: {type: String, required: true, maxLength: 100},
})

UserSchema.virtual("url").get(function() {
    return `/user/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);