'use strict';
// Bump VERSION whenever you change any shipped files.
const VERSION='pokepaint-v1.3.0';
const PREFIX='pokepaint-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+VERSION;
const FILES=['./','index.html','style.css','game.js','pokemon.js','manifest.json','icon.svg','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png',...Array.from({length:151},(_,i)=>`assets/${i+1}.png`)];
self.addEventListener('install',e=>e.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!e.request.url.startsWith(self.registration.scope))return;e.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(e.request,{ignoreSearch:true});if(cached)return cached;try{return await fetch(e.request);}catch(error){if(e.request.mode==='navigate')return (await cache.match('index.html'));throw error;}})());});
