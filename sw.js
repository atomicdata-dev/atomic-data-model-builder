if(!self.define){let e,n={};const s=(s,i)=>(s=new URL(s+".js",i).href,n[s]||new Promise((n=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=n,document.head.appendChild(e)}else e=s,importScripts(s),n()})).then((()=>{let e=n[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(i,c)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(n[o])return;let r={};const t=e=>s(e,o),a={module:{uri:o},exports:r,require:t};n[o]=Promise.all(i.map((e=>a[e]||t(e)))).then((e=>(c(...e),r)))}}define(["./workbox-118fddf1"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-36633485.css",revision:null},{url:"assets/index-75b78a3f.js",revision:null},{url:"index.html",revision:"6b2243ee2b4456f0f72d5184f5d51be6"},{url:"registerSW.js",revision:"055a5d4cc1724b56f20f349913b8ec65"},{url:"android-chrome-192x192.png",revision:"0c18f249158fb1312653ba5d58f99694"},{url:"android-chrome-512x512.png",revision:"fb7c0555e46c69807e43c38fc64e9b02"},{url:"maskable_icon.png",revision:"b2028eea26b14b5638e7dbdfe1fc044f"},{url:"maskable_icon_x512.png",revision:"9338a856b023f814f9bd9b6c9b58f3f5"},{url:"maskable_icon_x384.png",revision:"c83fdfe79ab1541a7b6f3dceec70a200"},{url:"maskable_icon_x192.png",revision:"dc9b09a2eff18baf7366764ac4c5bdca"},{url:"maskable_icon_x128.png",revision:"e2c63434d1928dedec819db66a473a98"},{url:"manifest.webmanifest",revision:"cda34584b7b7ba96d0b03ed28739500f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i,new e.CacheFirst({cacheName:"gstatic-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
