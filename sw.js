// TEKO Gestão de Obra — guarda o app no aparelho para abrir mesmo sem internet.
const V='teko-v2';
const SHELL=['./','index.html','config.js','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png',
 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{}))))) ;self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname.endsWith('supabase.co'))return; // dados sempre da rede
  const shell=u.origin===location.origin||u.hostname==='cdn.jsdelivr.net'||u.hostname.startsWith('fonts.');
  if(!shell)return;
  // rede primeiro (pega atualizações), cache se estiver sem internet
  e.respondWith(fetch(e.request).then(r=>{if(r.ok||r.type==='opaque'){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
