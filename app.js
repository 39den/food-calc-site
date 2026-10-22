/* Еда калькулятор: общий слой функций (PWA, поиск, избранное, список покупок, режим готовки, чек с выбором магазина). */
(()=>{
const S=document.currentScript,BASE=new URL('.',S.src).href,LS=localStorage;
const J=(k,d)=>{try{return JSON.parse(LS.getItem(k))??d}catch{return d}},W=(k,v)=>LS.setItem(k,JSON.stringify(v));
const rub0=n=>Math.round(n).toLocaleString('ru-RU')+' ₽',rub=n=>n.toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const STORES=[{id:'',name:'Магазин не выбран'},{id:'spar',name:'SPAR'},{id:'local',name:'Цены магазинов вашего города',soon:1}];
let data=null;const ready=fetch(BASE+'data.json').then(r=>r.json()).then(d=>(data=d));
const FC=window.FC={BASE,rub,rub0,esc,ready,get data(){return data},STORES,
 store(){return LS.getItem('fc-store')||''},
 setStore(id){LS.setItem('fc-store',id);document.querySelectorAll('[data-fc-receipt]').forEach(el=>FC.receipt(el,el._r,el._o));dispatchEvent(new CustomEvent('fc-store',{detail:id}))},
 storeLabel(){const s=STORES.find(x=>x.id===FC.store());return s&&s.id?s.name:''},
 /* чек: обезличенный по умолчанию, «SPAR» появляется только после выбора магазина */
 receipt(el,r,o={}){el._r=r;el._o=o;el.dataset.fcReceipt=1;const st=FC.store(),sp=st==='spar';
  el.innerHTML=`<div class="fc-rc-h"><div><div class="fc-rc-k">Итого за ужин</div><div class="fc-rc-sum">${rub0(r.cost)}</div></div>
  <label class="fc-rc-sw"><span>${sp?'Магазин':'Магазин не выбран'}</span><select aria-label="Выбрать магазин">${STORES.map(s=>`<option value="${s.id}" ${s.soon?'disabled':''} ${s.id===st?'selected':''}>${s.id?s.name:'Выбрать магазин'}${s.soon?' — скоро':''}</option>`).join('')}</select></label></div>
  <ul class="fc-rc-list">${r.items.map(i=>`<li><span>${esc(i.name)}</span><b>${rub(i.cost)}</b></li>`).join('')}</ul>
  <div class="fc-rc-note">${sp?'SPAR Online, Калининград · цены каталога на '+esc((data?.snapshot||'').split(' — ')[0]):'Цены одного магазина из каталога. Сеть покажем, когда вы выберете магазин.'}</div>`;
  el.querySelector('select').onchange=e=>FC.setStore(e.target.value)},
 favs(){return J('fc-favs',[])},isFav(id){return FC.favs().includes(id)},
 toggleFav(id){const f=FC.favs(),i=f.indexOf(id);i<0?f.push(id):f.splice(i,1);W('fc-favs',f);toast(i<0?'Добавлено в избранное':'Убрано из избранного');dispatchEvent(new Event('fc-favs'));return i<0},
 list(){return J('fc-list',[])},
 addToList(r){const l=FC.list();r.items.forEach(i=>{if(!l.some(x=>x.name===i.name))l.push({name:i.name,cost:i.cost,done:false})});W('fc-list',l);toast('В списке: '+l.length+' поз.');badge()},
 openList,openSearch,cook,toast};
const css=`.fc-ui{font:15px/1.5 Manrope,system-ui,sans-serif;color:#23201c}
.fc-fab{position:fixed;right:18px;bottom:18px;z-index:900;display:flex;gap:8px}
.fc-fab button{border:1px solid #e8e0d3;border-radius:99px;padding:11px 16px;background:#fffdf9;color:#23201c;font:600 14px Manrope,system-ui;cursor:pointer;box-shadow:0 10px 30px -12px #3a2a1a40;transition:box-shadow .25s,transform .25s}
.fc-fab button:hover{box-shadow:0 14px 34px -12px #3a2a1a60;transform:translateY(-1px)}.fc-inl{display:flex;gap:4px}.fc-inl button{position:relative;width:42px;height:42px;border-radius:50%;border:1px solid #ece3d6;background:#fffdf9;color:#23201c;cursor:pointer;display:grid;place-items:center;transition:background .2s}.fc-inl button:hover{background:#f6e2d9}.fc-inl button[data-f=install]{width:auto;padding:0 14px;border-radius:99px;font:700 13px Manrope,system-ui}.fc-inl .b{position:absolute;top:-4px;right:-4px;background:#c8553d;color:#fff;border-radius:99px;padding:0 6px;font:700 11px/18px Manrope,system-ui}
.fc-fab .b{background:#c8553d;color:#fff;border-radius:99px;padding:1px 7px;margin-left:6px;font-size:12px}
.fc-ov{position:fixed;inset:0;z-index:950;background:#23201c55;backdrop-filter:blur(8px);display:flex;align-items:flex-start;justify-content:center;padding:10vh 14px;animation:fco .2s}
@keyframes fco{from{opacity:0}}
.fc-box{background:#fffdf9;width:min(640px,100%);border-radius:24px;max-height:80vh;overflow:auto;box-shadow:0 40px 90px -30px #3a2a1a80}
.fc-box input[type=search]{width:100%;border:0;border-bottom:1px solid #eee5d8;background:none;padding:20px 22px;font:500 18px Manrope,system-ui;outline:none;color:#23201c}
.fc-res a,.fc-res button{display:flex;justify-content:space-between;gap:10px;padding:12px 22px;text-decoration:none;color:inherit;width:100%;border:0;background:none;text-align:left;font:inherit;cursor:pointer}
.fc-res [aria-selected=true]{background:#f6ece1}.fc-res mark{background:none;color:#c8553d;font-weight:700}
.fc-hd{display:flex;justify-content:space-between;align-items:center;padding:18px 22px;border-bottom:1px solid #eee5d8}.fc-hd b{font:600 20px "Playfair Display",Georgia,serif}
.fc-x{border:0;background:#f3ece2;border-radius:99px;width:36px;height:36px;cursor:pointer;font-size:15px}
.fc-li{display:flex;gap:12px;align-items:center;padding:12px 22px;border-bottom:1px solid #f1eadf}.fc-li.done span{text-decoration:line-through;opacity:.45}
.fc-li input{width:20px;height:20px;accent-color:#c8553d}.fc-act{display:flex;gap:8px;padding:16px 22px;flex-wrap:wrap}
.fc-act button{border:1px solid #e3d9ca;background:#fff;border-radius:99px;padding:9px 15px;cursor:pointer;font:600 14px Manrope,system-ui}
.fc-act button[data-a=share]{background:#c8553d;color:#fff;border-color:#c8553d}
.fc-cook{position:fixed;inset:0;z-index:960;background:#faf6ef;color:#23201c;display:flex;flex-direction:column;padding:28px;font-family:Manrope,system-ui}
.fc-cook .st{flex:1;display:grid;place-items:center;text-align:center;font:500 clamp(26px,4.4vw,48px)/1.3 "Playfair Display",Georgia,serif;padding:0 6vw}
.fc-cook nav{display:flex;gap:10px;justify-content:center}.fc-cook nav button{font:600 17px Manrope,system-ui;padding:16px 28px;border-radius:99px;border:1px solid #e3d9ca;background:#fff;color:inherit;cursor:pointer}
.fc-cook nav button[data-d="1"]{background:#c8553d;color:#fff;border-color:#c8553d}.fc-cook nav button:disabled{opacity:.35}
.fc-sp{display:inline-block;margin:0 6px 18px;vertical-align:top}.fc-sp img{width:min(46vw,520px);max-height:42vh;object-fit:cover;border-radius:20px;box-shadow:0 20px 40px -24px #3a2a1a80}.fc-sp figcaption{font:600 14px Manrope,system-ui;color:#5f564d;margin-top:8px}.fc-cook .st{overflow:auto}@media(max-width:700px){.fc-sp img{width:84vw}}
.fc-cook .top{display:flex;justify-content:space-between;gap:12px;font-size:14px;color:#7a7065}
.fc-toast{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);background:#23201c;color:#fff;padding:11px 20px;border-radius:99px;z-index:999;font:600 14px Manrope,system-ui;animation:fct .25s}
@keyframes fct{from{opacity:0;transform:translate(-50%,8px)}}
[data-fc-receipt]{background:#fffdf9;border:1px solid #eee5d8;border-radius:24px;padding:22px;box-shadow:0 24px 60px -30px #3a2a1a50;font-family:Manrope,system-ui;color:#23201c}
.fc-rc-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
.fc-rc-k{font-size:13px;color:#7a7065}.fc-rc-sum{font:700 34px/1.1 Manrope,system-ui;letter-spacing:-.02em}
.fc-rc-sw{display:flex;flex-direction:column;gap:4px;font-size:12px;color:#7a7065}
.fc-rc-sw select{font:600 14px Manrope,system-ui;padding:8px 12px;border-radius:12px;border:1px solid #e3d9ca;background:#faf6ef;color:#23201c;cursor:pointer}
.fc-rc-list{list-style:none;padding:0;margin:16px 0 0;font-size:14px}.fc-rc-list li{display:flex;justify-content:space-between;gap:14px;padding:9px 0;border-top:1px solid #f1eadf}
.fc-rc-list span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#4a433b}.fc-rc-list b{font-weight:600;white-space:nowrap}
.fc-rc-note{font-size:12px;color:#8a8075;margin-top:12px}
@media (prefers-reduced-motion:reduce){.fc-toast,.fc-ov{animation:none}}`;
const st=document.createElement('style');st.textContent=css;document.head.append(st);
function toast(t){const d=document.createElement('div');d.className='fc-toast fc-ui';d.setAttribute('role','status');d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),2200)}
function modal(html){const o=document.createElement('div');o.className='fc-ov fc-ui';o.innerHTML=`<div class="fc-box" role="dialog" aria-modal="true">${html}</div>`;
 const close=()=>{o.remove();removeEventListener('keydown',k)},k=e=>{if(e.key==='Escape')close()};addEventListener('keydown',k);
 o.addEventListener('click',e=>{if(e.target===o||e.target.closest('.fc-x'))close()});document.body.append(o);return{o,close}}
/* нечёткий поиск: подпоследовательность + бонус за подряд идущие и начало слова */
function fuzzy(q,s){q=q.toLowerCase().replace(/ё/g,'е');const t=s.toLowerCase().replace(/ё/g,'е');let i=0,sc=0,run=0,pos=[];
 for(let j=0;j<t.length&&i<q.length;j++){if(t[j]===q[i]){run++;sc+=run*2+(j===0||t[j-1]===' '?5:0);pos.push(j);i++}else run=0}
 return i===q.length?{sc:sc-t.length*.05,pos}:null}
function hl(s,pos){let o='';[...s].forEach((c,i)=>o+=pos.includes(i)?`<mark>${esc(c)}</mark>`:esc(c));return o}
async function openSearch(q0=''){await ready;const m=modal(`<input type="search" placeholder="Поиск: «индейка», «грчк», «тайск»…" aria-label="Поиск рецептов"><div class="fc-res" role="listbox"></div><div class="fc-act" style="font-size:12px;opacity:.6">↑↓ выбрать · Enter открыть · Esc закрыть</div>`);
 const inp=m.o.querySelector('input'),res=m.o.querySelector('.fc-res');let sel=0,items=[];
 const draw=()=>{const q=inp.value.trim();items=data.recipes.map((r,i)=>{const hay=r.title+' · '+r.protein+' · '+r.cuisine+' · '+r.items.map(x=>x.name).join(' ');const f=q?fuzzy(q,r.title)||fuzzy(q,hay):{sc:0,pos:[]};return f&&{r,i,f,inTitle:!!(q&&fuzzy(q,r.title))}}).filter(Boolean).sort((a,b)=>b.f.sc-a.f.sc);
  sel=Math.min(sel,Math.max(items.length-1,0));res.innerHTML=items.length?items.map((x,k)=>`<a role="option" aria-selected="${k===sel}" href="${BASE}recipes.html#r-${x.i}"><span>${x.inTitle?hl(x.r.title,x.f.pos):esc(x.r.title)}${FC.isFav(x.i+'')?' ♥':''}<br><small style="opacity:.6">${esc(x.r.protein)} · ${Math.round(x.r.kbju.kcal)} ккал</small></span><b>${rub0(x.r.cost)}</b></a>`).join(''):'<p style="padding:20px;opacity:.6">Ничего не нашлось</p>'};
 inp.addEventListener('input',()=>{sel=0;draw()});inp.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){sel=Math.min(sel+1,items.length-1);draw();e.preventDefault()}if(e.key==='ArrowUp'){sel=Math.max(sel-1,0);draw();e.preventDefault()}if(e.key==='Enter'&&items[sel]){location.href=res.querySelectorAll('a')[sel].href;m.close()}});
 res.addEventListener('click',()=>m.close());inp.value=q0;draw();inp.focus()}
FC.anchor=(r,i)=>'r-'+i;
function openList(){const m=modal(`<div class="fc-hd"><b>Список покупок</b><button class="fc-x" aria-label="Закрыть">✕</button></div><div class="fc-items"></div><div class="fc-act"><button data-a="share">Поделиться</button><button data-a="clear-done">Убрать купленное</button><button data-a="clear">Очистить</button></div>`);
 const box=m.o.querySelector('.fc-items');const draw=()=>{const l=FC.list();box.innerHTML=l.length?l.map((x,i)=>`<label class="fc-li ${x.done?'done':''}"><input type="checkbox" data-i="${i}" ${x.done?'checked':''}><span>${esc(x.name)}</span><small style="margin-left:auto;opacity:.6">${rub(x.cost)}</small></label>`).join('')+`<div class="fc-li"><b>Итого</b><b style="margin-left:auto">${rub(l.reduce((a,x)=>a+x.cost,0))}</b></div>`:'<p style="padding:20px;opacity:.6">Пусто. Нажмите «В список» у рецепта.</p>';badge()};
 box.addEventListener('change',e=>{const l=FC.list();l[e.target.dataset.i].done=e.target.checked;W('fc-list',l);draw()});
 m.o.querySelector('.fc-act').addEventListener('click',async e=>{const a=e.target.dataset.a;if(!a)return;let l=FC.list();
  if(a==='share'){const text='Список покупок (Еда калькулятор):\n'+l.filter(x=>!x.done).map(x=>'☐ '+x.name).join('\n');
   try{if(navigator.share)await navigator.share({title:'Список покупок',text});else{await navigator.clipboard.writeText(text);toast('Скопировано в буфер')}}catch(_){}return}
  if(a==='clear')l=[];if(a==='clear-done')l=l.filter(x=>!x.done);W('fc-list',l);draw()});draw()}
/* режим готовки: шаги крупно + Wake Lock, чтобы экран не гас */
async function cook(r){let i=0,lock=null;const o=document.createElement('div');o.className='fc-cook';o.setAttribute('role','dialog');document.body.append(o);
 const req=async()=>{try{lock=await navigator.wakeLock?.request('screen')}catch(_){lock=null}draw()};
 const draw=()=>{o.innerHTML=`<div class="top"><span>${esc(r.title)}</span><span>${lock?'🔆 экран не погаснет':'экран может погаснуть'} · шаг ${i+1}/${r.steps.length}</span></div><div class="st" aria-live="polite"><div>${(r.step_photos||[]).filter(p=>p.step===i).map(p=>`<figure class="fc-sp"><picture><source type="image/avif" srcset="${BASE}img/${p.img}-480.avif 480w, ${BASE}img/${p.img}-960.avif 960w" sizes="(max-width:700px) 90vw, 560px"><img src="${BASE}img/${p.img}-960.webp" srcset="${BASE}img/${p.img}-480.webp 480w, ${BASE}img/${p.img}-960.webp 960w" sizes="(max-width:700px) 90vw, 560px" alt="${esc(p.cap)}"></picture><figcaption>Вот так должно выглядеть: ${esc(p.cap)}</figcaption></figure>`).join('')}<p>${esc(r.steps[i])}</p></div></div><nav><button data-d="-1" ${i?'':'disabled'}>← Назад</button><button data-d="x">Готово</button><button data-d="1" ${i<r.steps.length-1?'':'disabled'}>Далее →</button></nav>`};
 const vis=()=>{if(document.visibilityState==='visible'&&o.isConnected)req()};document.addEventListener('visibilitychange',vis);
 const end=()=>{lock?.release?.();o.remove();removeEventListener('keydown',key);document.removeEventListener('visibilitychange',vis)};
 const key=e=>{if(e.key==='Escape')end();if(e.key==='ArrowRight'&&i<r.steps.length-1){i++;draw()}if(e.key==='ArrowLeft'&&i){i--;draw()}};addEventListener('keydown',key);
 o.addEventListener('click',e=>{const d=e.target.dataset.d;if(!d)return;if(d==='x')return end();i+=+d;draw()});draw();req()}
/* панель кнопок */
let deferred=null;const fab=document.createElement('div');fab.className='fc-fab fc-ui';
fab.innerHTML=`<button data-f="search" aria-label="Поиск (/ или ⌘K)">Поиск <span style="opacity:.5;font-weight:500">/</span></button><button data-f="list" aria-label="Список покупок">🛒<span class="b" hidden></span></button><button data-f="install" hidden>⤓ Установить</button>`;
function badge(){const b=fab.querySelector('.b'),n=FC.list().filter(x=>!x.done).length;b.hidden=!n;b.textContent=n;if(fab.className==='fc-inl')fab.querySelector('[data-f=list]').hidden=!FC.list().length}
fab.addEventListener('click',async e=>{const f=e.target.closest('button')?.dataset.f;if(f==='search')openSearch();if(f==='list')openList();
 if(f==='install'&&deferred){deferred.prompt();await deferred.userChoice;deferred=null;e.target.hidden=true}});
addEventListener('DOMContentLoaded',()=>{const nb=document.querySelector('[data-fc-inline]');if(nb){fab.className='fc-inl';fab.querySelector('[data-f=search]').innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>';fab.querySelector('[data-f=list]').innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6 5 3H2"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg><span class="b" hidden></span>';nb.append(fab)}else document.body.append(fab);badge()});
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;fab.querySelector('[data-f=install]').hidden=false});
addEventListener('appinstalled',()=>toast('Приложение установлено'));
addEventListener('keydown',e=>{const t=e.target.tagName;if((e.key==='k'&&(e.metaKey||e.ctrlKey))||(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(t)&&!e.target.isContentEditable)){e.preventDefault();if(!document.querySelector('.fc-ov'))openSearch()}});
addEventListener('online',()=>toast('Снова онлайн'));addEventListener('offline',()=>toast('Нет сети — работаем из кэша'));
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register(BASE+'sw.js',{scope:BASE}).catch(()=>{});
})();
