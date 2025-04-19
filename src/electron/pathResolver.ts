import path from 'node:path'
import { app } from 'electron'
import { isNotDist } from './util'

export function getPresloadPath() {
  return path.join(
    app.getAppPath(),
    isNotDist() ? '.' : '..',
    '/dist-electron/preload.cjs'
  )
}
export function getUIPath() {
  return path.join(app.getAppPath(), '/dist-frontend/index.html')
}
export function getAssetPath() {
  return path.join(app.getAppPath(), isNotDist() ? '.' : '..', '/src/assets')
}
export function getIconPath() {
  return path.join(
    app.getAppPath(),
    isNotDist() ? '.' : '..',
    '/src/assets/icons'
  )
}
