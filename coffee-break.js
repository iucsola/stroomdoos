// "How it works" (Luc 18-11): Primer's Coffee break card (CoffeeBreak.swift) in its light look, floating over a
// Logic-like arrange area. The scroll runs the import from Paste tracks (3 of 8) to Strip silence (8 of 8); the two
// checks before it are already done.
(function(){
const sec=document.getElementById('how'),svg=document.getElementById('coffee-card'),lanesEl=sec&&sec.querySelector('.lanes');
if(!sec||!svg||!lanesEl)return;
const NS='http://www.w3.org/2000/svg';
const el=(t,a,p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);p&&p.appendChild(e);return e};
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ease=p=>-(Math.cos(Math.PI*p)-1)/2;
// Primer's light theme (Theme.swift): one colour per step, for its coat and for the painted waveform.
const TH={panel:'#f7f7f9',text:'#16161a',sec:'#62626c',div:'#d9d9df',slab:'#ffffff',idle:'#cdcdd3',arc:'#16161a',steam:'#bdb7ab',
  cols:['#16161a','#16161a','#a7342a','#ae752a','#397d42','#2c679a','#a7342a','#ae752a']};
const STEPS=['Check open project','Check template','Paste tracks','Route outputs','Set No Input','Send colors','Clean names','Strip silence'];
// Layout in points, as the SwiftUI view: padding 20, width 320, cup 54, waveform strip 46, the running step, eight coats.
const W=320,H=206,LX=20,LW=280,LY=86,LH=46,LC=LY+LH/2;
const BX=[];for(let x=LX+8;x<LX+LW-6;x+=6)BX.push(x);const NB=BX.length;
function waveH(seed){let s=seed*13+5;return BX.map(x=>{s=(s*9301+49297)%233280;return 4+30*(s/233280)*(.55+.45*Math.sin(x/23+seed))})}

// The import as a timeline in seconds: a step starts at t0, starts painting at td (after the colour swap) and ends at t1.
const DUR=[.3,.25,2.4,2.6,1.4,2.4,1.8,2],PAINT_FROM=2,SWAP=.9,RIPPLE=.9,plan=[];
let T=.8;
DUR.forEach((dur,i)=>{const p={i,dur,paints:i>=PAINT_FROM,t0:T,td:T+(i>PAINT_FROM?SWAP:0)};p.t1=p.td+dur;p.h=waveH(i+1);plan.push(p);T=p.t1});
const tEnd=T;
function frontAt(p,t){if(t<p.td)return 0;if(t>=p.t1)return 1;const f=(t-p.td)/p.dur;return f<.08?f*f/.16:f>.92?1-(1-f)*(1-f)/.16:f}

// ---------- the card ----------
const card=el('g',{'font-family':'-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif'},svg);
el('rect',{width:W,height:H,rx:12,fill:TH.panel},card);
// The cup in the style of the Primer logo, with steam.
const cup=el('g',{transform:'translate(20 20) scale(.84375)'},card),iso=(cx,cy)=>`matrix(.866 .5 -.866 .5 ${cx} ${cy})`;
for(let k=3;k>0;k-=1)el('rect',{x:-15,y:-15,width:30,height:30,rx:6,fill:'#2c679a',transform:iso(32,48+k)},cup);
el('rect',{x:-15,y:-15,width:30,height:30,rx:6,fill:'#3d8fd6',transform:iso(32,48)},cup);
el('path',{d:'M44.3 35.5 C52.5 34.5 53.5 43.5 44.3 43.5',fill:'none',stroke:'#aaa69d','stroke-width':3.4,'stroke-linecap':'round'},cup);
el('path',{d:'M19.1 31 V46 A12.9 7.4 0 0 0 44.9 46 V31 Z',fill:'#aaa69d'},cup);
el('ellipse',{cx:32,cy:31,rx:12.9,ry:7.4,fill:'#ece6da'},cup);
el('ellipse',{cx:32,cy:31.3,rx:10.4,ry:5.9,fill:'#5a3a28'},cup);
const foam=el('g',{transform:`${iso(32,31.3)} rotate(-90)`,fill:'rgba(236,230,218,.8)'},cup);
[3,5.5,4,7,4.5,6,3.5].forEach((h,i)=>el('rect',{x:-6.6+i*2,y:-h/2,width:1.2,height:h,rx:.6},foam));
const steam=[27.5,32,36.5].map(x=>el('rect',{x:x-1.4,width:2.8,rx:1.4,fill:TH.steam},cup));
el('text',{x:86,y:39,fill:TH.text,'font-weight':700,'font-size':22,'dominant-baseline':'central'},card).textContent='Coffee break!';
el('text',{x:86,y:60,fill:TH.sec,'font-size':12,'dominant-baseline':'central'},card).textContent='Hands off the mouse and keyboard.';
el('rect',{x:LX,y:LY,width:LW,height:LH,rx:8,fill:TH.slab},card);
const bars=BX.map(x=>el('rect',{x:x-2,width:4,rx:2},card));
const name=el('text',{x:20,y:158,'font-size':15,'font-weight':600,fill:TH.text,'dominant-baseline':'central'},card);
const count=el('text',{x:300,y:158,'font-size':12,'text-anchor':'end',fill:TH.sec,'dominant-baseline':'central'},card);
const SW=(LW-7*4)/8,coats=STEPS.map((_,i)=>{const x=LX+i*(SW+4);el('rect',{x,y:178,width:SW,height:8,rx:4,fill:TH.div},card);return el('rect',{x,y:178,width:0,height:8,rx:4},card)});

// t: where the import is (from the scroll). c: a clock for what keeps moving (steam, the paint's wobble, the running coat).
function draw(t,c){
  const done=t>=tEnd,p=plan.find(q=>t>=q.t0&&t<q.t1)||plan[t<plan[0].t0?0:plan.length-1];
  const shown=p.paints?p:plan[PAINT_FROM],front=LX+LW*(p.paints?frontAt(p,t):0);
  const swap=p.paints&&p.i>PAINT_FROM&&t<p.td?(t-p.t0)/SWAP:null,ripple=done?clamp((t-tEnd)/RIPPLE):null;
  bars.forEach((b,j)=>{const x=BX[j];let h,fill;
    if(swap!=null){const q=clamp(swap*1.5-j/NB*.5);if(q<.5){h=plan[p.i-1].h[j]*(1-ease(q*2));fill=TH.cols[p.i-1]}else{h=p.h[j]*ease((q-.5)*2);fill=TH.idle}}
    else{const d=front-x,on=p.paints&&d>0;h=shown.h[j];fill=on?TH.cols[p.i]:TH.idle;
      if(on&&d<22)h*=1+.7*Math.sin(Math.PI*d/22);
      if(on&&!done)h*=1+.08*Math.sin(c*4.2-x/14);
      if(ripple!=null){const r=LX+ripple*(LW+40)-x;if(r>0&&r<30)h*=1+.5*Math.sin(Math.PI*r/30)}}
    h=Math.max(2,h);b.setAttribute('y',LC-h/2);b.setAttribute('height',h);b.setAttribute('fill',fill)});
  const cur=done?plan.length-1:p.i;name.textContent=STEPS[cur];count.textContent=`${cur+1} of 8`;
  plan.forEach(q=>{const dn=t>=q.t1,run=!dn&&t>=q.t0,f=dn?1:run?Math.max(.12,q.paints?frontAt(q,t):(t-q.t0)/q.dur):0;
    coats[q.i].setAttribute('width',SW*f);coats[q.i].setAttribute('fill',dn?TH.cols[q.i]:TH.arc);coats[q.i].style.opacity=run?.55+.45*Math.sin(c*5)**2:1});
  steam.forEach((r,i)=>{const k=((c/4)+i/3)%1,h=[6,9,5][i]*(.7+.5*Math.sin(k*Math.PI));
    r.setAttribute('y',24-k*14-h);r.setAttribute('height',h);r.style.opacity=(k<.25?k/.25:1-(k-.25)/.75)*.85})}

// ---------- Logic behind the card: the nine tracks of the picture at the top, each one region as long as the song ----------
const GROUP={Drums:'#de4a33',Bass:'#e59a36',Keys:'#36b5c4',Vocals:'#c85aa2'},END=94;
const TRACKS=[['Drums',[[0,14],[18,31],[35,49],[56,70],[74,88]]],['Drums',[[1,14],[18,31],[36,49],[56,70],[75,88]]],
  ['Drums',[[0,31],[35,49],[56,88]]],['Drums',[[18,49],[56,88]]],['Bass',[[0,47],[52,88]]],['Keys',[[18,31],[56,70],[74,86]]],
  ['Keys',[[0,49],[52,92]]],['Vocals',[[10,30],[36,48],[58,70],[74,90]]],['Vocals',[[36,48],[74,90]]]];
// A region is its sound and the silence in between; Strip silence takes the silence out.
const lanes=TRACKS.map(([g,sound])=>{const lane=document.createElement('div');lane.className='lane';lane.style.setProperty('--c',GROUP[g]);
  let x=0;const add=(a,b,kind)=>{if(b>a){const i=document.createElement('i');i.className=kind;i.style.left=a+'%';i.style.width=(b-a)+'%';lane.appendChild(i)}};
  sound.forEach(([a,b])=>{add(x,a,'quiet');add(a,b,'sound');x=b});add(x,END,'quiet');lanesEl.appendChild(lane);return lane});

// ---------- the scroll: one stretch per step from Paste tracks on, then a shorter one for the finish ----------
const STOPS=plan.slice(PAINT_FROM).map(q=>[q.t0,q.t1]).concat([[tEnd,tEnd+RIPPLE]]),WT=[1,1,1,1,1,1,.6],SUM=WT.reduce((a,b)=>a+b,0);
function at(f){let a=f*SUM;for(let k=0;k<WT.length;k++){if(a<=WT[k]||k===WT.length-1){const q=clamp(a/WT[k]);return{k,q,t:STOPS[k][0]+(STOPS[k][1]-STOPS[k][0])*q}}a-=WT[k]}}
// Paste tracks brings the tracks in, Send colors colours them, Strip silence cuts them: one track after the other.
function stage(k,q){const n=lanes.length,on=(s,i)=>k>s||(k===s&&q>(i+.5)/n*.85);
  lanes.forEach((l,i)=>{l.classList.toggle('in',on(0,i));l.classList.toggle('col',on(3,i));l.classList.toggle('cut',on(5,i))})}
function progress(){const r=sec.getBoundingClientRect(),run=r.height-innerHeight;return run>0?clamp(-r.top/run):1}

if(matchMedia('(prefers-reduced-motion: reduce)').matches){draw(tEnd+RIPPLE,0);stage(WT.length-1,1);return}
let shown=null,live=false;
function frame(ms){if(!live){shown=null;return}const a=at(progress());shown=shown==null?a.t:shown+(a.t-shown)*.16;
  draw(shown,ms/1000);stage(a.k,a.q);requestAnimationFrame(frame)}
new IntersectionObserver(es=>{const was=live;live=es[0].isIntersecting;if(live&&!was)requestAnimationFrame(frame)},{rootMargin:'200px 0px'}).observe(sec);
const a=at(progress());draw(a.t,0);stage(a.k,a.q);
})();
