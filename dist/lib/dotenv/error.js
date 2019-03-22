"use strict";
class ErrorReporter {
    constructor(apiKey) {
        if (apiKey === undefined || apiKey === "") {
            throw new Error("apiKey required");
        }
        this.apiKey = apiKey;
    }
    report(err) {
        // could use apiKey here to send error somewhere
    }
}
