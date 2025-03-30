declare module TSystem {
    interface Usage {
        cpuUsage: number
        ramUsage: number
        storageUsage: number
    }
    interface StaticInfo {
        totalStorage: number
        cpuModel: string
        cpuCount: number
        totalMemoryGB: number
    }

    type View = 'CPU' | 'RAM' | 'STORAGE'

    type FrameWindowAction = 'MINIMIZE' | 'MAXIMIZE' | 'CLOSE'

    interface EventPayloadMapping {
        statistics: Usage
        getStaticData: StaticInfo
        changeView: View
        sendFrameAction: FrameWindowAction
    }

    type UnsubcribeFunction = () => void
}
