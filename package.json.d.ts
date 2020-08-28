interface IPackageJson {
  name: string
  version: string
  description: string
  main: string
  scripts: Record<string, string | undefined>
  repository: {
    type: string
    url: string
  }
  keywords: string[]
  authro: string
  license: string
  bugs: {
    url: string
  }
  homepage: string
  dependencies: Record<string, string | undefined>
  devDependencies: Record<string, string | undefined>
}

const packageInfo: IPackageJson

export default packageInfo
