/* ═══════════════════════════════════════
   FLOATING LOVE ICONS
═══════════════════════════════════════ */
function buildFloaties(containerId) {
  const container = document.getElementById(containerId);
  if (!container || container.dataset.built) return;
  container.dataset.built = "1";
  const H = innerHeight;
  const icons = [
    { e: "💗", weight: 8 },
    { e: "💖", weight: 7 },
    { e: "💕", weight: 6 },
    { e: "💓", weight: 5 },
    { e: "❤️", weight: 5 },
    { e: "🌸", weight: 4 },
    { e: "✨", weight: 4 },
    { e: "💌", weight: 3 },
    { e: "🌷", weight: 2 },
    { e: "🥰", weight: 2 },
    { e: "💝", weight: 2 },
    { e: "⭐", weight: 2 },
    { e: "🌺", weight: 1 },
    { e: "💫", weight: 1 },
  ];
  const pool = icons.flatMap(({ e, weight }) => Array(weight).fill(e));
  function pick() {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  for (let i = 0; i < 42; i++) {
    const el = document.createElement("span");
    el.className = "floatie" + (Math.random() > 0.45 ? " sway" : "");
    const sz = 13 + Math.random() * 22,
      dur = 7 + Math.random() * 11,
      delay = -(Math.random() * dur);
    const left = 2 + Math.random() * 96,
      travel = -(H * (0.35 + Math.random() * 0.5));
    const r0 = Math.random() * 30 - 15 + "deg",
      r1 = Math.random() * 30 - 10 + "deg",
      r2 = Math.random() * 40 - 20 + "deg";
    const sx = Math.random() * 32 - 16 + "px",
      peakOp = 0.25 + Math.random() * 0.45;
    el.textContent = pick();
    Object.assign(el.style, { left: left + "%", bottom: -sz + "px", "--sz": sz + "px", "--dur": dur + "s", "--delay": delay + "s", "--travel": travel + "px", "--far": travel * 1.3 + "px", "--r0": r0, "--r1": r1, "--r2": r2, "--sx": sx, "--peak-op": peakOp, animationDelay: delay + "s" });
    el.addEventListener("animationiteration", () => {
      el.textContent = pick();
    });
    container.appendChild(el);
  }
}

/* ═══════════════════════════════════════
   CURSOR + TRAILS
═══════════════════════════════════════ */
let cX = innerWidth / 2,
  cY = innerHeight / 2,
  tT = 0;
const trailE = ["💗", "✨", "🌸", "💖", "⭐", "💫", "🌟"];
const cur = document.getElementById("cursor");
document.addEventListener("mousemove", (e) => {
  cX = e.clientX;
  cY = e.clientY;
  cur.style.left = cX + "px";
  cur.style.top = cY + "px";
  document.getElementById("ambient-glow").style.setProperty("--mx", (cX / innerWidth) * 100 + "%");
  document.getElementById("ambient-glow").style.setProperty("--my", (cY / innerHeight) * 100 + "%");
  if (Date.now() - tT > 60) {
    tT = Date.now();
    trail(cX, cY);
  }
});
document.addEventListener("mousedown", () => cur.classList.add("clicking"));
document.addEventListener("mouseup", () => cur.classList.remove("clicking"));
document.addEventListener(
  "touchmove",
  (e) => {
    const t = e.touches[0];
    cX = t.clientX;
    cY = t.clientY;
    cur.style.left = cX + "px";
    cur.style.top = cY + "px";
    if (Date.now() - tT > 80) {
      tT = Date.now();
      trail(cX, cY, "14px");
    }
  },
  { passive: true },
);
function trail(x, y, sz) {
  const t = document.createElement("div");
  t.className = "cursor-trail";
  t.textContent = trailE[Math.floor(Math.random() * trailE.length)];
  t.style.left = x + "px";
  t.style.top = y + "px";
  t.style.fontSize = sz || 8 + Math.random() * 8 + "px";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 700);
}
function burst(x, y, list) {
  const em = list || ["💗", "✨", "💖", "🌟", "🌸"],
    n = 5 + Math.floor(Math.random() * 4);
  for (let i = 0; i < n; i++) {
    const el = document.createElement("div");
    el.className = "emoji-burst";
    el.textContent = em[Math.floor(Math.random() * em.length)];
    const a = (Math.PI * 2 * i) / n - Math.PI / 2,
      d = 40 + Math.random() * 60;
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.setProperty("--ex", Math.cos(a) * d + "px");
    el.style.setProperty("--ey", Math.sin(a) * d + "px");
    el.style.animationDuration = 0.6 + Math.random() * 0.4 + "s";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}
let tId = null;
function toast(msg, d = 2500) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(tId);
  tId = setTimeout(() => t.classList.remove("show"), d);
}
function prog(p) {
  document.getElementById("progress-bar-wrap").classList.add("visible");
  document.getElementById("progress-bar").style.width = p + "%";
}
function flash(cb, col = "white") {
  const f = document.getElementById("screen-flash");
  f.style.background = col;
  f.style.transition = "opacity .15s";
  f.style.opacity = "1";
  setTimeout(() => {
    f.style.transition = "opacity .4s";
    f.style.opacity = "0";
    if (cb) cb();
  }, 150);
}
function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function fadeHide(el, ms = 500) {
  return new Promise((r) => {
    el.style.transition = `opacity ${ms}ms`;
    el.style.opacity = "0";
    setTimeout(() => {
      el.style.display = "none";
      el.style.opacity = "";
      r();
    }, ms);
  });
}

/* ── START SCREEN ── */
(function () {
  const ss = document.getElementById("start-screen");
  const cv = document.getElementById("start-particles");
  const ctx = cv.getContext("2d");
  cv.width = innerWidth;
  cv.height = innerHeight;
  const emo = ["💗", "✨", "💖", "🌸", "⭐", "💫", "🌟", "💕"];
  const pts = Array.from({ length: 40 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, vy: -(0.3 + Math.random() * 0.7), vx: (Math.random() - 0.5) * 0.4, sz: 10 + Math.random() * 16, e: emo[Math.floor(Math.random() * emo.length)], op: Math.random(), od: Math.random() > 0.5 ? 0.01 : -0.01 }));
  let raf;
  (function draw() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    pts.forEach((p) => {
      p.y += p.vy;
      p.x += p.vx;
      p.op += p.od;
      if (p.op >= 1 || p.op <= 0) p.od *= -1;
      if (p.y < -30) {
        p.y = cv.height + 10;
        p.x = Math.random() * cv.width;
      }
      ctx.globalAlpha = p.op * 0.6;
      ctx.font = `${p.sz}px serif`;
      ctx.fillText(p.e, p.x, p.y);
    });
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(draw);
  })();

  function onTap(){
    cancelAnimationFrame(raf);

    const bgm=document.getElementById("main-audio");
    bgm.volume=0.85;

    const introSc=document.getElementById("intro-screen");
    const vid=document.getElementById("intro-video");

    bgm.play().then(()=>{
      console.log("✅ BGM playing");
      // Audio unlocked — start everything normally
      introSc.style.display="flex";
      vid.muted=true;vid.play().catch(()=>{});
      burst(innerWidth/2,innerHeight/2,["💖","✨","💗","🌟","🌸","💫"]);
      ss.style.transition="opacity .5s";ss.style.opacity="0";
      setTimeout(()=>{ss.style.display="none";},500);
      prog(5);
      runFlow(vid,introSc);
    }).catch((err)=>{
      console.log("❌ BGM error:",err.name, err.message);
      // Show overlay — nothing starts until user taps
      const overlay=document.createElement("div");
      overlay.style.cssText="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.85);flex-direction:column;gap:16px;cursor:pointer";
      overlay.innerHTML='<div style="font-size:60px">🌹</div><div style="font-family:Pacifico,cursive;font-size:22px;color:#fff;text-align:center;padding:0 24px">Veldamaaaaaa 🫴🏻</div>';
      document.body.appendChild(overlay);
      overlay.addEventListener("click",()=>{
        overlay.remove();
        bgm.play().catch(()=>{});
        // Now start video + flow after overlay tap
        introSc.style.display="flex";
        vid.muted=true;vid.play().catch(()=>{});
        burst(innerWidth/2,innerHeight/2,["💖","✨","💗","🌟","🌸","💫"]);
        ss.style.transition="opacity .5s";ss.style.opacity="0";
        setTimeout(()=>{ss.style.display="none";},500);
        prog(5);
        runFlow(vid,introSc);
      },{once:true});
    });
  }

  document.getElementById("start-btn").addEventListener("click",onTap,{once:true});
  document.getElementById("start-btn").addEventListener("touchstart",e=>{e.preventDefault();onTap();},{once:true,passive:false});
})();

async function runFlow(vid, introSc) {
  await new Promise((res) => {
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        res();
      }
    };
    vid.addEventListener("ended", go, { once: true });
    setTimeout(go, 12000);
  });
  await fadeHide(introSc, 400);
  prog(12);
  buildHate();
  const hEl = document.getElementById("hate-screen");
  hEl.style.display = "flex";
  await wait(7000);
  await exitHate(hEl);
  prog(22);
  await doCountdown1();
  prog(35);

  const lSc = document.getElementById("letter-screen");
  const lCard = document.getElementById("letter-card");
  buildFloaties("letter-floaties");
  lSc.style.opacity = "0";
  lSc.style.display = "flex";
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  lSc.style.transition = "opacity 400ms";
  lSc.style.opacity = "1";
  lCard.classList.add("show");
  toast("💌", 3000);
  prog(42);
  await typewrite(["lp1", "lp2", "lp3"], 27, 280);
  await wait(2600);

  const pg1 = document.getElementById("lpage-1"),
    pg2 = document.getElementById("lpage-2");
  const p2texts = { lp4: "Eppatiki gurtunchukunta - mee navvu, mee chupu, mee maatalu , mee kopam , annitikanna ekkuva meeku naa pi unna abhimanam .", lp5: "Prathi roju nenu lechaka alochinche modati vyakthi, padukunemundu alochince akari vyakthi.. mereee okosari kallalo kuda 🙃🙃🙃. 💕", lp6: "Ilage inka chala chala chala Birthdays jarupukovali.. jarupukuntaru, I hate youuuuu. 🥂" };
  ["lp4", "lp5", "lp6", "lc-sign"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
  lCard.style.transition = "opacity 0.25s ease";
  lCard.style.opacity = "0";
  await wait(260);
  pg1.classList.remove("active");
  pg2.classList.add("active");
  document.getElementById("dot-1").classList.remove("active");
  document.getElementById("dot-2").classList.add("active");
  const pp = document.getElementById("btn-prev"),
    np = document.getElementById("btn-next");
  pp.style.opacity = "1";
  pp.style.pointerEvents = "auto";
  np.style.opacity = "0";
  np.style.pointerEvents = "none";
  void lCard.offsetWidth;
  lCard.style.transition = "opacity 0.3s ease";
  lCard.style.opacity = "1";
  await wait(320);
  toast("💕", 2000);
  prog(55);
  await typewrite(["lp4", "lp5", "lp6"], 21, 250, p2texts);
  await wait(300);
  await typewriteInto("lc-sign", "Appudu Ippudu Eppudu , Mee Pottyyyyyy 💖", 28);
  prog(65);
  await wait(400);
  fadeHide(lSc, 300);
  await wait(300);
  prog(68);
  flash(null, "#ff4d6d33");
  prog(78);
  await showBirthdayCard();
  prog(90);
  await surprise();
  prog(93);
  launchVideo();
}

function typewriteInto(elId, text, msPerChar = 28) {
  return new Promise((res) => {
    const el = document.getElementById(elId);
    if (!el) {
      res();
      return;
    }
    el.innerHTML = "";
    [...text].forEach((ch, i) => {
      const sp = document.createElement("span");
      sp.className = "char";
      sp.textContent = ch;
      setTimeout(() => sp.classList.add("vis"), i * msPerChar);
      el.appendChild(sp);
    });
    setTimeout(res, text.length * msPerChar + 60);
  });
}

function showBirthdayCard() {
  return new Promise((res) => {
    const fs = document.getElementById("final-screen");
    fs.classList.add("active");
    flash(null, "#ff4d6d55");
    startAurora();
    startPetals();
    startFireworks();
    spawnConfetti();
    [
      ["final-cake", 200],
      ["final-title", 600],
      ["final-name", 1100],
      ["final-divider", 1600],
      ["final-message", 1900],
      ["final-emojis", 2300],
    ].forEach(([id, d]) => setTimeout(() => document.getElementById(id)?.classList.add("show"), d));
    const cc = ["#ff4d6d", "#ff9f43", "#ffd700", "#a29bfe", "#00cec9", "#fd79a8", "#fff"];
    for (let i = 0; i < 180; i++)
      setTimeout(() => {
        const el = document.createElement("div");
        el.style.cssText = `position:fixed;top:-20px;left:${Math.random() * 100}vw;width:${5 + Math.random() * 9}px;height:${5 + Math.random() * 9}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};background:${cc[~~(Math.random() * cc.length)]};animation:confettiFall ${2.5 + Math.random() * 3}s linear forwards;animation-delay:${Math.random() * 2}s;z-index:175;pointer-events:none`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 6000);
      }, i * 18);
    toast("🎂 Happy Birthday Kuttulu!! 💖", 3000);
    setTimeout(() => {
      fs.style.transition = "opacity .8s ease";
      fs.style.opacity = "0";
      setTimeout(() => {
        fs.classList.remove("active");
        fs.style.transition = "";
        fs.style.opacity = "";
        ["final-cake", "final-title", "final-name", "final-divider", "final-message", "final-emojis"].forEach((id) => document.getElementById(id)?.classList.remove("show"));
        res();
      }, 800);
    }, 12000);
  });
}

const HC = ["#ff4d6d", "#ff9f43", "#ffd700", "#a29bfe", "#00cec9", "#fd79a8"];
function buildHate() {
  const hs = document.getElementById("hate-screen");
  hs.innerHTML = "";
  const W = innerWidth,
    H = innerHeight,
    rows = 10,
    rh = H / rows;
  const fs = Math.floor(rh * 0.78),
    pv = Math.floor(rh * 0.05),
    ph = Math.floor(fs * 0.18);
  const wpw = Math.ceil((W * 2) / (fs * 5.8)) + 4;
  for (let r = 0; r < rows; r++) {
    const row = document.createElement("div");
    row.className = "hate-row " + (r % 2 === 0 ? "go-left" : "go-right");
    row.style.height = rh + "px";
    row.style.minHeight = rh + "px";
    const dur = 3.5 + r * 0.18 + "s";
    row.style.animationDuration = dur;
    for (let pass = 0; pass < 2; pass++) {
      for (let w = 0; w < wpw; w++) {
        const sp = document.createElement("span");
        sp.className = "hate-word";
        sp.textContent = "i hate you";
        sp.style.fontSize = fs + "px";
        sp.style.padding = `${pv}px ${ph}px`;
        sp.style.color = HC[(r * 3 + w) % HC.length];
        sp.style.animationDuration = 0.5 + Math.random() * 0.5 + "s";
        sp.style.animationDelay = Math.random() * 0.5 + "s";
        row.appendChild(sp);
      }
    }
    hs.appendChild(row);
  }
  const glitch = document.createElement("div");
  glitch.id = "hate-glitch";
  hs.appendChild(glitch);
  [400, 900, 1500, 2200, 3100, 4000, 4800, 5600, 6200, 6700].forEach((t) => {
    setTimeout(() => {
      glitch.style.animation = "none";
      void glitch.offsetWidth;
      glitch.style.animation = `glitchFlash ${60 + Math.random() * 80}ms ease`;
    }, t);
  });
}

function exitHate(hs) {
  return new Promise((res) => {
    document.querySelectorAll(".hate-word").forEach((el, i) => {
      setTimeout(() => {
        el.style.transition = "all .15s ease";
        el.style.transform = "scale(1.3)";
        el.style.filter = "brightness(3)";
        setTimeout(() => {
          el.textContent = "kutty";
          el.style.color = "#ff9f43";
          el.style.filter = "brightness(1.4) drop-shadow(0 0 8px #ff9f43)";
          el.style.transform = "scale(1)";
          el.style.transition = "all .2s cubic-bezier(.34,1.56,.64,1)";
          setTimeout(() => {
            el.style.transition = "opacity .25s ease, transform .25s ease";
            el.style.opacity = "0";
            el.style.transform = "scale(0.6) translateY(-10px)";
          }, 180);
        }, 120);
      }, i * 2);
    });
    flash(null, "#ff9f4333");
    setTimeout(() => {
      hs.style.display = "none";
      res();
    }, 700);
  });
}

function doCountdown1() {
  return new Promise((res) => {
    const cs = document.getElementById("countdown-screen"),
      cn = document.getElementById("countdown-number"),
      cv = document.getElementById("countdown-particles");
    cs.style.display = "flex";
    cv.width = innerWidth;
    cv.height = innerHeight;
    const ctx = cv.getContext("2d");

    // ── continuous star/particle field ──
    const starCols = ["#ffd700", "#ff9f43", "#ff4d6d", "#ffb3c6", "#fff0a0", "#ff85a1", "#ffd6e7", "#ffffff"];
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: 0.4 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.15 + Math.random() * 0.55),
      op: Math.random(),
      od: Math.random() > 0.5 ? 0.008 : -0.008,
      col: starCols[~~(Math.random() * starCols.length)],
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
    }));

    // sparkle bursts (bigger glitter dots)
    const glitters = Array.from({ length: 28 }, () => ({
      x: Math.random() * cv.width,
      y: Math.random() * cv.height,
      r: 1.5 + Math.random() * 3.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.025 + Math.random() * 0.04,
      col: Math.random() > 0.5 ? "#ffd700" : "#ff4d6d",
    }));

    const burstPts = [];
    let raf;
    function addB(c) {
      for (let i = 0; i < 18; i++) {
        const a = Math.random() * Math.PI * 2,
          s = 1 + Math.random() * 3;
        burstPts.push({ x: cv.width / 2, y: cv.height / 2, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: 0.018 + Math.random() * 0.015, r: 2 + Math.random() * 4, c });
      }
    }

    function tick() {
      // dark translucent wipe for trail effect
      ctx.fillStyle = "rgba(10,10,10,0.18)";
      ctx.fillRect(0, 0, cv.width, cv.height);

      // stars
      stars.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.twinkle += s.twinkleSpeed;
        s.op += s.od;
        if (s.op >= 0.85 || s.op <= 0.05) s.od *= -1;
        if (s.y < -10) {
          s.y = cv.height + 10;
          s.x = Math.random() * cv.width;
        }
        if (s.x < -10) s.x = cv.width + 10;
        if (s.x > cv.width + 10) s.x = -10;
        const twinkleOp = s.op * (0.5 + 0.5 * Math.abs(Math.sin(s.twinkle)));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.col;
        ctx.globalAlpha = twinkleOp;
        ctx.fill();
      });

      // glitter sparkles (cross/plus shape)
      glitters.forEach((g) => {
        g.phase += g.speed;
        const op = 0.3 + 0.7 * Math.abs(Math.sin(g.phase));
        const sz = g.r * (0.6 + 0.4 * Math.abs(Math.sin(g.phase)));
        ctx.globalAlpha = op;
        ctx.strokeStyle = g.col;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(g.x - sz, g.y);
        ctx.lineTo(g.x + sz, g.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(g.x, g.y - sz);
        ctx.lineTo(g.x, g.y + sz);
        ctx.stroke();
      });

      // burst particles
      ctx.globalAlpha = 1;
      for (let i = burstPts.length - 1; i >= 0; i--) {
        const p = burstPts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04;
        p.life -= p.decay;
        if (p.life <= 0) {
          burstPts.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.c +
          Math.floor(p.life * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    }
    tick();

    const phrases = [
      { t: "8766 Days", c: "#ff4d6d" },
      { t: "1252 Weeks", c: "#ff9f43" },
      { t: "288 Months", c: "#ffd700" },
      { t: "24 Years", c: "#06d6a0" },
      { t: "Ilane navvutu navvistu kshamistu premisthu  🙃", c: "#ff9f43" },
      { t: "Life long Happy ga undali.. untaru ✨", c: "#ffd700" },
      { t: "24/101 ✅", c: "#00cec9" },
    ];
    const burstColors = ["#ff4d6d", "#ff9f43", "#ffd700", "#c77dff", "#06d6a0", "#00cec9"];
    let idx = 0;
    function showPhrase() {
      if (idx >= phrases.length) {
        addB("#ffd700");
        cn.style.color = "";
        cn.textContent = "😏";
        cn.className = "";
        void cn.offsetWidth;
        cn.classList.add("show");
        setTimeout(() => {
          cn.classList.add("hide");
          cancelAnimationFrame(raf);
          cs.style.transition = "opacity 400ms";
          cs.style.opacity = "0";
          setTimeout(() => {
            cs.style.display = "none";
            cs.style.opacity = "";
            res();
          }, 400);
        }, 200);
        return;
      }
      const ph = phrases[idx];
      addB(burstColors[idx % burstColors.length]);
      cn.style.color = ph.c;
      cn.style.webkitTextFillColor = ph.c;
      cn.style.backgroundImage = "none";
      cn.textContent = ph.t;
      cn.className = "";
      void cn.offsetWidth;
      cn.classList.add("show");
      setTimeout(() => {
        cn.classList.add("hide");
        idx++;
        setTimeout(showPhrase, 500);
      }, 1400);
    }
    showPhrase();
  });
}

function typewrite(ids, ms, gap, textMap) {
  ms = ms || 27;
  gap = gap || 120;
  return new Promise((res) => {
    var texts = {};
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      texts[id] = textMap ? textMap[id] || "" : el.textContent;
      el.innerHTML = "";
    });
    var delay = 80,
      total = 0;
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var txt = texts[id] || "";
      Array.from(txt).forEach(function (ch, ci) {
        var sp = document.createElement("span");
        sp.className = "char";
        sp.textContent = ch;
        var d = delay + ci * ms;
        setTimeout(function () {
          sp.classList.add("vis");
        }, d);
        el.appendChild(sp);
      });
      var end = delay + txt.length * ms;
      if (end > total) total = end;
      delay += txt.length * ms + gap;
    });
    setTimeout(res, total + 80);
  });
}

let curLP = 1;
function goPage(p) {
  if (p === curLP) return;
  const prev = document.getElementById("lpage-" + curLP);
  prev.style.transition = "opacity .2s,transform .2s";
  prev.style.opacity = "0";
  prev.style.transform = p > curLP ? "translateX(-20px)" : "translateX(20px)";
  setTimeout(() => {
    prev.classList.remove("active");
    prev.style.opacity = "";
    prev.style.transform = "";
    curLP = p;
    const nxt = document.getElementById("lpage-" + curLP);
    nxt.style.opacity = "0";
    nxt.style.transform = "translateX(20px)";
    nxt.classList.add("active");
    requestAnimationFrame(() => {
      nxt.style.transition = "opacity .3s,transform .3s";
      nxt.style.opacity = "1";
      nxt.style.transform = "translateX(0)";
    });
    document.getElementById("dot-1").classList.toggle("active", curLP === 1);
    document.getElementById("dot-2").classList.toggle("active", curLP === 2);
    const pp = document.getElementById("btn-prev"),
      np = document.getElementById("btn-next");
    pp.style.opacity = curLP === 1 ? "0" : "1";
    pp.style.pointerEvents = curLP === 1 ? "none" : "auto";
    np.style.opacity = curLP === 2 ? "0" : "1";
    np.style.pointerEvents = curLP === 2 ? "none" : "auto";
  }, 200);
}
document.getElementById("btn-next").addEventListener("click", () => goPage(2));
document.getElementById("btn-prev").addEventListener("click", () => goPage(1));
let swX = 0;
document.addEventListener("touchstart", (e) => (swX = e.touches[0].clientX), { passive: true });
document.addEventListener(
  "touchend",
  (e) => {
    if (!document.getElementById("letter-card").classList.contains("show")) return;
    const d = swX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) {
      d > 0 ? goPage(2) : goPage(1);
    }
  },
  { passive: true },
);

function surprise() {
  return new Promise((res) => {
    const ss = document.getElementById("surprise-screen"),
      inn = document.getElementById("surprise-inner"),
      thread = document.getElementById("chat-thread");
    ss.style.display = "flex";
    setTimeout(() => {
      inn.classList.add("show");
      toast("👊", 5000);
    }, 200);
    function sendMsg(side, name, text, delay) {
      return new Promise((r) => {
        setTimeout(() => {
          const cb = document.createElement("div");
          cb.className = "cb " + side;
          const nameEl = document.createElement("div");
          nameEl.className = "cb-name";
          nameEl.textContent = name;
          const typingEl = document.createElement("div");
          typingEl.className = "cb-typing";
          typingEl.innerHTML = '<div class="cd"></div><div class="cd"></div><div class="cd"></div>';
          cb.appendChild(nameEl);
          cb.appendChild(typingEl);
          thread.appendChild(cb);
          requestAnimationFrame(() => requestAnimationFrame(() => cb.classList.add("show")));
          setTimeout(() => {
            typingEl.remove();
            const textEl = document.createElement("div");
            textEl.className = "cb-text";
            textEl.textContent = text;
            cb.appendChild(textEl);
            burst(side === "left" ? 80 : innerWidth - 80, thread.getBoundingClientRect().bottom - 20, side === "left" ? ["👀", "💬", "✨"] : ["😏", "💜", "✨"]);
            r();
          }, 700);
        }, delay);
      });
    }
    (async () => {
      await wait(500);
      await sendMsg("left", "K", "Enti idi? 👀", 300);
      await sendMsg("right", "P", "Open chesi chudu 😏🎁", 300);
      await sendMsg("right", "P", "Hmmmm 😌", 300);
      await sendMsg("left", "K", "Hmmm 🤔", 300);
      await sendMsg("right", "P", "Bye 👋💜", 300);
    })();
    let done=false;const go=()=>{if(!done){done=true;res();}};
    setTimeout(go,8000);
  });
}

function launchVideo() {
  const ss = document.getElementById("surprise-screen");
  fadeHide(ss, 400);
  prog(92);
  setTimeout(() => {
    const gos = document.getElementById("gift-open-screen");
    gos.style.display = "flex";
    const gc = document.getElementById("gift-bg-canvas");
    gc.width = innerWidth;
    gc.height = innerHeight;
    const gctx = gc.getContext("2d");
    const gparts = [];
    let graf;
    const rings = [];
    let ringTimer = 0;
    function addRing() {
      rings.push({ r: 0, maxR: Math.min(innerWidth, innerHeight) * 0.55, op: 0.6, col: `hsl(${280 + Math.random() * 60},80%,65%)` });
    }
    addRing();
    function addSparkle() {
      for (let i = 0; i < 3; i++) {
        const cx = innerWidth / 2,
          cy = innerHeight * 0.44;
        const a = Math.random() * Math.PI * 2,
          sp = 0.3 + Math.random() * 1.6;
        const hue = Math.random() > 0.5 ? 35 + Math.random() * 30 : 280 + Math.random() * 60;
        gparts.push({ x: cx + (Math.random() - 0.5) * 100, y: cy + (Math.random() - 0.5) * 70, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.4, life: 1, decay: 0.006 + Math.random() * 0.008, r: 1 + Math.random() * 3.5, h: hue });
      }
    }
    const stars = Array.from({ length: 60 }, () => ({ x: Math.random() * gc.width, y: Math.random() * gc.height, r: 0.3 + Math.random() * 0.8, phase: Math.random() * Math.PI * 2 }));
    (function gtick(ts) {
      gctx.fillStyle = "rgba(0,0,0,.08)";
      gctx.fillRect(0, 0, gc.width, gc.height);
      stars.forEach((s) => {
        s.phase += 0.025;
        const op = 0.05 + 0.15 * Math.abs(Math.sin(s.phase));
        gctx.beginPath();
        gctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        gctx.fillStyle = `rgba(255,255,255,${op})`;
        gctx.fill();
      });
      ringTimer++;
      if (ringTimer % 90 === 0) addRing();
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i];
        rg.r += 2.2;
        rg.op -= 0.008;
        if (rg.op <= 0) {
          rings.splice(i, 1);
          continue;
        }
        gctx.beginPath();
        gctx.arc(innerWidth / 2, innerHeight * 0.44, rg.r, 0, Math.PI * 2);
        gctx.strokeStyle = rg.col;
        gctx.globalAlpha = rg.op;
        gctx.lineWidth = 1.5;
        gctx.stroke();
        gctx.globalAlpha = 1;
      }
      const auraGrad = gctx.createRadialGradient(innerWidth / 2, innerHeight * 0.44, 0, innerWidth / 2, innerHeight * 0.44, Math.min(innerWidth, innerHeight) * 0.28);
      auraGrad.addColorStop(0, `rgba(180,80,255,${0.06 + 0.04 * Math.sin((ts || 0) * 0.002)})`);
      auraGrad.addColorStop(0.5, `rgba(255,100,200,${0.03 + 0.02 * Math.cos((ts || 0) * 0.003)})`);
      auraGrad.addColorStop(1, "transparent");
      gctx.fillStyle = auraGrad;
      gctx.fillRect(0, 0, gc.width, gc.height);
      addSparkle();
      for (let i = gparts.length - 1; i >= 0; i--) {
        const p = gparts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.025;
        p.life -= p.decay;
        if (p.life <= 0) {
          gparts.splice(i, 1);
          continue;
        }
        gctx.beginPath();
        gctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        gctx.fillStyle = `hsla(${p.h},100%,72%,${p.life * 0.55})`;
        gctx.shadowColor = `hsla(${p.h},100%,72%,1)`;
        gctx.shadowBlur = 6;
        gctx.fill();
        gctx.shadowBlur = 0;
      }
      graf = requestAnimationFrame(gtick);
    })();
    const wrap = document.getElementById("gbox-wrap");
    wrap.style.animation = "boxSway 2.5s ease-in-out infinite";
    const swaySt = document.createElement("style");
    swaySt.textContent = "@keyframes boxSway{0%{transform:rotate(-2deg) scale(1) translateY(0)}25%{transform:rotate(1.5deg) scale(1.03) translateY(-6px)}50%{transform:rotate(-1deg) scale(1.01) translateY(-2px)}75%{transform:rotate(2deg) scale(1.04) translateY(-8px)}100%{transform:rotate(-2deg) scale(1) translateY(0)}}";
    document.head.appendChild(swaySt);
    const hint = document.getElementById("gift-hint");
    let secs = 3;
    if (hint) hint.textContent = secs;
    const countInterval = setInterval(() => {
      secs--;
      if (hint) {
        hint.textContent = secs;
        hint.style.transform = "scale(1.35)";
        setTimeout(() => {
          if (hint) hint.style.transform = "scale(1)";
        }, 120);
      }
      if (secs <= 0) clearInterval(countInterval);
    }, 1000);
    let unwrapped = false;
    function doUnwrap() {
      if (unwrapped) return;
      unwrapped = true;
      cancelAnimationFrame(graf);
      wrap.style.animation = "none";
      wrap.style.transition = "transform .08s ease-in-out";
      let shk = 0;
      const shakeIt = setInterval(() => {
        shk++;
        wrap.style.transform = shk % 2 === 0 ? "rotate(-8deg) scale(1.05)" : "rotate(8deg) scale(1.05)";
        if (shk >= 6) {
          clearInterval(shakeIt);
          wrap.style.transform = "";
        }
      }, 70);
      setTimeout(() => {
        document.getElementById("gbox-bow")?.classList.add("fly");
      }, 600);
      setTimeout(() => {
        document.querySelectorAll(".wrap-strip").forEach((s, si) => {
          setTimeout(() => s.classList.add("torn"), si * 80);
        });
      }, 950);
      setTimeout(() => {
        document.getElementById("gbox-lid")?.classList.add("open");
        document.getElementById("box-inner-glow")?.classList.add("lit");
      }, 1500);
      setTimeout(() => {
        const f = document.getElementById("screen-flash");
        f.style.transition = "none";
        f.style.background = "#fff8e1";
        f.style.opacity = "1";
        void f.offsetWidth;
        f.style.transition = "opacity 1s ease";
        f.style.opacity = "0";
        gos.style.display = "none";
        startStoryReel();
      }, 3200);
    }
    setTimeout(doUnwrap, 3000);
  }, 400);
}

/* ══════════════════════════════════════
   CAKE SCREEN
══════════════════════════════════════ */
const NUM_CANDLES = 24;

function showCakeScreen(){
  return new Promise(res=>{
    const cs=document.getElementById('cake-screen');
    cs.style.display='flex';
    buildFloaties('cake-floaties');

    const pcv=document.getElementById('cake-particles');
    pcv.width=innerWidth*devicePixelRatio;pcv.height=innerHeight*devicePixelRatio;
    pcv.style.width=innerWidth+'px';pcv.style.height=innerHeight+'px';
    const pctx=pcv.getContext('2d');pctx.scale(devicePixelRatio,devicePixelRatio);

    setTimeout(()=>document.getElementById('cake-title').classList.add('show'),300);
    setTimeout(()=>document.getElementById('blow-btn-wrap').classList.add('show'),1000);

    const flame=document.getElementById('cake-flame');
    const badge=document.getElementById('candle-count-badge');
    const btn=document.getElementById('blow-btn');
    const ringFill=document.getElementById('blow-ring-fill');
    const circumference=2*Math.PI*72;
    let holding=false,holdInterval=null,holdProgress=0,blowDone=false;
    const TOTAL_MS=3000; // 3 seconds to blow
    const TICK_MS=50;
    const BLOW_RATE=TICK_MS/TOTAL_MS;

    function startHold(){
      if(blowDone)return;
      holding=true;btn.classList.add('holding');
      document.getElementById('blow-icon').style.transform='scale(1.2)';
      document.getElementById('blow-hint').style.opacity='0.3';
      holdInterval=setInterval(()=>{
        if(!holding)return;
        holdProgress+=BLOW_RATE;
        const dl=Math.min(holdProgress,1)*circumference;
        ringFill.style.strokeDasharray=`${dl} ${circumference}`;
        if(holdProgress>=1){
          blowDone=true;
          stopHold();
          onBlown();
        }
      },TICK_MS);
    }

    function stopHold(){
      holding=false;btn.classList.remove('holding');
      clearInterval(holdInterval);holdInterval=null;
      if(!blowDone){
        holdProgress=0;
        ringFill.style.strokeDasharray=`0 ${circumference}`;
      }
      document.getElementById('blow-icon').style.transform='';
      if(!blowDone)document.getElementById('blow-hint').style.opacity='';
    }

    btn.addEventListener('mousedown',e=>{e.preventDefault();startHold();});
    document.addEventListener('mouseup',()=>{if(holding)stopHold();});
    btn.addEventListener('touchstart',e=>{e.preventDefault();startHold();},{passive:false});
    document.addEventListener('touchend',()=>{if(holding)stopHold();},{passive:true});
    document.addEventListener('touchcancel',()=>{if(holding)stopHold();},{passive:true});

    function onBlown(){
      // blow out flame
      if(flame)flame.classList.add('out');
      if(badge)badge.textContent='🎂';
      document.getElementById('cake-candle-glow').style.opacity='0';
      // sparks
      for(let i=0;i<10;i++)setTimeout(()=>burst(Math.random()*innerWidth,Math.random()*innerHeight*.7,['🎂','✨','💖','🌟','🎉','💫','🎊']),i*100);
      document.getElementById('blow-btn-wrap').style.transition='opacity .4s';
      document.getElementById('blow-btn-wrap').style.opacity='0';
      document.getElementById('blow-celebration').classList.add('show');
      toast('I HATE YOUUU 💖',3000);
      setTimeout(()=>{
        cs.style.transition='opacity .8s ease';cs.style.opacity='0';
        setTimeout(()=>{cs.style.display='none';cs.style.opacity='';res();},800);
      },3000);
    }
  });
}

/* ══════════════════════════════════════
   VIDEO PLAYBACK
══════════════════════════════════════ */


function spawnConfetti() {
  const cc = ["#ff4d6d", "#ff9f43", "#ffd700", "#a29bfe", "#00cec9", "#fd79a8", "#fff"];
  for (let i = 0; i < 150; i++)
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.cssText = `left:${Math.random() * 100}vw;background:${cc[Math.floor(Math.random() * cc.length)]};width:${6 + Math.random() * 10}px;height:${6 + Math.random() * 10}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};animation-duration:${2 + Math.random() * 3}s;animation-delay:${Math.random() * 2}s`;
      document.getElementById("final-screen").appendChild(el);
    }, i * 20);
}

function finalScreen() {
  const fs = document.getElementById("final-screen");
  fs.classList.add("active");
  flash(null, "#ff4d6d55");
  prog(100);

  // stagger heavy animations so they don't all hit at once
  setTimeout(()=>startAurora(), 0);
  setTimeout(()=>startPetals(), 300);
  setTimeout(()=>startFireworks(), 600);

  [
    ["final-cake", 200],
    ["final-title", 600],
    ["final-name", 1100],
    ["final-divider", 1600],
    ["final-message", 1900],
    ["final-emojis", 2300],
  ].forEach(([id, d]) => setTimeout(() => document.getElementById(id).classList.add("show"), d));

  // stagger confetti in smaller batches after 600ms delay
  const cc = ["#ff4d6d", "#ff9f43", "#ffd700", "#a29bfe", "#00cec9", "#fd79a8", "#fff"];
  for (let i = 0; i < 200; i++)
    setTimeout(() => {
      const el = document.createElement("div");
      el.style.cssText = `position:fixed;top:-20px;left:${Math.random() * 100}vw;width:${5 + Math.random() * 9}px;height:${5 + Math.random() * 9}px;border-radius:${Math.random() > 0.5 ? "50%" : "2px"};background:${cc[Math.floor(Math.random() * cc.length)]};animation:confettiFall ${2.5 + Math.random() * 3}s linear forwards;animation-delay:${Math.random() * 2}s;z-index:175;pointer-events:none`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 6000);
    }, 600 + i * 18);

  setTimeout(() => {
    [
      [80, 80],
      [innerWidth - 80, 80],
      [80, innerHeight - 80],
      [innerWidth - 80, innerHeight - 80],
    ].forEach(([x, y], i) => setTimeout(() => burst(x, y, ["💖", "🌟", "✨", "🎉", "🌸", "💗"]), i * 200));
  }, 1200);

  setInterval(() => burst(80 + Math.random() * (innerWidth - 160), 80 + Math.random() * (innerHeight - 160), ["💗", "✨", "💖", "🌟", "🎊", "🌸"]), 3500);
  toast("👊👊👊👊👊", 6000);
}

function startAurora() {
  const cv = document.getElementById("aurora-canvas");
  cv.width = innerWidth;
  cv.height = innerHeight;
  const ctx = cv.getContext("2d");
  let t = 0;
  const bl = [
    { x: 0.2, y: 0.4, r: 0.55, h: 320, s: 0.0007 },
    { x: 0.7, y: 0.3, r: 0.5, h: 15, s: 0.0009 },
    { x: 0.5, y: 0.7, r: 0.6, h: 280, s: 0.0006 },
    { x: 0.85, y: 0.65, r: 0.45, h: 45, s: 0.0011 },
    { x: 0.15, y: 0.75, r: 0.4, h: 350, s: 0.0008 },
  ];
  (function d() {
    ctx.fillStyle = "#08000e";
    ctx.fillRect(0, 0, cv.width, cv.height);
    bl.forEach((b) => {
      const cx = (b.x + Math.sin(t * b.s * 1000 + b.h) * 0.18) * cv.width,
        cy = (b.y + Math.cos(t * b.s * 1000 + b.h) * 0.14) * cv.height,
        r = b.r * Math.max(cv.width, cv.height) * (0.55 + Math.sin(t * b.s * 500) * 0.12),
        al = 0.18 + Math.sin(t * b.s * 800) * 0.08;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `hsla(${b.h + Math.sin(t * 0.001) * 30},90%,65%,${al})`);
      g.addColorStop(0.5, `hsla(${b.h + 60},80%,50%,${al * 0.5})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, cv.width, cv.height);
    });
    t += 16;
    requestAnimationFrame(d);
  })();
}

function startPetals() {
  const c = document.getElementById("final-petals"),
    pe = ["🌸", "🌺", "✨", "💗", "🌷", "💖", "🌼", "⭐", "💫", "🌹"];
  function one() {
    const el = document.createElement("div");
    el.className = "petal";
    el.textContent = pe[Math.floor(Math.random() * pe.length)];
    el.style.left = Math.random() * 110 - 5 + "vw";
    el.style.fontSize = 12 + Math.random() * 18 + "px";
    el.style.setProperty("--drift", (Math.random() - 0.5) * 200 + "px");
    el.style.animationDuration = 6 + Math.random() * 9 + "s";
    el.style.animationDelay = Math.random() * 3 + "s";
    c.appendChild(el);
    setTimeout(() => el.remove(), 20000);
  }
  for (let i = 0; i < 25; i++) setTimeout(one, i * 200);
  setInterval(one, 600);
}

function startFireworks() {
  const cv = document.getElementById("firework-canvas");
  cv.width = innerWidth;
  cv.height = innerHeight;
  const ctx = cv.getContext("2d"),
    sp = [];
  const fc = ["#ff4d6d", "#ff9f43", "#ffd700", "#a29bfe", "#fd79a8", "#00cec9", "#fff"];
  function launch() {
    const x = 100 + Math.random() * (cv.width - 200),
      y = 60 + Math.random() * (cv.height * 0.55),
      col = fc[Math.floor(Math.random() * fc.length)],
      n = 28 + Math.floor(Math.random() * 20);
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n,
        s = 2.5 + Math.random() * 4.5;
      sp.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, col, r: 2 + Math.random() * 2.5, tr: [] });
    }
    burst(x, y, ["✨", "💥", "🌟", "💖"]);
  }
  (function tick() {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#08000e";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.globalAlpha = 1;
    for (let i = sp.length - 1; i >= 0; i--) {
      const s = sp[i];
      s.tr.push({ x: s.x, y: s.y });
      if (s.tr.length > 6) s.tr.shift();
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.09;
      s.vx *= 0.97;
      s.life -= 0.018;
      if (s.life <= 0) {
        sp.splice(i, 1);
        continue;
      }
      s.tr.forEach((p, ti) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, s.r * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = s.col;
        ctx.globalAlpha = (ti / s.tr.length) * s.life * 0.5;
        ctx.fill();
      });
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.col;
      ctx.globalAlpha = s.life;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    requestAnimationFrame(tick);
  })();
  launch();
  setTimeout(launch, 600);
  setTimeout(launch, 1200);
  setInterval(launch, 2200);
}

/* ─── STORY REEL ─── */
function startStoryReel() {
  const root = document.getElementById("story-screen");
  root.style.display = "block";
  prog(95);
  const DUR = [5500, 4500, 4500, 4200, 4800, 9500];
  const total = DUR.reduce((a, b) => a + b, 0);
  const sl = document.getElementById("sline");
  if (sl) {
    sl.style.transition = `width ${total}ms linear`;
    requestAnimationFrame(() => requestAnimationFrame(() => (sl.style.width = "100%")));
  }

  function animScene(i) {
    if (i === 0) {
      const cv = document.getElementById("sc1-map-canvas");
      if (!cv || cv.dataset.built) return;
      cv.dataset.built = "1";
      cv.width = innerWidth;
      cv.height = innerHeight;
      const ctx = cv.getContext("2d");
      const W = cv.width,
        H = cv.height;
      const cities = { G: { x: W * 0.28, y: H * 0.62, color: "#ff9f43" }, T: { x: W * 0.4, y: H * 0.55, color: "#ffd700" }, L: { x: W * 0.22, y: H * 0.18, color: "#06d6a0" } };
      function makeCurve(from, to) {
        const mx = (from.x + to.x) / 2 + (Math.random() - 0.5) * W * 0.14,
          my = (from.y + to.y) / 2 + (Math.random() - 0.5) * H * 0.12;
        return { from, to, cp: { x: mx, y: my }, progress: 0 };
      }
      const routes = [makeCurve(cities.G, cities.L), makeCurve(cities.T, cities.L)];
      const scatterDots = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.5 + Math.random() * 1.2, op: 0.04 + Math.random() * 0.1 }));
      let startTime = null;
      function bezierPt(p0, cp, p1, t) {
        return { x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * cp.x + t * t * p1.x, y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * cp.y + t * t * p1.y };
      }
      (function drawScene(ts) {
        if (!startTime) startTime = ts;
        const elapsed = ts - startTime;
        ctx.clearRect(0, 0, W, H);
        scatterDots.forEach((d) => {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${d.op})`;
          ctx.fill();
        });
        routes.forEach((r, ri) => {
          const pct = Math.min(1, Math.max(0, (elapsed - ri * 300) / 2800));
          r.progress = pct;
          if (pct <= 0) return;
          const steps = 80;
          ctx.save();
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          for (let s = 0; s < Math.floor(steps * pct); s++) {
            const p0 = bezierPt(r.from, r.cp, r.to, s / steps),
              p1 = bezierPt(r.from, r.cp, r.to, (s + 1) / steps);
            ctx.strokeStyle = ri === 0 ? `rgba(255,159,67,${0.55 + 0.35 * (s / steps)})` : `rgba(255,215,0,${0.55 + 0.35 * (s / steps)})`;
            ctx.shadowColor = ri === 0 ? "#ff9f43" : "#ffd700";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
          ctx.restore();
          if (pct > 0 && pct < 1) {
            const cp = bezierPt(r.from, r.cp, r.to, pct),
              col = ri === 0 ? "#ff9f43" : "#ffd700";
            const grad = ctx.createRadialGradient(cp.x, cp.y, 0, cp.x, cp.y, 10);
            grad.addColorStop(0, "rgba(255,255,255,1)");
            grad.addColorStop(0.4, col);
            grad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(cp.x, cp.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }
        });
        if (routes.every((r) => r.progress >= 1)) {
          const t = (elapsed % 2000) / 2000;
          Object.values(cities).forEach((c, ci) => {
            const pulse = 0.4 + 0.6 * Math.abs(Math.sin(t * Math.PI * 2 + ci));
            const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 28);
            grad.addColorStop(0, c.color + "88");
            grad.addColorStop(1, "transparent");
            ctx.beginPath();
            ctx.arc(c.x, c.y, 28 * pulse, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          });
        }
        requestAnimationFrame(drawScene);
      })(0);
      setTimeout(() => document.getElementById("lp-g")?.classList.add("pin-visible"), 400);
      setTimeout(() => document.getElementById("lp-t")?.classList.add("pin-visible"), 900);
      setTimeout(() => document.getElementById("lp-l")?.classList.add("pin-visible"), 3200);
    }
    if (i === 1) {
      const spk = document.getElementById("sc2-sparks");
      if (spk) {
        spk.width = innerWidth * devicePixelRatio;
        spk.height = innerHeight * devicePixelRatio;
        spk.style.cssText = `position:absolute;inset:0;width:${innerWidth}px;height:${innerHeight}px;z-index:2;pointer-events:none;`;
        const sx = spk.getContext("2d");
        sx.scale(devicePixelRatio, devicePixelRatio);
        const W = innerWidth,
          H = innerHeight;
        const embers = Array.from({ length: 55 }, () => ({ x: W * (0.15 + Math.random() * 0.7), y: H * (0.3 + Math.random() * 0.6), vx: (Math.random() - 0.5) * 0.5, vy: -(0.3 + Math.random() * 0.7), r: 0.6 + Math.random() * 2.8, life: Math.random(), col: ["#ff5500", "#ff7700", "#ffaa00", "#ff3300", "#ff9900"][~~(Math.random() * 5)], trail: [] }));
        (function stk() {
          sx.fillStyle = "rgba(0,0,0,.06)";
          sx.fillRect(0, 0, W, H);
          embers.forEach((p) => {
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 8) p.trail.shift();
            p.trail.forEach((t, ti) => {
              const tf = ti / p.trail.length;
              sx.beginPath();
              sx.arc(t.x, t.y, p.r * tf * 0.6, 0, Math.PI * 2);
              sx.fillStyle = p.col;
              sx.globalAlpha = tf * 0.25;
              sx.fill();
            });
            p.x += p.vx;
            p.y += p.vy;
            p.life += 0.007;
            p.vx += (Math.random() - 0.5) * 0.05;
            if (p.y < H * 0.1 || p.life > 1) {
              p.y = H * (0.5 + Math.random() * 0.4);
              p.x = W * (0.2 + Math.random() * 0.6);
              p.life = 0;
              p.trail = [];
            }
            const op = Math.sin(p.life * Math.PI) * 0.7;
            sx.beginPath();
            sx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            sx.fillStyle = p.col;
            sx.globalAlpha = op;
            sx.shadowColor = p.col;
            sx.shadowBlur = 10;
            sx.fill();
          });
          sx.globalAlpha = 1;
          sx.shadowBlur = 0;
          requestAnimationFrame(stk);
        })();
      }
      const con = document.getElementById("sc2msgs");
      if (!con) return;
      con.innerHTML = "";
      const msgs = [
        { cls: "mo", text: "Hii ! 👋" },
        { cls: "mi", text: "Heyy!! 😊" },
        { cls: "mo", text: "Mam em cheppindi? 🤔" },
        { cls: "mi", text: "Nenu class ki inka vellaledu..." },
      ];
      function typeInto(el, text, ms, cb) {
        el.textContent = "";
        const cur = document.createElement("span");
        cur.className = "sc2-cursor";
        el.appendChild(cur);
        let idx = 0;
        const tick = setInterval(() => {
          if (idx < text.length) {
            cur.before(text[idx++]);
          } else {
            clearInterval(tick);
            cur.remove();
            if (cb) cb();
          }
        }, ms);
      }
      const el0 = document.createElement("div");
      el0.className = "sc2-msg mo";
      con.appendChild(el0);
      setTimeout(() => {
        el0.classList.add("sv");
        typeInto(el0, msgs[0].text, 48, () => {
          msgs.slice(1).forEach((m, mi) => {
            setTimeout(
              () => {
                const el = document.createElement("div");
                el.className = `sc2-msg ${m.cls}`;
                el.textContent = m.text;
                con.appendChild(el);
                requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("sv")));
              },
              400 + mi * 700,
            );
          });
        });
      }, 350);
    }
    if (i === 2) {
      // build classroom
      const sc3 = document.getElementById("sc3");
      if (!sc3.dataset.classBuilt) {
        sc3.dataset.classBuilt = "1";

        // clear old door elements
        ["sc3-door-wrap", "sc3-spill", "sc3-lightcone", "sc3-light-fixture", "sc3-floor-reflect"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.style.display = "none";
        });

        const W = innerWidth,
          H = innerHeight;

        // classroom canvas
        const cc = document.createElement("canvas");
        cc.style.cssText = `position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;`;
        cc.width = W;
        cc.height = H;
        sc3.appendChild(cc);
        const cx = cc.getContext("2d");

        function drawClassroom() {
          cx.clearRect(0, 0, W, H);

          // floor
          const flg = cx.createLinearGradient(0, H * 0.65, 0, H);
          flg.addColorStop(0, "#1a1200");
          flg.addColorStop(1, "#0a0800");
          cx.fillStyle = flg;
          cx.fillRect(0, H * 0.65, W, H * 0.35);

          // floor tiles
          cx.strokeStyle = "rgba(255,220,80,.05)";
          cx.lineWidth = 1;
          for (let tx = 0; tx < W; tx += W / 8) {
            cx.beginPath();
            cx.moveTo(tx, H * 0.65);
            cx.lineTo(tx, H);
            cx.stroke();
          }
          for (let ty = H * 0.65; ty < H; ty += (H * 0.35) / 4) {
            cx.beginPath();
            cx.moveTo(0, ty);
            cx.lineTo(W, ty);
            cx.stroke();
          }

          // back wall
          const wg = cx.createLinearGradient(0, 0, 0, H * 0.65);
          wg.addColorStop(0, "#0d0a00");
          wg.addColorStop(1, "#1a1500");
          cx.fillStyle = wg;
          cx.fillRect(0, 0, W, H * 0.65);

          // blackboard
          const bx = W * 0.12,
            by = H * 0.06,
            bw = W * 0.76,
            bh = H * 0.34;
          cx.fillStyle = "#0d2010";
          cx.fillRect(bx, by, bw, bh);
          cx.strokeStyle = "rgba(255,255,255,.15)";
          cx.lineWidth = 6;
          cx.strokeRect(bx, by, bw, bh);
          // board frame
          const fg2 = cx.createLinearGradient(bx, by, bx, by + bh);
          fg2.addColorStop(0, "#8B6914");
          fg2.addColorStop(1, "#5c4510");
          cx.strokeStyle = fg2;
          cx.lineWidth = 10;
          cx.strokeRect(bx - 2, by - 2, bw + 4, bh + 4);

          // chalk writing on board
          cx.font = `bold ${Math.max(14, W * 0.025)}px 'Caveat',cursive`;
          cx.fillStyle = "rgba(255,255,255,.75)";
          cx.textAlign = "center";
          cx.textBaseline = "middle";
          cx.fillText("37 BLOCK — Room No - 911", W / 2, by + bh * 0.28);
          cx.font = `${Math.max(11, W * 0.018)}px 'Caveat',cursive`;
          cx.fillStyle = "rgba(200,255,200,.5)";
          cx.fillText("SoftSkills  →  Aptitude", W / 2, by + bh * 0.5);
          cx.fillStyle = "rgba(255,255,150,.4)";
          cx.fillText("Summer PEP: 30 Days 💘", W / 2, by + bh * 0.72);

          // chalk tray
          cx.fillStyle = "#5c4510";
          cx.fillRect(bx, by + bh, bw, 8);
          // chalk pieces
          ["#fff", "#ffcccc", "#ccffcc"].forEach((col, ci) => {
            cx.fillStyle = col;
            cx.fillRect(bx + 20 + ci * 18, by + bh + 1, 12, 6);
          });

          // teacher desk (front)
          const tdx = W * 0.3,
            tdy = H * 0.58,
            tdw = W * 0.4,
            tdh = H * 0.08;
          const tdg = cx.createLinearGradient(tdx, tdy, tdx, tdy + tdh);
          tdg.addColorStop(0, "#5c3a1e");
          tdg.addColorStop(1, "#3a2010");
          cx.fillStyle = tdg;
          cx.fillRect(tdx, tdy, tdw, tdh);
          cx.strokeStyle = "rgba(255,200,80,.2)";
          cx.lineWidth = 1.5;
          cx.strokeRect(tdx, tdy, tdw, tdh);
          // desk legs
          cx.fillStyle = "#2a1800";
          cx.fillRect(tdx + 10, tdy + tdh, 14, H * 0.06);
          cx.fillRect(tdx + tdw - 24, tdy + tdh, 14, H * 0.06);

          // student desks (rows)
          const deskRows = [
            [0.44, 0.72, 0.18],
            [0.44, 0.82, 0.18],
            [0.7, 0.72, 0.18],
            [0.7, 0.82, 0.18],
            [0.18, 0.72, 0.18],
            [0.18, 0.82, 0.18],
          ];
          deskRows.forEach(([dx, dy, dw]) => {
            const ddx = W * dx,
              ddy = H * dy,
              ddw = W * dw,
              ddh = H * 0.055;
            const dg = cx.createLinearGradient(ddx, ddy, ddx, ddy + ddh);
            dg.addColorStop(0, "#3a2a14");
            dg.addColorStop(1, "#231a0a");
            cx.fillStyle = dg;
            cx.fillRect(ddx, ddy, ddw, ddh);
            cx.strokeStyle = "rgba(255,180,50,.12)";
            cx.lineWidth = 1;
            cx.strokeRect(ddx, ddy, ddw, ddh);
            // desk leg
            cx.fillStyle = "#1a1008";
            cx.fillRect(ddx + ddw / 2 - 4, ddy + ddh, 8, H * 0.04);
            // notebook on desk
            if (Math.random() > 0.4) {
              cx.fillStyle = "rgba(200,220,255,.12)";
              cx.fillRect(ddx + ddw * 0.1, ddy + 4, ddw * 0.35, ddh - 8);
            }
          });

          // window (right wall)
          const wx = W * 0.84,
            wy = H * 0.1,
            ww = W * 0.1,
            wh = H * 0.28;
          cx.fillStyle = "rgba(100,150,255,.08)";
          cx.fillRect(wx, wy, ww, wh);
          cx.strokeStyle = "rgba(255,255,255,.2)";
          cx.lineWidth = 3;
          cx.strokeRect(wx, wy, ww, wh);
          cx.strokeStyle = "rgba(255,255,255,.1)";
          cx.lineWidth = 1.5;
          cx.beginPath();
          cx.moveTo(wx + ww / 2, wy);
          cx.lineTo(wx + ww / 2, wy + wh);
          cx.stroke();
          cx.beginPath();
          cx.moveTo(wx, wy + wh / 2);
          cx.lineTo(wx + ww, wy + wh / 2);
          cx.stroke();

          // ceiling light
          cx.fillStyle = "rgba(255,240,150,.6)";
          cx.beginPath();
          cx.ellipse(W / 2, H * 0.01, W * 0.18, 8, 0, 0, Math.PI * 2);
          cx.fill();
          const lg = cx.createRadialGradient(W / 2, 0, 0, W / 2, 0, H * 0.5);
          lg.addColorStop(0, "rgba(255,240,150,.12)");
          lg.addColorStop(0.6, "rgba(255,220,80,.03)");
          lg.addColorStop(1, "transparent");
          cx.fillStyle = lg;
          cx.fillRect(0, 0, W, H);
        }
        drawClassroom();

        // dust particles
        const dust = document.getElementById("sc3-dust");
        if (dust && !dust.dataset.built) {
          dust.dataset.built = 1;
          const dc = document.createElement("canvas");
          dc.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:5;";
          dc.width = W;
          dc.height = H;
          dust.appendChild(dc);
          const dx = dc.getContext("2d");
          const motes = Array.from({ length: 22 }, () => ({ x: W * (0.1 + Math.random() * 0.8), y: H * (0.1 + Math.random() * 0.5), vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.12, r: 0.8 + Math.random() * 2, phase: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.012 }));
          (function dtk() {
            dx.clearRect(0, 0, dc.width, dc.height);
            motes.forEach((m) => {
              m.x += m.vx;
              m.y += m.vy;
              m.phase += m.speed;
              m.vx += (Math.random() - 0.5) * 0.03;
              m.vy += (Math.random() - 0.5) * 0.02;
              if (m.x < W * 0.05 || m.x > W * 0.95) m.vx *= -0.9;
              if (m.y < H * 0.05 || m.y > H * 0.65) m.vy *= -0.9;
              const op = 0.08 + 0.5 * Math.abs(Math.sin(m.phase));
              dx.beginPath();
              dx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
              dx.fillStyle = `rgba(255,240,160,${op})`;
              dx.shadowColor = "rgba(255,230,100,.6)";
              dx.shadowBlur = 6;
              dx.fill();
            });
            dx.shadowBlur = 0;
            requestAnimationFrame(dtk);
          })();
        }
      }
    }
    if (i === 3) {
      const mx = document.getElementById("sc4-matrix");
      if (mx) {
        mx.width = innerWidth;
        mx.height = innerHeight;
        mx.style.cssText = `position:absolute;inset:0;width:${innerWidth}px;height:${innerHeight}px;z-index:2;pointer-events:none;opacity:.12;`;
        const mc = mx.getContext("2d");
        const cols = Math.floor(innerWidth / 14);
        const drops = Array.from({ length: cols }, () => (Math.random() * innerHeight) / 14);
        const chars = "0123456789ABCDEF";
        (function mrain() {
          mc.fillStyle = "rgba(0,0,0,.08)";
          mc.fillRect(0, 0, mx.width, mx.height);
          mc.fillStyle = "#30d158";
          mc.font = "bold 12px monospace";
          drops.forEach((y, xi) => {
            mc.fillText(chars[~~(Math.random() * chars.length)], xi * 14, y * 14);
            if (y * 14 > mx.height && Math.random() > 0.97) drops[xi] = 0;
            drops[xi] += 0.4;
          });
          requestAnimationFrame(mrain);
        })();
      }
      setTimeout(() => document.getElementById("nb1")?.classList.add("ns"), 200);
      setTimeout(() => {
        const nd = document.getElementById("sc4-num");
        if (nd) {
          nd.classList.add("ns");
          const dispArr = "9 3 9 0 X X X X X 8".split(" ");
          nd.textContent = "_ _ _ _ _ _ _ _ _ _";
          dispArr.forEach((d, ci) => {
            setTimeout(() => {
              const revealed = dispArr.slice(0, ci + 1).join(" ");
              const blanks = Array(dispArr.length - ci - 1)
                .fill("_")
                .join(" ");
              nd.textContent = revealed + (blanks ? " " + blanks : "");
            }, ci * 155);
          });
        }
      }, 900);
      setTimeout(() => document.getElementById("nb2")?.style.setProperty("opacity", "1"), 2800);
    }
    if (i === 4) {
      const amb = document.getElementById("sc5-ambient");
      if (amb) {
        amb.width = innerWidth * devicePixelRatio;
        amb.height = innerHeight * devicePixelRatio;
        amb.style.cssText = `position:absolute;inset:0;width:${innerWidth}px;height:${innerHeight}px;z-index:2;pointer-events:none;`;
        const ax = amb.getContext("2d");
        ax.scale(devicePixelRatio, devicePixelRatio);
        const W = innerWidth,
          H = innerHeight;
        const layers = [
          { n: 18, r: [0.5, 1.2], v: 0.08, col: ["#06d6a0", "#25d366"], blur: 14, op: [0.04, 0.12] },
          { n: 12, r: [2, 5], v: 0.15, col: ["#00c878", "#128c7e"], blur: 30, op: [0.02, 0.06] },
          { n: 8, r: [6, 12], v: 0.06, col: ["#1db954", "#06d6a0"], blur: 60, op: [0.01, 0.03] },
        ];
        const apts = layers.flatMap((l) => Array.from({ length: l.n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * l.v, vy: (Math.random() - 0.5) * l.v, r: l.r[0] + Math.random() * (l.r[1] - l.r[0]), life: Math.random() * Math.PI * 2, speed: 0.003 + Math.random() * 0.007, col: l.col[~~(Math.random() * l.col.length)], blur: l.blur, opMin: l.op[0], opRange: l.op[1] - l.op[0] })));
        (function atk() {
          ax.fillStyle = "rgba(0,0,0,.04)";
          ax.fillRect(0, 0, W, H);
          apts.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life += p.speed;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
            const op = p.opMin + p.opRange * Math.abs(Math.sin(p.life));
            ax.beginPath();
            ax.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ax.fillStyle = p.col;
            ax.globalAlpha = op;
            ax.shadowColor = p.col;
            ax.shadowBlur = p.blur;
            ax.fill();
          });
          ax.globalAlpha = 1;
          ax.shadowBlur = 0;
          requestAnimationFrame(atk);
        })();
      }
      const msgs = [
        { c: "wr", t: "Hiiiiii! ☀️" },
        { c: "wl", t: "Hi! 💛" },
        { c: "wr", t: "Em chestunnaru? 🤔" },
        { c: "wl", t: "Clg ki start avtunna" },
        { c: "wr", t: "Seriii👊" },
        { c: "wl", t: "Tata" },
      ];
      const con = document.getElementById("wabody");
      if (con) {
        con.innerHTML = "";
        msgs.forEach((m, mi) => {
          const el = document.createElement("div");
          el.className = `wb ${m.c}`;
          el.textContent = m.t;
          con.appendChild(el);
          setTimeout(() => el.classList.add("wv"), 240 + mi * 390);
        });
      }
    }
    if (i === 5) {
      setTimeout(() => document.getElementById("bff-duo")?.classList.add("bv"), 100);
      setTimeout(() => document.getElementById("bw1")?.classList.add("bv"), 600);
      setTimeout(() => document.getElementById("bw2")?.classList.add("bv"), 1100);
      const bgCv = document.getElementById("sc6-canvas");
      if (bgCv) {
        bgCv.width = innerWidth * devicePixelRatio;
        bgCv.height = innerHeight * devicePixelRatio;
        bgCv.style.width = innerWidth + "px";
        bgCv.style.height = innerHeight + "px";
        const bx = bgCv.getContext("2d");
        bx.scale(devicePixelRatio, devicePixelRatio);
        const W = innerWidth,
          H = innerHeight;
        const clouds = [
          { x: W * 0.3, y: H * 0.4, r: W * 0.35, col: "rgba(100,0,180,.08)" },
          { x: W * 0.7, y: H * 0.6, r: W * 0.28, col: "rgba(0,100,180,.06)" },
          { x: W * 0.5, y: H * 0.2, r: W * 0.22, col: "rgba(180,0,100,.05)" },
        ];
        const stars = Array.from({ length: 160 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 0.2 + Math.random() * 0.8, phase: Math.random() * Math.PI * 2, speed: 0.4 + Math.random() * 1.2, col: ["#fff", "#c8b4ff", "#b4d8ff", "#ffddcc"][~~(Math.random() * 4)] }));
        let nextShoot = 1200;
        const shoots = [];
        const orbs = Array.from({ length: 100 }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: 0.4 + Math.random() * 3, life: Math.random() * Math.PI * 2, speed: 0.003 + Math.random() * 0.008, col: ["#c77dff", "#ff4d6d", "#ffd700", "#06d6a0", "#ff9f43", "#a855f7", "#60a5fa", "#f472b6"][~~(Math.random() * 8)] }));
        let sc6t = null;
        (function ptick(ts) {
          if (!sc6t) sc6t = ts;
          const elapsed = ts - sc6t;
          bx.fillStyle = "rgba(0,0,0,.05)";
          bx.fillRect(0, 0, W, H);
          clouds.forEach((c) => {
            const g = bx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
            g.addColorStop(0, c.col);
            g.addColorStop(1, "transparent");
            bx.beginPath();
            bx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            bx.fillStyle = g;
            bx.globalAlpha = 1;
            bx.fill();
          });
          stars.forEach((s) => {
            const op = 0.1 + 0.8 * Math.abs(Math.sin(s.phase + elapsed * 0.001 * s.speed));
            bx.beginPath();
            bx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            bx.fillStyle = s.col;
            bx.globalAlpha = op;
            bx.fill();
          });
          if (elapsed > nextShoot && shoots.length < 3) {
            shoots.push({ x: Math.random() * W, y: Math.random() * H * 0.4, vx: 3 + Math.random() * 5, vy: 1 + Math.random() * 2, life: 1, len: 60 + Math.random() * 80 });
            nextShoot = elapsed + 2000 + Math.random() * 2000;
          }
          shoots.forEach((s) => {
            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.025;
            if (s.life > 0) {
              bx.beginPath();
              bx.moveTo(s.x, s.y);
              bx.lineTo(s.x - (s.vx * s.len) / 5, s.y - (s.vy * s.len) / 5);
              bx.strokeStyle = `rgba(255,255,255,${s.life * 0.7})`;
              bx.lineWidth = 1.5;
              bx.shadowColor = "#fff";
              bx.shadowBlur = 8;
              bx.stroke();
              bx.shadowBlur = 0;
            }
          });
          for (let si = shoots.length - 1; si >= 0; si--) if (shoots[si].life <= 0) shoots.splice(si, 1);
          orbs.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.life += p.speed;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
            const op = 0.05 + 0.28 * Math.abs(Math.sin(p.life));
            bx.beginPath();
            bx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            bx.fillStyle = p.col;
            bx.globalAlpha = op;
            bx.shadowColor = p.col;
            bx.shadowBlur = 16;
            bx.fill();
          });
          bx.globalAlpha = 1;
          bx.shadowBlur = 0;
          requestAnimationFrame(ptick);
        })(0);
      }
      setTimeout(() => {
        const wrap = document.getElementById("sc6-inf-wrap"),
          cv = document.getElementById("sc6-inf-canvas");
        if (!cv || !wrap) return;
        wrap.classList.add("bv");
        const rect = cv.getBoundingClientRect(),
          CW = rect.width || 320,
          CH = rect.height || 110;
        cv.width = CW * devicePixelRatio;
        cv.height = CH * devicePixelRatio;
        cv.style.width = CW + "px";
        cv.style.height = CH + "px";
        const ctx = cv.getContext("2d");
        ctx.scale(devicePixelRatio, devicePixelRatio);
        const cx = CW / 2,
          cy = CH / 2,
          a = CW * 0.29,
          STEPS = 600;
        function infPt(t) {
          const s = Math.sin(t),
            c = Math.cos(t),
            d = 1 + s * s;
          return { x: cx + (a * c) / d, y: cy + (a * s * c) / d };
        }
        const pts = [];
        for (let i = 0; i <= STEPS; i++) pts.push(infPt((i / STEPS) * Math.PI * 2));
        const pathCols = ["#c77dff", "#ff4d6d", "#ff9f43", "#ffd700", "#06d6a0", "#60a5fa", "#c77dff"];
        function easeInOut(t) {
          return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }
        const TOTAL_MS = 3800;
        let startT = null;
        const trail = [],
          TRAIL_LEN = 55;
        (function drawFrame(ts) {
          if (!startT) startT = ts;
          const raw = Math.min(1, (ts - startT) / TOTAL_MS),
            drawn = Math.floor(easeInOut(raw) * STEPS);
          ctx.clearRect(0, 0, CW, CH);
          [
            { w: 14, a: 0.04, blur: 36 },
            { w: 7, a: 0.14, blur: 18 },
            { w: 3.5, a: 0.5, blur: 8 },
            { w: 1.5, a: 0.95, blur: 2 },
          ].forEach(({ w, a, blur }) => {
            ctx.save();
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = w;
            for (let s = 1; s <= drawn; s++) {
              const pct = s / STEPS,
                ci = Math.floor(pct * (pathCols.length - 1));
              ctx.beginPath();
              ctx.moveTo(pts[s - 1].x, pts[s - 1].y);
              ctx.lineTo(pts[s].x, pts[s].y);
              ctx.strokeStyle = pathCols[Math.min(ci, pathCols.length - 1)];
              ctx.globalAlpha = a * (0.25 + 0.75 * pct);
              ctx.shadowColor = pathCols[Math.min(ci, pathCols.length - 1)];
              ctx.shadowBlur = blur;
              ctx.stroke();
            }
            ctx.restore();
          });
          if (drawn > 0 && drawn < STEPS) {
            const head = pts[drawn],
              headCol = pathCols[Math.min(Math.floor((drawn / STEPS) * (pathCols.length - 1)), pathCols.length - 1)];
            trail.push({ ...head, col: headCol });
            if (trail.length > TRAIL_LEN) trail.shift();
            trail.forEach((tp, ti) => {
              const frac = ti / trail.length;
              ctx.beginPath();
              ctx.arc(tp.x, tp.y, 5.5 * frac, 0, Math.PI * 2);
              ctx.fillStyle = tp.col;
              ctx.globalAlpha = frac * 0.85;
              ctx.shadowColor = tp.col;
              ctx.shadowBlur = 14;
              ctx.fill();
            });
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            [18, 10, 4].forEach((r, ri) => {
              const hg = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r);
              hg.addColorStop(0, ri === 2 ? "#fff" : "rgba(255,255,255,.9)");
              hg.addColorStop(0.5, headCol);
              hg.addColorStop(1, "transparent");
              ctx.beginPath();
              ctx.arc(head.x, head.y, r, 0, Math.PI * 2);
              ctx.fillStyle = hg;
              ctx.fill();
            });
          }
          if (drawn >= STEPS) {
            (function keepGlow() {
              ctx.clearRect(0, 0, CW, CH);
              [
                { w: 14, a: 0.04, blur: 36 },
                { w: 7, a: 0.14, blur: 18 },
                { w: 3.5, a: 0.5, blur: 8 },
                { w: 1.5, a: 0.95, blur: 2 },
              ].forEach(({ w, a, blur }) => {
                ctx.save();
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineWidth = w;
                for (let s = 1; s <= STEPS; s++) {
                  const pct = s / STEPS,
                    ci = Math.floor(pct * (pathCols.length - 1));
                  ctx.beginPath();
                  ctx.moveTo(pts[s - 1].x, pts[s - 1].y);
                  ctx.lineTo(pts[s].x, pts[s].y);
                  ctx.strokeStyle = pathCols[Math.min(ci, pathCols.length - 1)];
                  ctx.globalAlpha = a * (0.25 + 0.75 * pct);
                  ctx.shadowColor = pathCols[Math.min(ci, pathCols.length - 1)];
                  ctx.shadowBlur = blur;
                  ctx.stroke();
                }
                ctx.restore();
              });
            })();
            setTimeout(() => document.getElementById("bcp")?.classList.add("bv"), 350);
            return;
          }
          requestAnimationFrame(drawFrame);
        })(0);
      }, 1800);
    }
  }

const SCENES = ["sc1", "sc2", "sc3", "sc4", "sc5", "sc6"];
  function goScene(i) {
    if (i >= SCENES.length) {
      root.style.transition = "opacity .9s ease";
      root.style.opacity = "0";
      setTimeout(async () => {
        root.style.display = "none";
        root.style.opacity = "";
        await showCakeScreen();
        setTimeout(()=>finalScreen(), 100);
      }, 900);
      return;
    }
    if (i > 0) {
      const prev = document.getElementById(SCENES[i - 1]);
      prev.style.transition = "opacity .8s ease";
      prev.style.opacity = "0";
      setTimeout(() => {
        prev.classList.remove("in");
        prev.style.transition = "";
        prev.style.opacity = "";
      }, 800);
    }
    setTimeout(
      () => {
        const el = document.getElementById(SCENES[i]);
        el.style.opacity = "0";
        el.style.transition = "";
        el.classList.add("in");
        el.style.transition = "opacity .8s ease";
        el.style.opacity = "1";
        animScene(i);
        const emojis = [
          ["🗺️", "📍", "✨", "🌟", "💫"],
          ["🧡", "📱", "💬", "✨"],
          ["🏫", "🚪", "✨", "💡"],
          ["📞", "💛", "✨", "😊"],
          ["💬", "🌙", "☀️", "💛"],
          ["💗", "✨", "🌟", "💜", "🎉"],
        ];
        burst(innerWidth / 2, innerHeight * 0.15, emojis[i] || ["✨"]);
      },
      i === 0 ? 0 : 150,
    );
    setTimeout(() => goScene(i + 1), DUR[i]);
  }
  goScene(0);
}
