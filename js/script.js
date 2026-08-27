/* =========================================================
   بورتفوليو (متعدد الصفحات) — منطق التفاعل
   نفس الملف يُستخدم في كل الصفحات
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- السنة في الفوتر ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- تشغيل حركة الظهور بعد اكتمال تحميل الصفحة ----------
  requestAnimationFrame(() => {
    document.body.classList.add('is-loaded');
  });

  // ---------- الانتقال بين الصفحات مع تلاشي بسيط ----------
  const navLinks = document.querySelectorAll('.nav-link, [data-transition]');

  navLinks.forEach(link => {
    // روابط خارجية أو بريد إلكتروني: بدون تأثير الانتقال
    const href = link.getAttribute('href') || '';
    const isSamePageAnchor = href.startsWith('#');
    const isExternal = link.target === '_blank' || href.startsWith('mailto:') || href.startsWith('http');

    if (isSamePageAnchor || isExternal) return;

    link.addEventListener('click', (e) => {
      // اسمح بفتح الرابط بتاب جديد بشكل طبيعي (Ctrl/Cmd + click)
      if (e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      document.body.classList.add('is-leaving');
      document.body.classList.remove('is-loaded');
      setTimeout(() => {
        window.location.href = href;
      }, 320);
    });
  });

  // ---------- قائمة الجوال ----------
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  navToggle?.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // ---------- كشف العناصر عند التمرير (بطاقات الأعمال والمهارات) ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal.on-scroll').forEach(el => revealObserver.observe(el));

  // ---------- عدّادات الأرقام (تظهر فقط في الصفحة الرئيسية) ----------
  document.querySelectorAll('.meta-num').forEach(el => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    let started = false;

    function play() {
      if (started) return;
      started = true;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(progress * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    // ابدأ العدّ بعد حركة الظهور الأولية للصفحة
    setTimeout(play, 400);
  });

  // ---------- توهج المؤشر ----------
  const glow = document.getElementById('cursorGlow');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (glow && !prefersReducedMotion) {
    window.addEventListener('pointermove', (e) => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    });
  } else if (glow) {
    glow.style.display = 'none';
  }

  // ---------- نموذج التواصل: يفتح تطبيق البريد بالمعلومات المُدخلة ----------
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // TODO: replace this with your real email address
    const myEmail = 'you@example.com';
    const subject = encodeURIComponent(`Message from ${name} via your portfolio`);
    const body    = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`;
  });

});

// دعم زر الرجوع/التقدم في المتصفح: أعد إظهار الصفحة إن كانت محفوظة في الكاش
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    document.body.classList.remove('is-leaving');
    document.body.classList.add('is-loaded');
  }
});
