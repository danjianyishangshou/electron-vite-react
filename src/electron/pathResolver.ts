import path from 'node:path'
import { app } from 'electron'


export function getPresloadPath() {
    return path.join(app.getAppPath(), '/dist-electron/preload.cjs')
}
export function getUIPath() {
    return path.join(app.getAppPath(), '/dist-frontend/index.html')
}

export function getIconPath() {
    return path.join(app.getAppPath(), '/src/assets/icons')
}