export type HTTPMethod =
  | 'ACL'
  | 'BIND'
  | 'CHECKOUT'
  | 'CONNECT'
  | 'COPY'
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'LINK'
  | 'LOCK'
  | 'M-SEARCH'
  | 'MERGE'
  | 'MKACTIVITY'
  | 'MKCALENDAR'
  | 'MKCOL'
  | 'MOVE'
  | 'NOTIFY'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PROPFIND'
  | 'PROPPATCH'
  | 'PURGE'
  | 'PUT'
  | 'REBIND'
  | 'REPORT'
  | 'SEARCH'
  | 'SOURCE'
  | 'SUBSCRIBE'
  | 'TRACE'
  | 'UNBIND'
  | 'UNLINK'
  | 'UNLOCK'
  | 'UNSUBSCRIBE';

export type Handler = (
  req: Request,
  params: {[k: string]: string | undefined},
  store: any
) => Response | Promise<Response>;

export interface Config {
  ignoreTrailingSlash?: boolean;

  allowUnsafeRegex?: boolean;

  caseSensitive?: boolean;

  maxParamLength?: number;

  defaultRoute?(
    req: Request,
  ): void;

  onBadUrl?(
    path: string,
    req: Request,
  ): void;

  versioning?: {
    storage(): {
      get(version: String): Handler | null,
      set(version: String, store: Handler): void,
      del(version: String): void,
      empty(): void
    },
    deriveVersion<Context>(req: Request, ctx?: Context): String,
  }
}

export interface RouteOptions {
  version: string;
}

export interface ShortHandRoute {
  (path: string, handler: Handler): void;
  (path: string, opts: RouteOptions, handler: Handler): void;
  (path: string, handler: Handler, store: any): void;
  (path: string, opts: RouteOptions, handler: Handler, store: any): void;
}

export interface FindResult {
  handler: Handler;
  params: {[k: string]: string | undefined};
  store: any;
}

export class Router {
  constructor(config: Config)

  on(
    method: HTTPMethod | HTTPMethod[],
    path: string,
    handler: Handler
  ): void;
  on(
    method: HTTPMethod | HTTPMethod[],
    path: string,
    options: RouteOptions,
    handler: Handler
  ): void;
  on(
    method: HTTPMethod | HTTPMethod[],
    path: string,
    handler: Handler,
    store: any
  ): void;
  on(
    method: HTTPMethod | HTTPMethod[],
    path: string,
    options: RouteOptions,
    handler: Handler,
    store: any
  ): void;

  off(method: HTTPMethod | HTTPMethod[], path: string): void;

  lookup<Context>(
    req: Request,
    ctx?: Context
  ): Response;

  find(
    method: HTTPMethod,
    path: string,
    version?: string
  ): FindResult | null;

  reset(): void;
  prettyPrint(): string;

  all: ShortHandRoute;

  acl: ShortHandRoute;
  bind: ShortHandRoute;
  checkout: ShortHandRoute;
  connect: ShortHandRoute;
  copy: ShortHandRoute;
  delete: ShortHandRoute;
  get: ShortHandRoute;
  head: ShortHandRoute;
  link: ShortHandRoute;
  lock: ShortHandRoute;
  'm-search': ShortHandRoute;
  merge: ShortHandRoute;
  mkactivity: ShortHandRoute;
  mkcalendar: ShortHandRoute;
  mkcol: ShortHandRoute;
  move: ShortHandRoute;
  notify: ShortHandRoute;
  options: ShortHandRoute;
  patch: ShortHandRoute;
  post: ShortHandRoute;
  propfind: ShortHandRoute;
  proppatch: ShortHandRoute;
  purge: ShortHandRoute;
  put: ShortHandRoute;
  rebind: ShortHandRoute;
  report: ShortHandRoute;
  search: ShortHandRoute;
  source: ShortHandRoute;
  subscribe: ShortHandRoute;
  trace: ShortHandRoute;
  unbind: ShortHandRoute;
  unlink: ShortHandRoute;
  unlock: ShortHandRoute;
  unsubscribe: ShortHandRoute;
}
