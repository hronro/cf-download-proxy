// For some reason some lib contains code depends on node built-in moudles
// Those code should be dead code, but can not be tree shaked from rollup.
// So they will finally show up in the bunble.
// To avoid runtime error, we use empty object and empty function to mock them

const emptyObject = Object.create(null)

function emptyFunction () {}

export const require = emptyFunction
export const fs = emptyObject
export const path = emptyObject

// for `http` module
export const METHODS = [
  'ACL',         'BIND',       'CHECKOUT',
  'CONNECT',     'COPY',       'DELETE',
  'GET',         'HEAD',       'LINK',
  'LOCK',        'M-SEARCH',   'MERGE',
  'MKACTIVITY',  'MKCALENDAR', 'MKCOL',
  'MOVE',        'NOTIFY',     'OPTIONS',
  'PATCH',       'POST',       'PROPFIND',
  'PROPPATCH',   'PURGE',      'PUT',
  'REBIND',      'REPORT',     'SEARCH',
  'SOURCE',      'SUBSCRIBE',  'TRACE',
  'UNBIND',      'UNLINK',     'UNLOCK',
  'UNSUBSCRIBE'
]
