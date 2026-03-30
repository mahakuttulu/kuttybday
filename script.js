/* ═══════════════════════════════════════
   FLOATING LOVE ICONS
═══════════════════════════════════════ */
function buildFloaties(containerId){
  const container=document.getElementById(containerId);
  if(!container||container.dataset.built)return;
  container.dataset.built='1';
  const H=innerHeight;
  const icons=[{e:'💗',weight:8},{e:'💖',weight:7},{e:'💕',weight:6},{e:'💓',weight:5},{e:'❤️',weight:5},{e:'🌸',weight:4},{e:'✨',weight:4},{e:'💌',weight:3},{e:'🌷',weight:2},{e:'🥰',weight:2},{e:'💝',weight:2},{e:'⭐',weight:2},{e:'🌺',weight:1},{e:'💫',weight:1}];
  const pool=icons.flatMap(({e,weight})=>Array(weight).fill(e));
  function pick(){return pool[Math.floor(Math.random()*pool.length)];}
  for(let i=0;i<42;i++){
    const el=document.createElement('span');
    el.className='floatie'+(Math.random()>.45?' sway':'');
    const sz=13+Math.random()*22,dur=7+Math.random()*11,delay=-(Math.random()*dur);
    const left=2+Math.random()*96,travel=-(H*(.35+Math.random()*.5));
    const r0=(Math.random()*30-15)+'deg',r1=(Math.random()*30-10)+'deg',r2=(Math.random()*40-20)+'deg';
    const sx=(Math.random()*32-16)+'px',peakOp=.25+Math.random()*.45;
    el.textContent=pick();
    Object.assign(el.style,{left:left+'%',bottom:(-sz)+'px','--sz':sz+'px','--dur':dur+'s','--delay':delay+'s','--travel':travel+'px','--far':(travel*1.3)+'px','--r0':r0,'--r1':r1,'--r2':r2,'--sx':sx,'--peak-op':peakOp,animationDelay:delay+'s'});
    el.addEventListener('animationiteration',()=>{el.textContent=pick();});
    container.appendChild(el);
  }
}

/* ═══════════════════════════════════════
   CURSOR + TRAILS
═══════════════════════════════════════ */
let cX=innerWidth/2,cY=innerHeight/2,tT=0;
const trailE=["💗","✨","🌸","💖","⭐","💫","🌟"];
const cur=document.getElementById("cursor");
document.addEventListener("mousemove",e=>{cX=e.clientX;cY=e.clientY;cur.style.left=cX+"px";cur.style.top=cY+"px";document.getElementById("ambient-glow").style.setProperty("--mx",(cX/innerWidth)*100+"%");document.getElementById("ambient-glow").style.setProperty("--my",(cY/innerHeight)*100+"%");if(Date.now()-tT>60){tT=Date.now();trail(cX,cY);}});
document.addEventListener("mousedown",()=>cur.classList.add("clicking"));
document.addEventListener("mouseup",()=>cur.classList.remove("clicking"));
document.addEventListener("touchmove",e=>{const t=e.touches[0];cX=t.clientX;cY=t.clientY;cur.style.left=cX+"px";cur.style.top=cY+"px";if(Date.now()-tT>80){tT=Date.now();trail(cX,cY,"14px");}},{passive:true});
function trail(x,y,sz){const t=document.createElement("div");t.className="cursor-trail";t.textContent=trailE[Math.floor(Math.random()*trailE.length)];t.style.left=x+"px";t.style.top=y+"px";t.style.fontSize=sz||(8+Math.random()*8+"px");document.body.appendChild(t);setTimeout(()=>t.remove(),700);}
function burst(x,y,list){const em=list||["💗","✨","💖","🌟","🌸"],n=5+Math.floor(Math.random()*4);for(let i=0;i<n;i++){const el=document.createElement("div");el.className="emoji-burst";el.textContent=em[Math.floor(Math.random()*em.length)];const a=(Math.PI*2*i)/n-Math.PI/2,d=40+Math.random()*60;el.style.left=x+"px";el.style.top=y+"px";el.style.setProperty("--ex",Math.cos(a)*d+"px");el.style.setProperty("--ey",Math.sin(a)*d+"px");el.style.animationDuration=.6+Math.random()*.4+"s";document.body.appendChild(el);setTimeout(()=>el.remove(),1000);}}
let tId=null;
function toast(msg,d=2500){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(tId);tId=setTimeout(()=>t.classList.remove("show"),d);}
function prog(p){document.getElementById("progress-bar-wrap").classList.add("visible");document.getElementById("progress-bar").style.width=p+"%";}
function flash(cb,col="white"){const f=document.getElementById("screen-flash");f.style.background=col;f.style.transition="opacity .15s";f.style.opacity="1";setTimeout(()=>{f.style.transition="opacity .4s";f.style.opacity="0";if(cb)cb();},150);}
function wait(ms){return new Promise(r=>setTimeout(r,ms));}
function fadeHide(el,ms=500){return new Promise(r=>{el.style.transition=`opacity ${ms}ms`;el.style.opacity="0";setTimeout(()=>{el.style.display="none";el.style.opacity="";r();},ms);});}

/* ── START SCREEN ── */
(function(){
  const ss=document.getElementById("start-screen");
  const cv=document.getElementById("start-particles");
  const ctx=cv.getContext("2d");
  cv.width=innerWidth;cv.height=innerHeight;
  const emo=["💗","✨","💖","🌸","⭐","💫","🌟","💕"];
  const pts=Array.from({length:40},()=>({x:Math.random()*cv.width,y:Math.random()*cv.height,vy:-(0.3+Math.random()*0.7),vx:(Math.random()-.5)*0.4,sz:10+Math.random()*16,e:emo[Math.floor(Math.random()*emo.length)],op:Math.random(),od:Math.random()>.5?.01:-.01}));
  let raf;
  (function draw(){ctx.clearRect(0,0,cv.width,cv.height);pts.forEach(p=>{p.y+=p.vy;p.x+=p.vx;p.op+=p.od;if(p.op>=1||p.op<=0)p.od*=-1;if(p.y<-30){p.y=cv.height+10;p.x=Math.random()*cv.width;}ctx.globalAlpha=p.op*.6;ctx.font=`${p.sz}px serif`;ctx.fillText(p.e,p.x,p.y);});ctx.globalAlpha=1;raf=requestAnimationFrame(draw);})();

  function onTap(){
    cancelAnimationFrame(raf);

    // 🔊 Unlock audio FIRST — must be synchronous within the gesture
    const bgm=document.getElementById("main-audio");
    bgm.muted=false;
    bgm.volume=0.85;
    const unlockPlay=bgm.play();
    if(unlockPlay!==undefined){
      unlockPlay.catch(()=>{
        document.addEventListener('touchstart',()=>bgm.play().catch(()=>{}),{once:true});
      });
    }

    const s3vid=document.getElementById("tessa-video");
    s3vid.preload="auto";
    s3vid.load();
    const introSc=document.getElementById("intro-screen");
    const vid=document.getElementById("intro-video");
    introSc.style.display="flex";
    vid.muted=true;vid.play().catch(()=>{});
    burst(innerWidth/2,innerHeight/2,["💖","✨","💗","🌟","🌸","💫"]);
    ss.style.transition="opacity .5s";ss.style.opacity="0";
    setTimeout(()=>{ss.style.display="none";},500);
    prog(5);
    runFlow(vid,introSc);
  }

  document.getElementById("start-btn").addEventListener("click",onTap,{once:true});
  document.getElementById("start-btn").addEventListener("touchstart",e=>{e.preventDefault();onTap();},{once:true,passive:false});
})();

async function runFlow(vid,introSc){
  await new Promise(res=>{let done=false;const go=()=>{if(!done){done=true;res();}};vid.addEventListener("ended",go,{once:true});setTimeout(go,12000);});
  await fadeHide(introSc,400);
  prog(12);
  buildHate();
  const hEl=document.getElementById("hate-screen");
  hEl.style.display="flex";
  await wait(7000);
  await exitHate(hEl);
  prog(22);
  await doCountdown1();
  prog(35);

  const lSc=document.getElementById("letter-screen");
  const lCard=document.getElementById("letter-card");
  buildFloaties('letter-floaties');
  lSc.style.opacity="0";lSc.style.display="flex";
  await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  lSc.style.transition="opacity 400ms";lSc.style.opacity="1";
  lCard.classList.add("show");
  toast("💌...",3000);
  prog(42);
  await typewrite(["lp1","lp2","lp3"],27,280);
  await wait(2600);

  const pg1=document.getElementById("lpage-1"),pg2=document.getElementById("lpage-2");
  const p2texts={lp4:"Eppatiki gurtunchukunta - mee navvu, mee chupu, mee maatalu , mee kopam , annitikanna ekkuva meeku naa pi unna abhimanam .",lp5:"Prathi roju nenu lechaka alochinche modati vyakthi, padukunemundu alochince akari vyakthi.. mereee okosari kallalo kuda 🙃🙃🙃. 💕",lp6:"Ilage inka chala chala chala Birthdays jarupukovali.. jarupukuntaru, I hate youuuuu. 🥂"};
  ["lp4","lp5","lp6","lc-sign"].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML="";});
  lCard.style.transition="opacity 0.25s ease";lCard.style.opacity="0";
  await wait(260);
  pg1.classList.remove("active");pg2.classList.add("active");
  document.getElementById("dot-1").classList.remove("active");document.getElementById("dot-2").classList.add("active");
  const pp=document.getElementById("btn-prev"),np=document.getElementById("btn-next");
  pp.style.opacity="1";pp.style.pointerEvents="auto";np.style.opacity="0";np.style.pointerEvents="none";
  void lCard.offsetWidth;lCard.style.transition="opacity 0.3s ease";lCard.style.opacity="1";
  await wait(320);
  toast("💕 Page 2...",2000);
  prog(55);
  await typewrite(["lp4","lp5","lp6"],21,250,p2texts);
  await wait(300);
  await typewriteInto("lc-sign","Appudu Ippudu Eppudu , Mee Pottyyyyyy 💖",28);
  prog(65);
  await wait(400);
  fadeHide(lSc,300);
  await wait(300);
  prog(68);
  flash(null,"#ff4d6d33");
  prog(78);
  await showBirthdayCard();
  prog(90);
  await surprise();
  prog(93);
  launchVideo();
}

function typewriteInto(elId,text,msPerChar=28){
  return new Promise(res=>{const el=document.getElementById(elId);if(!el){res();return;}el.innerHTML="";[...text].forEach((ch,i)=>{const sp=document.createElement("span");sp.className="char";sp.textContent=ch;setTimeout(()=>sp.classList.add("vis"),i*msPerChar);el.appendChild(sp);});setTimeout(res,text.length*msPerChar+60);});
}

function showBirthdayCard(){
  return new Promise(res=>{
    const fs=document.getElementById("final-screen");
    fs.classList.add("active");
    flash(null,"#ff4d6d55");
    startAurora();startPetals();startFireworks();
    spawnConfetti();
    [["final-cake",200],["final-title",600],["final-name",1100],["final-divider",1600],["final-message",1900],["final-emojis",2300]].forEach(([id,d])=>setTimeout(()=>document.getElementById(id)?.classList.add("show"),d));
    const cc=["#ff4d6d","#ff9f43","#ffd700","#a29bfe","#00cec9","#fd79a8","#fff"];
    for(let i=0;i<180;i++)setTimeout(()=>{const el=document.createElement("div");el.style.cssText=`position:fixed;top:-20px;left:${Math.random()*100}vw;width:${5+Math.random()*9}px;height:${5+Math.random()*9}px;border-radius:${Math.random()>.5?"50%":"2px"};background:${cc[~~(Math.random()*cc.length)]};animation:confettiFall ${2.5+Math.random()*3}s linear forwards;animation-delay:${Math.random()*2}s;z-index:175;pointer-events:none`;document.body.appendChild(el);setTimeout(()=>el.remove(),6000);},i*18);
    toast("🎂 Happy Birthday Kuttulu!! 💖",3000);
    setTimeout(()=>{fs.style.transition="opacity .8s ease";fs.style.opacity="0";setTimeout(()=>{fs.classList.remove("active");fs.style.transition="";fs.style.opacity="";["final-cake","final-title","final-name","final-divider","final-message","final-emojis"].forEach(id=>document.getElementById(id)?.classList.remove("show"));res();},800);},12000);
  });
}

const HC=["#ff4d6d","#ff9f43","#ffd700","#a29bfe","#00cec9","#fd79a8"];
function buildHate(){
  const hs=document.getElementById("hate-screen");hs.innerHTML="";
  const W=innerWidth,H=innerHeight,rows=10,rh=H/rows;
  const fs=Math.floor(rh*.78),pv=Math.floor(rh*.05),ph=Math.floor(fs*.18);
  const wpw=Math.ceil(W*2/(fs*5.8))+4;
  for(let r=0;r<rows;r++){const row=document.createElement("div");row.className="hate-row "+(r%2===0?"go-left":"go-right");row.style.height=rh+"px";row.style.minHeight=rh+"px";const dur=(3.5+r*.18)+"s";row.style.animationDuration=dur;for(let pass=0;pass<2;pass++){for(let w=0;w<wpw;w++){const sp=document.createElement("span");sp.className="hate-word";sp.textContent="i hate you";sp.style.fontSize=fs+"px";sp.style.padding=`${pv}px ${ph}px`;sp.style.color=HC[(r*3+w)%HC.length];sp.style.animationDuration=(.5+Math.random()*.5)+"s";sp.style.animationDelay=(Math.random()*.5)+"s";row.appendChild(sp);}}hs.appendChild(row);}
  const glitch=document.createElement("div");glitch.id="hate-glitch";hs.appendChild(glitch);
  [400,900,1500,2200,3100,4000,4800,5600,6200,6700].forEach(t=>{setTimeout(()=>{glitch.style.animation="none";void glitch.offsetWidth;glitch.style.animation=`glitchFlash ${60+Math.random()*80}ms ease`;},t);});
}

function exitHate(hs){
  return new Promise(res=>{
    document.querySelectorAll(".hate-word").forEach((el,i)=>{setTimeout(()=>{el.style.transition="all .15s ease";el.style.transform="scale(1.3)";el.style.filter="brightness(3)";setTimeout(()=>{el.textContent="kutty";el.style.color="#ff9f43";el.style.filter="brightness(1.4) drop-shadow(0 0 8px #ff9f43)";el.style.transform="scale(1)";el.style.transition="all .2s cubic-bezier(.34,1.56,.64,1)";setTimeout(()=>{el.style.transition="opacity .25s ease, transform .25s ease";el.style.opacity="0";el.style.transform="scale(0.6) translateY(-10px)";},180);},120);},i*2);});
    flash(null,"#ff9f4333");
    setTimeout(()=>{hs.style.display="none";res();},700);
  });
}

function doCountdown1(){
  return new Promise(res=>{
    const cs=document.getElementById("countdown-screen"),cn=document.getElementById("countdown-number"),cv=document.getElementById("countdown-particles");
    cs.style.display="flex";cv.width=innerWidth;cv.height=innerHeight;
    const ctx=cv.getContext("2d"),pts=[];let raf;
    function addB(c){for(let i=0;i<18;i++){const a=Math.random()*Math.PI*2,s=1+Math.random()*3;pts.push({x:cv.width/2,y:cv.height/2,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:.018+Math.random()*.015,r:2+Math.random()*4,c});}}
    function tick(){ctx.clearRect(0,0,cv.width,cv.height);for(let i=pts.length-1;i>=0;i--){const p=pts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.04;p.life-=p.decay;if(p.life<=0){pts.splice(i,1);continue;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c+Math.floor(p.life*255).toString(16).padStart(2,"0");ctx.fill();}raf=requestAnimationFrame(tick);}
    tick();
    const phrases=[{t:"8766 Days",c:"#ff4d6d"},{t:"1252 Weeks",c:"#ff9f43"},{t:"288 Months",c:"#ffd700"},{t:"24 Years ",c:"#06d6a0"},{t:"Aina sare inka chinna pillalne unnaru 🙃",c:"#ff9f43"},{t:"Eppatiki ilane undipondiii ✨",c:"#ffd700"},{t:"24/101 ✅",c:"#00cec9"}];
    const burstColors=["#ff4d6d","#ff9f43","#ffd700","#c77dff","#06d6a0","#00cec9"];
    let idx=0;
    function showPhrase(){
      if(idx>=phrases.length){addB("#ffd700");cn.style.color="";cn.textContent="😏";cn.className="";void cn.offsetWidth;cn.classList.add("show");setTimeout(()=>{cn.classList.add("hide");cancelAnimationFrame(raf);cs.style.transition="opacity 400ms";cs.style.opacity="0";setTimeout(()=>{cs.style.display="none";cs.style.opacity="";res();},400);},200);return;}
      const ph=phrases[idx];addB(burstColors[idx%burstColors.length]);cn.style.color=ph.c;cn.style.webkitTextFillColor=ph.c;cn.style.backgroundImage="none";cn.textContent=ph.t;cn.className="";void cn.offsetWidth;cn.classList.add("show");setTimeout(()=>{cn.classList.add("hide");idx++;setTimeout(showPhrase,500);},1400);
    }
    showPhrase();
  });
}

function typewrite(ids,ms,gap,textMap){
  ms=ms||27;gap=gap||120;
  return new Promise(res=>{
    var texts={};ids.forEach(function(id){var el=document.getElementById(id);if(!el)return;texts[id]=textMap?textMap[id]||'':el.textContent;el.innerHTML='';});
    var delay=80,total=0;
    ids.forEach(function(id){var el=document.getElementById(id);if(!el)return;var txt=texts[id]||'';Array.from(txt).forEach(function(ch,ci){var sp=document.createElement('span');sp.className='char';sp.textContent=ch;var d=delay+ci*ms;setTimeout(function(){sp.classList.add('vis');},d);el.appendChild(sp);});var end=delay+txt.length*ms;if(end>total)total=end;delay+=txt.length*ms+gap;});
    setTimeout(res,total+80);
  });
}

let curLP=1;
function goPage(p){
  if(p===curLP)return;
  const prev=document.getElementById("lpage-"+curLP);
  prev.style.transition="opacity .2s,transform .2s";prev.style.opacity="0";prev.style.transform=p>curLP?"translateX(-20px)":"translateX(20px)";
  setTimeout(()=>{prev.classList.remove("active");prev.style.opacity="";prev.style.transform="";curLP=p;const nxt=document.getElementById("lpage-"+curLP);nxt.style.opacity="0";nxt.style.transform="translateX(20px)";nxt.classList.add("active");requestAnimationFrame(()=>{nxt.style.transition="opacity .3s,transform .3s";nxt.style.opacity="1";nxt.style.transform="translateX(0)";});document.getElementById("dot-1").classList.toggle("active",curLP===1);document.getElementById("dot-2").classList.toggle("active",curLP===2);const pp=document.getElementById("btn-prev"),np=document.getElementById("btn-next");pp.style.opacity=curLP===1?"0":"1";pp.style.pointerEvents=curLP===1?"none":"auto";np.style.opacity=curLP===2?"0":"1";np.style.pointerEvents=curLP===2?"none":"auto";},200);
}
document.getElementById("btn-next").addEventListener("click",()=>goPage(2));
document.getElementById("btn-prev").addEventListener("click",()=>goPage(1));
let swX=0;
document.addEventListener("touchstart",e=>swX=e.touches[0].clientX,{passive:true});
document.addEventListener("touchend",e=>{if(!document.getElementById("letter-card").classList.contains("show"))return;const d=swX-e.changedTouches[0].clientX;if(Math.abs(d)>50){d>0?goPage(2):goPage(1);}},{passive:true});

function surprise(){
  return new Promise(res=>{
    const ss=document.getElementById("surprise-screen"),inn=document.getElementById("surprise-inner"),thread=document.getElementById("chat-thread");
    ss.style.display="flex";setTimeout(()=>{inn.classList.add("show");toast("👊",5000);},200);
    function sendMsg(side,name,text,delay){return new Promise(r=>{setTimeout(()=>{const cb=document.createElement("div");cb.className="cb "+side;const nameEl=document.createElement("div");nameEl.className="cb-name";nameEl.textContent=name;const typingEl=document.createElement("div");typingEl.className="cb-typing";typingEl.innerHTML='<div class="cd"></div><div class="cd"></div><div class="cd"></div>';cb.appendChild(nameEl);cb.appendChild(typingEl);thread.appendChild(cb);requestAnimationFrame(()=>requestAnimationFrame(()=>cb.classList.add("show")));setTimeout(()=>{typingEl.remove();const textEl=document.createElement("div");textEl.className="cb-text";textEl.textContent=text;cb.appendChild(textEl);burst(side==="left"?80:innerWidth-80,thread.getBoundingClientRect().bottom-20,side==="left"?["👀","💬","✨"]:["😏","💜","✨"]);r();},700);},delay);});}
    (async()=>{await wait(1000);await sendMsg("left","K","Enti idi? 👀",300);await sendMsg("right","P","Open chesi chudu 😏🎁",300);await sendMsg("right","P","Hmmmm 😌",300);await sendMsg("left","K","Hmmm 🤔",300);await sendMsg("right","P","Bye 👋💜",300);})();
    let done=false;const go=()=>{if(!done){done=true;res();}};
    inn.addEventListener("click",e=>{burst(e.clientX||innerWidth/2,e.clientY||innerHeight/2,["🎁","✨","💗","🌟","🎊"]);setTimeout(go,300);},{once:true});
    setTimeout(go,8000);
  });
}

function launchVideo(){
  const ss=document.getElementById("surprise-screen");
  fadeHide(ss,400);
  prog(92);
  setTimeout(()=>{
    const gos=document.getElementById("gift-open-screen");
    gos.style.display="flex";
    const gc=document.getElementById("gift-bg-canvas");
    gc.width=innerWidth;gc.height=innerHeight;
    const gctx=gc.getContext("2d");const gparts=[];let graf;
    const rings=[];let ringTimer=0;
    function addRing(){rings.push({r:0,maxR:Math.min(innerWidth,innerHeight)*.55,op:.6,col:`hsl(${280+Math.random()*60},80%,65%)`});}
    addRing();
    function addSparkle(){for(let i=0;i<3;i++){const cx=innerWidth/2,cy=innerHeight*.44;const a=Math.random()*Math.PI*2,sp=.3+Math.random()*1.6;const hue=Math.random()>.5?35+Math.random()*30:280+Math.random()*60;gparts.push({x:cx+((Math.random()-.5)*100),y:cy+((Math.random()-.5)*70),vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-1.4,life:1,decay:.006+Math.random()*.008,r:1+Math.random()*3.5,h:hue});}}
    const stars=Array.from({length:60},()=>({x:Math.random()*gc.width,y:Math.random()*gc.height,r:.3+Math.random()*.8,phase:Math.random()*Math.PI*2}));
    (function gtick(ts){gctx.fillStyle="rgba(0,0,0,.08)";gctx.fillRect(0,0,gc.width,gc.height);stars.forEach(s=>{s.phase+=.025;const op=.05+.15*Math.abs(Math.sin(s.phase));gctx.beginPath();gctx.arc(s.x,s.y,s.r,0,Math.PI*2);gctx.fillStyle=`rgba(255,255,255,${op})`;gctx.fill();});ringTimer++;if(ringTimer%90===0)addRing();for(let i=rings.length-1;i>=0;i--){const rg=rings[i];rg.r+=2.2;rg.op-=.008;if(rg.op<=0){rings.splice(i,1);continue;}gctx.beginPath();gctx.arc(innerWidth/2,innerHeight*.44,rg.r,0,Math.PI*2);gctx.strokeStyle=rg.col;gctx.globalAlpha=rg.op;gctx.lineWidth=1.5;gctx.stroke();gctx.globalAlpha=1;}const auraGrad=gctx.createRadialGradient(innerWidth/2,innerHeight*.44,0,innerWidth/2,innerHeight*.44,Math.min(innerWidth,innerHeight)*.28);auraGrad.addColorStop(0,`rgba(180,80,255,${.06+.04*Math.sin((ts||0)*.002)})`);auraGrad.addColorStop(.5,`rgba(255,100,200,${.03+.02*Math.cos((ts||0)*.003)})`);auraGrad.addColorStop(1,'transparent');gctx.fillStyle=auraGrad;gctx.fillRect(0,0,gc.width,gc.height);addSparkle();for(let i=gparts.length-1;i>=0;i--){const p=gparts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.025;p.life-=p.decay;if(p.life<=0){gparts.splice(i,1);continue;}gctx.beginPath();gctx.arc(p.x,p.y,p.r,0,Math.PI*2);gctx.fillStyle=`hsla(${p.h},100%,72%,${p.life*.55})`;gctx.shadowColor=`hsla(${p.h},100%,72%,1)`;gctx.shadowBlur=6;gctx.fill();gctx.shadowBlur=0;}graf=requestAnimationFrame(gtick);})();
    const wrap=document.getElementById("gbox-wrap");
    wrap.style.animation="boxSway 2.5s ease-in-out infinite";
    const swaySt=document.createElement("style");swaySt.textContent="@keyframes boxSway{0%{transform:rotate(-2deg) scale(1) translateY(0)}25%{transform:rotate(1.5deg) scale(1.03) translateY(-6px)}50%{transform:rotate(-1deg) scale(1.01) translateY(-2px)}75%{transform:rotate(2deg) scale(1.04) translateY(-8px)}100%{transform:rotate(-2deg) scale(1) translateY(0)}}";document.head.appendChild(swaySt);
    const hint=document.getElementById("gift-hint");let secs=3;if(hint)hint.textContent=secs;
    const countInterval=setInterval(()=>{secs--;if(hint){hint.textContent=secs;hint.style.transform="scale(1.35)";setTimeout(()=>{if(hint)hint.style.transform="scale(1)";},120);}if(secs<=0)clearInterval(countInterval);},1000);
    let unwrapped=false;
    function doUnwrap(){
      if(unwrapped)return;unwrapped=true;
      cancelAnimationFrame(graf);wrap.style.animation="none";wrap.style.transition="transform .08s ease-in-out";let shk=0;
      const shakeIt=setInterval(()=>{shk++;wrap.style.transform=shk%2===0?"rotate(-8deg) scale(1.05)":"rotate(8deg) scale(1.05)";if(shk>=6){clearInterval(shakeIt);wrap.style.transform="";}},70);
      setTimeout(()=>{document.getElementById("gbox-bow")?.classList.add("fly");},600);
      setTimeout(()=>{document.querySelectorAll(".wrap-strip").forEach((s,si)=>{setTimeout(()=>s.classList.add("torn"),si*80);});},950);
      setTimeout(()=>{document.getElementById("gbox-lid")?.classList.add("open");document.getElementById("box-inner-glow")?.classList.add("lit");},1500);
      setTimeout(()=>{
        const f=document.getElementById("screen-flash");f.style.transition="none";f.style.background="#fff8e1";f.style.opacity="1";void f.offsetWidth;f.style.transition="opacity 1s ease";f.style.opacity="0";
        gos.style.display="none";
        startStoryReel();
      },3200);
    }
    setTimeout(doUnwrap,3000);
  },400);
}

/* ══════════════════════════════════════
   CAKE SCREEN
══════════════════════════════════════ */
const NUM_CANDLES = 24;

function showCakeScreen(){
  return new Promise(res=>{
    const cs = document.getElementById('cake-screen');
    cs.style.display = 'flex';
    buildFloaties('cake-floaties');

    const cv = document.getElementById('cake-canvas');
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;

    const pcv = document.getElementById('cake-particles');
    pcv.width = innerWidth * devicePixelRatio;
    pcv.height = innerHeight * devicePixelRatio;
    pcv.style.width = innerWidth + 'px';
    pcv.style.height = innerHeight + 'px';
    const pctx = pcv.getContext('2d');
    pctx.scale(devicePixelRatio, devicePixelRatio);

    const candles = Array.from({length: NUM_CANDLES}, () => ({
      lit: true,
      flicker: Math.random() * Math.PI * 2,
      flickerSpeed: .07 + Math.random() * .07,
      smokeT: 0,
    }));
    let candlesOut = 0, blowDone = false;

    const particles = [];
    function addSmoke(x, y){
      for(let i = 0; i < 5; i++){
        particles.push({x, y, vx:(Math.random()-.5)*1.4, vy:-(0.8+Math.random()*1.6),
          life:1, decay:.009+Math.random()*.014, r:4+Math.random()*10, type:'smoke'});
      }
    }
    function addSpark(x, y){
      for(let i = 0; i < 8; i++){
        const a = Math.random()*Math.PI*2, s = 1.5+Math.random()*3.5;
        particles.push({x, y, vx:Math.cos(a)*s, vy:Math.sin(a)*s-2.5,
          life:1, decay:.035+Math.random()*.05, r:1.5+Math.random()*2.5, type:'spark',
          col:`hsl(${30+Math.random()*40},100%,65%)`});
      }
    }

    const COLS = 8;
    const cakeBaseY = H * .84;
    const cakeH = H * .24;
    const cakeW = W * .76;
    const cakeTop = cakeBaseY - cakeH;
    const candleW = 10, candleH = 38;
    const cSpacingX = cakeW / (COLS + 1);
    const cSpacingY = 24;

    function getCandlePos(i){
      const col = i % COLS, row = Math.floor(i / COLS);
      const x = W/2 - cakeW/2 + (col+1)*cSpacingX;
      const y = cakeTop - row*(candleH + cSpacingY) - candleH*.5;
      return {x, y};
    }

    function drawCake(){
      ctx.clearRect(0,0,W,H);
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(W/2, cakeBaseY+12, cakeW/2+24, 16, 0, 0, Math.PI*2);
      const plg = ctx.createRadialGradient(W/2,cakeBaseY+8,4,W/2,cakeBaseY+12,cakeW/2+24);
      plg.addColorStop(0,'rgba(255,245,245,1)');plg.addColorStop(.7,'rgba(220,200,205,.9)');plg.addColorStop(1,'rgba(180,155,160,.5)');
      ctx.fillStyle=plg; ctx.shadowColor='rgba(0,0,0,.45)'; ctx.shadowBlur=16; ctx.fill(); ctx.restore();

      const tiers = [
        {yOff:0,        w:cakeW*.8,  h:cakeH*.36, c1:'#ff7b9c',c2:'#e05075',c3:'#ffafc5'},
        {yOff:cakeH*.36,w:cakeW*.88, h:cakeH*.33, c1:'#ff9f43',c2:'#e07028',c3:'#ffbf78'},
        {yOff:cakeH*.69,w:cakeW,     h:cakeH*.31, c1:'#ff4d6d',c2:'#c0183a',c3:'#ff8097'},
      ];
      tiers.forEach(t => {
        const tx = W/2 - t.w/2, ty = cakeTop + t.yOff;
        ctx.save();
        const bg = ctx.createLinearGradient(tx,ty,tx+t.w,ty+t.h);
        bg.addColorStop(0,t.c3); bg.addColorStop(.5,t.c1); bg.addColorStop(1,t.c2);
        ctx.beginPath(); ctx.roundRect(tx,ty,t.w,t.h,7); ctx.fillStyle=bg;
        ctx.shadowColor='rgba(0,0,0,.38)'; ctx.shadowBlur=10; ctx.fill(); ctx.shadowBlur=0;
        const fy = ty - 5;
        ctx.beginPath();
        for(let fx=tx+12; fx<tx+t.w-12; fx+=20){ ctx.arc(fx,fy+5,8,Math.PI,0,false); }
        ctx.fillStyle='rgba(255,255,255,.9)'; ctx.fill();
        ctx.beginPath(); ctx.roundRect(tx+5,fy-1,t.w-10,8,4); ctx.fillStyle='rgba(255,255,255,.93)'; ctx.fill();
        for(let s=0;s<16;s++){
          const sx=tx+14+Math.random()*(t.w-28), sy=ty+7+Math.random()*(t.h-14);
          ctx.beginPath(); ctx.ellipse(sx,sy,5,2,Math.random()*Math.PI,0,Math.PI*2);
          ctx.fillStyle=['#ffd700','#ff4d6d','#a29bfe','#06d6a0','#fff','#ff9f43'][~~(Math.random()*6)];
          ctx.fill();
        }
        ctx.restore();
      });

      ctx.save();
      const fz = Math.max(11, Math.min(20, W*.036));
      ctx.font = `bold ${fz}px 'Pacifico',cursive`;
      ctx.fillStyle='rgba(255,255,255,.85)'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.shadowColor='rgba(180,0,50,.5)'; ctx.shadowBlur=7;
      ctx.fillText('Happy Birthday Kuttulu! 💖', W/2, cakeBaseY - cakeH*.12);
      ctx.restore();

      candles.forEach((c,i)=>{
        const {x,y} = getCandlePos(i);
        ctx.save();
        const cg = ctx.createLinearGradient(x-candleW/2,y,x+candleW/2,y);
        cg.addColorStop(0,'#ffd6e7'); cg.addColorStop(.5,'#fff0f6'); cg.addColorStop(1,'#ffb3c6');
        ctx.beginPath(); ctx.roundRect(x-candleW/2,y,candleW,candleH,3); ctx.fillStyle=cg;
        ctx.shadowColor='rgba(255,100,150,.25)'; ctx.shadowBlur=5; ctx.fill();
        for(let wi=0;wi<3;wi++){ctx.beginPath();ctx.rect(x-candleW/2,y+6+wi*9,candleW,3);ctx.fillStyle=['#ff4d6d','#ff9f43','#a29bfe'][wi]+'88';ctx.fill();}
        ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x,y-7); ctx.strokeStyle='#5c3317'; ctx.lineWidth=1.5; ctx.stroke();
        if(c.lit){
          c.flicker += c.flickerSpeed;
          const fk = Math.sin(c.flicker);
          const fw = 5+fk*2, fh = 14+fk*4;
          const fx = x+fk*.5, fy = y-7-fh*.4;
          ctx.save();
          const gl = ctx.createRadialGradient(fx,fy+fh*.3,0,fx,fy,fh*1.3);
          gl.addColorStop(0,'rgba(255,200,60,.22)'); gl.addColorStop(1,'transparent');
          ctx.beginPath(); ctx.ellipse(fx,fy+fh*.3,fw*2.4,fh*1.7,0,0,Math.PI*2); ctx.fillStyle=gl; ctx.fill(); ctx.restore();
          ctx.save();
          const fl = ctx.createLinearGradient(fx,fy-fh*.5,fx,fy+fh*.5);
          fl.addColorStop(0,'rgba(255,255,200,.95)'); fl.addColorStop(.35,'rgba(255,150,20,.92)'); fl.addColorStop(.7,'rgba(255,60,10,.85)'); fl.addColorStop(1,'rgba(220,20,20,.3)');
          ctx.beginPath(); ctx.moveTo(fx,fy-fh*.5);
          ctx.bezierCurveTo(fx+fw*.7,fy-fh*.1,fx+fw*.5,fy+fh*.4,fx,fy+fh*.5);
          ctx.bezierCurveTo(fx-fw*.5,fy+fh*.4,fx-fw*.7,fy-fh*.1,fx,fy-fh*.5);
          ctx.fillStyle=fl; ctx.shadowColor='rgba(255,150,0,.8)'; ctx.shadowBlur=12; ctx.fill(); ctx.restore();
        } else {
          if(Math.random()<.07) addSmoke(x,y-7);
          ctx.beginPath(); ctx.arc(x,y-7,2,0,Math.PI*2); ctx.fillStyle='#333'; ctx.fill();
        }
        ctx.restore();
      });

      const rect = cv.getBoundingClientRect();
      pctx.clearRect(0,0,innerWidth,innerHeight);
      particles.forEach(p=>{
        const px = rect.left + p.x*(rect.width/W), py = rect.top + p.y*(rect.height/H);
        if(p.type==='smoke'){
          const r = p.r*(2+p.life*.5);
          const sg = pctx.createRadialGradient(px,py,0,px,py,r);
          sg.addColorStop(0,`rgba(200,170,220,${p.life*.3})`); sg.addColorStop(1,'transparent');
          pctx.beginPath(); pctx.arc(px,py,r,0,Math.PI*2); pctx.fillStyle=sg; pctx.fill();
        } else {
          pctx.beginPath(); pctx.arc(px,py,p.r,0,Math.PI*2);
          pctx.fillStyle=p.col; pctx.globalAlpha=p.life; pctx.shadowColor=p.col; pctx.shadowBlur=7; pctx.fill(); pctx.globalAlpha=1; pctx.shadowBlur=0;
        }
      });
    }

    let animRaf;
    function tickParticles(){
      for(let i=particles.length-1;i>=0;i--){
        const p=particles[i]; p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
        if(p.type==='smoke'){p.vx*=.98;p.vy*=.97;}else{p.vy+=.06;}
        if(p.life<=0) particles.splice(i,1);
      }
    }
    (function loop(){ tickParticles(); drawCake(); animRaf=requestAnimationFrame(loop); })();

    setTimeout(()=>document.getElementById('cake-title').classList.add('show'), 300);
    setTimeout(()=>document.getElementById('cake-subtitle').classList.add('show'), 700);
    setTimeout(()=>document.getElementById('blow-btn-wrap').classList.add('show'), 1100);

    const btn = document.getElementById('blow-btn');
    const ringFill = document.getElementById('blow-ring-fill');
    const badge = document.getElementById('candle-count-badge');
    const circumference = 2 * Math.PI * 72;
    let holding = false, holdInterval = null, holdProgress = 0;
    const TICK_MS = 50;
    const BLOW_RATE = 0.18;

    function startHold(){
      if(blowDone) return;
      holding = true;
      btn.classList.add('holding');
      document.getElementById('blow-icon').style.animation = 'none';
      document.getElementById('blow-icon').style.transform = 'scale(1.2)';
      document.getElementById('blow-hint').style.opacity = '0.3';
      holdInterval = setInterval(()=>{
        if(!holding) return;
        holdProgress += BLOW_RATE;
        const dashLen = Math.min(holdProgress, 1) * circumference;
        ringFill.style.strokeDasharray = `${dashLen} ${circumference}`;
        if(holdProgress >= 1){
          holdProgress = 0;
          const litIdx = candles.map((c,i)=>c.lit?i:-1).filter(i=>i>=0);
          if(litIdx.length > 0){
            const pick = litIdx[~~(Math.random()*litIdx.length)];
            candles[pick].lit = false;
            candlesOut++;
            const {x,y} = getCandlePos(pick);
            addSpark(x, y-7); addSmoke(x, y-7);
            burst(
              btn.getBoundingClientRect().left + btn.offsetWidth/2,
              btn.getBoundingClientRect().top + btn.offsetHeight/2,
              ['💨','✨','💫']
            );
            const remaining = NUM_CANDLES - candlesOut;
            if(badge) badge.textContent = remaining > 0 ? `🕯️ ${remaining}` : '🎂';
            if(badge) { badge.style.transform='scale(1.4)'; setTimeout(()=>badge.style.transform='scale(1)',200); }
          }
          if(candlesOut >= NUM_CANDLES && !blowDone){
            blowDone = true;
            stopHold();
            onAllBlown();
          }
        }
      }, TICK_MS);
    }

    function stopHold(){
      holding = false;
      btn.classList.remove('holding');
      clearInterval(holdInterval); holdInterval = null;
      holdProgress = 0;
      ringFill.style.strokeDasharray = `0 ${circumference}`;
      document.getElementById('blow-icon').style.animation = '';
      document.getElementById('blow-icon').style.transform = '';
      if(!blowDone) document.getElementById('blow-hint').style.opacity = '';
    }

    btn.addEventListener('mousedown', e=>{ e.preventDefault(); startHold(); });
    document.addEventListener('mouseup', ()=>{ if(holding) stopHold(); });
    btn.addEventListener('touchstart', e=>{ e.preventDefault(); startHold(); }, {passive:false});
    document.addEventListener('touchend', ()=>{ if(holding) stopHold(); }, {passive:true});
    document.addEventListener('touchcancel', ()=>{ if(holding) stopHold(); }, {passive:true});

    function onAllBlown(){
      cancelAnimationFrame(animRaf);
      pctx.clearRect(0,0,innerWidth,innerHeight);
      document.getElementById('blow-btn-wrap').style.transition='opacity .4s';
      document.getElementById('blow-btn-wrap').style.opacity='0';
      for(let i=0;i<10;i++) setTimeout(()=>burst(Math.random()*innerWidth,Math.random()*innerHeight*.7,['🎂','✨','💖','🌟','🎉','💫','🎊']),i*100);
      document.getElementById('cake-candle-glow').style.opacity='0';
      const cel = document.getElementById('blow-celebration');
      cel.classList.add('show');
      toast('🎂 Wish granted! 💖', 3000);
      setTimeout(()=>{
        cs.style.transition='opacity .8s ease';
        cs.style.opacity='0';
        setTimeout(()=>{ cs.style.display='none'; cs.style.opacity=''; res(); }, 800);
      }, 3000);
    }
  });
}

/* ══════════════════════════════════════
   VIDEO PLAYBACK
══════════════════════════════════════ */
function playVideo(){
  prog(98);
  flash(()=>{
    const vs = document.getElementById("video-screen");
    const vid = document.getElementById("tessa-video");
    vs.style.display = "block";
    toast("💗", 4000);
    vid.muted = false;
    vid.volume = 1;
    setTimeout(()=>{
      const pp = vid.play();
      if(pp){
        pp.catch(()=>{
          const h = document.createElement("div");
          h.style.cssText = "position:fixed;inset:0;z-index:165;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(4px);cursor:pointer;flex-direction:column;gap:16px";
          h.innerHTML = '<div style="font-size:clamp(60px,15vw,100px)">▶</div><div style="font-family:Pacifico,cursive;font-size:clamp(16px,3vw,24px);color:#fff;letter-spacing:2px;text-shadow:0 0 20px #ff4d6d">tap to play 💗</div>';
          document.body.appendChild(h);
          h.addEventListener("click", ()=>{ vid.play().catch(()=>{}); h.remove(); }, {once:true});
        });
      }
    }, 80);
    vid.addEventListener("ended", ()=>{
      vs.style.transition = "opacity 1s";
      vs.style.opacity = "0";
      setTimeout(()=>{ vs.style.display = "none"; vs.style.opacity = ""; finalScreen(); }, 1000);
    }, {once:true});
  }, "#ff4d6d44");
}

function spawnConfetti(){
  const cc=["#ff4d6d","#ff9f43","#ffd700","#a29bfe","#00cec9","#fd79a8","#fff"];
  for(let i=0;i<150;i++)setTimeout(()=>{const el=document.createElement("div");el.className="confetti-piece";el.style.cssText=`left:${Math.random()*100}vw;background:${cc[Math.floor(Math.random()*cc.length)]};width:${6+Math.random()*10}px;height:${6+Math.random()*10}px;border-radius:${Math.random()>.5?"50%":"2px"};animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*2}s`;document.getElementById("final-screen").appendChild(el);},i*20);
}

function finalScreen(){
  const fs=document.getElementById("final-screen");fs.classList.add("active");
  flash(null,"#ff4d6d55");prog(100);
  startAurora();startPetals();startFireworks();
  [["final-cake",200],["final-title",600],["final-name",1100],["final-divider",1600],["final-message",1900],["final-emojis",2300]].forEach(([id,d])=>setTimeout(()=>document.getElementById(id).classList.add("show"),d));
  const cc=["#ff4d6d","#ff9f43","#ffd700","#a29bfe","#00cec9","#fd79a8","#fff"];
  for(let i=0;i<200;i++)setTimeout(()=>{const el=document.createElement("div");el.style.cssText=`position:fixed;top:-20px;left:${Math.random()*100}vw;width:${5+Math.random()*9}px;height:${5+Math.random()*9}px;border-radius:${Math.random()>.5?"50%":"2px"};background:${cc[Math.floor(Math.random()*cc.length)]};animation:confettiFall ${2.5+Math.random()*3}s linear forwards;animation-delay:${Math.random()*2}s;z-index:175;pointer-events:none`;document.body.appendChild(el);setTimeout(()=>el.remove(),6000);},i*18);
  setTimeout(()=>{[[80,80],[innerWidth-80,80],[80,innerHeight-80],[innerWidth-80,innerHeight-80]].forEach(([x,y],i)=>setTimeout(()=>burst(x,y,["💖","🌟","✨","🎉","🌸","💗"]),i*200));},800);
  setInterval(()=>burst(80+Math.random()*(innerWidth-160),80+Math.random()*(innerHeight-160),["💗","✨","💖","🌟","🎊","🌸"]),3500);
  toast("👊👊👊👊👊",6000);
}

function startAurora(){
  const cv=document.getElementById("aurora-canvas");cv.width=innerWidth;cv.height=innerHeight;
  const ctx=cv.getContext("2d");let t=0;
  const bl=[{x:.2,y:.4,r:.55,h:320,s:.0007},{x:.7,y:.3,r:.5,h:15,s:.0009},{x:.5,y:.7,r:.6,h:280,s:.0006},{x:.85,y:.65,r:.45,h:45,s:.0011},{x:.15,y:.75,r:.4,h:350,s:.0008}];
  (function d(){ctx.fillStyle="#08000e";ctx.fillRect(0,0,cv.width,cv.height);bl.forEach(b=>{const cx=(b.x+Math.sin(t*b.s*1000+b.h)*.18)*cv.width,cy=(b.y+Math.cos(t*b.s*1000+b.h)*.14)*cv.height,r=b.r*Math.max(cv.width,cv.height)*(.55+Math.sin(t*b.s*500)*.12),al=.18+Math.sin(t*b.s*800)*.08;const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`hsla(${b.h+Math.sin(t*.001)*30},90%,65%,${al})`);g.addColorStop(.5,`hsla(${b.h+60},80%,50%,${al*.5})`);g.addColorStop(1,"transparent");ctx.fillStyle=g;ctx.fillRect(0,0,cv.width,cv.height);});t+=16;requestAnimationFrame(d);})();
}

function startPetals(){
  const c=document.getElementById("final-petals"),pe=["🌸","🌺","✨","💗","🌷","💖","🌼","⭐","💫","🌹"];
  function one(){const el=document.createElement("div");el.className="petal";el.textContent=pe[Math.floor(Math.random()*pe.length)];el.style.left=Math.random()*110-5+"vw";el.style.fontSize=12+Math.random()*18+"px";el.style.setProperty("--drift",(Math.random()-.5)*200+"px");el.style.animationDuration=6+Math.random()*9+"s";el.style.animationDelay=Math.random()*3+"s";c.appendChild(el);setTimeout(()=>el.remove(),20000);}
  for(let i=0;i<25;i++)setTimeout(one,i*200);setInterval(one,600);
}

function startFireworks(){
  const cv=document.getElementById("firework-canvas");cv.width=innerWidth;cv.height=innerHeight;
  const ctx=cv.getContext("2d"),sp=[];
  const fc=["#ff4d6d","#ff9f43","#ffd700","#a29bfe","#fd79a8","#00cec9","#fff"];
  function launch(){const x=100+Math.random()*(cv.width-200),y=60+Math.random()*(cv.height*.55),col=fc[Math.floor(Math.random()*fc.length)],n=28+Math.floor(Math.random()*20);for(let i=0;i<n;i++){const a=(Math.PI*2*i)/n,s=2.5+Math.random()*4.5;sp.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,col,r:2+Math.random()*2.5,tr:[]});}burst(x,y,["✨","💥","🌟","💖"]);}
  (function tick(){ctx.globalAlpha=.15;ctx.fillStyle="#08000e";ctx.fillRect(0,0,cv.width,cv.height);ctx.globalAlpha=1;for(let i=sp.length-1;i>=0;i--){const s=sp[i];s.tr.push({x:s.x,y:s.y});if(s.tr.length>6)s.tr.shift();s.x+=s.vx;s.y+=s.vy;s.vy+=.09;s.vx*=.97;s.life-=.018;if(s.life<=0){sp.splice(i,1);continue;}s.tr.forEach((p,ti)=>{ctx.beginPath();ctx.arc(p.x,p.y,s.r*.6,0,Math.PI*2);ctx.fillStyle=s.col;ctx.globalAlpha=(ti/s.tr.length)*s.life*.5;ctx.fill();});ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=s.col;ctx.globalAlpha=s.life;ctx.fill();ctx.globalAlpha=1;}requestAnimationFrame(tick);})();
  launch();setTimeout(launch,600);setTimeout(launch,1200);setInterval(launch,2200);
}

/* ─── STORY REEL ─── */
function startStoryReel(){
  const root=document.getElementById("story-screen");
  root.style.display="block";
  prog(95);
  const DUR=[5500,4500,4500,4200,4800,9500];
  const total=DUR.reduce((a,b)=>a+b,0);
  const sl=document.getElementById("sline");
  if(sl){sl.style.transition=`width ${total}ms linear`;requestAnimationFrame(()=>requestAnimationFrame(()=>sl.style.width="100%"));}

  function animScene(i){
    if(i===0){
      const cv=document.getElementById('sc1-map-canvas');if(!cv||cv.dataset.built)return;cv.dataset.built='1';cv.width=innerWidth;cv.height=innerHeight;const ctx=cv.getContext('2d');const W=cv.width,H=cv.height;const cities={G:{x:W*.28,y:H*.62,color:'#ff9f43'},T:{x:W*.40,y:H*.55,color:'#ffd700'},L:{x:W*.22,y:H*.18,color:'#06d6a0'}};function makeCurve(from,to){const mx=(from.x+to.x)/2+(Math.random()-.5)*W*.14,my=(from.y+to.y)/2+(Math.random()-.5)*H*.12;return{from,to,cp:{x:mx,y:my},progress:0};}const routes=[makeCurve(cities.G,cities.L),makeCurve(cities.T,cities.L)];const scatterDots=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H,r:.5+Math.random()*1.2,op:.04+Math.random()*.1}));let startTime=null;function bezierPt(p0,cp,p1,t){return{x:(1-t)*(1-t)*p0.x+2*(1-t)*t*cp.x+t*t*p1.x,y:(1-t)*(1-t)*p0.y+2*(1-t)*t*cp.y+t*t*p1.y};}(function drawScene(ts){if(!startTime)startTime=ts;const elapsed=ts-startTime;ctx.clearRect(0,0,W,H);scatterDots.forEach(d=>{ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${d.op})`;ctx.fill();});routes.forEach((r,ri)=>{const pct=Math.min(1,Math.max(0,(elapsed-ri*300)/2800));r.progress=pct;if(pct<=0)return;const steps=80;ctx.save();ctx.lineWidth=2;ctx.lineCap='round';for(let s=0;s<Math.floor(steps*pct);s++){const p0=bezierPt(r.from,r.cp,r.to,s/steps),p1=bezierPt(r.from,r.cp,r.to,(s+1)/steps);ctx.strokeStyle=ri===0?`rgba(255,159,67,${.55+.35*(s/steps)})`:`rgba(255,215,0,${.55+.35*(s/steps)})`;ctx.shadowColor=ri===0?'#ff9f43':'#ffd700';ctx.shadowBlur=8;ctx.beginPath();ctx.moveTo(p0.x,p0.y);ctx.lineTo(p1.x,p1.y);ctx.stroke();}ctx.restore();if(pct>0&&pct<1){const cp=bezierPt(r.from,r.cp,r.to,pct),col=ri===0?'#ff9f43':'#ffd700';const grad=ctx.createRadialGradient(cp.x,cp.y,0,cp.x,cp.y,10);grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(.4,col);grad.addColorStop(1,'transparent');ctx.beginPath();ctx.arc(cp.x,cp.y,7,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();}});if(routes.every(r=>r.progress>=1)){const t=(elapsed%2000)/2000;Object.values(cities).forEach((c,ci)=>{const pulse=.4+.6*Math.abs(Math.sin(t*Math.PI*2+ci));const grad=ctx.createRadialGradient(c.x,c.y,0,c.x,c.y,28);grad.addColorStop(0,c.color+'88');grad.addColorStop(1,'transparent');ctx.beginPath();ctx.arc(c.x,c.y,28*pulse,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();});}requestAnimationFrame(drawScene);})(0);
      setTimeout(()=>document.getElementById('lp-g')?.classList.add('pin-visible'),400);
      setTimeout(()=>document.getElementById('lp-t')?.classList.add('pin-visible'),900);
      setTimeout(()=>document.getElementById('lp-l')?.classList.add('pin-visible'),3200);
    }
    if(i===1){const spk=document.getElementById("sc2-sparks");if(spk){spk.width=innerWidth*devicePixelRatio;spk.height=innerHeight*devicePixelRatio;spk.style.cssText=`position:absolute;inset:0;width:${innerWidth}px;height:${innerHeight}px;z-index:2;pointer-events:none;`;const sx=spk.getContext("2d");sx.scale(devicePixelRatio,devicePixelRatio);const W=innerWidth,H=innerHeight;const embers=Array.from({length:55},()=>({x:W*(.15+Math.random()*.7),y:H*(.3+Math.random()*.6),vx:(Math.random()-.5)*.5,vy:-(0.3+Math.random()*.7),r:.6+Math.random()*2.8,life:Math.random(),col:["#ff5500","#ff7700","#ffaa00","#ff3300","#ff9900"][~~(Math.random()*5)],trail:[]}));(function stk(){sx.fillStyle="rgba(0,0,0,.06)";sx.fillRect(0,0,W,H);embers.forEach(p=>{p.trail.push({x:p.x,y:p.y});if(p.trail.length>8)p.trail.shift();p.trail.forEach((t,ti)=>{const tf=ti/p.trail.length;sx.beginPath();sx.arc(t.x,t.y,p.r*tf*.6,0,Math.PI*2);sx.fillStyle=p.col;sx.globalAlpha=tf*.25;sx.fill();});p.x+=p.vx;p.y+=p.vy;p.life+=.007;p.vx+=(Math.random()-.5)*.05;if(p.y<H*.1||p.life>1){p.y=H*(.5+Math.random()*.4);p.x=W*(.2+Math.random()*.6);p.life=0;p.trail=[];}const op=Math.sin(p.life*Math.PI)*.7;sx.beginPath();sx.arc(p.x,p.y,p.r,0,Math.PI*2);sx.fillStyle=p.col;sx.globalAlpha=op;sx.shadowColor=p.col;sx.shadowBlur=10;sx.fill();});sx.globalAlpha=1;sx.shadowBlur=0;requestAnimationFrame(stk);})();}const con=document.getElementById("sc2msgs");if(!con)return;con.innerHTML="";const msgs=[{cls:"mo",text:"Hii ! 👋"},{cls:"mi",text:"Heyy!! 😊"},{cls:"mo",text:"Mam em cheppindi? 🤔"},{cls:"mi",text:"Nenu class ki inka vellaledu..."}];function typeInto(el,text,ms,cb){el.textContent="";const cur=document.createElement("span");cur.className="sc2-cursor";el.appendChild(cur);let idx=0;const tick=setInterval(()=>{if(idx<text.length){cur.before(text[idx++]);}else{clearInterval(tick);cur.remove();if(cb)cb();}},ms);}const el0=document.createElement("div");el0.className="sc2-msg mo";con.appendChild(el0);setTimeout(()=>{el0.classList.add("sv");typeInto(el0,msgs[0].text,48,()=>{msgs.slice(1).forEach((m,mi)=>{const el=document.createElement("div");el.className=`sc2-msg ${m.cls}`;el.textContent=m.t;con.appendChild(el);setTimeout(()=>el.classList.add("sv"),260+mi*500);});});},350);}
    if(i===2){const dust=document.getElementById("sc3-dust");if(dust&&!dust.dataset.built){dust.dataset.built=1;const dc=document.createElement("canvas");dc.style.cssText="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;";dc.width=innerWidth;dc.height=innerHeight;dust.appendChild(dc);const dx=dc.getContext("2d");const motes=Array.from({length:28},()=>({x:innerWidth*(.32+Math.random()*.36),y:innerHeight*(.08+Math.random()*.60),vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.12,r:.8+Math.random()*2.2,phase:Math.random()*Math.PI*2,speed:.008+Math.random()*.012}));(function dtk(){dx.clearRect(0,0,dc.width,dc.height);motes.forEach(m=>{m.x+=m.vx;m.y+=m.vy;m.phase+=m.speed;m.vx+=(Math.random()-.5)*.03;m.vy+=(Math.random()-.5)*.02;if(m.x<innerWidth*.2||m.x>innerWidth*.8)m.vx*=-.9;if(m.y<innerHeight*.05||m.y>innerHeight*.72)m.vy*=-.9;const op=.1+.65*Math.abs(Math.sin(m.phase));dx.beginPath();dx.arc(m.x,m.y,m.r,0,Math.PI*2);dx.fillStyle=`rgba(255,240,160,${op})`;dx.shadowColor="rgba(255,230,100,.8)";dx.shadowBlur=8;dx.fill();});dx.shadowBlur=0;requestAnimationFrame(dtk);})();}}
    if(i===3){const mx=document.getElementById("sc4-matrix");if(mx){mx.width=innerWidth;mx.height=innerHeight;mx.style.cssText=`position:absolute;inset:0;width:${innerWidth}px;height:${innerHeight}px;z-index:2;pointer-events:none;opacity:.12;`;const mc=mx.getContext("2d");const cols=Math.floor(innerWidth/14);const drops=Array.from({length:cols},()=>Math.random()*innerHeight/14);const chars="0123456789ABCDEF";(function mrain(){mc.fillStyle="rgba(0,0,0,.08)";mc.fillRect(0,0,mx.width,mx.height);mc.fillStyle="#30d158";mc.font="bold 12px monospace";drops.forEach((y,xi)=>{mc.fillText(chars[~~(Math.random()*chars.length)],xi*14,y*14);if(y*14>mx.height&&Math.random()>.97)drops[xi]=0;drops[xi]+=.4;});requestAnimationFrame(mrain);})();}setTimeout(()=>document.getElementById("nb1")?.classList.add("ns"),200);setTimeout(()=>{const nd=document.getElementById("sc4-num");if(nd){nd.classList.add("ns");const dispArr="9 3 9 0 X X X X X 8".split(" ");nd.textContent="_ _ _ _ _ _ _ _ _ _";dispArr.forEach((d,ci)=>{setTimeout(()=>{const revealed=dispArr.slice(0,ci+1).join(" ");const blanks=Array(dispArr.length-ci-1).fill("_").join(" ");nd.textContent=revealed+(blanks?" "+blanks:"");},ci*155);});}},900);setTimeout(()=>document.getElementById("nb2")?.style.setProperty("opacity","1"),2800);}
    if(i===4){const amb=document.getElementById("sc5-ambient");if(amb){amb.width=innerWidth*devicePixelRatio;amb.height=innerHeight*devicePixelRatio;amb.style.cssText=`position:absolute;inset:0;width:${innerWidth}px;height:${innerHeight}px;z-index:2;pointer-events:none;`;const ax=amb.getContext("2d");ax.scale(devicePixelRatio,devicePixelRatio);const W=innerWidth,H=innerHeight;const layers=[{n:18,r:[.5,1.2],v:.08,col:["#06d6a0","#25d366"],blur:14,op:[.04,.12]},{n:12,r:[2,5],v:.15,col:["#00c878","#128c7e"],blur:30,op:[.02,.06]},{n:8,r:[6,12],v:.06,col:["#1db954","#06d6a0"],blur:60,op:[.01,.03]}];const apts=layers.flatMap(l=>Array.from({length:l.n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*l.v,vy:(Math.random()-.5)*l.v,r:l.r[0]+Math.random()*(l.r[1]-l.r[0]),life:Math.random()*Math.PI*2,speed:.003+Math.random()*.007,col:l.col[~~(Math.random()*l.col.length)],blur:l.blur,opMin:l.op[0],opRange:l.op[1]-l.op[0]})));(function atk(){ax.fillStyle="rgba(0,0,0,.04)";ax.fillRect(0,0,W,H);apts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life+=p.speed;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;const op=p.opMin+p.opRange*Math.abs(Math.sin(p.life));ax.beginPath();ax.arc(p.x,p.y,p.r,0,Math.PI*2);ax.fillStyle=p.col;ax.globalAlpha=op;ax.shadowColor=p.col;ax.shadowBlur=p.blur;ax.fill();});ax.globalAlpha=1;ax.shadowBlur=0;requestAnimationFrame(atk);})();}const msgs=[{c:"wr",t:"Hiiiiii! ☀️"},{c:"wl",t:"Hi! 💛"},{c:"wr",t:"Em chestunnaru? 🤔"},{c:"wl",t:"Clg ki start avtunna"},{c:"wr",t:"Seriii"},{c:"wl",t:"Tata"}];const con=document.getElementById("wabody");if(con){con.innerHTML="";msgs.forEach((m,mi)=>{const el=document.createElement("div");el.className=`wb ${m.c}`;el.textContent=m.t;con.appendChild(el);setTimeout(()=>el.classList.add("wv"),240+mi*390);});}}
    if(i===5){setTimeout(()=>document.getElementById("bff-duo")?.classList.add("bv"),100);setTimeout(()=>document.getElementById("bw1")?.classList.add("bv"),600);setTimeout(()=>document.getElementById("bw2")?.classList.add("bv"),1100);const bgCv=document.getElementById("sc6-canvas");if(bgCv){bgCv.width=innerWidth*devicePixelRatio;bgCv.height=innerHeight*devicePixelRatio;bgCv.style.width=innerWidth+"px";bgCv.style.height=innerHeight+"px";const bx=bgCv.getContext("2d");bx.scale(devicePixelRatio,devicePixelRatio);const W=innerWidth,H=innerHeight;const clouds=[{x:W*.3,y:H*.4,r:W*.35,col:"rgba(100,0,180,.08)"},{x:W*.7,y:H*.6,r:W*.28,col:"rgba(0,100,180,.06)"},{x:W*.5,y:H*.2,r:W*.22,col:"rgba(180,0,100,.05)"}];const stars=Array.from({length:160},()=>({x:Math.random()*W,y:Math.random()*H,r:.2+Math.random()*.8,phase:Math.random()*Math.PI*2,speed:.4+Math.random()*1.2,col:["#fff","#c8b4ff","#b4d8ff","#ffddcc"][~~(Math.random()*4)]}));let nextShoot=1200;const shoots=[];const orbs=Array.from({length:100},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:.4+Math.random()*3,life:Math.random()*Math.PI*2,speed:.003+Math.random()*.008,col:["#c77dff","#ff4d6d","#ffd700","#06d6a0","#ff9f43","#a855f7","#60a5fa","#f472b6"][~~(Math.random()*8)]}));let sc6t=null;(function ptick(ts){if(!sc6t)sc6t=ts;const elapsed=ts-sc6t;bx.fillStyle="rgba(0,0,0,.05)";bx.fillRect(0,0,W,H);clouds.forEach(c=>{const g=bx.createRadialGradient(c.x,c.y,0,c.x,c.y,c.r);g.addColorStop(0,c.col);g.addColorStop(1,"transparent");bx.beginPath();bx.arc(c.x,c.y,c.r,0,Math.PI*2);bx.fillStyle=g;bx.globalAlpha=1;bx.fill();});stars.forEach(s=>{const op=.1+.8*Math.abs(Math.sin(s.phase+elapsed*.001*s.speed));bx.beginPath();bx.arc(s.x,s.y,s.r,0,Math.PI*2);bx.fillStyle=s.col;bx.globalAlpha=op;bx.fill();});if(elapsed>nextShoot&&shoots.length<3){shoots.push({x:Math.random()*W,y:Math.random()*H*.4,vx:3+Math.random()*5,vy:1+Math.random()*2,life:1,len:60+Math.random()*80});nextShoot=elapsed+2000+Math.random()*2000;}shoots.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.life-=.025;if(s.life>0){bx.beginPath();bx.moveTo(s.x,s.y);bx.lineTo(s.x-s.vx*s.len/5,s.y-s.vy*s.len/5);bx.strokeStyle=`rgba(255,255,255,${s.life*.7})`;bx.lineWidth=1.5;bx.shadowColor="#fff";bx.shadowBlur=8;bx.stroke();bx.shadowBlur=0;}});for(let si=shoots.length-1;si>=0;si--)if(shoots[si].life<=0)shoots.splice(si,1);orbs.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life+=p.speed;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;const op=.05+.28*Math.abs(Math.sin(p.life));bx.beginPath();bx.arc(p.x,p.y,p.r,0,Math.PI*2);bx.fillStyle=p.col;bx.globalAlpha=op;bx.shadowColor=p.col;bx.shadowBlur=16;bx.fill();});bx.globalAlpha=1;bx.shadowBlur=0;requestAnimationFrame(ptick);})(0);}
      setTimeout(()=>{const wrap=document.getElementById("sc6-inf-wrap"),cv=document.getElementById("sc6-inf-canvas");if(!cv||!wrap)return;wrap.classList.add("bv");const rect=cv.getBoundingClientRect(),CW=rect.width||320,CH=rect.height||110;cv.width=CW*devicePixelRatio;cv.height=CH*devicePixelRatio;cv.style.width=CW+"px";cv.style.height=CH+"px";const ctx=cv.getContext("2d");ctx.scale(devicePixelRatio,devicePixelRatio);const cx=CW/2,cy=CH/2,a=CW*.29,STEPS=600;function infPt(t){const s=Math.sin(t),c=Math.cos(t),d=1+s*s;return{x:cx+a*c/d,y:cy+a*s*c/d};}const pts=[];for(let i=0;i<=STEPS;i++)pts.push(infPt((i/STEPS)*Math.PI*2));const pathCols=["#c77dff","#ff4d6d","#ff9f43","#ffd700","#06d6a0","#60a5fa","#c77dff"];function easeInOut(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;}const TOTAL_MS=3800;let startT=null;const trail=[],TRAIL_LEN=55;(function drawFrame(ts){if(!startT)startT=ts;const raw=Math.min(1,(ts-startT)/TOTAL_MS),drawn=Math.floor(easeInOut(raw)*STEPS);ctx.clearRect(0,0,CW,CH);[{w:14,a:.04,blur:36},{w:7,a:.14,blur:18},{w:3.5,a:.5,blur:8},{w:1.5,a:.95,blur:2}].forEach(({w,a,blur})=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=w;for(let s=1;s<=drawn;s++){const pct=s/STEPS,ci=Math.floor(pct*(pathCols.length-1));ctx.beginPath();ctx.moveTo(pts[s-1].x,pts[s-1].y);ctx.lineTo(pts[s].x,pts[s].y);ctx.strokeStyle=pathCols[Math.min(ci,pathCols.length-1)];ctx.globalAlpha=a*(0.25+0.75*pct);ctx.shadowColor=pathCols[Math.min(ci,pathCols.length-1)];ctx.shadowBlur=blur;ctx.stroke();}ctx.restore();});if(drawn>0&&drawn<STEPS){const head=pts[drawn],headCol=pathCols[Math.min(Math.floor((drawn/STEPS)*(pathCols.length-1)),pathCols.length-1)];trail.push({...head,col:headCol});if(trail.length>TRAIL_LEN)trail.shift();trail.forEach((tp,ti)=>{const frac=ti/trail.length;ctx.beginPath();ctx.arc(tp.x,tp.y,5.5*frac,0,Math.PI*2);ctx.fillStyle=tp.col;ctx.globalAlpha=frac*.85;ctx.shadowColor=tp.col;ctx.shadowBlur=14;ctx.fill();});ctx.globalAlpha=1;ctx.shadowBlur=0;[18,10,4].forEach((r,ri)=>{const hg=ctx.createRadialGradient(head.x,head.y,0,head.x,head.y,r);hg.addColorStop(0,ri===2?"#fff":"rgba(255,255,255,.9)");hg.addColorStop(.5,headCol);hg.addColorStop(1,"transparent");ctx.beginPath();ctx.arc(head.x,head.y,r,0,Math.PI*2);ctx.fillStyle=hg;ctx.fill();});}if(drawn>=STEPS){(function keepGlow(){ctx.clearRect(0,0,CW,CH);[{w:14,a:.04,blur:36},{w:7,a:.14,blur:18},{w:3.5,a:.5,blur:8},{w:1.5,a:.95,blur:2}].forEach(({w,a,blur})=>{ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.lineWidth=w;for(let s=1;s<=STEPS;s++){const pct=s/STEPS,ci=Math.floor(pct*(pathCols.length-1));ctx.beginPath();ctx.moveTo(pts[s-1].x,pts[s-1].y);ctx.lineTo(pts[s].x,pts[s].y);ctx.strokeStyle=pathCols[Math.min(ci,pathCols.length-1)];ctx.globalAlpha=a*(0.25+0.75*pct);ctx.shadowColor=pathCols[Math.min(ci,pathCols.length-1)];ctx.shadowBlur=blur;ctx.stroke();}ctx.restore();});})();setTimeout(()=>document.getElementById("bcp")?.classList.add("bv"),350);return;}requestAnimationFrame(drawFrame);})(0);},1800);}
  }

  const SCENES=["sc1","sc2","sc3","sc4","sc5","sc6"];
  function goScene(i){
    if(i>=SCENES.length){
      root.style.transition="opacity .9s ease";root.style.opacity="0";
      setTimeout(async()=>{
        root.style.display="none";root.style.opacity="";
        await showCakeScreen();
        playVideo();
      },900);
      return;
    }
    if(i>0){const prev=document.getElementById(SCENES[i-1]);prev.style.transition="opacity .8s ease";prev.style.opacity="0";setTimeout(()=>{prev.classList.remove("in");prev.style.transition="";prev.style.opacity="";},800);}
    setTimeout(()=>{const el=document.getElementById(SCENES[i]);el.style.opacity="0";el.style.transition="";el.classList.add("in");el.style.transition="opacity .8s ease";el.style.opacity="1";animScene(i);const emojis=[["🗺️","📍","✨","🌟","💫"],["🧡","📱","💬","✨"],["🏫","🚪","✨","💡"],["📞","💛","✨","😊"],["💬","🌙","☀️","💛"],["💗","✨","🌟","💜","🎉"]];burst(innerWidth/2,innerHeight*.15,emojis[i]||["✨"]);},i===0?0:150);
    setTimeout(()=>goScene(i+1),DUR[i]);
  }
  goScene(0);
}
