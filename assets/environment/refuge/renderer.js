/* Refúgio: camada visual independente. Nunca escreve na grade nem no estado de jogo. */
const refugeCatalog=__CATALOG__;
const refugeImages={objects:new Image(),terrain:new Image(),details:new Image(),dungeon:new Image(),low:new Image()};
refugeImages.objects.src=__OBJECTS__;
refugeImages.terrain.src=__TERRAIN__;refugeImages.details.src=__DETAILS__;refugeImages.dungeon.src=__DUNGEON__;refugeImages.low.src=__LOW__;
const refugeArt={ready:false,sprites:new Map(),tiles:[],floorCache:new Map(),error:null};
function refugeCrop(image,rect,width,height,diamond=false){const raw=document.createElement('canvas');const [u,v,w,h]=rect;raw.width=Math.round(w*image.naturalWidth);raw.height=Math.round(h*image.naturalHeight);const c=raw.getContext('2d');c.drawImage(image,Math.round(u*image.naturalWidth),Math.round(v*image.naturalHeight),raw.width,raw.height,0,0,raw.width,raw.height);const a=c.getImageData(0,0,raw.width,raw.height).data;let left=raw.width,top=raw.height,right=0,bottom=0;for(let y=0;y<raw.height;y++)for(let x=0;x<raw.width;x++)if(a[(y*raw.width+x)*4+3]>96){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}if(right<left)throw Error('Sprite vazio');const out=document.createElement('canvas');out.width=width*2;out.height=height*2;const ctx=out.getContext('2d');ctx.imageSmoothingEnabled=false;if(diamond){ctx.beginPath();ctx.moveTo(width,0);ctx.lineTo(width*2,height);ctx.lineTo(width,height*2);ctx.lineTo(0,height);ctx.closePath();ctx.clip()}ctx.drawImage(raw,left,top,right-left+1,bottom-top+1,0,0,out.width,out.height);return out}
function prepareRefugeArt(){if(refugeArt.ready||!Object.values(refugeImages).every(i=>i.complete&&i.naturalWidth))return;try{for(const [id,def]of Object.entries(refugeCatalog.sprites))refugeArt.sprites.set(id,refugeCrop(refugeImages[def.atlas||'objects'],def.rect,...def.size));for(let i=0;i<8;i++)refugeArt.tiles.push(refugeCrop(refugeImages.terrain,[(i%4)/4,Math.floor(i/4)/2,.25,.5],32,16,true));refugeArt.tilePixels=refugeArt.tiles.map(c=>c.getContext('2d').getImageData(0,0,64,32).data);refugeArt.ready=true}catch(e){refugeArt.error=e.message;console.error('Refúgio: '+e.message)}}
Object.values(refugeImages).forEach(i=>i.addEventListener('load',prepareRefugeArt));
function refugeSprite(id,sx,sy,alpha=1){const def=refugeCatalog.sprites[id],image=refugeArt.sprites.get(id);if(!image)return false;g.save();g.imageSmoothingEnabled=false;g.globalAlpha*=alpha;if(id==='lantern')g.globalAlpha*=.96+.04*Math.sin((refugeArt.time||0)*1.7+sx);if(def.flipX){g.translate(Math.round(sx),0);g.scale(-1,1);sx=0}g.drawImage(image,Math.round(sx-def.size[0]*def.origin[0]),Math.round(sy-def.size[1]*def.origin[1]),...def.size);g.restore();return true}
function environmentTerrainIndex(x,y){
 if(M[y]?.[x]==='W')return 7;
 const path=trailCells.has(x+','+y),nearPortal=ports.some(([a,b])=>Math.hypot(x-a,y-b)<1.8);
 if(cur==='dungeon')return x>=27&&y>=15?5:path?(nearPortal?5:4):x>=15&&y<15?1:y>=15?6:0;
 return path?(nearPortal?5:4):x<5&&y>10?6:y<5&&x<8?1:x>14&&y>10?2:0;
}
function refugeFloorTile(x,y){
 const index=environmentTerrainIndex(x,y),water=index===7,bridge=cur==='hub'&&y===9&&(x===6||x===13),adjacent=[[0,-1],[1,0],[0,1],[-1,0]].map(([dx,dy])=>M[y+dy]?.[x+dx]===undefined||solid(x+dx,y+dy)?index:environmentTerrainIndex(x+dx,y+dy));
 const variant=(x*7+y*11)%3,key=cur+':'+index+':'+adjacent.join(',')+':'+variant;
 if(!refugeArt.floorCache.has(key)){
  const out=document.createElement('canvas');out.width=64;out.height=32;const c=out.getContext('2d');c.imageSmoothingEnabled=false;
  c.fillStyle=['#355843','#365343','#626343','#675b44','#786346','#6c7463','#464837','#315c5e'][index];c.beginPath();c.moveTo(32,0);c.lineTo(64,16);c.lineTo(32,32);c.lineTo(0,16);c.closePath();c.fill();c.drawImage(refugeArt.tiles[index],0,0);
  if(!water&&!bridge){const data=c.getImageData(0,0,64,32),textures=refugeArt.tilePixels;for(let py=0;py<32;py++)for(let px=0;px<64;px++){
   const distances=[py-(px-32)/2,32-py-(px-32)/2,32-py+(px-32)/2,py+(px-32)/2],i=(py*64+px)*4;if(Math.min(...distances)<0)continue;
   for(let edge=0;edge<4;edge++){const other=adjacent[edge],d=distances[edge];if(other===index||other===7||d>5)continue;
    // Dither nas bordas: conserva os pixels definidos em vez de aplicar borrão.
    const hash=((px*37+py*71+variant*19)%101)/101,weight=.5*(1-d/5);if(hash>weight)continue;const source=textures[other];if(source[i+3]<80)continue;for(let k=0;k<3;k++)data.data[i+k]=source[i+k];
   }
  }c.putImageData(data,0,0)}refugeArt.floorCache.set(key,out);
 }return {image:refugeArt.floorCache.get(key),bridge,water};
}
function drawRefugeFloorArt(x,y,sx,sy){if(!refugeArt.ready)return false;const tile=refugeFloorTile(x,y);g.save();g.imageSmoothingEnabled=false;g.drawImage(tile.image,sx-16,sy-8,32,16);if(tile.bridge){g.beginPath();g.moveTo(sx-16,sy);g.lineTo(sx,sy-8);g.lineTo(sx+16,sy);g.lineTo(sx,sy+8);g.closePath();g.clip();g.fillStyle='#65533d';g.fillRect(sx-16,sy-8,32,16);g.strokeStyle='#b1986d';for(let i=-18;i<18;i+=4){g.beginPath();g.moveTo(sx+i,sy-8);g.lineTo(sx+i+16,sy+8);g.stroke()}}if(tile.water){g.strokeStyle='#afdfdb40';g.beginPath();const drift=Math.sin((refugeArt.time||0)*.7+x*.8)*2;g.moveTo(sx-8+drift,sy-1);g.lineTo(sx-2+drift,sy+1);g.moveTo(sx+3-drift,sy+3);g.lineTo(sx+7-drift,sy+4);g.stroke()}g.restore();return true}
// Árvores são pontos de paisagem; corredores e bordas da arena usam obstáculos baixos.
function environmentObstacleId(x,y){
 const n=(x*13+y*7)%11,nearTrail=[[0,-1],[1,0],[0,1],[-1,0]].some(([dx,dy])=>trailCells.has((x+dx)+','+(y+dy))),arena=cur==='dungeon'&&x>=25&&y>=14;
 if(cur==='dungeon'){
  if(x===26&&y===17)return 'fendaArch';
  if(!nearTrail&&!arena&&n===0)return 'fendaTree';
  return n===1?'mossWall':n===2?'rootStump':n===3?'fendaLog':n===7?'column':n===4?'fendaCrystal':n===5?'ruinSteps':n===8?'mushroomRock':'boulder';
 }
 if(!nearTrail&&n===0)return ['oak','pine','ancient'][(x+y)%3];
 return n===1?'mossWall':n===2?'log':n===3?'rootStump':n===7?'column':n===5?'ruinSteps':n===8?'mushroomRock':'boulder';
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
 const occluded=environmentOccludesActor(x,y,id);environmentObstacleSprite(id,sx,sy-5,occluded);if(!occluded&&(id==='fendaCrystal'||id==='mushroomRock')){g.save();g.globalCompositeOperation='lighter';glow(sx,sy-12,17,'133,85,201',.045+.015*Math.sin((refugeArt.time||0)*1.4+x));g.restore()}return true;
}
function queueRefugeDecorations(D,S,t){if(!refugeArt.ready)return;if(cur==='dungeon'){queueDungeonDecorations(D,S,t);return}for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++){if(M[y][x]!=='.'||trailCells.has(x+','+y)||[{x:px,y:py},...enemies].some(a=>Math.hypot(x+.5-a.x,y+.5-a.y)<1))continue;const n=(x*37+y*61)%19;if(n!==1)continue;const [sx,sy]=S(x,y);if(sx<-25||sx>W+25||sy<-25||sy>H+30)continue;D.push([x+y+.75,()=>refugeSprite('fern',sx+5,sy+1,.85)])}for(const x of [6,13]){const [bx,by]=S(x,9);D.push([x+9+.5,()=>refugeSprite('bridge',bx,by+7)])}for(const x of [8,11,15]){const [mx,my]=S(x,8);D.push([x+8.7,()=>refugeSprite('mushrooms',mx+9,my+3)])}const [sx,sy]=S(15,11);D.push([27,()=>{shadow(sx,sy,15,5,.3);refugeSprite('altar',sx,sy,Math.hypot(px-15.5,py-11.5)<1.4?.35:1)}])}

function queueDungeonDecorations(D,S,t){for(let y=1;y<ROWS-1;y++)for(let x=1;x<COLS-1;x++){if(M[y][x]!=='.'||trailCells.has(x+','+y)||(x>=27&&y>=15)||[{x:px,y:py},...enemies].some(a=>Math.hypot(x+.5-a.x,y+.5-a.y)<1))continue;const n=(x*37+y*61)%29,mushroomGrove=x<12&&y>=15;if(n!==1&&!(mushroomGrove&&n===5))continue;const [sx,sy]=S(x,y);if(sx<-25||sx>W+25||sy<-25||sy>H+30)continue;D.push([x+y+.75,()=>refugeSprite(mushroomGrove?'mushrooms':'fern',sx+7,sy+1,.85)])}}
function drawDungeonAtmosphere(S,t){if(cur!=='dungeon'||!refugeArt.ready)return;g.save();for(const [x,y]of [[20,10],[10,20],[30,21]]){const [sx,sy]=S(x,y);if(sx<-90||sx>W+90||sy<-90||sy>H+90)continue;glow(sx+Math.sin(t*.25+x)*6,sy,55,'93,104,157',.045)}g.restore()}

let environmentAmbience=null;
function updateEnvironmentAmbience(){
 if(!audioCtx||audioCtx.state!=='running')return;
 if(!environmentAmbience){try{const buffer=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),data=buffer.getChannelData(0);let seed=9147,last=0;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;last=(last+(seed/4294967296*2-1)*.06)/1.02;data[i]=last*3}
 const channels={};for(const name of ['wind','stream']){const source=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),gain=audioCtx.createGain();source.buffer=buffer;source.loop=true;source.playbackRate.value=name==='wind'?.55:1;filter.type=name==='wind'?'lowpass':'bandpass';filter.frequency.value=name==='wind'?300:850;filter.Q.value=.6;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(audioCtx.destination);source.start();channels[name]={source,filter,gain,target:0}}environmentAmbience=channels}catch{return}}
 const quiet=audioMuted||ui||document.hidden,riverDistance=Math.hypot(px-Math.max(5.5,Math.min(17.5,px)),py-9.5),targets={wind:quiet?0:cur==='dungeon'?.025:.008,stream:quiet||cur!=='hub'?0:.07*Math.max(0,1-riverDistance/5)};
 for(const name of ['wind','stream']){const channel=environmentAmbience[name],target=targets[name];if(Math.abs(channel.target-target)>.0002){channel.gain.gain.setTargetAtTime(target,audioCtx.currentTime,.25);channel.target=target}}
}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&environmentAmbience)for(const c of Object.values(environmentAmbience)){c.gain.gain.setTargetAtTime(0,audioCtx.currentTime,.05);c.target=0}});
