// طيف الضيافة — السكربت الوحيد. الصفحة كاملة بدونه؛ هو لنموذج الطلب وإغلاق القائمة فقط.
(function () {
  var f = document.getElementById('q');
  if (f) {
    var d = f.elements.d, t = new Date();
    d.min = t.getFullYear() + '-' + ('0' + (t.getMonth() + 1)).slice(-2) + '-' + ('0' + t.getDate()).slice(-2);
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = new FormData(f);
      var m = 'السلام عليكم طيف الضيافة، أبغى عرض سعر:\nالمناسبة: ' + v.get('o') + '\nالمدينة: ' + v.get('c') + '\nالتاريخ: ' + v.get('d') + '\nعدد الضيوف: ' + v.get('g');
      document.getElementById('out').textContent = m;
      location.href = 'https://wa.me/' + f.getAttribute('data-wa') + '?text=' + encodeURIComponent(m);
    });
  }
  var menu = document.querySelector('.menu');
  if (menu) {
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
  }
})();
