import { IMainLayoutData } from './layouts/main.eta'

interface IData extends IMainLayoutData {
  endpoint: string
}

export default function templateFunction(data: IData): string
