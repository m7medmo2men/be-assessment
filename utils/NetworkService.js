const axios = require("axios");
const https = require("https");

class NetworkService {
    constructor(url, check) {
        this.url = url;
        this.check = check;
        this.axios = axios.create();
    }

    setupConfigs() {
        this.config = {
            headers: Object.assign({}, ...this.check.httpHeaders),
            auth: this.check.authentication,
            timeout: this.check.timeout,
            httpsAgent: new https.Agent({
                rejectUnauthorized: this.check.protocol === "https" ? this.check.ignoreSSL : false,
            }),
        };
    }

    setupInterceptors() {
        this.axios.interceptors.request.use((config) => {
            config.headers["request-startTime"] = process.hrtime();
            return config;
        });

        this.axios.interceptors.response.use((response) => {
            const start = response.config.headers["request-startTime"];
            const end = process.hrtime(start);
            const milliseconds = Math.round(end[0] * 1000 + end[1] / 1000000);
            response.headers["request-duration"] = milliseconds;
            return response;
        });
    }

    async send() {
        this.setupConfigs();
        this.setupInterceptors();

        return await this.axios.get(this.url, this.config);
    }
}

module.exports = NetworkService;
