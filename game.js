(async function(){
const S=await Save.load();
const cv=document.getElementById('c'),g=cv.getContext('2d'),$=id=>document.getElementById(id);
let W,H,camX=0,camY=0;const rs=()=>{W=cv.width=innerWidth;H=cv.height=innerHeight};rs();addEventListener('resize',rs);
const PX=48,LH=720,LW=L=>2400+L*400,FY=L=>(L+1)*LH,LX=k=>k%2?LW(k)-250:250,gy=()=>P.y,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const PL=Math.min(S.player.level,S.caves.unlocked),P={x:S.player.x,y:FY(PL),vy:0,f:1,hp:1,acd:0,hurt:0,msg:0,lad:-1,lvl:PL};
// ---- sprites ----
const IMG={},PH={},PPH={};
for(const k in SPR){const im=new Image();im.onload=()=>IMG[k]=im;im.src=ASSET_DIR+(ASSET_OVERRIDES[k]||k+'.png')}
function makePH(k){const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d'),s=SPR[k],col=s.color;
 const r=(a,b,w,h,f)=>{x.fillStyle=f||col;x.fillRect(a,b,w,h)};
 ({slime:()=>{r(2,7,12,8);r(4,5,8,3);r(5,9,2,2,'#fff');r(9,9,2,2,'#fff');r(6,10,1,1,'#000');r(10,10,1,1,'#000')},
 ore:()=>{r(2,5,12,10,'#666');r(3,4,10,2,'#777');r(4,7,3,3);r(9,9,3,3);r(8,6,2,2)},
 heart:()=>{r(2,3,5,4);r(9,3,5,4);r(2,6,12,3);r(4,9,8,2);r(6,11,4,2);r(7,13,2,1);r(3,4,2,1,'#fff')},
 helmet:()=>{r(3,3,10,6);r(2,8,3,5);r(11,8,3,5);r(5,7,6,3,'#000')},
 chestplate:()=>{r(2,2,12,3);r(3,5,10,9);r(1,3,3,6);r(12,3,3,6)},
 leggings:()=>{r(3,2,10,4);r(3,6,4,8);r(9,6,4,8)},
 sword:()=>{r(7,1,2,9);r(5,10,6,2,'#444');r(7,12,2,3,'#852')},
 pickaxe:()=>{r(7,4,2,11,'#852');r(2,3,12,3);r(2,5,2,2);r(12,5,2,2)},
 boots:()=>{r(2,6,5,7);r(9,6,5,7);r(1,11,6,3);r(9,11,6,3)},
 goo:()=>{r(4,6,8,7);r(5,4,6,3);r(6,7,2,2,'#fff')},
 seed:()=>{r(5,8,2,2);r(9,6,2,2);r(7,11,2,2);r(10,10,2,2)},
 crop:()=>{r(4,4,8,9);r(7,1,2,4,'#4a4')},
 plant:()=>{const t=s.stage;r(7,12-t*3,2,4+t*3,'#4a4');if(t==2)r(5,5,6,5)}})[s.kind]();return c}
const spr=k=>IMG[k]||PH[k]||(PH[k]=makePH(k));
function playerPH(){const e=S.equipment,k=S.character.skin+S.character.hair+SLOTS.map(s=>e[s]).join();if(PPH[k])return PPH[k];
 const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d'),r=(a,b,w,h,f)=>{x.fillStyle=f;x.fillRect(a,b,w,h)},ac=s=>e[s]?SPR[e[s]].color:null;
 r(4,3,8,5,S.character.skin);r(4,1,8,3,S.character.hair);r(6,5,1,1,'#000');r(9,5,1,1,'#000');
 r(4,8,8,5,ac('chestplate')||'#3a6ac0');r(5,13,2,3,ac('leggings')||'#2a3a6a');r(9,13,2,3,ac('leggings')||'#2a3a6a');
 if(ac('helmet'))r(4,1,8,2,ac('helmet'));if(ac('boots')){r(5,15,2,1,ac('boots'));r(9,15,2,1,ac('boots'))}
 return PPH[k]=c}
// ---- stats / items ----
const stats=()=>{let d=0,h=0,m=0;SLOTS.forEach(s=>{const it=ITEMS[S.equipment[s]];if(it){d+=it.def;h+=it.hp;m+=it.dmg}});
 const ht=ITEMS[S.equipment.heart]||{},sw=ITEMS[S.equipment.sword]||{},pk=ITEMS[S.equipment.pickaxe]||{};return{def:d,hp:100+h+S.skills.combat.level*2,dmg:m,xp:ht.xpBonus||0,spd:ht.spd||0,jmp:ht.jmp||0,atk:sw.atk||0,pk:pk.pow||0}};
const maxStack=id=>/armor|heart|sword|pickaxe/.test(ITEMS[id].type)?1:999;
function place(id,n,lists){const M=maxStack(id);
 for(const L of lists)for(const s of L)if(n>0&&s&&s.id===id&&s.n<M){const a=Math.min(n,M-s.n);s.n+=a;n-=a}
 for(const L of lists)for(let i=0;i<L.length&&n>0;i++)if(!L[i]){const a=Math.min(n,M);L[i]={id,n:a};n-=a}
 return n}
const pops=[];const pop=(x,y,s,c)=>pops.push({x,y,s,c:c||'#fff',t:1.2});
function give(id,n){const left=place(id,n,[S.inventory,S.hotbar]);
 pop(P.x,gy()-80-pops.length%3*14,left?'Inventory full!':'+'+n+' '+ITEMS[id].name,left?'#f66':'#8f8');changed()}
function xp(k,a){const s=S.skills[k];s.xp+=a*(1+stats().xp/100);
 while(s.level<MAXLV&&s.xp>=need(s.level)){s.xp-=need(s.level);s.level++;pop(P.x,gy()-130,k+' Lv '+s.level,'#fd0')}
 s.xp=Math.round(s.xp*10)/10;unlockCheck();Save.write()}
function unlockCheck(){while(S.caves.unlocked<10&&S.skills.combat.level>=CAVES[S.caves.unlocked].unlockCombat){S.caves.unlocked++;pop(P.x,gy()-150,'Cave unlocked: '+CAVES[S.caves.unlocked-1].name,'#fd0')}}
unlockCheck();P.hp=stats().hp;
// ---- world entities: levels stack downward, each wide and wider with depth ----
function shade(h,f){const n=parseInt(h.slice(1),16);return'rgb('+[n>>16,n>>8&255,n&255].map(v=>Math.round(v*f)).join()+')'}
const LCOL=L=>L?[shade(CAVES[L-1].color,.25),shade(CAVES[L-1].color,.55)]:['#8ec8f0','#5f9a3a'];
const ores=[],slimes=[];
CAVES.forEach(c=>{const L=c.i+1,w=LW(L),n=4+(c.i>>1);
 for(let j=0;j<n;j++)ores.push({x:500+(w-1000)*(j+.5)/n+Math.sin(j*7+c.i)*60,i:c.i,fy:FY(L),hp:c.oreHp,t:0});
 for(let j=0;j<n+1;j++){const x=450+(w-900)*(j+.5)/(n+1);slimes.push({x,home:x,i:c.i,fy:FY(L),y:0,vy:0,vx:0,hp:c.slimeHp,t:0,hopT:Math.random()*2,hit:0})}});
// ---- input ----
const keys={};
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();keys[k]=1;
 if(k==='escape')togSet();
 if(k==='e'){inv.open=!inv.open;resetDel();$('inv').style.display=inv.open?'block':'none';if(inv.open)renderInv()}
 if(k>='1'&&k<='5'){S.selectedSlot=k-1;renderHotbar();Save.write()}
 if(k===' '||k.startsWith('arrow'))e.preventDefault()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);addEventListener('blur',()=>{for(const k in keys)keys[k]=0});
addEventListener('wheel',e=>{S.selectedSlot=(S.selectedSlot+(e.deltaY>0?1:4))%5;renderHotbar();Save.write()});
const inv={open:false,del:false};
cv.addEventListener('mousedown',e=>{if(e.button!==0||inv.open||P.acd>0)return;
 const wx=e.clientX+camX,wy=e.clientY+camY,st=stats(),far=(x,y)=>{pop(x,y-90,'Too far','#ccc');return true},near=(x,fy)=>Math.abs(P.x-x)<=120&&Math.abs(P.y-fy)<60;
 for(const s of slimes){const sy=s.fy-s.y;if(s.t<=0&&Math.abs(wx-s.x)<28&&wy>sy-PX&&wy<sy){
  if(!near(s.x,s.fy))return far(s.x,sy);
  const d=Math.round((3+S.skills.combat.level*1.5+st.atk)*(1+st.dmg/100));s.hp-=d;s.hit=.15;P.acd=.35;pop(s.x,sy-PX,'-'+d);
  if(s.hp<=0)kill(s);return}}
 for(const o of ores)if(o.t<=0&&Math.abs(wx-o.x)<28&&wy>o.fy-PX&&wy<o.fy){
  if(!near(o.x,o.fy))return far(o.x,o.fy);
  const d=Math.round((1+S.skills.mining.level*.4+st.pk)*10)/10;o.hp-=d;P.acd=.3;pop(o.x,o.fy-PX,'-'+d,'#adf');
  if(o.hp<=0){const c=CAVES[o.i];o.t=15;give('ore_'+o.i,1+(Math.random()<.3?1:0));if(Math.random()<c.toolRate)give('sword_'+o.i,1);if(Math.random()<c.toolRate)give('pickaxe_'+o.i,1);xp('mining',c.oreXp)}return}
 const F=FY(0);
 for(let i=0;i<8;i++){const px=150+i*75;if(Math.abs(wx-px)<34&&wy>F-70&&wy<F+16){
  if(!near(px,F))return far(px,F);P.acd=.25;const p=S.farm.plots[i];
  if(!p){const sl=S.hotbar[S.selectedSlot];
   if(sl&&ITEMS[sl.id].type==='seed'){S.farm.plots[i]={crop:ITEMS[sl.id].crop,plantedAt:Date.now()};if(--sl.n<=0)S.hotbar[S.selectedSlot]=null;changed()}
   else pop(px,F-80,'Select seeds in hotbar','#ccc')}
  else{const c=CROPS[p.crop],left=c.grow-(Date.now()-p.plantedAt)/1000;
   if(left>0)pop(px,F-80,Math.ceil(left)+'s left','#ccc');
   else{S.farm.plots[i]=null;give('crop_'+c.id,1+(Math.random()<.5?1:0));give('seed_'+c.id,1+(Math.random()<.5?1:0));
    const nx=CROPLIST[CROPLIST.indexOf(c)+1];if(nx&&Math.random()<.25)give('seed_'+nx.id,1);xp('farming',c.xp);changed()}}
  return}}});
function kill(s){const c=CAVES[s.i];s.t=12;S.caves.kills[s.i]=(S.caves.kills[s.i]||0)+1;
 give('goo_'+s.i,1+(Math.random()*3|0));
 if(Math.random()<c.heartRate)give('heart_'+s.i,1);
 if(Math.random()<c.armorRate)give('armor_'+s.i+'_'+SLOTS[Math.random()*4|0],1);
 xp('combat',c.slimeXp)}
// ---- update ----
let curL=-1;
function update(dt){
 const st=stats(),l=keys.a||keys.arrowleft,r=keys.d||keys.arrowright,dn=keys.s||keys.arrowdown,up=keys.w||keys.arrowup;
 if(!inv.open&&P.lad<0){
  P.x+=((r?1:0)-(l?1:0))*200*(1+st.spd/100)*dt;if(l&&!r)P.f=-1;if(r&&!l)P.f=1;
  if(P.y>=FY(P.lvl)){
   if(dn&&P.lvl<10&&Math.abs(P.x-LX(P.lvl))<26){
    if(S.caves.unlocked>P.lvl)P.lad=P.lvl;else if(P.msg<=0){P.msg=1;pop(P.x,P.y-90,'Locked: Combat Lv '+CAVES[P.lvl].unlockCombat,'#f66')}}
   else if(up&&P.lvl>0&&Math.abs(P.x-LX(P.lvl-1))<26)P.lad=P.lvl-1;
   else if(up||keys[' '])P.vy=-430*(1+st.jmp/100)}}
 if(P.lad>=0){const k=P.lad;P.x=LX(k);P.vy=0;P.y+=inv.open?0:((dn?1:0)-(up?1:0))*170*dt;
  if(P.y>=FY(k+1)){P.y=FY(k+1);P.lvl=k+1;P.lad=-1}else if(P.y<=FY(k)){P.y=FY(k);P.lvl=k;P.lad=-1}}
 else{const fl=FY(P.lvl);P.vy+=1100*dt;P.y+=P.vy*dt;if(P.y>=fl){P.y=fl;P.vy=0}P.x=clamp(P.x,20,LW(P.lvl)-20)}
 P.acd-=dt;P.hurt-=dt;P.msg-=dt;P.hp=Math.min(st.hp,P.hp+st.hp*.01*dt);
 ores.forEach(o=>{if(o.t>0){o.t-=dt;if(o.t<=0)o.hp=CAVES[o.i].oreHp}});
 slimes.forEach(s=>{const c=CAVES[s.i];
  if(s.t>0){s.t-=dt;if(s.t<=0){s.t=0;s.hp=c.slimeHp;s.x=s.home}return}
  s.hit-=dt;s.hopT-=dt;s.vy-=1100*dt;s.y+=s.vy*dt;s.x=clamp(s.x+s.vx*dt,30,LW(s.i+1)-30);
  if(s.y<=0){s.y=0;s.vy=0;s.vx=0;if(s.hopT<=0){
   const near=Math.abs(P.x-s.x)<380&&Math.abs(P.y-s.fy)<60;
   const d=near?Math.sign(P.x-s.x)||1:Math.abs(s.x-s.home)>150?Math.sign(s.home-s.x):(Math.random()<.5?-1:1);
   s.vy=300;s.vx=d*(near?110:50);s.hopT=near?.9:1.8}}
  if(Math.abs(P.x-s.x)<34&&Math.abs(P.y-(s.fy-s.y))<36&&P.hurt<=0){const d=Math.max(1,Math.round(c.slimeDmg*100/(100+st.def)));
   P.hp-=d;P.hurt=.8;pop(P.x,P.y-PX,'-'+d,'#f55')}});
 if(P.hp<=0){P.x=200;P.lvl=0;P.y=FY(0);P.lad=-1;P.hp=st.hp;pop(P.x,P.y-100,'You died','#f55')}
 const nl=clamp(Math.floor((P.y-1)/LH),0,10);if(nl!==curL){curL=nl;showTitle(nl?CAVES[nl-1].name:'Surface Farm',nl?CAVES[nl-1].color:'#8fe')}
 pops.forEach(p=>{p.t-=dt;p.y-=25*dt});for(let i=pops.length-1;i>=0;i--)if(pops[i].t<=0)pops.splice(i,1)}
// ---- draw ----
function ds(k,x,y){g.drawImage(spr(k),x,y,PX,PX)}
function draw(){camX=Math.round(clamp(P.x-W/2,0,Math.max(0,LW(P.lvl)-W)));camY=Math.round(clamp(P.y-H*.6,0,FY(10)+60-H));
 g.imageSmoothingEnabled=false;g.fillStyle='#000';g.fillRect(0,0,W,H);g.save();g.translate(-camX,-camY);
 const vis=(a,b)=>b>camY&&a<camY+H;
 for(let L=0;L<=10;L++)if(vis(L*LH,(L+1)*LH)){g.fillStyle=LCOL(L)[0];g.fillRect(0,L*LH,LW(L),LH)}
 for(let L=0;L<=10;L++)if(vis(FY(L),FY(L)+40)){g.fillStyle=LCOL(L)[1];g.fillRect(0,FY(L),LW(L),40)}
 g.font='bold 14px monospace';
 for(let k=0;k<10;k++)if(vis(FY(k)-80,FY(k+1))){const x=LX(k),open=S.caves.unlocked>k;
  g.fillStyle='#000c';g.fillRect(x-22,FY(k),44,LH);g.fillStyle='#b87a45';g.fillRect(x-16,FY(k),4,LH);g.fillRect(x+12,FY(k),4,LH);
  for(let y=FY(k)+8;y<FY(k+1);y+=16)g.fillRect(x-14,y,28,3);
  g.textAlign='center';g.fillStyle=open?'#fff':'#f66';g.fillText(open?'\u25BC '+CAVES[k].name:'Locked: Combat Lv '+CAVES[k].unlockCombat,x,FY(k)-56);g.textAlign='left'}
 const F=FY(0);
 for(let i=0;i<8;i++){const px=150+i*75,p=S.farm.plots[i];g.fillStyle='#4a2f1a';g.fillRect(px-30,F-4,60,14);
  if(p){const c=CROPS[p.crop],t=(Date.now()-p.plantedAt)/1000/c.grow;ds('plant_'+p.crop+'_'+(t>=1?2:t>.5?1:0),px-PX/2,F-PX+4)}}
 ores.forEach(o=>{if(o.t>0)return;ds('ore_'+o.i,o.x-PX/2,o.fy-PX);
  const m=CAVES[o.i].oreHp;if(o.hp<m){g.fillStyle='#000';g.fillRect(o.x-20,o.fy-PX-8,40,4);g.fillStyle='#4cf';g.fillRect(o.x-20,o.fy-PX-8,40*o.hp/m,4)}});
 slimes.forEach(s=>{if(s.t>0)return;const y=s.fy-s.y-PX,m=CAVES[s.i].slimeHp;g.globalAlpha=s.hit>0?.5:1;ds('slime_'+s.i,s.x-PX/2,y);g.globalAlpha=1;
  g.fillStyle='#000';g.fillRect(s.x-20,y-8,40,4);g.fillStyle='#e33';g.fillRect(s.x-20,y-8,40*s.hp/m,4)});
 g.save();g.translate(P.x,P.y);g.scale(P.f,1);g.globalAlpha=P.hurt>0&&(P.hurt*20|0)%2?.5:1;g.drawImage(IMG.player||playerPH(),-PX/2,-PX,PX,PX);g.restore();
 g.font='bold 14px monospace';pops.forEach(p=>{g.globalAlpha=Math.min(1,p.t);g.fillStyle=p.c;g.fillText(p.s,p.x-20,p.y)});g.globalAlpha=1;g.restore()}
// ---- UI ----
function showTitle(txt,col){const c=document.createElement('canvas'),x=c.getContext('2d'),f='bold 10px monospace';x.font=f;
 const w=Math.ceil(x.measureText(txt).width)+4;c.width=w;c.height=14;x.font=f;x.textBaseline='top';
 x.fillStyle='#000';x.fillText(txt,2,2);x.fillStyle=col;x.fillText(txt,1,1);
 const d=x.getImageData(0,0,w,14);for(let i=3;i<d.data.length;i+=4)d.data[i]=d.data[i]>110?255:0;x.putImageData(d,0,0);
 c.style.width=w*clamp(Math.floor(W*.6/w),3,12)+'px';
 const t=$('title');t.innerHTML='';t.appendChild(c);t.classList.remove('go');void t.offsetWidth;t.classList.add('go')}
function ico(id){const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').drawImage(spr(id),0,0,16,16);return c}
const tip=$('tip');addEventListener('mousemove',e=>{tip.style.left=e.clientX+14+'px';tip.style.top=e.clientY+10+'px'});
function tipHtml(id){const it=ITEMS[id];let t='<b>'+it.name+'</b>';
 if(it.type==='armor')t+='<br>Defense +'+it.def+'<br>Health +'+it.hp+'<br>Damage +'+it.dmg+'%';
 else if(it.type==='sword')t+='<br>Damage +'+it.atk+'<br>Drop rate '+(it.rate*100).toFixed(3)+'%';
 else if(it.type==='pickaxe')t+='<br>Mining power +'+it.pow+'<br>Drop rate '+(it.rate*100).toFixed(3)+'%';
 else if(it.type==='heart')t+='<br>+'+it.xpBonus+'% skill XP<br>+'+it.spd+'% speed<br>+'+it.jmp+'% jump<br>Drop rate '+(it.rate*100).toFixed(2)+'%';
 else t+='<br>'+it.desc;return t}
function slotDiv(sl,cls,fn,label){const d=document.createElement('div');d.className='slot '+(cls||'');if(label)d.dataset.l=label;
 if(sl){d.appendChild(ico(sl.id));if(sl.n>1){const n=document.createElement('i');n.textContent=sl.n;d.appendChild(n)}
  d.onmouseenter=()=>{tip.innerHTML=tipHtml(sl.id);tip.style.display='block'};d.onmouseleave=()=>tip.style.display='none'}
 d.onclick=fn;return d}
function renderHotbar(){const h=$('hb');h.innerHTML='';S.hotbar.forEach((sl,i)=>{const d=slotDiv(sl,i===S.selectedSlot?'sel':'',()=>{S.selectedSlot=i;renderHotbar();Save.write()});d.dataset.k=i+1;h.appendChild(d)})}
function renderInv(){tip.style.display='none';
 const eq=$('eq');eq.innerHTML='';[...SLOTS,'heart','sword','pickaxe'].forEach(k=>{const id=S.equipment[k];
  eq.appendChild(slotDiv(id?{id,n:1}:null,'',()=>{if(inv.del){if(id){S.equipment[k]=null;changed()}return}if(id&&place(id,1,[S.inventory,S.hotbar])===0){S.equipment[k]=null;changed()}},k))});
 const ig=$('ig');ig.innerHTML='';S.inventory.forEach((sl,i)=>ig.appendChild(slotDiv(sl,'',()=>invClick(i))));
 const hi=$('hbi');hi.innerHTML='';S.hotbar.forEach((sl,i)=>hi.appendChild(slotDiv(sl,i===S.selectedSlot?'sel':'',()=>{
  if(sl&&inv.del){S.hotbar[i]=null;changed();return}if(sl){const left=place(sl.id,sl.n,[S.inventory]);if(left===0)S.hotbar[i]=null;else sl.n=left;changed()}})))}
function invClick(i){const sl=S.inventory[i];if(!sl)return;const it=ITEMS[sl.id];if(inv.del){S.inventory[i]=null;changed();return}
 if(it.slot||it.type==='heart'){const k=it.type==='heart'?'heart':it.slot,old=S.equipment[k];S.equipment[k]=sl.id;S.inventory[i]=old?{id:old,n:1}:null}
 else{const left=place(sl.id,sl.n,[S.hotbar]);
  if(left===0)S.inventory[i]=null;else if(left<sl.n)sl.n=left;else{const sel=S.hotbar[S.selectedSlot];S.hotbar[S.selectedSlot]=sl;S.inventory[i]=sel}}
 changed()}
function changed(){if(inv.open)renderInv();renderHotbar();Save.write()}
$('skin').value=S.character.skin;$('hair').value=S.character.hair;
$('skin').oninput=e=>{S.character.skin=e.target.value;Save.write()};$('hair').oninput=e=>{S.character.hair=e.target.value;Save.write()};
function resetDel(){inv.del=false;$('del').textContent='Delete mode: off';$('del').style.background=''}
$('del').onclick=()=>{inv.del=!inv.del;$('del').textContent='Delete mode: '+(inv.del?'ON (click items)':'off');$('del').style.background=inv.del?'#c33':''};
const togSet=()=>{const s=$('settings');s.style.display=s.style.display==='flex'?'none':'flex'};$('gear').onclick=togSet;
document.querySelectorAll('button').forEach(b=>b.onmousedown=e=>e.preventDefault());$('exp').onclick=Save.exportFile;$('imp').onclick=()=>$('file').click();$('file').onchange=e=>e.target.files[0]&&Save.importFile(e.target.files[0]);
function hud(){const st=stats(),zi=curL-1;
 let h='<b>'+(zi<0?'Surface Farm':CAVES[zi].name)+'</b><br>HP '+Math.ceil(P.hp)+'/'+st.hp+' DEF '+st.def+' DMG +'+st.dmg+'% XP +'+st.xp+'%<br>SPD +'+st.spd+'% JMP +'+st.jmp+'%<div class="bar"><b style="background:#e33;width:'+P.hp/st.hp*100+'%"></b></div>';
 for(const k in S.skills){const s=S.skills[k],n=need(s.level);h+=k[0].toUpperCase()+k.slice(1)+' Lv '+s.level+(s.level<MAXLV?' '+Math.floor(s.xp)+'/'+n:' MAX')+'<div class="bar"><b style="background:#4c4;width:'+(s.level<MAXLV?s.xp/n*100:100)+'%"></b></div>'}
 $('hud').innerHTML=h}
renderHotbar();
setInterval(()=>{S.player.x=Math.round(P.x);S.player.level=P.lvl;Save.write()},3000);setInterval(hud,150);addEventListener('beforeunload',Save.flush);
let last=performance.now();(function loop(t){update(Math.min(.05,(t-last)/1000));last=t;draw();requestAnimationFrame(loop)})(last);
})();
