"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nativeModules = void 0;
const animation_1 = require("./animation");
exports.nativeModules = new Map();
// Register Modules
exports.nativeModules.set("animation", animation_1.setupAnimationModule);
