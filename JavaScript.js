// JavaScript.js (reemplaza tu archivo por este)
// Versión limpia: abre/cierra modales solo al hacer click, oculta todo al cargar.
document.addEventListener('DOMContentLoaded', () => {
  const openButtons = document.querySelectorAll('[data-modal]');
  const overlays = document.querySelectorAll('.modal-overlay');

  // Asegurar que todos los overlays estén ocultos al inicio
  overlays.forEach(o => {
    o.classList.remove('open');
    o.style.display = 'none';
    o.setAttribute('aria-hidden', 'true');
  });

  let lastFocused = null;
  const TRANSITION_MS = 300; // debe coincidir con tu CSS (transición de apertura/cierre)

  function openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    lastFocused = document.activeElement;

    // Mostrar overlay y activar clase "open" (usa requestAnimationFrame para animaciones)
    overlay.style.display = 'flex';
    // fuerza reflow para que la clase 'open' active la transición
    requestAnimationFrame(() => overlay.classList.add('open'));
    overlay.setAttribute('aria-hidden', 'false');

    // bloquear scroll de fondo
    document.body.style.overflow = 'hidden';

    // enfocar el primer elemento focoable dentro del modal (si existe)
    const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function closeModal(overlay) {
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');

    // esperar la duración de la transición antes de ocultarlo
    setTimeout(() => {
      overlay.style.display = 'none';
      // restaurar scroll
      document.body.style.overflow = '';
      // restaurar foco al elemento que abrió el modal
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
      lastFocused = null;
    }, TRANSITION_MS);
  }

  // Abrir modal al click en botones con data-modal
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-modal');
      if (!id) return;
      openModal(id);
    });
  });

  // Cerrar cuando se hace click en botones con clase .modal-close o fuera del contenido (overlay)
  document.addEventListener('click', (e) => {
    // click en botón de cerrar (puede ser .modal-close o .modal-close dentro del modal)
    if (e.target.matches('.modal-close')) {
      const overlay = e.target.closest('.modal-overlay');
      if (overlay) closeModal(overlay);
      return;
    }

    // click directamente en el overlay (fuera del modal interior)
    if (e.target.matches('.modal-overlay')) {
      closeModal(e.target);
      return;
    }
  });

  // Cerrar con ESC y manejar trap de Tab
  document.addEventListener('keydown', (e) => {
    // ESC => cerrar
    if (e.key === 'Escape') {
      const openOverlay = document.querySelector('.modal-overlay.open');
      if (openOverlay) closeModal(openOverlay);
      return;
    }

    // Trap de foco dentro del modal cuando está abierto (Tab / Shift+Tab)
    if (e.key === 'Tab') {
      const openOverlay = document.querySelector('.modal-overlay.open');
      if (!openOverlay) return;

      const focusable = Array.from(openOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter(el => !el.hasAttribute('disabled'));
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});
// Carrusel simple - Autoplay con pausa en hover, next/prev e indicadores
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('main-carousel');
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const indicatorsWrap = carousel.querySelector('.carousel-indicators');

  let index = slides.findIndex(s => s.classList.contains('active'));
  if (index < 0) index = 0;
  const total = slides.length;
  const INTERVAL = 3000; // ms
  let timer = null;
  let paused = false;

  // crear indicadores
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    if (i === index) btn.classList.add('active');
    btn.addEventListener('click', () => goTo(i));
    indicatorsWrap.appendChild(btn);
  });
  const indicators = Array.from(indicatorsWrap.children);

  function update() {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    indicators.forEach((b, i) => b.classList.toggle('active', i === index));
  }

  function next() { index = (index + 1) % total; update(); }
  function prev() { index = (index - 1 + total) % total; update(); }
  function goTo(i) { index = (i + total) % total; update(); resetTimer(); }

  // handlers botones
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetTimer(); });

  // autoplay
  function startTimer() {
    stopTimer();
    timer = setInterval(() => { if (!paused) next(); }, INTERVAL);
  }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function resetTimer() { stopTimer(); startTimer(); }

  // pausa al hover / touch
  carousel.addEventListener('mouseenter', () => { paused = true; });
  carousel.addEventListener('mouseleave', () => { paused = false; });
  carousel.addEventListener('touchstart', () => { paused = true; }, {passive:true});
  carousel.addEventListener('touchend', () => { paused = false; }, {passive:true});

  // init
  update();
  startTimer();
});
document.getElementById("btn-contacto").addEventListener("click", function() {
  alert("📞 Mi número de contacto es: 5");
});
