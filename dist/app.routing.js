"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server/server"));
const app_router_1 = __importDefault(require("./routes/app.router"));
const user_router_1 = __importDefault(require("./routes/user.router"));
const routing = server_1.default.arguments;
routing.use('/api/v1/usuario', user_router_1.default);
routing.use('/api/v1', app_router_1.default);
exports.default = routing;
