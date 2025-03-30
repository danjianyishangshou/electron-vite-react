// 在初始化时，需要在 preload.ts 中注册 ipcRenderer 事件 用于前后台交互
const electron = require("electron")

// 中间通信链接 contextBridge建立链接  
// - 用于渲染进程与主进程之间的通信
// exposeInMainWorld 用于将一个对象暴露给渲染进程
// 这里定义了之后前端可以通过 window.electron 来调用 ipcRenderer 事件
// 添加一个electron的全局变量 用于前后台交互
electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback) =>
        ipcOn("statistics", (statisics: TSystem.Usage) => callback(statisics)),
    // 这个地方主要与util.ts 中的 ipcMainHandle("getStaticData") 进行通信
    getStaticData: () => ipcInvoke("getStaticData"),
    changeView: (callback) =>
        ipcOn('changeView', (view: TSystem.View) => callback(view)),
    // // 这个地方主要与util.ts 中的 ipcMainOn('sendFrameAction')
    sendFrameAction: (action: TSystem.FrameWindowAction) =>
        ipcSend('sendFrameAction', action),
} satisfies Window["electron"])

type KeyType = keyof TSystem.EventPayloadMapping

/**
 *  invoke 模式 渲染进程调用主进程的方法 
    - invoke 这是Electron 9+引入的 双向通信 方式
    - 渲染进程调用后 等待 主进程返回结果
    - 主进程需要使用 ipcMain.handle() 来响应
    - 适用于需要获取返回数据的场景
 */
function ipcInvoke<Key extends KeyType>(
    key: Key
): Promise<TSystem.EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key)
}
/**
 *  on 事件监听 模式渲染 进程监听主进程主动发送的消息 主进程使用 ipcMain.emit() 或 webContents.send() 触发 适用于主进程主动推送数据的场景
 * @param key 
 * @param callback 
 * @returns 
 */
function ipcOn<Key extends KeyType>(
    key: Key,
    callback: (payload: TSystem.EventPayloadMapping[Key]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)
    electron.ipcRenderer.on(key, cb)
    // 返回一个取消订阅的函数
    return () => electron.ipcRenderer.off(key, cb)
}

/**
 * 发送消息   
 * @param key 
 * @param payload 
 */
function ipcSend<Key extends KeyType>(
    key: Key,
    payload: TSystem.EventPayloadMapping[Key]
) {
    electron.ipcRenderer.send(key, payload)
}

// satisfies 是一个类型断言的操作符
// - 验证右侧表达式是否符合指定的类型
// - 不会改变值的实际类型，只是进行检查
// 相比类型断言(as)的优势 ：
// - 更安全，不会强制类型转换
// - 会进行严格的类型检查
// - 保留了值的原始类型信息

/*
| 特性               | invoke/handle             | on/send                  |
|------------------ |---------------------------|--------------------------|
| 通信方向           | 渲染进程→主进程→渲染进程      | 主进程→渲染进程             |
| 是否等待返回值      | 是                         | 否                       |
| 是否需要响应        | 是                         | 是                       |
| 是否需要主动触发     | 是                         | 否                       |
| 使用场景           | 获取数据、执行操作            | 实时通知、状态更新          |
*/
