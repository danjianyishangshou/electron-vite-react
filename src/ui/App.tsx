import { useEffect, useMemo, useState } from "react"
import "./App.css"
import { useStatistics } from "./hooks/useStatistics"
import { Chart } from "./components/Chart"

function App() {
  const [activeView, setActiveView] = useState<TSystem.View>("CPU")
  const statistics = useStatistics(10)
  const cpuUsages = useMemo(
    () => statistics.map((stat) => stat.cpuUsage),
    [statistics]
  )
  const ramUsage = useMemo(
    () => statistics.map((stat) => stat.ramUsage),
    [statistics]
  )
  const storageUsage = useMemo(
    () => statistics.map((stat) => stat.storageUsage),
    [statistics]
  )
  const activeUsage = useMemo(() => {
    switch (activeView) {
      case "CPU":
        return cpuUsages
      case "RAM":
        return ramUsage
      case "STORAGE":
        return storageUsage
    }
  }, [activeView, cpuUsages, ramUsage, storageUsage])
  useEffect(() => {
    return window.electron.changeView((view) => {
      setActiveView(view)
    })
  }, [])

  return (
    <div className="App">
      <header>
        <button
          id="close"
          onClick={() => window.electron.sendFrameAction("CLOSE")}
        />
        <button
          id="minimize"
          onClick={() => window.electron.sendFrameAction("MINIMIZE")}
        />
        <button
          id="maximize"
          onClick={() => window.electron.sendFrameAction("MAXIMIZE")}
        />
      </header>
      <div className="main">
        <div style={{ height: 120 }}>
          <Chart
            data={activeUsage}
            maxDataPoints={10}
            selectedView={activeView}
          />
        </div>
      </div>
    </div>
  )
}

export default App
