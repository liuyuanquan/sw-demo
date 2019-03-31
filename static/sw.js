const CACHE_NAME = 'cache_v1'
const urlsToCache = [
  '/',
  '/css/index.css',
  '/img/fan.jpg'
]
self.addEventListener('install', event => {
  console.log('sw install')
  const handle = async () => {
    const cache = await caches.open(CACHE_NAME)
    await cache.addAll(urlsToCache)
    // 跳过waiting
    await self.skipWaiting()
  }
  event.waitUntil(handle())
})
self.addEventListener('fetch', event => {
  const handle = async () => {
    // 先从网络中获取资源，获取失败再从缓存中读取
    let response
    try {
      response = await fetch(event.request.url)
      if (!response || response.status !== 200) {
        throw new Error('Service Unavailable')
      }
    } catch (error) {
      return caches.match(event.request)
    }
    
    const responseClone = response.clone()
    const cache = await caches.open(CACHE_NAME)
    await cache.delete(event.request)
    await cache.put(event.request, responseClone)

    return response
  }
  event.respondWith(handle())
})
self.addEventListener('message', async event => {
  const clients = await self.clients.matchAll()
  if (clients && clients.length) {
    clients.forEach(client => client.postMessage(event.data.split('').reverse().join('')))
  }
})
self.addEventListener('activate', event => {
  console.log('sw activate')
  const handle = async () => {
    const keys = await caches.keys()
    keys.forEach(async key => {
      await caches.delete(key)
    })
    // 通知客户端
    await self.clients.claim()
  }
  event.waitUntil(handle())  
})
