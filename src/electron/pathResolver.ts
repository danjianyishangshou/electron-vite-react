import path from 'node:path'
import { app } from 'electron'


export function getPresloadPath(){
    // 如果打包有问题的话 return path.join(app.getAppPath(), isDev()?'.':'..', '/dist-electron/preload.cjs')
    return path.join(app.getAppPath(), '/dist-electron/preload.cjs')
}