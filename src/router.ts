import styleCss from 'milligram/dist/milligram.min.css'

import { Router } from './libs/find-my-way'

import renderNotFound from './templates/404.eta'
import renderError from './templates/error.eta'
import renderHome from './templates/home.eta'

import robotsTxt from './robots.txt'

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

router.get('/robots.txt', () => new Response(robotsTxt, {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8'
  }
}))

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
  
  let downloadUrlString: string | null = null

  for (const [key, value] of url.searchParams) {
    if (key === 'url') {
      downloadUrlString = decodeURIComponent(value)
    }
  }

  if (downloadUrlString == null || downloadUrlString.length === 0) {
    return new Response(renderError({
      error: 'Download URL is empty!'
    }), {
      status: 400,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    })
  }

  // check if the download url is valid
  try {
    const downloadUrl = new URL(downloadUrlString)

    if (downloadUrl.protocol !== 'http:' &&  downloadUrl.protocol !== 'https:') {
      return new Response(renderError({
        error: `Invalid protocol of download URL: \`${downloadUrl.protocol}\`.`,
      }))
    }
  } catch {
    return new Response(renderError({
      error: 'Invalid download URL.',
    }))
  }

  let { headers, body: stream } = await fetch(downloadUrlString, {
    headers: req.headers
  })

  // try to guess file name
  const originalContentDisposition = headers.get('Content-Disposition')
  if (originalContentDisposition == null || !originalContentDisposition.includes('filename=')) {
    const pathChunks = downloadUrlString.split('/')

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
