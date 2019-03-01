import express = require('express');
export default class Server {
    app: express.Application;
    port: number;
    constructor(puerto: number);
    static init(puerto: number): Server;
    private publicDir;
    start(callback: Function): void;
}
