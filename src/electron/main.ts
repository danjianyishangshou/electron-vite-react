import { app, BrowserWindow } from 'electron'
import { ipcMainHandle, ipcMainOn, ISURL } from './util'
import { getStaticData, pollResource } from './resourceManager'
import { getPresloadPath, getUIPath } from './pathResolver'

import { createTray } from './tray'
import { createMenu } from './menu'

// 关闭应用程序菜单
// Menu.setApplicationMenu(null)

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 无边框窗口
    webPreferences: {
      preload: getPresloadPath(),
      nodeIntegration: false,
      // contextBridge API要求必须启用上下文隔离（context isolation）才能正常工作。
      contextIsolation: true,
      webSecurity: true,
    },
  })
  if (ISURL()) {
    mainWindow.loadURL('http://localhost:5123')
    console.log('---> isUrl <---' + process.env.NODE_ENV)
  } else {
    console.log('---> isPath --->' + (process.env.NODE_ENV || 'build'))
    mainWindow.loadFile(getUIPath())
  }
  pollResource(mainWindow)

  // 处理获取静态数据的逻辑
  ipcMainHandle('getStaticData', getStaticData)

  ipcMainOn('sendFrameAction', (payload) => {
    switch (payload) {
      case 'MINIMIZE':
        mainWindow.minimize()
        break
      case 'MAXIMIZE':
        // 最大化和还原窗口
        if (mainWindow.isMaximized()) {
          mainWindow.unmaximize()
        } else {
          mainWindow.maximize()
        }
        break
      case 'CLOSE':
        mainWindow.close()
        break
    }
  })

  createTray(mainWindow)

  createMenu(mainWindow)

  handleCloseEvents(mainWindow)
}
/**
 * 设置关闭窗口
 * @param mainWindow
 */
function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false
  // 监听窗口关闭事件
  mainWindow.on('close', (e) => {
    if (willClose) return
    e.preventDefault()
    // 隐藏窗口而不是退出应用
    mainWindow.hide()
    if (app.dock) {
      // 检查是否存在 Dock 对象（macOS 特殊处理）
      // 隐藏 macOS 的 Dock 图标
      app.dock.hide()
    }
  })
  app.on('before-quit', () => {
    willClose = true
  })
  mainWindow.on('show', () => {
    willClose = false
  })
}
app.on('ready', createWindow)

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
