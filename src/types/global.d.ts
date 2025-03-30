import { IpcRendererEvent } from 'electron';

type EventCallback<T> = (payload: T) => void;

declare namespace ElectronAPI {
    interface API {
        subscribeStatistics: (callback: EventCallback<TSystem.Usage>) => TSystem.UnsubcribeFunction;
        getStaticData: () => Promise<TSystem.StaticInfo>;
        changeView: (callback: (view: TSystem.View) => void) => TSystem.UnsubcribeFunction;
        sendFrameAction: (action: TSystem.FrameAction) => void;
    }

}

declare global {
    interface Window {
        electron: ElectronAPI.API;
    }
}