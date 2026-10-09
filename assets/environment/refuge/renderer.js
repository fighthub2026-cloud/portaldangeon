/* Refúgio: camada visual independente. Nunca escreve na grade nem no estado de jogo. */
const refugeCatalog=__CATALOG__;
const refugeImages={objects:new Image(),terrain:new Image(),details:new Image(),dungeon:new Image()};
refugeImages.objects.src=__OBJECTS__;
refugeImages.terrain.src=__TERRAIN__;refugeImages.details.src=__DETAILS__;refugeImages.dungeon.src=__DUNGEON__;
const refugeArt={ready:false,sprites:new Map(),tiles:[],floorCache:new Map(),error:null};
function refugeCrop(image,rect,width,height,diamond=false){const raw=document.createElement('canvas');const [u,v,w,h]=rect;raw.width=Math.round(w*image.naturalWidth);raw.height=Math.round(h*image.naturalHeight);const c=raw.getContext('2d');c.drawImage(image,Math.round(u*image.naturalWidth),Math.round(v*image.naturalHeight),raw.width,raw.height,0,0,raw.width,raw.height);const a=c.getImageData(0,0,raw.width,raw.height).data;let left=raw.width,top=raw.height,right=0,bottom=0;for(let y=0;y<raw.height;y++)for(let x=0;x<raw.width;x++)if(a[(y*raw.width+x)*4+3]>96){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}if(right<left)throw Error('Sprite vazio');const out=document.createElement('canvas');out.width=width*2;out.height=height*2;const ctx=out.getContext('2d');ctx.imageSmoothingEnabled=false;if(diamond){ctx.beginPath();ctx.moveTo(width,0);ctx.lineTo(width*2,height);ctx.lineTo(width,height*2);ctx.lineTo(0,height);ctx.closePath();ctx.clip()}ctx.drawImage(raw,left,top,right-left+1,bottom-top+1,0,0,out.width,out.height);return out}
function prepareRefugeArt(){if(refugeArt.ready||!Object.values(refugeImages).every(i=>i.complete&&i.naturalWidth))return;try{for(const [id,def]of Object.entries(refugeCatalog.sprites))refugeArt.sprites.set(id,refugeCrop(refugeImages[def.atlas||'objects'],def.rect,...def.size));for(let i=0;i<8;i++)refugeArt.tiles.push(refugeCrop(refugeImages.terrain,[(i%4)/4,Math.floor(i/4)/2,.25,.5],32,16,true));refugeArt.ready=true}catch(e){refugeArt.error=e.message;console.error('Refúgio: '+e.message)}}
Object.values(refugeImages).forEach(i=>i.addEventListener('load',prepareRefugeArt));
function refugeSprite(id,sx,sy,alpha=1){const def=refugeCatalog.sprites[id],image=refugeArt.sprites.get(id);if(!image)return false;g.save();g.imageSmoothingEnabled=false;g.globalAlpha*=alpha;if(def.flipX){g.translate(Math.round(sx),0);g.scale(-1,1);sx=0}g.drawImage(image,Math.round(sx-def.size[0]*def.origin[0]),Math.round(sy-def.size[1]*def.origin[1]),...def.size);g.restore();return true}
function refugeFloorTile(x,y){const path=trailCells.has(x+','+y),water=M[y][x]==='W',bridge=cur==='hub'&&y===9&&(x===6||x===13),nearPortal=ports.some(([a,b])=>Math.hypot(x-a,y-b)<1.8);let index=water?7:path?(nearPortal?5:4):(x<5&&y>10?6:y<5&&x<8?1:x>14&&y>10?2:0);if(cur==='dungeon'){const arena=x>=27&&y>=15;index=arena?5:path?(nearPortal?5:4):x>=15&&y<15?1:y>=15?6:0}const neighbors=[[0,-1],[1,0],[0,1],[-1,0]];let mask=0;if(path)neighbors.forEach(([dx,dy],i)=>{if(!trailCells.has((x+dx)+','+(y+dy))&&!solid(x+dx,y+dy))mask|=1<<i});const key=cur+':'+index+':'+mask+':'+((x*7+y*11)%3);if(!refugeArt.floorCache.has(key)){const out=document.createElement('canvas');out.width=64;out.height=32;const c=out.getContext('2d');c.imageSmoothingEnabled=false;c.drawImage(refugeArt.tiles[index],0,0);if(mask){const edges=[[[32,0],[64,16]],[[64,16],[32,32]],[[32,32],[0,16]],[[0,16],[32,0]]];c.save();c.beginPath();c.moveTo(32,0);c.lineTo(64,16);c.lineTo(32,32);c.lineTo(0,16);c.closePath();c.clip();for(let i=0;i<4;i++)if(mask&(1<<i)){const [a,b]=edges[i];c.save();c.beginPath();c.moveTo(...a);c.lineTo(...b);c.lineTo(b[0]*.82+32*.18,b[1]*.82+16*.18);c.lineTo(a[0]*.82+32*.18,a[1]*.82+16*.18);c.closePath();c.clip();c.drawImage(refugeArt.tiles[1],0,0);c.restore()}c.restore()}refugeArt.floorCache.set(key,out)}return {image:refugeArt.floorCache.get(key),bridge,water}}
function drawRefugeFloorArt(x,y,sx,sy){if(!refugeArt.ready)return false;const tile=refugeFloorTile(x,y);g.save();g.imageSmoothingEnabled=false;g.drawImage(tile.image,sx-16,sy-8,32,16);if(tile.bridge){g.beginPath();g.moveTo(sx-16,sy);g.lineTo(sx,sy-8);g.lineTo(sx+16,sy);g.lineTo(sx,sy+8);g.closePath();g.clip();g.fillStyle='#65533d';g.fillRect(sx-16,sy-8,32,16);g.strokeStyle='#b1986d';for(let i=-18;i<18;i+=4){g.beginPath();g.moveTo(sx+i,sy-8);g.lineTo(sx+i+16,sy+8);g.stroke()}}if(tile.water){g.strokeStyle='#afdfdb40';g.beginPath();g.moveTo(sx-8,sy-1);g.lineTo(sx-2,sy+1);g.stroke()}g.restore();return true}
// Árvores são pontos de paisagem; corredores e bordas da arena usam obstáculos baixos.
function environmentObstacleId(x,y){
 const n=(x*13+y*7)%11,nearTrail=[[0,-1],[1,0],[0,1],[-1,0]].some(([dx,dy])=>trailCells.has((x+dx)+','+(y+dy))),arena=cur==='dungeon'&&x>=25&&y>=14;
 if(cur==='dungeon'){
  if(x===26&&y===17)return 'fendaArch';
  if(!nearTrail&&!arena&&n===0)return 'fendaTree';
  return n<3?'fendaLog':n===7?'column':n===4?'fendaCrystal':'boulder';
 }
 if(!nearTrail&&n===0)return ['oak','pine','ancient'][(x+y)%3];
 return n===2?'log':n===7?'column':'boulder';
}
function environmentOccludesActor(x,y,id){
 const def=refugeCatalog.sprites[id],tx=(x-y)*16,ty=(x+y+1)*8-5,w=def.size[0],h=def.size[1];
 return [{x:px,y:py,t:'hero'},...enemies.filter(e=>e.hp>0)].some(a=>{
  if(a.x+a.y>=x+y+1)return false;
  const ax=(a.x-a.y)*16,ay=(a.x+a.y)*8,aw=a.t==='b'?38:a.t==='hero'?17:13,ah=a.t==='b'?94:a.t==='hero'?49:a.t==='m'?44:35;
  return ax+aw>tx-w/2&&ax-aw<tx+w/2&&ay>ty-h&&ay-ah<ty-9;
 });
}
function environmentObstacleSprite(id,sx,sy,fade){
 if(!fade)return refugeSprite(id,sx,sy);
 const def=refugeCatalog.sprites[id],image=refugeArt.sprites.get(id);if(!image)return false;
 const [w,h]=def.size,base=Math.min(10,h*.4),top=h-base,left=Math.round(sx-w/2),y=Math.round(sy-h),sourceTop=image.height*top/h;
 g.save();g.imageSmoothingEnabled=false;g.globalAlpha*=.13;g.drawImage(image,0,0,image.width,sourceTop,left,y,w,top);g.restore();
 g.save();g.imageSmoothingEnabled=false;g.drawImage(image,0,sourceTop,image.width,image.height-sourceTop,left,y+top,w,base);g.restore();return true;
}
function drawRefugeObstacleArt(x,y,sx,sy){
 if(!refugeArt.ready)return false;
 const id=environmentObstacleId(x,y);shadow(sx+3,sy+1,13,4,.24);
 g.save();g.imageSmoothingEnabled=false;g.drawImage(refugeArt.tiles[1],sx-16,sy-8,32,16);g.strokeStyle='#8aa16b99';g.beginPath();g.moveTo(sx-15,sy);g.lineTo(sx,sy-7);g.lineTo(sx+15,sy);g.lineTo(sx,sy+7);g.closePath();g.stroke();g.restore();
 environmentObstacleSprite(id,sx,sy-5,environmentOccludesActor(x,y,id));return true;
}
function queueRefugeDecorations(D,S,t){if(!refugeArt.ready)return;if(cur==='dungeon'){queueDungeonDecorations(D,S,t);return}for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++){if(M[y][x]!=='.'||trailCells.has(x+','+y)||[{x:px,y:py},...enemies].some(a=>Math.hypot(x+.5-a.x,y+.5-a.y)<1))continue;const n=(x*37+y*61)%19;if(n!==1)continue;const [sx,sy]=S(x,y);if(sx<-25||sx>W+25||sy<-25||sy>H+30)continue;D.push([x+y+.75,()=>refugeSprite('fern',sx+5,sy+1,.85)])}for(const x of [6,13]){const [bx,by]=S(x,9);D.push([x+9+.5,()=>refugeSprite('bridge',bx,by+7)])}for(const x of [8,11,15]){const [mx,my]=S(x,8);D.push([x+8.7,()=>refugeSprite('mushrooms',mx+9,my+3)])}const [sx,sy]=S(15,11);D.push([27,()=>{shadow(sx,sy,15,5,.3);refugeSprite('altar',sx,sy,Math.hypot(px-15.5,py-11.5)<1.4?.35:1)}])}

function queueDungeonDecorations(D,S,t){for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++){if(M[y][x]!=='.'||trailCells.has(x+','+y)||(x>=27&&y>=15)||[{x:px,y:py},...enemies].some(a=>Math.hypot(x+.5-a.x,y+.5-a.y)<1))continue;const n=(x*37+y*61)%29;if(n!==1)continue;const [sx,sy]=S(x,y);if(sx<-25||sx>W+25||sy<-25||sy>H+30)continue;D.push([x+y+.75,()=>refugeSprite(n===1?'fern':'mushrooms',sx+7,sy+1,.85)])}}
function drawDungeonAtmosphere(S,t){if(cur!=='dungeon'||!refugeArt.ready)return;g.save();for(const [x,y]of [[20,10],[10,20],[30,21]]){const [sx,sy]=S(x,y);if(sx<-90||sx>W+90||sy<-90||sy>H+90)continue;glow(sx+Math.sin(t*.25+x)*6,sy,55,'93,104,157',.045)}g.restore()}
