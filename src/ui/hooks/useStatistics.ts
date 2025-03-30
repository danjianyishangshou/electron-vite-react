import { useEffect, useState } from "react";

export function useStatistics(count: number) {
    const [value, setValue] = useState<TSystem.Usage[]>([]);
    useEffect(() => {
        const unsub = window.electron.subscribeStatistics((stats) => {
            if (stats) {
                setValue((prev) => {
                    const prevStatsList = [...prev, stats]
                    if (prevStatsList.length > count) {
                        prevStatsList.shift()
                    }
                    return prevStatsList
                })
            }
        })
        return unsub
    }, [])
    return value
}