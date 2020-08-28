import { router } from './router'

addEventListener('fetch', event => {
  try {
    event.respondWith(handleRequest(event.request))
  } catch (error) {
    event.respondWith(new Response(error.message ?? error.toString(), {
      status: 500,
    }))
  }
})

function handleRequest(request: Request): Response {
  return router.lookup(request)
}
