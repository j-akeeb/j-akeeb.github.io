(function () {
  var R = document.documentElement;
  function get(k) { try { return localStorage.getItem('epub2site:' + k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem('epub2site:' + k, v); } catch (e) {} }

  var theme = get('theme'); if (theme) R.dataset.theme = theme;
  var scale = parseFloat(get('scale')) || 1;
  R.style.setProperty('--scale', scale);
  if (window.matchMedia('(max-width:900px)').matches) R.classList.add('toc-closed');

  document.addEventListener('DOMContentLoaded', function () {
    var body = document.body, book = body.dataset.book, page = body.dataset.page;

    var tocBtn = document.getElementById('toc-toggle');
    if (tocBtn) {
      tocBtn.setAttribute('aria-expanded', String(!R.classList.contains('toc-closed')));
      tocBtn.addEventListener('click', function () {
        var closed = R.classList.toggle('toc-closed');
        tocBtn.setAttribute('aria-expanded', String(!closed));
      });
      var cur = document.querySelector('#toc [aria-current]'), toc = document.getElementById('toc');
      if (cur && toc) toc.scrollTop = cur.offsetTop - toc.clientHeight / 3;
    }

    function bump(delta) {
      scale = Math.max(0.8, Math.min(1.6, Math.round((scale + delta) * 100) / 100));
      R.style.setProperty('--scale', scale); set('scale', scale);
    }
    var sm = document.getElementById('smaller'), lg = document.getElementById('larger'),
        th = document.getElementById('theme');
    if (sm) sm.addEventListener('click', function () { bump(-0.1); });
    if (lg) lg.addEventListener('click', function () { bump(0.1); });
    if (th) th.addEventListener('click', function () {
      var dark = R.dataset.theme === 'dark' ||
        (!R.dataset.theme && window.matchMedia('(prefers-color-scheme:dark)').matches);
      R.dataset.theme = dark ? 'light' : 'dark'; set('theme', R.dataset.theme);
    });

    document.querySelectorAll('.book a[href^="http"]').forEach(function (a) {
      a.target = '_blank'; a.rel = 'noopener';
    });

    document.addEventListener('keydown', function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (/input|textarea|select/i.test(e.target.tagName)) return;
      var sel = e.key === 'ArrowLeft' ? '.pager .prev' : e.key === 'ArrowRight' ? '.pager .next' : null;
      var a = sel && document.querySelector(sel);
      if (a) location.href = a.href;
    });

    if (body.classList.contains('chapter') && book && page) set('last:' + book, page);
    var cont = document.getElementById('continue'), last = book && get('last:' + book);
    if (cont && last) { cont.href = last; cont.hidden = false; }
  });
})();
