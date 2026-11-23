// Eleven 공용 효과: 홈페이지(index.html)의 효과 스크립트를 다른 페이지에서도 쓰도록 옮긴 것.
// 홈페이지 효과를 바꾸면 여기도 같이 맞춘다. 꾸밈 담당 CSS는 assets/fx.css.
//   - 반짝이는 픽셀 별 배경 (마우스를 따라 살짝 움직임)
//   - 클릭하면 픽셀 조각이 팡! + 마우스 꼬리 빛
//   - data-fx-drop   : 제목 글자가 한 글자씩 떨어지고 끝에 픽셀 커서
//   - data-fx-reveal : 화면에 들어올 때 도트처럼 툭툭 나타남
//   - data-fx-tilt   : 카드가 마우스를 따라 기울고 빛이 따라다님
// '움직임 줄이기' 설정이면 별만 멈춘 채로 그리고 나머지 움직임은 하지 않는다.
(function () {
  'use strict';
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm) document.documentElement.classList.add('fx-on');

  function canvas(id) {
    let cv = document.getElementById(id);
    if (!cv) {
      cv = document.createElement('canvas');
      cv.id = id;
      cv.setAttribute('aria-hidden', 'true');
      document.body.prepend(cv);
    }
    return cv;
  }
  function fit(cv, ctx) {
    const d = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  }

  // ---------- 제목 글자 떨어뜨리기 ----------
  // 글자를 단어(.w, 줄바꿈 안 함)와 글자(.ch)로 나눠 한 덩어리(.fx-letters)에 담는다.
  // 제목이 flex(아이콘 + 글자)여도 글자 덩어리는 한 칸으로 남는다.
  document.querySelectorAll('[data-fx-drop]').forEach(h => {
    if (calm) return;
    const text = h.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;
    if (!h.hasAttribute('aria-label')) h.setAttribute('aria-label', text);
    const box = document.createElement('span');
    box.className = 'fx-letters';
    box.setAttribute('aria-hidden', 'true');
    let i = 0;
    text.split(' ').forEach((word, n) => {
      if (n) box.appendChild(document.createTextNode(' '));
      const w = document.createElement('span');
      w.className = 'w';
      [...word].forEach(c => {
        const sp = document.createElement('span');
        sp.className = 'ch'; sp.style.setProperty('--i', i++); sp.textContent = c;
        w.appendChild(sp);
      });
      box.appendChild(w);
    });
    const cur = document.createElement('i');
    cur.className = 'fx-cursor';
    box.appendChild(cur);
    [...h.childNodes].forEach(node => { if (node.nodeType === 3) node.remove(); });
    h.appendChild(box);
  });

  // ---------- 화면에 들어올 때 나타나기 ----------
  const reveal = document.querySelectorAll('[data-fx-reveal]');
  if (!calm && reveal.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(list => list.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('fx-in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    reveal.forEach(el => io.observe(el));
  } else {
    reveal.forEach(el => el.classList.add('fx-in'));
  }
  // 인쇄할 때는 아직 안 나타난 것도 모두 보이게
  addEventListener('beforeprint', () => reveal.forEach(el => el.classList.add('fx-in')));

  // ---------- 카드: 마우스 따라 기울기 + 빛 ----------
  if (!calm && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-fx-tilt]').forEach(card => {
      const light = document.createElement('i');
      light.className = 'fx-light';
      light.setAttribute('aria-hidden', 'true');
      card.appendChild(light);
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', x * 100 + '%'); card.style.setProperty('--my', y * 100 + '%');
        card.style.setProperty('--ry', (x - .5) * 12 + 'deg'); card.style.setProperty('--rx', (.5 - y) * 10 + 'deg');
      });
      card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  // ---------- 배경: 반짝이는 픽셀 별 ----------
  (function stars() {
    const cv = canvas('stars'), ctx = cv.getContext('2d');
    if (!ctx) return;
    let W, H, list = [], mx = 0, my = 0;
    const colors = ['#ffffff', '#d9c8ff', '#b08af5', '#f2a7c8'];
    function resize() {
      fit(cv, ctx); W = innerWidth; H = innerHeight;
      list = Array.from({ length: Math.round(W * H / 5500) }, () => ({
        x: Math.random() * W, y: Math.random() * H, s: Math.random() < .15 ? 3 : 2,
        z: .3 + Math.random() * .7, ph: Math.random() * 6.28, sp: .6 + Math.random() * 1.6,
        c: colors[Math.random() * colors.length | 0]
      }));
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (const st of list) {
        const a = calm ? .7 : .35 + .65 * Math.abs(Math.sin(t / 1000 * st.sp + st.ph));
        const x = Math.round(st.x + mx * st.z * 14), y = Math.round(st.y + my * st.z * 14);
        ctx.globalAlpha = a; ctx.fillStyle = st.c; ctx.fillRect(x, y, st.s, st.s);
        if (st.s === 3 && a > .9) { ctx.globalAlpha = a * .5; ctx.fillRect(x - 3, y + 1, 9, 1); ctx.fillRect(x + 1, y - 3, 1, 9); }
      }
      ctx.globalAlpha = 1;
      if (!calm) requestAnimationFrame(draw);
    }
    addEventListener('resize', () => { resize(); if (calm) draw(0); });
    addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
    resize(); requestAnimationFrame(draw);
  })();

  // ---------- 클릭하면 픽셀 조각이 팡! + 마우스 꼬리 빛 ----------
  (function particles() {
    if (calm) return;
    const cv = canvas('fx'), ctx = cv.getContext('2d');
    if (!ctx) return;
    let W, H, parts = [], running = false, lastTrail = 0;
    const colors = ['#b08af5', '#7c4dcc', '#f2a7c8', '#ffffff', '#ffd34d'];
    function resize() { fit(cv, ctx); W = innerWidth; H = innerHeight; }
    function burst(x, y, n, power) {
      for (let k = 0; k < n; k++) {
        const ang = Math.random() * Math.PI * 2, v = power * (.4 + Math.random() * .8);
        parts.push({ x, y, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v - 1.5, g: .18, life: 1, dec: .02 + Math.random() * .02, s: Math.random() < .3 ? 4 : 3, c: colors[Math.random() * colors.length | 0] });
      }
      loop();
    }
    function trail(x, y) { parts.push({ x, y, vx: (Math.random() - .5) * .6, vy: -.3 - Math.random() * .5, g: 0, life: .8, dec: .03, s: 2, c: colors[Math.random() * 3 | 0] }); loop(); }
    function loop() { if (!running) { running = true; requestAnimationFrame(tick); } }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      parts = parts.filter(p => (p.life -= p.dec) > 0);
      for (const p of parts) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy;
        ctx.globalAlpha = Math.max(p.life, 0); ctx.fillStyle = p.c; ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      }
      ctx.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(tick); else { running = false; ctx.clearRect(0, 0, W, H); }
    }
    addEventListener('resize', resize); resize();
    addEventListener('pointerdown', e => burst(e.clientX, e.clientY, 14, 4));
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const now = performance.now(); if (now - lastTrail < 28) return; lastTrail = now; trail(e.clientX, e.clientY);
    });
  })();
})();
