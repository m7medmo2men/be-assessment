const mongoose = require("mongoose");

const ReportModel = require("../models/reportModel");

const schema = mongoose.Schema({
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    url: {
        type: String,
        required: [true, "URL is required"],
    },
    protocol: {
        type: String,
        required: [true, "Protocol is required"],
    },
    path: {
        type: String,
    },
    port: {
        type: Number,
    },
    webhook: {
        type: String,
    },
    timeout: {
        type: Number,
        default: 5000,
    },
    interval: {
        type: Number,
        default: 10000,
    },
    threshold: {
        type: Number,
        default: 1,
    },
    authentication: {
        username: String,
        password: String,
    },
    httpHeaders: [Object],
    assert: {
        StatusCode: Number,
    },
    tags: [String],
    ignoreSSL: Boolean,
});

schema.post("save", async function (check) {
    await ReportModel.create({
        checkId: check._id,
    });
});

const URLCheckModel = mongoose.model("URLCheck", schema);
module.exports = URLCheckModel;
