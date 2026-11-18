// Coffee break card, the same animation as in Primer (CoffeeBreak.swift). Dark card, one-line steps.
(function(){
var svg=document.getElementById('coffee-card');if(!svg)return;
const NS='http://www.w3.org/2000/svg';
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=p=>-(Math.cos(Math.PI*p)-1)/2;
// app colours (Theme.swift, Islands.swift PrimerMark layers)
const TH={
 dark:{window:'#0b0b0d',panel:'#121215',text:'#efeff1',sec:'#8e8e97',div:'#2a2a30',danger:'#f07a6e',slab:'#1a1a1e',idle:'#3f3f47',ring:'#3a3a42',arc:'#ece6da',
   cols:['#ece6da','#ece6da','#e8483b','#f2a33a','#4fae5b','#3d8fd6','#e8483b','#f2a33a'],check:'#16140f',edge:'rgba(0,0,0,.55)',steam:'#ece6da',
   logic:['#232327','#2c2c31',.35]},
 light:{window:'#ededf0',panel:'#f7f7f9',text:'#16161a',sec:'#62626c',div:'#d9d9df',danger:'#c0392b',slab:'#ffffff',idle:'#cdcdd3',ring:'#d9d9df',arc:'#16161a',
   cols:['#16161a','#16161a','#a7342a','#ae752a','#397d42','#2c679a','#a7342a','#ae752a'],check:'#ffffff',edge:'rgba(22,20,15,.38)',steam:'#bdb7ab',
   logic:['#dedee2','#d0d0d5',.5]}};
const STEPS=['Check open project','Check template','Paste tracks','Route outputs','Set No Input','Send colors','Clean names','Strip silence'];
const FONT='-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
// layout in points, as the SwiftUI view: padding 20, width 320, spacing 12, cup 54, rows of 24
const W=320,LX=20,LW=280,LY=86,LH=46,LC=LY+LH/2,RY0=144+12,HL={list:372,slabs:372,compact:226};
const BX=[];for(let x=LX+8;x<LX+LW-6;x+=6)BX.push(x);const NB=BX.length;
function waveH(seed){let s=seed*13+5;return BX.map(x=>{s=(s*9301+49297)%233280;return 4+30*(s/233280)*(.55+.45*Math.sin(x/23+seed))})}

// ---------- three cups, drawn in a 64 x 64 box; each returns a steam update ----------
let uid=0;
const CUPS={
 logo(g,defs,th){const iso=(cx,cy)=>`matrix(.866 .5 -.866 .5 ${cx} ${cy})`,PRT='#ece6da',PRS='#aaa69d',BT='#3d8fd6',BS='#2c679a';
  for(let k=3;k>0;k-=1)el('rect',{x:-15,y:-15,width:30,height:30,rx:6,fill:BS,transform:iso(32,48+k)},g);
  el('rect',{x:-15,y:-15,width:30,height:30,rx:6,fill:BT,transform:iso(32,48)},g);
  el('path',{d:'M44.3 35.5 C52.5 34.5 53.5 43.5 44.3 43.5',fill:'none',stroke:PRS,'stroke-width':3.4,'stroke-linecap':'round'},g);
  el('path',{d:'M19.1 31 V46 A12.9 7.4 0 0 0 44.9 46 V31 Z',fill:PRS},g);
  el('ellipse',{cx:32,cy:31,rx:12.9,ry:7.4,fill:PRT},g);
  el('ellipse',{cx:32,cy:31.3,rx:10.4,ry:5.9,fill:'#5a3a28'},g);
  let w='';[3,5.5,4,7,4.5,6,3.5].forEach((h,i)=>{const u=-6+i*2;w+=`<rect x="${u-.6}" y="${-h/2}" width="1.2" height="${h}" rx=".6"/>`});
  const wg=el('g',{transform:`${iso(32,31.3)} rotate(-90)`,fill:'rgba(236,230,218,.8)'},g);wg.innerHTML=w;
  const st=[[27.5,6],[32,9],[36.5,5]].map(([x,h])=>el('rect',{x:x-1.4,width:2.8,height:h,rx:1.4,fill:th.steam},g));
  return t=>st.forEach((r,i)=>{const k=((t/4)+i/3)%1,h=[6,9,5][i]*(.7+.5*Math.sin(k*Math.PI));
    r.setAttribute('y',24-k*14-h);r.setAttribute('height',h);r.style.opacity=(k<.25?k/.25:1-(k-.25)/.75)*.85})}};

// ---------- one card; returns its update(t) ----------
function makeCard(parent,defs,th,cupName,id,layout){
  const H=HL[layout];
  const card=el('g',{id,'font-family':FONT},parent);
  el('rect',{width:W,height:H,rx:12,fill:th.panel},card);
  const cupG=el('g',{transform:'translate(20 20) scale(.84375)'},card);const cupUp=CUPS[cupName](cupG,defs,th);
  // title block: 22 bold + 12, spacing 2, centred on the 54 pt cup (20..74, middle 47)
  el('text',{x:86,y:39,fill:th.text,'font-weight':700,'font-size':22,'dominant-baseline':'central'},card).textContent='Coffee break!';
  el('text',{x:86,y:60,fill:th.sec,'font-size':12,'dominant-baseline':'central'},card).textContent='Hands off the mouse and keyboard.';
  el('rect',{x:LX,y:LY,width:LW,height:LH,rx:8,fill:th.slab},card);
  const edge=el('rect',{x:LX,y:LY,width:LW,height:LH,rx:8,fill:'none','stroke-width':1.5,stroke:'none'},card);
  const bars=BX.map(x=>el('rect',{x:x-2,width:4,rx:2},card));
  // layout 3: one line with the running step, eight coats that fill up
  let one=null;
  if(layout==='compact'){const nm=el('text',{x:20,y:158,'font-size':15,'font-weight':600,fill:th.text,'dominant-baseline':'central'},card);
    const ct=el('text',{x:300,y:158,'font-size':12,'text-anchor':'end',fill:th.sec,'dominant-baseline':'central'},card);
    const sw=(LW-7*4)/8,segs=STEPS.map((_,i)=>{const x=LX+i*(sw+4);el('rect',{x,y:178,width:sw,height:8,rx:4,fill:th.div},card);
      return el('rect',{x,y:178,width:0,height:8,rx:4},card)});one={nm,ct,segs,sw}}
  const rows=layout==='compact'?[]:STEPS.map((t,i)=>{const y=RY0+i*24;
    const slab=layout==='slabs'?el('rect',{x:LX,y:y-10.5,width:LW,height:21,rx:6,fill:th.slab},card):null;
    const wash=layout==='slabs'?el('rect',{x:LX,y:y-10.5,width:LW,height:21,rx:6,opacity:0},card):null;
    const pill=layout==='slabs'?el('rect',{x:LX+6,y:y-6,width:4,height:12,rx:2},card):null;
    const dot=el('circle',{cx:26,cy:y,r:6,'stroke-width':1.5},card);
    const arc=el('path',{d:`M26 ${y-6} A6 6 0 0 1 32 ${y}`,fill:'none',stroke:th.arc,'stroke-width':2,'stroke-linecap':'round'},card);
    const ok=el('path',{d:`M23 ${y} l2.2 2.2 l4.2 -4.4`,fill:'none',stroke:th.check,'stroke-width':1.8,'stroke-linecap':'round','stroke-linejoin':'round'},card);
    if(layout==='slabs'){dot.style.display=arc.style.display='none';ok.setAttribute('transform','translate(266 0)')}
    const tx=el('text',{x:layout==='slabs'?LX+18:42,y,'font-size':12,'dominant-baseline':'central'},card);tx.textContent=t;
    const st=el('text',{x:layout==='slabs'?292:300,y,'text-anchor':'end','font-size':10,'dominant-baseline':'central',fill:th.danger},card);
    return{dot,arc,ok,tx,st,y,wash,pill}});
  const foot=el('text',{x:20,y:layout==='compact'?206:RY0+8*24-2,fill:th.sec,'font-size':10,'dominant-baseline':'central'},card);
  const C=th.cols;
  return t=>{
    const failed=tFail!=null&&t>=tFail,done=!failed&&t>=tEnd,tt=failed?tFail:t;
    const fade=t>LOOP-FADE?clamp(1-(t-(LOOP-FADE))/FADE):1;
    const p=plan.find(q=>t>=q.t0&&t<q.t1)||plan[failed?FAIL_STEP:(t<plan[0].t0?0:plan.length-1)];
    const shown=p.paints?p:plan[PAINT_FROM],front=LX+LW*(p.paints?frontAt(p,tt):0);
    const swap=p.paints&&p.i>PAINT_FROM&&t<p.td?(t-p.t0)/TR:null,ripple=done?(t-tEnd)/RIPPLE:null;
    bars.forEach((b,j)=>{const x=BX[j];let h,fill,op=1;
      if(swap!=null){const q=clamp(swap*1.5-j/NB*.5);if(q<.5){h=plan[p.i-1].h[j]*(1-ease(q*2));fill=C[p.i-1]}else{h=p.h[j]*ease((q-.5)*2);fill=th.idle}}
      else{const dd=front-x,on=p.paints&&dd>0,atEdge=failed&&dd>-6&&dd<=0;h=shown.h[j];fill=on?C[p.i]:th.idle;
        if(on&&dd<22)h*=1+.7*Math.sin(Math.PI*dd/22);
        if(on&&!failed&&!done)h*=1+.08*Math.sin(t*4.2-x/14);
        if(atEdge)fill=th.danger;
        if(ripple!=null){const rx=LX+ripple*(LW+40)-x;if(rx>0&&rx<30)h*=1+.5*Math.sin(Math.PI*rx/30)}
        if(on)op=fade}
      h=Math.max(2,h);b.setAttribute('y',LC-h/2);b.setAttribute('height',h);b.setAttribute('fill',fill);b.style.opacity=op});
    edge.setAttribute('stroke',failed?th.danger:'none');
    if(one){const isF=failed,cur=failed?FAIL_STEP:done?plan.length-1:p.i;
      one.nm.textContent=STEPS[cur];one.nm.setAttribute('fill',isF?th.danger:th.text);
      one.ct.textContent=isF?'Problem':`${Math.min(cur+1,8)} of 8`;one.ct.setAttribute('fill',isF?th.danger:th.sec);
      plan.forEach(q=>{const sg=one.segs[q.i],dn=t>=q.t1&&!(failed&&q.i>=FAIL_STEP),run=!failed&&t>=q.t0&&t<q.t1,isFl=failed&&q.i===FAIL_STEP;
        const f=dn?1:isFl?Math.max(.15,frontAt(q,tFail)):run?Math.max(.12,q.paints?frontAt(q,t):(t-q.t0)/q.dur):0;
        sg.setAttribute('width',one.sw*f);sg.setAttribute('fill',isFl?th.danger:dn?C[q.i]:th.arc);sg.style.opacity=run?.55+.45*Math.sin(t*5)**2:1})}
    plan.forEach(q=>{const r=rows[q.i];if(!r)return;const isFail=failed&&q.i===FAIL_STEP,dn=!isFail&&t>=q.t1&&!(failed&&q.i>FAIL_STEP),run=!failed&&t>=q.t0&&t<q.t1;
      r.dot.setAttribute('stroke',isFail?th.danger:dn?C[q.i]:run?th.ring:th.div);r.dot.setAttribute('fill',dn?C[q.i]:isFail?th.danger:'none');
      r.arc.style.opacity=run?1:0;r.arc.setAttribute('transform',`rotate(${(t*300)%360} 26 ${r.y})`);r.ok.style.opacity=dn?1:0;
      r.tx.setAttribute('fill',dn||run?th.text:th.sec);r.tx.setAttribute('font-weight',run?600:400);r.st.textContent=isFail?'Problem':'';
      if(r.pill){r.pill.setAttribute('fill',isFail?th.danger:dn?C[q.i]:run?th.arc:th.div);r.pill.style.opacity=run?.5+.5*Math.sin(t*5)**2:1;
        r.wash.setAttribute('fill',isFail?th.danger:C[q.i]);r.wash.setAttribute('opacity',dn?.14:isFail?.12:0);
        r.ok.setAttribute('stroke',C[q.i]);r.st.setAttribute('x',isFail?292:292)}});
    foot.textContent=failed?'Stopped here.':(!done&&t>p.td+4&&p.dur>8)?'This step takes a while.':'';
    cupUp(t)}}

// ---------- timeline ----------
const SC={quick:[.3,.25,2.4,2.6,1.4,2.4,1.8,2.0],long:[.3,.25,2.4,18,1.4,12,1.8,2.0],fail:[.3,.25,2.4,3,1.4,2.4,1.8,2.0]};
const PAINT_FROM=2,TR=.9,RIPPLE=.9,END=2.6,FADE=.8,FAIL_STEP=3,FAIL_AT=.45,FAIL_HOLD=4.5;
let plan,LOOP,tFail=null,tEnd;
function build(name){const d=SC[name];let T=.8;plan=[];tFail=null;
  d.forEach((dur,i)=>{const paints=i>=PAINT_FROM,tr=paints&&i>PAINT_FROM?TR:0,p={i,dur,paints,t0:T,td:T+tr};p.t1=p.td+dur;p.h=waveH(i+1);plan.push(p);T=p.t1});
  tEnd=T;if(name==='fail'){const p=plan[FAIL_STEP];tFail=p.td+p.dur*FAIL_AT;LOOP=tFail+FAIL_HOLD}else LOOP=T+RIPPLE+END}
function frontAt(p,t){if(t<p.td)return 0;if(t>=p.t1)return 1;const f=(t-p.td)/p.dur;return f<.08?f*f/.16:f>.92?1-(1-f)*(1-f)/.16:f}


const defs=el('defs',{},svg);
const update=makeCard(svg,defs,TH.dark,'logo','cbCard','compact');
build('quick');
const still=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(still){update(plan[3].td+1);return}
let t0=null,run=false;
function frame(ms){if(!run){t0=null;return}if(t0==null)t0=ms;let t=(ms-t0)/1000;if(t>=LOOP){t0=ms;t=0}update(t);requestAnimationFrame(frame)}
// Only animate while the card is on screen.
new IntersectionObserver(es=>es.forEach(e=>{const was=run;run=e.isIntersecting;if(run&&!was)requestAnimationFrame(frame)})).observe(svg);
update(plan[3].td+1);
})();
