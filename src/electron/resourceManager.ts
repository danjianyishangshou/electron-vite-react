import osUtils from 'os-utils';
import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'

const POLLING_INTERVAL = 500; // 轮询间隔时间（毫秒）
/**
 * 轮询获取动态资源
 */
export function pollResource() {
    setInterval(async() => {
       const cpuUsage = await getCpuUsage()
       const ramUsage = getRamUsage()
       const storageUsage = getStorageUsage()
    //    console.table({
    //     cpuUsage: `CPU 使用率: ${(cpuUsage * 100).toFixed(2)} %`,
    //     ramUsage: `内存使用率: ${(ramUsage * 100).toFixed(2)} %`,
    //     totalStorage: `硬盘总容量: ${storageUsage.total} GB`,
    //     storageUsage: `硬盘使用率: ${(storageUsage.usage * 100).toFixed(2)} %`
    //    });
    return {
        cpuUsage,
        ramUsage,
        storageUsage
    }
    }, POLLING_INTERVAL)
}

export function getStaticData() {
    // 获取硬盘总容量
    const totalStorage = getStorageUsage().total
    // 获取 CPU 型号
    const cpuModel = os.cpus()[0].model
    // 获取cpus数量
    const cpuCount = os.cpus().length
    // 获取内存总量
    const totalMemoryGB = Math.floor(os.totalmem() / 1024)
    return {
        totalStorage,
        cpuModel,
        cpuCount,
        totalMemoryGB
    }
}

/**
 * 获取 CPU 使用率
 * @returns 
 */
function getCpuUsage():Promise<number> {
    return new Promise((resolve) => osUtils.cpuUsage(resolve))
}
/**
 * 获取内存使用率
 * @returns 
 */
function getRamUsage():number {
    return 1 - osUtils.freememPercentage()
}
/**
 * 获取硬盘使用率
 * @returns 
 */
function getStorageUsage():{ total : number, usage : number } {
    // 获取根目录的文件系统状态信息
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C:\\' : path.sep)
    // 计算总存储空间（单位：字节）
    const total = stats.blocks * stats.bsize
    // 计算可用存储空间（单位：字节）
    const free = stats.bfree * stats.bsize
    return {
        // 转换为 GB
        total: Math.floor(total / 1_000_000_000),
        // 计算使用率
        usage: 1 - free / total
    }
}

