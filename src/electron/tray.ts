import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "node:path";
import { getIconPath } from "./pathResolver";
export function createTray(mainWindow: BrowserWindow) {
    // 创建托盘 在顶部显示
    const tray = new Tray(path.join(getIconPath(), process.platform === 'darwin' ? 'trayIconTemplate.png' : 'trayIcon.png'))
    // 添加点击托盘图标的事件监听
    // tray.on('click', () => {
    //     mainWindow.show()
    //     if (app.dock) {
    //         app.dock.show()
    //     }
    // })
    // // 添加鼠标悬停显示菜单
    // tray.on('mouse-enter', () => {
    //     tray.popUpContextMenu()
    // })
    // // 添加鼠标离开隐藏菜单
    // tray.on('mouse-leave', () => {
    //     mainWindow.hide()
    //     if (app.dock) {
    //         app.dock.hide()
    //     }
    // })
    // 设置托盘菜单
    tray.setContextMenu(
        Menu.buildFromTemplate([
            {
                label: '显示窗口',
                click: () => {
                    mainWindow.show()
                    if (app.dock) {
                        app.dock.show()
                    }
                    // type: 'normal' 这里可以添加菜单项
                }
            },
            {
                label: '退出',
                click: () => {
                    app.quit()
                }
            }
        ])
    )
}