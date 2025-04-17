import { MERCHANT } from '../constants/sub-apps'

export interface SubApp {
  name: string
  entry: string
}

export const merchantApp: SubApp = {
  name: MERCHANT,
  entry: '//localhost:9528'
}

export const subApps: SubApp[] = [merchantApp]
