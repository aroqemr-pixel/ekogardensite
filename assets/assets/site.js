/* ====== AYARLAR: kendi bilgilerinizle değiştirin ====== */
const SITE_CONFIG = {
  waNumber: "905000000000", // WhatsApp numaranız (90 ile başlayıp boşluksuz)
  sheetWebAppUrl: "", // Apps Script Web App URL'niz (kurulum: apps-script.gs dosyasındaki adımlar)
};
/* ======================================================= */

function initNav(){
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('nav.links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('is-open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('is-open')));
}

function initWhatsAppLinks(){
  document.querySelectorAll('[data-wa]').forEach(el => {
    const msg = el.getAttribute('data-wa') || "Merhaba, EkoGarden Peyzaj hakkında bilgi almak istiyorum.";
    el.href = `https://wa.me/${SITE_CONFIG.waNumber}?text=${encodeURIComponent(msg)}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initWhatsAppLinks();
});
