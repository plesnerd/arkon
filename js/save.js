/* SAVE SYSTEM (separate from gameplay). Auto-saves to browser localStorage. Use the Upload/Download save.json
 * buttons in the game to load or export a save file. Field docs: see README.md. */
const Save=(()=>{
 const KEY='arkon_save_v1';let state=null,timer=null;
 const defaults=()=>({version:1,character:{skin:'#e8b88a',hair:'#5a3a1a'},
  skills:{farming:{level:1,xp:0},combat:{level:1,xp:0},mining:{level:1,xp:0}},
  inventory:Array(20).fill(null),hotbar:[{id:'seed_wheat',n:10},null,null,null,null],selectedSlot:0,
  equipment:{helmet:null,chestplate:null,leggings:null,boots:null,heart:null,sword:null,pickaxe:null},
  caves:{unlocked:1,kills:{}},farm:{plots:Array(8).fill(null)},player:{x:200,level:0}});
 const num=(v,a,b,f)=>Number.isFinite(+v)?Math.min(b,Math.max(a,+v)):f;
 function clean(raw){
  const d=defaults();if(!raw||typeof raw!=='object')return d;
  const hex=(v,f)=>/^#[0-9a-f]{6}$/i.test(v)?v:f;
  const slot=s=>s&&ITEMS[s.id]&&s.n>0?{id:s.id,n:Math.floor(s.n)}:null;
  const arr=(a,n,f)=>Array.isArray(a)?Array.from({length:n},(_,i)=>slot(a[i])):f;
  const c=raw.character||{};d.character.skin=hex(c.skin,d.character.skin);d.character.hair=hex(c.hair,d.character.hair);
  for(const k in d.skills){const s=(raw.skills||{})[k];if(s){d.skills[k].level=Math.floor(num(s.level,1,MAXLV,1));d.skills[k].xp=num(s.xp,0,1e12,0)}}
  d.inventory=arr(raw.inventory,20,d.inventory);d.hotbar=arr(raw.hotbar,5,d.hotbar);
  d.selectedSlot=Math.floor(num(raw.selectedSlot,0,4,0));
  const e=raw.equipment||{};for(const k in d.equipment){const it=ITEMS[e[k]];
   if(it&&(k==='heart'?it.type==='heart':it.slot===k))d.equipment[k]=e[k]}
  const cv=raw.caves||{};d.caves.unlocked=Math.floor(num(cv.unlocked,1,10,1));
  if(cv.kills&&typeof cv.kills==='object')for(const k in cv.kills)d.caves.kills[k]=Math.floor(num(cv.kills[k],0,1e9,0));
  const pl=(raw.farm||{}).plots;if(Array.isArray(pl))d.farm.plots=Array.from({length:8},(_,i)=>{const p=pl[i];
   return p&&CROPS[p.crop]&&Number.isFinite(+p.plantedAt)?{crop:p.crop,plantedAt:+p.plantedAt}:null});
  d.player.x=num((raw.player||{}).x,0,1e6,200);d.player.level=Math.floor(num((raw.player||{}).level,0,10,0));return d}
 return{
  async load(){let raw=null;try{raw=JSON.parse(localStorage.getItem(KEY))}catch(e){}
   return state=clean(raw)},
  write(){clearTimeout(timer);timer=setTimeout(Save.flush,250)},
  flush(){try{localStorage.setItem(KEY,JSON.stringify(state,null,1))}catch(e){}},
  exportFile(){Save.flush();const a=document.createElement('a');
   a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download='save.json';a.click()},
  importFile(f){const r=new FileReader();r.onload=()=>{try{state=clean(JSON.parse(r.result));Save.flush();location.reload()}catch(e){alert('Invalid save file')}};r.readAsText(f)}
 }})();
