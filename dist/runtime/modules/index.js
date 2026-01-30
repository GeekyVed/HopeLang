"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeModules = void 0;
const blocode_1 = require("./blocode");
exports.nativeModules = new Map();
// Register Modules
exports.nativeModules.set("blocode", blocode_1.setupBlocodeModule);
