import { app, BrowserWindow } from 'electron'
import path from 'node:path'
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true
        },
    })
 
    const indexPath = path.resolve(app.getAppPath(), 'dist-frontend/index.html');

    win.loadFile(indexPath)
}

app.on('ready', createWindow)