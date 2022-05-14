const URLCheck = require("../models/URLCheckModel");
const eventEmitter = require("../utils/eventEmitter");
const { isOwner } = require("./authController");

exports.getCheck = async function (req, res) {
    const id = req.params.id;
    const check = await URLCheck.findById(id);
    if (!check) {
        return res.status(400).json({
            message: "Check not found",
        });
    }
    if (!isOwner(req.user._id, check.createdBy)) {
        return res.status(400).json({
            message: "This Check must reached by it's owner",
        });
    }
    return res.status(200).json(check);
};

exports.createCheck = async function (req, res) {
    const newCheck = await new URLCheck({
        ...req.body,
        createdBy: req.user._id,
    });
    await newCheck.save();
    eventEmitter.emit("createCheck", newCheck);
    return res.status(201).json(newCheck);
};

exports.updateCheck = async function (req, res) {
    const updatedCheck = await URLCheck.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedCheck) {
        return res.status(400).json({
            message: "Check not found",
        });
    }
    if (!isOwner(req.user._id, check.createdBy)) {
        return res.status(400).json({
            message: "This Check must reached by it's owner",
        });
    }
    res.status(200).json({
        data: updatedCheck,
    });
};

exports.deleteCheck = async function (req, res) {
    const toBedeletedCheck = await URLCheck.findById(req.params.id);
    if (!toBedeletedCheck) {
        return res.status(400).json({
            message: "Check not found",
        });
    }
    if (!isOwner(req.user._id, toBedeletedCheck.createdBy)) {
        return res.status(400).json({
            message: "This Check must reached by it's owner",
        });
    }
    await URLCheck.findByIdAndDelete(req.params.id);
    eventEmitter.emit("deleteCheck", toBedeletedCheck);
    res.status(200).json({
        message: "Check deleted",
    });
};
