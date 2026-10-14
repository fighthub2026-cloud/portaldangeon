/* Aetheria — one-view raster skeletal animation laboratory.
 * No framework, no WebGL, no network calls. Angles and lengths are procedural;
 * the character appearance always comes from the supplied raster artwork.
 *
 * new AetheriaRig(canvas, {
 *   images: {head,torso,pelvis,fullArm,fullLeg,hand,fist,foot},
 *   meta: {
 *     fullArm:{width:57,joints:[.08,.50,.94],centerX:.5},
 *     fullLeg:{width:62,joints:[.06,.50,.94],centerX:.5},
 *     head:{width:168,height:190,pivot:[.5,.93]},
 *     torso:{width:128,height:128,pivot:[.5,.10]},
 *     pelvis:{width:104,height:66,pivot:[.5,.16]},
 *     hand:{width:35,height:44,pivot:[.5,.10]},
 *     fist:{width:38,height:38,pivot:[.5,.10]},
 *     foot:{width:53,height:41,pivot:[.5,.13]}
 *   },
 *   masks: {optional exact skin-coverage masks matching corresponding images},
 *   skinBase:'#e9aa6b'
 * });
 *
 * Image values may be HTMLImageElement, ImageBitmap, or canvas. Image promises
 * must be resolved by the caller. Bare assets {head:Image,...} also accepted.
 * Fallback segmented limbs: upperArm/forearm and thigh/shin.
 * Three mesh source Y anchors correspond to shoulder/elbow/wrist or hip/knee/ankle.
 * Image vertical axis must run from proximal to distal; source transparent margin
 * is kept. Optional per-image mirrorLeft/mirrorRight overrides are supported.
 */
(function (global) {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const pt = (x, y) => ({x, y});
  const add = (a,b) => pt(a.x+b.x,a.y+b.y);
  const sub = (a,b) => pt(a.x-b.x,a.y-b.y);
  const mul = (a,t) => pt(a.x*t,a.y*t);
  const len = a => Math.hypot(a.x,a.y);
  const norm = a => {const l = len(a) || 1; return mul(a,1/l);};
  const lerpPoint = (a,b,t) => pt(mix(a.x,b.x,t),mix(a.y,b.y,t));
  const linear = x => x <= .04045 ? x/12.92 : Math.pow((x+.055)/1.055,2.4);
  const srgb = x => x <= .0031308 ? x*12.92 : 1.055*Math.pow(x,1/2.4)-.055;
  const parseHex = h => {
    if (typeof h !== 'string') return null;
    if (/^#[0-9a-f]{3}$/i.test(h)) h = '#' + [...h.slice(1)].map(c=>c+c).join('');
    if (!/^#[0-9a-f]{6}$/i.test(h)) return null;
    return [1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255);
  };
  const imageSize = image => ({width:image.naturalWidth || image.videoWidth || image.width,
    height:image.naturalHeight || image.videoHeight || image.height});
  const DEFAULT_META = {
    head:{width:169,height:190,pivot:[.5,.94]},
    torso:{width:129,height:130,pivot:[.5,.11]},
    pelvis:{width:105,height:66,pivot:[.5,.14]},
    fullArm:{width:43,joints:[.08,.51,.94],centerX:.5},
    fullLeg:{width:46,joints:[.08,.50,.94],centerX:.5},
    upperArm:{width:51,pivot:[.5,.10],end:[.5,.90]},
    forearm:{width:43,pivot:[.5,.10],end:[.5,.90]},
    thigh:{width:57,pivot:[.5,.08],end:[.5,.92]},
    shin:{width:45,pivot:[.5,.08],end:[.5,.92]},
    hand:{width:34,height:45,pivot:[.5,.10]},
    fist:{width:38,height:38,pivot:[.5,.10]},
    foot:{width:54,height:42,pivot:[.5,.13]}
  };

  /* C1 continuous interpolating centerline. Source joint positions are mapped
   * exactly; sampled tangent keeps the two sides of the raster strip continuous.
   */
  function splineAt(points, knots, t) {
    const last = knots.length - 1;
    let i = 0;
    if (t <= knots[0]) {
      const v = mul(sub(points[1],points[0]),1/(knots[1]-knots[0]));
      return {p:add(points[0],mul(v,t-knots[0])),v};
    }
    if (t >= knots[last]) {
      const v = mul(sub(points[last],points[last-1]),1/(knots[last]-knots[last-1]));
      return {p:add(points[last],mul(v,t-knots[last])),v};
    }
    while (i < last-1 && t > knots[i+1]) i++;
    const interval = knots[i+1]-knots[i];
    const u = (t-knots[i])/interval, u2=u*u, u3=u2*u;
    const tangent = j => {
      if (j === 0) return mul(sub(points[1],points[0]),1/(knots[1]-knots[0]));
      if (j === last) return mul(sub(points[last],points[last-1]),1/(knots[last]-knots[last-1]));
      return mul(sub(points[j+1],points[j-1]),1/(knots[j+1]-knots[j-1]));
    };
    const a=points[i], b=points[i+1], va=mul(tangent(i),interval), vb=mul(tangent(i+1),interval);
    const p=pt((2*u3-3*u2+1)*a.x+(u3-2*u2+u)*va.x+(-2*u3+3*u2)*b.x+(u3-u2)*vb.x,
      (2*u3-3*u2+1)*a.y+(u3-2*u2+u)*va.y+(-2*u3+3*u2)*b.y+(u3-u2)*vb.y);
    const v=pt((6*u2-6*u)*a.x+(3*u2-4*u+1)*va.x+(-6*u2+6*u)*b.x+(3*u2-2*u)*vb.x,
      (6*u2-6*u)*a.y+(3*u2-4*u+1)*va.y+(-6*u2+6*u)*b.y+(3*u2-2*u)*vb.y);
    return {p,v};
  }

  /* Affine triangle mapping with half-pixel expanded clips to avoid raster
   * hairlines between adjacent triangles. Texture alpha retains the silhouette.
   */
  function texturedTriangle(ctx,image,s0,s1,s2,d0,d1,d2) {
    const sx1=s1.x-s0.x, sy1=s1.y-s0.y, sx2=s2.x-s0.x, sy2=s2.y-s0.y;
    const det=sx1*sy2-sx2*sy1;
    if (Math.abs(det)<1e-6) return;
    const dx1=d1.x-d0.x,dy1=d1.y-d0.y,dx2=d2.x-d0.x,dy2=d2.y-d0.y;
    const a=(dx1*sy2-dx2*sy1)/det,b=(dy1*sy2-dy2*sy1)/det;
    const c=(sx1*dx2-sx2*dx1)/det,d=(sx1*dy2-sx2*dy1)/det;
    const e=d0.x-a*s0.x-c*s0.y,f=d0.y-b*s0.x-d*s0.y;
    // Offset each edge, rather than scaling around the centroid: centroid
    // expansion leaves hairlines on long, narrow triangles.
    const vertices=[d0,d1,d2],orientation=(dx1*dy2-dy1*dx2)>=0?1:-1;
    const normals=vertices.map((p,i)=>{const q=vertices[(i+1)%3],v=norm(sub(q,p));return pt(v.y*orientation,-v.x*orientation);});
    const expanded=vertices.map((p,i)=>{
      const a=normals[(i+2)%3],b=normals[i],denom=Math.max(.002,1+a.x*b.x+a.y*b.y);
      return add(p,mul(add(a,b),.55/denom));
    });
    const [p0,p1,p2]=expanded;
    ctx.save();
    ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.closePath();ctx.clip();
    ctx.transform(a,b,c,d,e,f);ctx.drawImage(image,0,0);ctx.restore();
  }

  class AetheriaRig {
    constructor(canvas,assets={}) {
      if (!canvas || !canvas.getContext) throw new Error('AetheriaRig requires a canvas.');
      this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});
      this.assets=assets;this.images=assets.images || assets;
      this.meta={};
      Object.keys(DEFAULT_META).forEach(key=>this.meta[key]={...DEFAULT_META[key],...(assets.meta||{})[key]});
      this.action='idle';this.previousAction='idle';this.time=0;this.actionTime=0;
      this.speed=1;this.scale=1;this.paused=false;this.debug=false;
      this._blendTime=1;this._previousPose=null;this._lastPose=null;
      this._skin=null;this._recolored={};this._frame=0;this._profiles=new WeakMap();
      this.supportsSkin=!!assets.masks && Object.keys(assets.masks).length>0;
      this.width=0;this.height=0;this.dpr=1;
    }
    setAction(action) {
      if (!['idle','walk','attack'].includes(action)) return this;
      if (action!==this.action) {
        this.previousAction=this.action;this.action=action;this.actionTime=0;
        this._previousPose=this._lastPose;this._blendTime=0;
      }
      return this;
    }
    setSpeed(speed) {this.speed=clamp(Number(speed)||0,.05,3);return this;}
    setScale(scale) {this.scale=clamp(Number(scale)||1,.45,1.65);return this;}
    setPaused(paused) {this.paused=!!paused;return this;}
    setDebug(debug) {this.debug=!!debug;return this;}
    seek(time) {this.time=this.actionTime=Math.max(0,Number(time)||0);this._blendTime=1;this.render(0);return this;}
    getPhase() {const duration=this.action==='walk'?1/.95:this.action==='attack'?1.35:1/.28;return (this.actionTime%duration)/duration;}
    seekPhase(phase) {const duration=this.action==='walk'?1/.95:this.action==='attack'?1.35:1/.28;return this.seek(clamp(Number(phase)||0,0,1)*duration);}
    invalidateAssets() {this._profiles=new WeakMap();this._recolored={};return this;}
    setSkin(hex) {
      if (hex===null || hex==='') {this._skin=null;this._recolored={};return true;}
      const target=parseHex(hex);
      if (!target || !this.supportsSkin) return false;
      const base=parseHex(this.assets.skinBase||'#e9aa6b');
      const baseLin=base.map(linear), targetLin=target.map(linear);
      const baseLuma=.2126*baseLin[0]+.7152*baseLin[1]+.0722*baseLin[2];
      const result={};
      for (const key of Object.keys(this.assets.masks)) {
        const source=this.images[key],mask=this.assets.masks[key];
        if (!source || !mask) continue;
        const {width,height}=imageSize(source);
        const dest=document.createElement('canvas');dest.width=width;dest.height=height;
        const dc=dest.getContext('2d',{willReadFrequently:true});dc.drawImage(source,0,0);
        const pixels=dc.getImageData(0,0,width,height);
        const mc=document.createElement('canvas');mc.width=width;mc.height=height;
        const mctx=mc.getContext('2d',{willReadFrequently:true});mctx.drawImage(mask,0,0,width,height);
        const coverage=mctx.getImageData(0,0,width,height).data;
        for(let i=0;i<pixels.data.length;i+=4) {
          // Masks are explicit white-coverage/transparent images. They must exclude
          // linework, eyes, mouth, underwear, and other non-skin details.
          const strength=coverage[i+3]/255 * coverage[i]/255;
          if(strength<=0 || pixels.data[i+3]===0) continue;
          const rgb=[0,1,2].map(k=>linear(pixels.data[i+k]/255));
          const shade=(.2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2])/Math.max(baseLuma,.001);
          for(let k=0;k<3;k++) {
            const colored=shade<=1?targetLin[k]*shade:
              targetLin[k]+(1-targetLin[k])*clamp((shade-1)*.48,0,.85);
            const c=mix(pixels.data[i+k]/255,srgb(clamp(colored,0,1)),strength);
            pixels.data[i+k]=Math.round(clamp(c,0,1)*255);
          }
        }
        dc.putImageData(pixels,0,0);result[key]=dest;
      }
      this._skin=hex;this._recolored=result;return true;
    }
    _image(key) {return this._recolored[key] || this.images[key];}
    _resize() {
      const rect=this.canvas.getBoundingClientRect();
      const width=rect.width || this.canvas.width || 600,height=rect.height || this.canvas.height || 650;
      const dpr=Math.min(global.devicePixelRatio||1,2);
      if(this.width!==width || this.height!==height || this.dpr!==dpr) {
        this.width=width;this.height=height;this.dpr=dpr;
        this.canvas.width=Math.round(width*dpr);this.canvas.height=Math.round(height*dpr);
      }
    }
    _basePose(time) {
      const breathing=Math.sin(time*TAU*.28);
      const p={
        root:pt(0,0),head:pt(0,-285),headAngle:breathing*.009,
        torso:pt(0,-289+breathing*.65),torsoAngle:0,pelvis:pt(0,-178),pelvisAngle:0,
        shoulderL:pt(-43,-263+breathing*.65),elbowL:pt(-72,-218),wristL:pt(-76,-163),
        shoulderR:pt(43,-263+breathing*.65),elbowR:pt(72,-218),wristR:pt(76,-163),
        hipL:pt(-27,-151),kneeL:pt(-29,-91),ankleL:pt(-30,-34),
        hipR:pt(27,-151),kneeR:pt(29,-91),ankleR:pt(30,-34),
        handAngleL:0,handAngleR:0,footAngleL:0,footAngleR:0,
        fistL:false,fistR:false,shadowWidth:1
      };
      p.wristL.x-=breathing*.9;p.wristR.x+=breathing*.9;
      return p;
    }
    _pose(time,action) {
      const p=this._basePose(time);
      if(action==='walk') {
        const phase=time*TAU*.95;
        const s=Math.sin(phase),c=Math.cos(phase),bob=-3.1*Math.cos(phase*2);
        const sway=2.8*s;
        p.root=pt(sway,bob);p.headAngle=-.018*s;
        p.torsoAngle=.012*s;p.pelvisAngle=-.014*s;
        p.head.x=-sway*.35;
        for (const side of ['L','R']) {
          const sign=side==='L'?-1:1, gait=side==='L'?s:-s;
          const lift=Math.max(0,gait)*11;
          p['hip'+side].y+=1.5*Math.cos(phase*2);
          p['knee'+side].x+=sign*(2+3*Math.max(0,gait));
          p['knee'+side].y+=gait*7-lift*.25;
          p['ankle'+side].x+=sign*2+gait*2;
          p['ankle'+side].y+=gait*11-lift;
          // Arms counter the ipsilateral leg, with independently bending elbows.
          p['elbow'+side].x+=sign*(2-2*gait);
          p['elbow'+side].y-=gait*7;
          p['wrist'+side].x+=sign*(2-4*gait);
          p['wrist'+side].y-=gait*18;
          p['handAngle'+side]=sign*.05+gait*.045;
          p['footAngle'+side]=sign*.045 + Math.max(0,gait)*sign*.045;
        }
        p.shadowWidth=1-.025*Math.cos(phase*2);
      } else if(action==='attack') {
        // Deliberate anticipation, fast extension, brief contact, eased recovery.
        // Timing is explicit animation design; procedural interpolation is not a
        // substitute for the poses that make a strike readable.
        const phase=(time%1.35)/1.35;
        const keys=[
          {t:0, a:0,b:0},
          {t:.24,a:1,b:0},
          {t:.36,a:0,b:1},
          {t:.43,a:0,b:1},
          {t:.72,a:0,b:0},
          {t:1,a:0,b:0}
        ];
        let i=0;while(i<keys.length-2 && phase>keys[i+1].t)i++;
        const k0=keys[i],k1=keys[i+1],t=smooth((phase-k0.t)/(k1.t-k0.t));
        const anticipate=mix(k0.a,k1.a,t), strike=mix(k0.b,k1.b,t);
        const moving=clamp(anticipate+strike,0,1);
        p.root.x=-4*anticipate+5*strike;p.root.y=2*moving;
        p.torsoAngle=-.048*anticipate+.038*strike;
        p.headAngle=-.025*anticipate+.02*strike;
        p.head.x=2*strike;
        const blend=(key,wind,hit)=>{
          p[key]=add(p[key],add(mul(sub(wind,p[key]),anticipate),mul(sub(hit,p[key]),strike)));
        };
        blend('shoulderR',pt(40,-264),pt(43,-266));
        blend('elbowR',pt(92,-237),pt(107,-285));
        blend('wristR',pt(87,-278),pt(158,-290));
        blend('elbowL',pt(-70,-219),pt(-68,-220));
        blend('wristL',pt(-74,-170),pt(-72,-173));
        blend('ankleL',pt(-40,-33),pt(-42,-34));
        blend('ankleR',pt(39,-31),pt(41,-31));
        blend('kneeL',pt(-33,-91),pt(-35,-89));
        blend('kneeR',pt(33,-91),pt(36,-90));
        p.fistL=phase<.76;p.fistR=phase<.76;
      }
      return p;
    }
    _blendPose(a,b,t) {
      if(!a || t>=1)return b;
      const p={};for(const key of Object.keys(b)) {
        if(typeof b[key]==='number')p[key]=mix(a[key]??b[key],b[key],t);
        else if(typeof b[key]==='boolean')p[key]=t<.5?a[key]:b[key];
        else p[key]=lerpPoint(a[key]||b[key],b[key],t);
      }
      return p;
    }
    _mirror(key,side) {
      const m=this.meta[key]||{};
      return side==='L' ? m.mirrorLeft!==false : m.mirrorRight===true;
    }
    _piece(key,anchor,angle=0,mirror=false,scale=1) {
      const image=this._image(key);if(!image)return;
      const m=this.meta[key]||{},size=imageSize(image);
      const w=(m.width||size.width)*scale,h=(m.height||w*size.height/size.width)*scale;
      const pivot=m.pivot||[.5,.5];
      const ctx=this.ctx;ctx.save();ctx.translate(anchor.x,anchor.y);ctx.rotate(angle);
      if(mirror)ctx.scale(-1,1);
      ctx.drawImage(image,-pivot[0]*w,-pivot[1]*h,w,h);ctx.restore();
    }
    _segment(key,a,b,mirror=false) {
      const image=this._image(key);if(!image)return;
      const meta=this.meta[key]||{},size=imageSize(image);
      const pivot=meta.pivot||[.5,.1],end=meta.end||[.5,.9];
      const w=meta.width||45;
      const angle=Math.atan2(b.y-a.y,b.x-a.x)-Math.PI/2;
      const h=len(sub(b,a))/Math.max(.1,end[1]-pivot[1]);
      const ctx=this.ctx;ctx.save();ctx.translate(a.x,a.y);ctx.rotate(angle);
      if(mirror)ctx.scale(-1,1);
      ctx.drawImage(image,-pivot[0]*w,-pivot[1]*h,w,h);ctx.restore();
    }
    _centerProfile(image) {
      const cached=this._profiles.get(image);if(cached)return cached;
      const {width,height}=imageSize(image);
      const cv=document.createElement('canvas');cv.width=width;cv.height=height;
      const cx=cv.getContext('2d',{willReadFrequently:true});cx.drawImage(image,0,0);
      let data;try{data=cx.getImageData(0,0,width,height).data;}catch(_){return null;}
      const raw=new Float32Array(height);raw.fill(-1);
      // Ignore isolated antialias speckles: use the largest opaque run in a row.
      for(let y=0;y<height;y++) {
        let bestStart=0,bestLength=0,runStart=-1;
        for(let x=0;x<=width;x++) {
          const opaque=x<width && data[(y*width+x)*4+3]>=72;
          if(opaque && runStart<0)runStart=x;
          if(!opaque && runStart>=0){const l=x-runStart;if(l>bestLength){bestStart=runStart;bestLength=l;}runStart=-1;}
        }
        if(bestLength>=Math.max(3,width*.07))raw[y]=(bestStart+bestLength*.5)/width;
      }
      let last=-1;for(let y=0;y<height;y++)if(raw[y]>=0){last=y;break;}
      if(last<0){raw.fill(.5);this._profiles.set(image,raw);return raw;}
      for(let y=0;y<last;y++)raw[y]=raw[last];
      for(let y=last+1;y<height;y++)if(raw[y]<0)raw[y]=raw[y-1];
      const result=new Float32Array(height),radius=Math.max(2,Math.round(height*.016));
      for(let y=0;y<height;y++) {
        let sum=0,weights=0;
        for(let d=-radius;d<=radius;d++){const weight=radius+1-Math.abs(d);sum+=raw[clamp(y+d,0,height-1)]*weight;weights+=weight;}
        result[y]=sum/weights;
      }
      this._profiles.set(image,result);return result;
    }
    _mesh(key,points,mirror=false,start=0,end=1) {
      const image=this._image(key);if(!image)return;
      const m=this.meta[key]||{},size=imageSize(image),w=m.width||58;
      let knots=m.joints||[.07,.5,.94];
      if(knots.length!==points.length)knots=points.map((_,i)=>.07+.87*i/(points.length-1));
      const profile=m.sourceCenterline===false?null:this._centerProfile(image);
      const rows=[start,end];
      const subdivisions=m.rows||18;
      for(let i=1;i<subdivisions;i++)if(i/subdivisions>start && i/subdivisions<end)rows.push(i/subdivisions);
      for(const k of knots)if(k>start && k<end)rows.push(k);
      rows.sort((a,b)=>a-b);
      const sections=rows.map(t=>{
        const {p,v}=splineAt(points,knots,t),vnorm=norm(v),n=pt(vnorm.y,-vnorm.x);
        const sourceCenter=profile?profile[clamp(Math.round(t*(size.height-1)),0,size.height-1)]:(m.centerX??.5);
        const cx=mirror?1-sourceCenter:sourceCenter;
        return {y:t*size.height,
          l:add(p,mul(n,-cx*w)),r:add(p,mul(n,(1-cx)*w))};
      });
      for(let i=0;i<sections.length-1;i++) {
        const a=sections[i],b=sections[i+1];
        const left=mirror?size.width:0,right=mirror?0:size.width;
        texturedTriangle(this.ctx,image,pt(left,a.y),pt(right,a.y),pt(left,b.y),a.l,a.r,b.l);
        texturedTriangle(this.ctx,image,pt(right,a.y),pt(right,b.y),pt(left,b.y),a.r,b.r,b.l);
      }
    }
    _drawLeg(p,side) {
      const points=[p['hip'+side],p['knee'+side],p['ankle'+side]];
      if(this._image('fullLeg'))this._mesh('fullLeg',points,this._mirror('fullLeg',side));
      else {
        this._segment('thigh',points[0],points[1],this._mirror('thigh',side));
        this._segment('shin',points[1],points[2],this._mirror('shin',side));
      }
      this._piece('foot',points[2],p['footAngle'+side],this._mirror('foot',side));
    }
    _drawArm(p,side,distal=false) {
      const points=[p['shoulder'+side],p['elbow'+side],p['wrist'+side]];
      if(this._image('fullArm')) {
        const elbow=(this.meta.fullArm.joints||[.07,.5,.94])[1];
        this._mesh('fullArm',points,this._mirror('fullArm',side),distal?elbow:0,1);
      } else {
        if(!distal)this._segment('upperArm',points[0],points[1],this._mirror('upperArm',side));
        this._segment('forearm',points[1],points[2],this._mirror('forearm',side));
      }
      if(distal) {
        const angle=Math.atan2(points[2].y-points[1].y,points[2].x-points[1].x)-Math.PI/2+p['handAngle'+side];
        const key=p['fist'+side] && this._image('fist')?'fist':'hand';
        this._piece(key,points[2],angle,this._mirror(key,side));
      }
    }
    _drawDebug(p) {
      const ctx=this.ctx;ctx.save();ctx.lineWidth=1.4;ctx.strokeStyle='#51f6db';ctx.fillStyle='#101d2b';
      const chains=[['shoulderL','elbowL','wristL'],['shoulderR','elbowR','wristR'],
        ['hipL','kneeL','ankleL'],['hipR','kneeR','ankleR']];
      for(const chain of chains) {
        ctx.beginPath();chain.forEach((key,i)=>{const q=p[key];if(i)ctx.lineTo(q.x,q.y);else ctx.moveTo(q.x,q.y);});ctx.stroke();
        for(const key of chain){const q=p[key];ctx.beginPath();ctx.arc(q.x,q.y,3.8,0,TAU);ctx.fill();ctx.stroke();}
      }
      ctx.beginPath();ctx.moveTo(0,-164);ctx.lineTo(p.head.x,p.head.y);ctx.stroke();
      ctx.font='9px system-ui';ctx.fillStyle='#a6fff0';
      [['ombro',p.shoulderR],['cotovelo',p.elbowR],['punho',p.wristR],['joelho',p.kneeR],['tornozelo',p.ankleR]].forEach(([text,q])=>ctx.fillText(text,q.x+7,q.y-6));
      ctx.restore();
    }
    render(dt=0) {
      this._resize();dt=clamp(Number(dt)||0,0,.10);
      if(!this.paused) {
        const step=dt*this.speed;this.time+=step;this.actionTime+=step;this._blendTime+=dt/.22;
      }
      const raw=this._pose(this.actionTime,this.action);
      const p=this._blendPose(this._previousPose,raw,smooth(this._blendTime));this._lastPose=p;
      const ctx=this.ctx;ctx.setTransform(this.dpr,0,0,this.dpr,0,0);ctx.clearRect(0,0,this.width,this.height);
      // Canonical height is 476. Small viewports fit without sacrificing texture resolution.
      const fitted=Math.min(this.width/295,this.height/535)*this.scale;
      const ground=Math.min(this.height*.91,this.height-24);
      const center=this.width*.5;
      ctx.save();ctx.translate(center,ground);ctx.scale(fitted,fitted);
      const gradient=ctx.createRadialGradient(0,-3,3,0,-3,87);
      gradient.addColorStop(0,'rgba(4,12,17,.27)');gradient.addColorStop(.65,'rgba(4,12,17,.13)');gradient.addColorStop(1,'rgba(4,12,17,0)');
      ctx.save();ctx.scale(p.shadowWidth,.22);ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(0,-3,87,0,TAU);ctx.fill();ctx.restore();
      ctx.translate(p.root.x,p.root.y);
      const legOrder=p.ankleL.y<p.ankleR.y?['L','R']:['R','L'];legOrder.forEach(s=>this._drawLeg(p,s));
      this._drawArm(p,'L');this._drawArm(p,'R');
      this._piece('torso',p.torso,p.torsoAngle);
      this._piece('pelvis',p.pelvis,p.pelvisAngle);
      this._drawArm(p,'L',true);this._drawArm(p,'R',true);
      this._piece('head',p.head,p.headAngle);
      if(this.debug)this._drawDebug(p);
      ctx.restore();this._frame++;return this;
    }
    getState() {
      return {action:this.action,time:this.actionTime,speed:this.speed,scale:this.scale,paused:this.paused,
        debug:this.debug,supportsSkin:this.supportsSkin,skin:this._skin,frame:this._frame};
    }
  }
  global.AetheriaRig=AetheriaRig;
})(typeof window!=='undefined'?window:globalThis);
