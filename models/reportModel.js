const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    checkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "URLCheck",
        required: true,
    },

    status: {
        type: String,
        default: "down",
    },
    avaliability: {
        type: Number,
        default: 0,
    },
    outages: {
        type: Number,
        default: 0,
    },
    downtime: {
        type: Number,
        default: 0,
    },
    uptime: {
        type: Number,
        default: 0,
    },
    responseTime: {
        type: Number,
        default: 0,
    },
    history: [],
    hits: {
        type: Number,
        default: 0,
    },
});

const ReportModel = mongoose.model("Report", Schema);
module.exports = ReportModel;
