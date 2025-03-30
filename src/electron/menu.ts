import { app, BrowserWindow, Menu } from "electron";
import { ipcWebContentsSend, isDev } from "./util";
/**
 * 创建自定义菜单
 */
export function createMenu(mainWindow: BrowserWindow) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: process.platform === 'darwin' ? undefined : 'App',
            type: 'submenu',
            submenu: [
                {
                    label: '关于',
                    click: () => {
                        console.log('关于')
                    }
                },
                {
                    label: '设置',
                    click: () => {
                        console.log('设置')
                    }
                },
                {
                    label: '开发者工具',
                    click: () => {
                        mainWindow.webContents.openDevTools()
                    },
                    visible: isDev()
                },
                {
                    label: '退出',
                    click: app.quit
                }
            ]
        },
        {
            label: '控制台',
            type: 'submenu',
            submenu: [
                {
                    label: 'CPU',
                    click: () => {
                        ipcWebContentsSend('changeView', mainWindow.webContents, 'CPU')
                    }
                },
                {
                    label: 'RAM',
                    click: () => {
                        ipcWebContentsSend('changeView', mainWindow.webContents, 'RAM')
                    }
                },
                {
                    label: 'STORAGE',
                    click: () => {
                        ipcWebContentsSend('changeView', mainWindow.webContents, 'STORAGE')
                    }
                }
            ]
        }
    ]))
}