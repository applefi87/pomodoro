if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,t)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let r={};const o=e=>i(e,l),u={module:{uri:l},exports:r,require:o};s[l]=Promise.all(n.map((e=>u[e]||o(e)))).then((e=>(t(...e),r)))}}define(["./workbox-b3e22772"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/index.7251b596.js",revision:null},{url:"assets/index.e72c55aa.css",revision:null},{url:"assets/ListView.11b7f7c1.js",revision:null},{url:"assets/ListView.bf4884a1.css",revision:null},{url:"assets/SettingView.4da6c5ad.js",revision:null},{url:"assets/SettingView.e11a55c8.css",revision:null},{url:"assets/webfontloader.cd097671.js",revision:null},{url:"index.html",revision:"9590666489f7abb2dcb975a25c19b8df"},{url:"manifest.webmanifest",revision:"9df809999cce2d28fb30a2b92c034627"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
