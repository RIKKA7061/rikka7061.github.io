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
    enhancePrint();
  });

  // ---------- 플레이스토어 이미지 ----------
  // 배포할 때 GitHub Actions(tools/store-images.mjs)가 games/<게임>/store.json 과 이미지를 만들어 둔다.
  // 파일이 없으면(출시 전 게임, 내 컴퓨터에서 바로 열었을 때) 원래 색 표지를 그대로 둔다.
  function loadStore(dir) {
    return fetch(new URL('store.json', dir), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }
  function makeImg(src, alt, cls, eager) {
    var i = document.createElement('img');
    i.src = src;
    i.alt = alt;
    i.className = cls;
    i.loading = eager ? 'eager' : 'lazy'; // 인쇄할 때는 화면 밖 이미지도 미리 받아 둔다
    i.decoding = 'async';
    return i;
  }
  /** 영역 안의 플레이스토어 링크 (없으면 null) */
  function storeHref(scope) {
    var a = scope && scope.querySelector('a[href*="play.google.com/store/apps/details"]');
    return a ? a.href : null;
  }
  /** 요소를 링크로 감싼다. 같은 곳으로 가는 글자 링크가 따로 있으므로 탭 이동·화면 읽기에서는 건너뛴다 */
  function wrapLink(el, href) {
    var a = document.createElement('a');
    a.href = href;
    a.className = 'img-link';
    a.tabIndex = -1;
    a.setAttribute('aria-hidden', 'true');
    if (/^https?:/.test(href) && href.indexOf(location.origin) !== 0) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
    el.parentNode.insertBefore(a, el);
    a.appendChild(el);
    return a;
  }

  // 첫 화면 게임 카드: 표지 → 대표 이미지(없으면 첫 스크린샷), 제목 옆에 아이콘
  function enhanceCards() {
    document.querySelectorAll('.game').forEach(function (card) {
      var link = card.querySelector('h3 a');
      if (!link) return;
      var dir = new URL(link.getAttribute('href'), location.href);
      var cardCover = card.querySelector('.cover');
      if (cardCover) wrapLink(cardCover, storeHref(card) || dir.href);
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
      var store = storeHref(page);
      var cover = page.querySelector('.detail-cover');
      var wide = s.header || (s.screenshots && s.screenshots[0]);
      if (cover && wide) {
        cover.classList.add('has-img');
        cover.insertBefore(makeImg(new URL(wide, dir).href, '', 'cover-img'), cover.firstChild);
        if (store) wrapLink(cover, store);
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
          a.href = store || url; // 누르면 플레이스토어로 (링크가 없으면 큰 이미지)
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

  // 인쇄용 포트폴리오(print.html): 게임마다 대표 이미지·스크린샷을 채운다. 없으면 색 표지 그대로.
  function enhancePrint() {
    var blocks = document.querySelectorAll('[data-print-game]');
    if (!blocks.length) return;
    var pending = blocks.length;
    var done = function () {
      if (--pending === 0) document.documentElement.setAttribute('data-print-ready', '');
    };
    blocks.forEach(function (block) {
      var slug = block.getAttribute('data-print-game');
      var dir = new URL('games/' + slug + '/', location.href);
      var title = (block.querySelector('.p-title-text') || {}).textContent || '';
      loadStore(dir).then(function (s) {
        if (s) {
          var hero = block.querySelector('.p-hero');
          var wide = s.header || (s.screenshots && s.screenshots[0]);
          if (hero && wide) {
            hero.classList.add('has-img');
            hero.innerHTML = '';
            hero.appendChild(makeImg(new URL(wide, dir).href, title + ' 대표 이미지', 'p-hero-img', true));
          }
          var shots = block.querySelector('.p-shots');
          var list = (s.screenshots || []).filter(function (x) { return x !== wide; }).slice(0, 4);
          if (shots && list.length) {
            list.forEach(function (src, i) {
              var im = makeImg(new URL(src, dir).href, title + ' 스크린샷 ' + (i + 1), 'p-shot', true);
              // 가로 스크린샷이면 두 칸씩 크게
              if (i === 0) im.addEventListener('load', function () {
                if (im.naturalWidth > im.naturalHeight) shots.classList.add('is-landscape');
              });
              shots.appendChild(im);
            });
            shots.hidden = false;
          }
          var t = block.querySelector('.p-title');
          if (t && s.icon) t.insertBefore(makeImg(new URL(s.icon, dir).href, '', 'p-icon', true), t.firstChild);
        }
        done();
      });
    });
    // 사이트에 인쇄용 PDF 가 있으면(배포 때 자동 생성) 받기 버튼을 보인다
    var pdf = document.querySelector('[data-pdf-link]');
    if (pdf) {
      fetch(pdf.getAttribute('href'), { method: 'HEAD' })
        .then(function (r) { if (r.ok) pdf.hidden = false; })
        .catch(function () {});
    }
    var printBtn = document.querySelector('[data-print-btn]');
    if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
  }
})();
