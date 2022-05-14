const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.matchPassword = async function (providedPassword, actualPassword) {
    return await bcrypt.compare(providedPassword, actualPassword);
};
module.exports = mongoose.model("User", userSchema);
