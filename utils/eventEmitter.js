const { EventEmitter } = require("events");
const eventEmitter = new EventEmitter();
const PollingProcess = require("./PollingProcess");

let map = new Map();

eventEmitter.on("createCheck", (check) => {
    const process = new PollingProcess(check);
    process.start();
    map.set(check._id.toString(), process);
});

eventEmitter.on("deleteCheck", (check) => {
    const process = map.get(check._id.toString());
    process.stop();
    map.delete(check._id.toString());
});

module.exports = eventEmitter;
