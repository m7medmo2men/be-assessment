class UrlBuilder {
    setProtocol(protocol) {
        this.protocol = protocol;
        return this;
    }

    setUrl(url) {
        this.url = "://" + url;
        return this;
    }

    setPort(port) {
        if (port) {
            this.port = ":" + port;
        }
        return this;
    }

    setPath(path) {
        if (path) {
            this.path = "/" + path;
        }
        return this;
    }

    build() {
        return this.protocol + this.url + this.port + this.path;
    }
}

module.exports = UrlBuilder;
