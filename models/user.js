const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

require('dotenv').config();

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
        
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(this.password, salt);

        this.password = hashedPassword;
        next();
    } catch (err) {
        return next(err);
    }
});

UserSchema.methods.validPassword = async function(password) {
	try {
        console.log("... comparing passwords ")
		return await bcrypt.compare(password, this.password);
	} catch (err) {
		throw new Error(err);
	}
}

UserSchema.methods.becomeMember = (accessCode) => {
    if (accessCode === process.env.MEMBER_ACCESS_CODE) {
        this.isMember = true;
        console.log(`isMember is now: ${this.isMember}`);
        return true;
    }
    return false;
}

UserSchema.virtual("url").get(function() {
    return `/user/${this._id}`;
})

module.exports = mongoose.model("User", UserSchema);