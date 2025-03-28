"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const node_path_1 = __importDefault(require("node:path"));
const util_1 = require("./util");
const resourceManager_1 = require("./resourceManager");
const pathResolver_1 = require("./pathResolver");
const createWindow = () => {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: (0, pathResolver_1.getPresloadPath)(),
            nodeIntegration: false,
            // contextBridge API要求必须启用上下文隔离（context isolation）才能正常工作。
            contextIsolation: true,
            webSecurity: true,
        },
    });
    if ((0, util_1.isDev)()) {
        win.loadURL('http://localhost:5123');
        console.log('---> delevopment <---');
    }
    else {
        console.log('---> production <---');
        win.loadFile(node_path_1.default.resolve(electron_1.app.getAppPath(), 'dist-frontend/index.html'));
    }
    (0, resourceManager_1.pollResource)();
};
electron_1.app.on('ready', createWindow);
