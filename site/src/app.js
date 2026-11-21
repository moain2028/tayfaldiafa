// طيف الضيافة — السكربت الوحيد. الصفحة كاملة بدونه؛ هو لنموذج الطلب وإغلاق القائمة فقط.
(function () {
  var f = document.getElementById('q');
  if (f) {
    try { f.elements.d.min = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date()); } catch (e) {}
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = new FormData(f);
      var m = 'السلام عليكم طيف الضيافة، أبغى عرض سعر:\nالمناسبة: ' + v.get('o') + '\nالمدينة: ' + v.get('c') + '\nالتاريخ: ' + v.get('d') + '\nعدد الضيوف: ' + v.get('g');
      var n = f.getAttribute('data-wa'), note = f.getAttribute('data-note');
      document.getElementById('out').textContent = m + (note ? '\n\n' + note : '');
      if (/^9665\d{8}$/.test(n)) location.href = 'https://wa.me/' + n + '?text=' + encodeURIComponent(m);
    });
  }
  var menu = document.querySelector('.menu');
  if (menu) {
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  }
})();
