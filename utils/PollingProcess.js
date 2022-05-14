const Emailer = require("./emailer");
const { getReportReportByCheckId, updateReport } = require("../controllers/reportController");
const userModel = require("../models/userModel");
const UrlBuilder = require("./UrlBuilder");
const NetworkService = require("./NetworkService");

class PollingProcess {
    constructor(check) {
        this.check = check;
        this.intervalId = null;
    }

    start() {
        this.intervalId = setInterval(async () => {
            let completeUrl = new UrlBuilder()
                .setProtocol(this.check.protocol)
                .setUrl(this.check.url)
                .setPort(this.check.port)
                .setPath(this.check.path)
                .build();

            const networkService = new NetworkService(completeUrl, this.check);
            const result = networkService.send();

            result
                .then((response) => {
                    if (response.status == 200) {
                        this.handleSuccess(response);
                    } else {
                        this.handleFaliure(response);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }, this.check.interval);
    }

    stop() {
        clearInterval(this.intervalId);
    }

    async handleSuccess(response) {
        const log = `< ${new Date().toUTCString()} > < Success >  ${
            response.headers["request-duration"]
        }ms }`;

        const report = await getReportReportByCheckId(this.check._id);

        const newReport = {
            status: "up",
            uptime: report.uptime + this.check.interval,
            hits: report.hits + 1,
            avaliability: ((report.hits + 1 - report.outages) / (report.hits + 1)) * 100,
            responseTime:
                report.responseTime +
                (response.headers["request-duration"] - report.responseTime) / (report.hits + 1),
            history: [...report.history, log],
        };

        const user = await userModel.findOne({ _id: this.check.createdBy });
        if (report.status != newReport.status) {
            await new Emailer(user.email).sendUrlUpNotification();
        }

        await updateReport(this.check._id, newReport);
    }

    async handleFaliure(response) {
        const log = `< ${new Date().toUTCString()} > < Failure > }`;

        const report = await getReportReportByCheckId(this.check._id);

        const newReport = {
            status: "down",
            hits: report.hits + 1,
            downTime: report.downTime + this.check.interval,
            outages: report.outages + 1,
            avaliability: ((report.hits + 1 - report.outages + 1) / (report.hits + 1)) * 100,
            history: [...report.history, log],
        };

        const user = await userModel.findOne({ _id: this.check.createdBy });
        if (report.status != newReport.status) {
            await new Emailer(user.email).sendUrlDownNotification();
        }

        await updateReport(this.check._id, newReport);
    }
}

module.exports = PollingProcess;
