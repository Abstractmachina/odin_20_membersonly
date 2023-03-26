const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcryptjs = require("bcryptjs");

const UserSchema = new Schema({
    firstName: {type: String, required: true, maxLength: 100},
    lastName: {type: String, required: true, maxLength: 100},
    username: {type: String, required: true, maxLength: 100},
    isMember: {type: Boolean, required: true},
    password: {type: String, required: true, maxLength: 100},
});

UserSchema.pre('save', async function(next) {
    try {
        const user = this;
        //only need to hash new passwords, so if unmodified, skip.
        if (!user.isModified('password')) next();
        
        const salt = await bcryptjs.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = await bcryptjs.hash(this.password, salt);

        this.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.matchPassword = async function(password) {
	try {
		return await bcryptjs.compare(password, this.password);
	} catch (err) {
		throw new Error(err);
	}
}

UserSchema.virtual("url").get(function() {
    return `/user/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);