// 在初始化时，需要在 preload.ts 中注册 ipcRenderer 事件 用于前后台交互
const electron = require('electron')

// 中间通信链接
// 添加一个electron的全局变量 用于前后台交互
electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback: (statisics: any) => void) => callback({}),
    getStaticData:()=>{console.log('static')}
})