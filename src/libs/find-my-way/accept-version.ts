import { SemVerStore } from './semver-store'

export const acceptVersionStrategy = {
  storage: () => new SemVerStore(),
  deriveVersion (req: Request) {
    return req.headers.get('accept-version')
  }
}
