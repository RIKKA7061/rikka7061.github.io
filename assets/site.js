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
  });
})();
