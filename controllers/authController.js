const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Emailer = require("../utils/emailer");

const signToken = function (id) {
    return jwt.sign({ id }, Process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};

const generateToken = function (user) {
    const token = signToken(user._id);
    return token;
};

const isOwner = function (requestUserId, checkUserId) {
    return requestUserId.toString() === checkUserId.toString();
};

async function verifyToken(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "You are not logged in!" });
    }

    const decoded = await promisify(jwt.verify)(token, Process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);

    req.user = currentUser;
    req.UserID = currentUser._id;
    req.DecodedID = decoded.id;
    next();
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (!user || !(await user.matchPassword(password, user.password))) {
        return res.status(400).json({ message: "Incorrect email or password" });
    }

    user.password = undefined;
    const token = generateToken(user);

    return res.status(200).json({ message: "User found", data: user, token: token });
}

async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        newUser.password = undefined;

        const token = generateToken(newUser);

        const mail = new Emailer(newUser.email);
        await mail.sendVerificationEmail(token);

        return res.status(200).json({ message: "User created", data: newUser });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = { login, register, verifyToken, isOwner };
