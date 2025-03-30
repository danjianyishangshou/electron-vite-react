"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const util_1 = require("./util");
const resourceManager_1 = require("./resourceManager");
const pathResolver_1 = require("./pathResolver");
const tray_1 = require("./tray");
const menu_1 = require("./menu");
// 关闭应用程序菜单
// Menu.setApplicationMenu(null)
const createWindow = () => {
    const mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false, // 无边框窗口
        webPreferences: {
            preload: (0, pathResolver_1.getPresloadPath)(),
            nodeIntegration: false,
            // contextBridge API要求必须启用上下文隔离（context isolation）才能正常工作。
            contextIsolation: true,
            webSecurity: true,
        },
    });
    if ((0, util_1.isDev)()) {
        mainWindow.loadURL('http://localhost:5123');
        console.log('---> delevopment <---');
    }
    else {
        console.log('---> production --->' + (process.env.NODE_ENV || 'build'));
        mainWindow.loadFile((0, pathResolver_1.getUIPath)());
    }
    (0, resourceManager_1.pollResource)(mainWindow);
    // 处理获取静态数据的逻辑
    (0, util_1.ipcMainHandle)('getStaticData', resourceManager_1.getStaticData);
    (0, util_1.ipcMainOn)('sendFrameAction', (payload) => {
        switch (payload) {
            case 'MINIMIZE':
                mainWindow.minimize();
                break;
            case 'MAXIMIZE':
                // 最大化和还原窗口
                if (mainWindow.isMaximized()) {
                    mainWindow.unmaximize();
                }
                else {
                    mainWindow.maximize();
                }
                break;
            case 'CLOSE':
                mainWindow.close();
                break;
        }
    });
    (0, tray_1.createTray)(mainWindow);
    (0, menu_1.createMenu)(mainWindow);
    handleCloseEvents(mainWindow);
};
/**
 * 设置关闭窗口
 * @param mainWindow
 */
function handleCloseEvents(mainWindow) {
    let willClose = false;
    // 监听窗口关闭事件
    mainWindow.on('close', (e) => {
        if (willClose)
            return;
        e.preventDefault();
        // 隐藏窗口而不是退出应用
        mainWindow.hide();
        if (electron_1.app.dock) { // 检查是否存在 Dock 对象（macOS 特殊处理）
            // 隐藏 macOS 的 Dock 图标 
            electron_1.app.dock.hide();
        }
    });
    electron_1.app.on('before-quit', () => {
        willClose = true;
    });
    mainWindow.on('show', () => {
        willClose = false;
    });
}
electron_1.app.on('ready', createWindow);
// function handleGetStaticData(callback:()=>TSystem.StaticInfo) {
//     ipcMain.handle('getStaticData',  callback)
// }
// 通过 ipcMain.handle() 来响应数据
// // 主进程注册处理器
// ipcMain.handle('getStaticData', async () => {
//     return await getStaticData();
//   });
//   // 预加载脚本暴露API (preload.ts)
//   contextBridge.exposeInMainWorld('electron', {
//     getStaticData: () => ipcRenderer.invoke('getStaticData')
//   });
//   // 渲染进程调用 (React组件)
//   window.electron.getStaticData().then(data => {
//     console.log(data);
//   });
// 关闭窗口的方法
// 1 closing all windows 关闭所有窗口
// 默认行为：当所有窗口关闭时应用退出
// 监听所有窗口关闭事件
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit() // 非macOS平台直接退出
//     }
//     // macOS平台通常保持应用运行（即使所有窗口关闭）
//     // macOS特殊处理 ：通常保持应用在后台运行（像Finder那样）
// })
// 2 calling app.quit 调用app.quit()
// 强制退出整个应用
// 自动更新完成后退出
// 主动退出应用
// function quitApp() {
//     app.quit() // 会触发before-quit和will-quit事件
// }
//
// 3 automatically (example: autoupdater) 自动退出 (如自动更新)
// 自动更新完成后退出
// autoUpdater.on('update-downloaded', () => {
//     autoUpdater.quitAndInstall() // 自动退出并安装更新
// })
