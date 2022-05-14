const ReportModel = require("../models/reportModel");

async function getReportReportByCheckId(checkId) {
    const report = await ReportModel.findOne({ checkId: checkId });
    return report;
}

async function updateReport(checkId, newReport) {
    const report = await ReportModel.findOneAndUpdate({ checkId: checkId }, newReport, {
        new: true,
    });
    return report;
}

module.exports = {
    getReportReportByCheckId,
    updateReport,
};
