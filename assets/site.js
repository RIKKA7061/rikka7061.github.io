// 화면 테마 바꾸기: 시스템 → 라이트 → 다크 (이 브라우저에 기억)
(function () {
  var KEY = 'rikka-theme';
  var ORDER = ['system', 'light', 'dark'];
  var ICON = { system: '🖥️', light: '☀️', dark: '🌙' };
  var LABEL = { system: '시스템 설정', light: '라이트', dark: '다크' };
  var root = document.documentElement;

  function read() {
    try { var v = localStorage.getItem(KEY); return v === 'light' || v === 'dark' ? v : 'system'; } catch (e) { return 'system'; }
  }
  function apply(pref) {
    if (pref === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', pref);
    try { if (pref === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, pref); } catch (e) {}
    var btn = document.querySelector('.theme-btn');
    if (btn) {
      btn.textContent = ICON[pref];
      btn.setAttribute('aria-label', '화면 테마: ' + LABEL[pref] + '. 눌러서 바꾸기');
    }
  }
  document.addEventListener('DOMContentLoaded', function () {
    var pref = read();
    apply(pref);
    var btn = document.querySelector('.theme-btn');
    if (btn) btn.addEventListener('click', function () {
      pref = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
      apply(pref);
    });
    var y = document.querySelector('[data-year]');
    if (y) y.textContent = String(new Date().getFullYear());
    enhanceCards();
    enhanceGamePage();
  });

  // ---------- 플레이스토어 이미지 ----------
  // 배포할 때 GitHub Actions(tools/store-images.mjs)가 games/<게임>/store.json 과 이미지를 만들어 둔다.
  // 파일이 없으면(출시 전 게임, 내 컴퓨터에서 바로 열었을 때) 원래 색 표지를 그대로 둔다.
  function loadStore(dir) {
    return fetch(new URL('store.json', dir), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }
  function makeImg(src, alt, cls) {
    var i = document.createElement('img');
    i.src = src;
    i.alt = alt;
    i.className = cls;
    i.loading = 'lazy';
    i.decoding = 'async';
    return i;
  }

  // 첫 화면 게임 카드: 표지 → 대표 이미지(없으면 첫 스크린샷), 제목 옆에 아이콘
  function enhanceCards() {
    document.querySelectorAll('.game').forEach(function (card) {
      var link = card.querySelector('h3 a');
      if (!link) return;
      var dir = new URL(link.getAttribute('href'), location.href);
      loadStore(dir).then(function (s) {
        if (!s) return;
        var cover = card.querySelector('.cover');
        var wide = s.header || (s.screenshots && s.screenshots[0]);
        if (cover && wide) {
          cover.classList.add('has-img');
          cover.insertBefore(makeImg(new URL(wide, dir).href, '', 'cover-img'), cover.firstChild);
        }
        if (s.icon) {
          var h = card.querySelector('h3');
          h.classList.add('with-icon');
          h.insertBefore(makeImg(new URL(s.icon, dir).href, '', 'game-icon'), h.firstChild);
        }
      });
    });
  }

  // 게임 페이지: 대표 이미지, 아이콘, 스크린샷 모음
  function enhanceGamePage() {
    var page = document.querySelector('[data-game-page]');
    if (!page) return;
    var dir = new URL('./', location.href);
    loadStore(dir).then(function (s) {
      if (!s) return;
      var title = (page.querySelector('.game-title') || {}).textContent || '';
      var cover = page.querySelector('.detail-cover');
      var wide = s.header || (s.screenshots && s.screenshots[0]);
      if (cover && wide) {
        cover.classList.add('has-img');
        cover.insertBefore(makeImg(new URL(wide, dir).href, '', 'cover-img'), cover.firstChild);
      }
      var h1 = page.querySelector('.game-title');
      if (h1 && s.icon) {
        h1.classList.add('with-icon');
        h1.insertBefore(makeImg(new URL(s.icon, dir).href, '', 'game-icon game-icon-lg'), h1.firstChild);
      }
      var box = page.querySelector('[data-shots]');
      var list = box && box.querySelector('.shots-list');
      if (list && s.screenshots && s.screenshots.length) {
        s.screenshots.forEach(function (src, i) {
          var url = new URL(src, dir).href;
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.appendChild(makeImg(url, title + ' 스크린샷 ' + (i + 1), 'shot'));
          li.appendChild(a);
          list.appendChild(li);
        });
        box.hidden = false;
      }
    });
  }
})();
