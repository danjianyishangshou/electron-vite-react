import { ipcMain, WebFrameMain } from 'electron'
import { getUIPath } from './pathResolver'
import { pathToFileURL } from 'url'

export function ISURL(): boolean {
  return process.env.ISURL === 'true'
}
/**
 * 用于控制是否是打包后的环境 为了解决 preload 注入的路径问题
 * @returns
 */
export function isNotDist(): boolean {
  return process.env.ISNOTDIST === 'true'
}
/**
 * 封装ipcMain的handle方法 用与接受 invoke 事件
 * @param key
 * @param handler
 */
export function ipcMainHandle<Key extends keyof TSystem.EventPayloadMapping>(
  key: Key,
  handler: () => TSystem.EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event) => {
    // 限制事件对后台的访问
    validateEventFrame(event.senderFrame)
    return handler()
  })
}
/**
 * 封装ipcMain的on方法 用与接受 send 事件
 * @param key
 * @param handler
 */
export function ipcMainOn<Key extends keyof TSystem.EventPayloadMapping>(
  key: Key,
  handler: (payload: TSystem.EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => {
    // 限制事件对后台的访问
    validateEventFrame(event.senderFrame)
    return handler(payload)
  })
}

/**
 * 封装ipcRenderer的send方法 用于发送事件
 * @param key
 * @param webContents
 * @param payload
 */
export function ipcWebContentsSend<
  Key extends keyof TSystem.EventPayloadMapping
>(
  key: Key,
  webContents: Electron.WebContents,
  payload: TSystem.EventPayloadMapping[Key]
) {
  webContents.send(key, payload)
}
/**
 * 验证事件的来源 是否是 主进程 安全验证
 * @param frame
 * @returns
 */
export function validateEventFrame(frame: WebFrameMain) {
  if (ISURL() && new URL(frame.url).host === 'localhost:5123') {
    return
  }
  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error('Mailcious event')
  }
}
