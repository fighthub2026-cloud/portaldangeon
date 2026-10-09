"""Incorpora PNGs e catálogo no HTML offline; não altera os sistemas de jogo."""
from pathlib import Path
import base64,json,re
root=Path(__file__).resolve().parents[1]
p=root/'Portais_Floresta_v5.html';s=p.read_text()
module=(root/'assets/environment/refuge/renderer.js').read_text()
module=module.replace('__CATALOG__',(root/'assets/environment/refuge/catalog.json').read_text())
for token,filename in [('__OBJECTS__','objects.png'),('__TERRAIN__','terrain.png'),('__DETAILS__','details.png'),('__DUNGEON__','../dungeon/objects.png')]:
 data=base64.b64encode((root/'assets/environment/refuge'/filename).read_bytes()).decode();module=module.replace(token,json.dumps('data:image/png;base64,'+data))
a='/* REFUGE_ASSETS_START */';b='/* REFUGE_ASSETS_END */';block=a+'\n'+module+'\n'+b+'\n'
if a in s:s=re.sub(re.escape(a)+r'[\s\S]*?'+re.escape(b)+'\n?',lambda _:block,s,count=1)
else:
 s=s.replace('function drawPortal(cx,cy,t,label,pal){',block+'function drawPortal(cx,cy,t,label,pal){',1)
 s=s.replace("  g.fillStyle='#2b2547';", "  if(!(cur==='hub'&&refugeArt.ready)){g.fillStyle='#2b2547';",1)
 s=s.replace("  const vx=cx,vy=cy-23;", "  }const vx=cx,vy=cy-23;",1)
 s=s.replace("  g.fillStyle='#d9c4ff';g.font='8px monospace';", "  if(cur==='hub'&&refugeArt.ready)refugeSprite('portal',cx,cy+2);g.fillStyle='#d9c4ff';g.font='8px monospace';",1)
 s=s.replace('function drawForestProp(x,y,sx,sy,t){','function drawForestProp(x,y,sx,sy,t){if(cur===\'hub\'&&drawRefugeObstacleArt(x,y,sx,sy))return;',1)
 s=s.replace('function drawFloor(x,y,sx,sy){','function drawFloor(x,y,sx,sy){if(cur===\'hub\'&&drawRefugeFloorArt(x,y,sx,sy))return;',1)
 s=s.replace("if(cur==='hub')for(const [x,y]of [[4,11],[15,11],[8,6]])", "if(cur==='hub')queueRefugeDecorations(D,S,t);if(cur==='hub')for(const [x,y]of (refugeArt.ready?[[4,11],[8,6]]:[[4,11],[15,11],[8,6]]))",1)
 s=s.replace('function frame(t){','function frame(t){prepareRefugeArt();',1)
s=s.replace("if(c==='L')D.push([x+y+1,()=>{drawCrystal(sx,sy);drawLamp(sx,sy,t)}])","if(c==='L')D.push([x+y+1,()=>{if(!(cur==='hub'&&refugeArt.ready&&refugeSprite('lantern',sx,sy))){drawCrystal(sx,sy);drawLamp(sx,sy,t)}}])")
# O mesmo sistema visual atende agora os dois mapas, preservando todos os hooks funcionais.
s=s.replace("cur==='hub'&&drawRefugeObstacleArt","drawRefugeObstacleArt").replace("cur==='hub'&&drawRefugeFloorArt","drawRefugeFloorArt")
s=s.replace("cur==='hub'&&refugeArt.ready","refugeArt.ready")
s=s.replace("if(cur==='hub')queueRefugeDecorations(D,S,t);","queueRefugeDecorations(D,S,t);")
s=s.replace("  enemies.forEach(e=>drawAttackWarning(e,ox,oy,t));","  drawDungeonAtmosphere(S,t);enemies.forEach(e=>drawAttackWarning(e,ox,oy,t));")
p.write_text(s)
