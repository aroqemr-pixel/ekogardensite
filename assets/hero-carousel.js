/* ====================================================================
   ANA SAYFA SLAYT AYARLARI
   Buraya kendi fotoğraf/video dosyalarınızı ekleyin. Her slayt için:
   - type: "image" veya "video"
   - src:  assets/hero/ klasörüne yüklediğiniz dosyanın adı
   - caption / sub: slaytın üzerinde görünecek kısa başlık ve alt yazı
   Fotoğraf/video dosyalarını GitHub'da assets/hero/ klasörüne yükleyin,
   sonra aşağıdaki listeye bir satır olarak ekleyin. Sıra önemli değil,
   istediğiniz kadar slayt ekleyip çıkarabilirsiniz (en az 1 tane kalmalı).
   ==================================================================== */
const heroSlides = [
  // Örnek — kendi görsellerinizi ekleyene kadar bu placeholder gösterilir:
  // { type: "image", src: "assets/hero/sardunya.jpg", caption: "Antalya Sardunyaları", sub: "2003'ten beri Türkiye'nin her yerine ulaşan süs bitkilerimiz." },
  // { type: "video", src: "assets/hero/tanitim.mp4", caption: "Fidanlığımızı tanıyın", sub: "Üretim alanlarımızdan kısa bir video." },
];

const HERO_INTERVAL_MS = 5000;

function heroSlideMarkup(slide, isActive){
  const media = slide.type === "video"
    ? `<video src="${slide.src}" autoplay muted loop playsinline></video>`
    : `<img src="${slide.src}" alt="${slide.caption || ''}" loading="lazy">`;
  return `
    <div class="hero-slide${isActive ? ' is-active' : ''}">
      ${media}
      ${slide.caption ? `
        <div class="cap">
          <strong>${slide.caption}</strong>
          ${slide.sub ? `<span>${slide.sub}</span>` : ''}
        </div>` : ''}
    </div>`;
}

function initHeroCarousel(){
  const root = document.getElementById('hero-carousel');
  if (!root) return;

  // Slayt girilmemişse eski sabit görünümü (gradyan + yazı) koru.
  if (heroSlides.length === 0){
    root.innerHTML = `
      <div class="cap">
        <strong>Antalya Sardunyaları</strong>
        <span>2003'ten beri Türkiye'nin her yerine ulaşan süs bitkilerimiz.</span>
      </div>`;
    return;
  }

  root.classList.add('has-carousel');
  root.innerHTML = heroSlides.map((s, i) => heroSlideMarkup(s, i === 0)).join('') +
    (heroSlides.length > 1 ? `
      <div class="hero-dots">
        ${heroSlides.map((_, i) => `<button class="hero-dot${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-label="Slayt ${i + 1}"></button>`).join('')}
      </div>` : '');

  const slideEls = root.querySelectorAll('.hero-slide');
  const dotEls = root.querySelectorAll('.hero-dot');
  let current = 0;
  let timer = null;

  function goTo(i){
    slideEls[current].classList.remove('is-active');
    dotEls[current] && dotEls[current].classList.remove('is-active');
    current = (i + slideEls.length) % slideEls.length;
    slideEls[current].classList.add('is-active');
    dotEls[current] && dotEls[current].classList.add('is-active');
  }

  function start(){
    if (slideEls.length < 2) return;
    timer = setInterval(() => goTo(current + 1), HERO_INTERVAL_MS);
  }
  function stop(){
    if (timer) clearInterval(timer);
  }

  dotEls.forEach(dot => {
    dot.addEventListener('click', () => {
      stop();
      goTo(parseInt(dot.dataset.i, 10));
      start();
    });
  });

  // Fare üzerine gelince slayt geçişini durdur, ayrılınca devam ettir.
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  start();
}

document.addEventListener('DOMContentLoaded', initHeroCarousel);
