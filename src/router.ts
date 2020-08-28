import styleCss from 'milligram/dist/milligram.min.css'

import { Router } from './libs/find-my-way'

import renderNotFound from './templates/404.eta'
import renderError from './templates/error.eta'
import renderHome from './templates/home.eta'

export const router = new Router({
  ignoreTrailingSlash: true,
  defaultRoute (req) {
    return new Response(renderNotFound({ url: req.url }), {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    }) 
  }
})

router.get('/_assets/style.css', () => new Response(styleCss, {
  headers: {
    'Content-Type': 'text/css; charset=utf-8'
  }
}))

router.get('/', () => {
  return new Response(renderHome({
    title: 'Download Proxy',
    endpoint: '/api/download'
  }), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  })
})

router.get('/api/download', async req => {
  const url = new URL(req.url)
  
  let downloadUrl: string | null = null

  for (const [key, value] of url.searchParams) {
    if (key === 'url') {
      downloadUrl = decodeURIComponent(value)
    }
  }

  if (downloadUrl == null || downloadUrl.length === 0) {
    return new Response(renderError({
      error: 'Download URL is empty!'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }

  let { headers, body: stream } = await fetch(downloadUrl, {
    headers: req.headers
  })

  if (!headers.has('Content-Disposition')) {
    // try to guess file name
    const pathChunks = downloadUrl.split('/')

    if (pathChunks.length > 0) {
      const fileName = pathChunks[pathChunks.length - 1]

      // we can't modify exist stream header, so we create a new one
      headers = new Headers(headers)
      headers.set('Content-Disposition', `attachment; filename="${fileName}"`)
    }
  }

  return new Response(stream, {
    headers,
  })
})
