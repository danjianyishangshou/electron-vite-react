import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { isDev } from './util';
import { pollResource } from './resourceManager';
import { getPresloadPath } from './pathResolver';
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: getPresloadPath(),
            nodeIntegration: false,
            // contextBridge API要求必须启用上下文隔离（context isolation）才能正常工作。
            contextIsolation: true,
            webSecurity: true,
        },
    })
    if(isDev()){
        win.loadURL('http://localhost:5123')
        console.log('---> delevopment <---');
    }else{
        console.log('---> production <---');
        win.loadFile(path.resolve(app.getAppPath(), 'dist-frontend/index.html'))
    }
    pollResource()
}

app.on('ready', createWindow)