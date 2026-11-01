/* ARKON DATA (all game content is defined here).
 * SPRITES: put 16x16 PNGs in /sprites folder named <key>.png (see README.md for the key list).
 * Missing files fall back to placeholder art. To use a different filename, add it to ASSET_OVERRIDES. */
const ASSET_DIR='sprites/';
const ASSET_OVERRIDES={ /* 'player':'hero.png', 'slime_0':'green_blob.png' */ };
const MAXLV=60,SLOTS=['helmet','chestplate','leggings','boots'],SMUL=[1,1.6,1.3,.8];
const need=l=>Math.round(30*Math.pow(l,1.6)); // xp needed to leave level l
const ITEMS={},SPR={};
function def(id,name,type,kind,color,x){ITEMS[id]=Object.assign({id,name,type},x);SPR[id]={kind,color}}
const CROPLIST=[
 {id:'wheat',name:'Wheat',grow:20,xp:4,color:'#e0c050'},
 {id:'carrot',name:'Carrot',grow:30,xp:7,color:'#e8832a'},
 {id:'potato',name:'Potato',grow:45,xp:11,color:'#c9a36a'},
 {id:'pumpkin',name:'Pumpkin',grow:70,xp:20,color:'#e86a10'}];
const CROPS={};
CROPLIST.forEach(c=>{CROPS[c.id]=c;
 def('seed_'+c.id,c.name+' Seeds','seed','seed',c.color,{crop:c.id,desc:'Select in hotbar, click a farm plot. Grows in '+c.grow+'s.'});
 def('crop_'+c.id,c.name,'material','crop',c.color,{desc:'Farming harvest.'});
 for(let s=0;s<3;s++)SPR['plant_'+c.id+'_'+s]={kind:'plant',color:c.color,stage:s}});
// [cave, slime, ore, color]
const CAVES=[
 ['Mossy Hollow','Moss Slime','Moss','#5fa04a'],['Clay Pits','Clay Slime','Claystone','#c0794d'],
 ['Copper Vein','Copper Slime','Copper','#d9904a'],['Frost Grotto','Frost Slime','Frostite','#7ad0e8'],
 ['Iron Deep','Iron Slime','Iron','#9aa4b0'],['Amber Mines','Amber Slime','Amber','#e8b030'],
 ['Ruby Depths','Ruby Slime','Ruby','#d83a4a'],['Void Cavern','Void Slime','Voidstone','#8a4ae0'],
 ['Prism Sanctum','Prism Slime','Prismite','#4ae0c0'],['Arkon Core','Arkon Slime','Arkonite','#ff5ad0']
].map((r,i)=>({i,name:r[0],slime:r[1],ore:r[2],color:r[3],prefix:r[1].split(' ')[0],heart:r[1].split(' ')[0]+' Heart',
 slimeHp:Math.round(20*Math.pow(1.45,i)),slimeDmg:Math.round(3*Math.pow(1.4,i)),slimeXp:Math.round(5*Math.pow(1.5,i)),
 oreHp:4+4*i,oreXp:Math.round(3*Math.pow(1.5,i)),heartRate:.1*Math.pow(.55,i),heartXp:(i+1)*4,heartSpd:(i+1)*3,heartJmp:(i+1)*2,toolRate:.005*Math.pow(.65,i),armorRate:.08,unlockCombat:3*i}));
CAVES.forEach(c=>{const i=c.i;
 def('ore_'+i,c.ore,'material','ore',c.color,{desc:'Mined in '+c.name+'.'});
 def('goo_'+i,c.prefix+' Goo','material','goo',c.color,{desc:'Dropped by '+c.slime+'.'});
 def('heart_'+i,c.heart,'heart','heart',c.color,{xpBonus:c.heartXp,spd:c.heartSpd,jmp:c.heartJmp,rate:c.heartRate});
 def('sword_'+i,c.ore+' Sword','sword','sword',c.color,{slot:'sword',atk:6*(i+1),rate:c.toolRate});
 def('pickaxe_'+i,c.ore+' Pickaxe','pickaxe','pickaxe',c.color,{slot:'pickaxe',pow:2*(i+1),rate:c.toolRate});
 SPR['slime_'+i]={kind:'slime',color:c.color};
 SLOTS.forEach((s,k)=>def('armor_'+i+'_'+s,c.prefix+' '+s[0].toUpperCase()+s.slice(1),'armor',s,c.color,
  {slot:s,def:Math.round(2*(i+1)*SMUL[k]),hp:Math.round(5*(i+1)*SMUL[k]),dmg:Math.round(2*(i+1)*SMUL[k])}))});
SPR.player={kind:'player'};
