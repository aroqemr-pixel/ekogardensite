// Sheet bağlanana kadar / bağlantı koparsa gösterilecek örnek ürünler.
// Kategoriler gerçek ürün gruplarınıza göre düzenlendi. Fiyat sitede
// gösterilmiyor — miktar/fiyat detayı WhatsApp üzerinden konuşuluyor.
const fallbackProducts = [
  { cat: "Sardunyalar", name: "Sardunya", desc: "Antalya'nın renkli sardunya çeşitleri, dış mekan ve balkon için." },
  { cat: "Krizantemler", name: "Krizantem", desc: "Mevsimlik, bol çiçekli krizantem çeşitleri." },
  { cat: "Aromatik Bitkiler", name: "Lavanta", desc: "Kokulu, bakımı kolay aromatik bahçe bitkisi." },
  { cat: "Aromatik Bitkiler", name: "Biberiye", desc: "Kurağa dayanıklı, hem süs hem mutfak bitkisi." },
  { cat: "Çok Yıllık ve Mevsimlikler", name: "Mevsimlik Çiçek Karışımı", desc: "Sezona göre değişen çok yıllık ve mevsimlik çiçek seçenekleri." },
  { cat: "Begonviller", name: "Begonvil (Bougainvillea)", desc: "Bol çiçekli, güneş seven sarılıcı süs bitkisi." },
  { cat: "Otsu Bitkiler", name: "Otsu Bitki Karışımı", desc: "Bahçe ve peyzaj projeleri için otsu bitki çeşitleri." },
  { cat: "Sukulent Bitkiler", name: "Sukulent Çeşitleri", desc: "Az bakım isteyen, kurağa dayanıklı sukulent bitkiler." },
  { cat: "Ağaçlar ve Çalılar", name: "Peyzaj Ağacı & Çalı", desc: "Bahçe ve proje ölçeğine uygun ağaç ve çalı çeşitleri." },
  { cat: "İthal Bitkiler", name: "İthal Bitki Çeşitleri", desc: "Seçkin projeler için ithal süs bitkisi seçenekleri." },
  { cat: "Yapısal Ürünler", name: "Peyzaj Yapısal Ürünleri", desc: "Saksı, zemin kaplama ve peyzaj sert zemin malzemeleri." },
];

let products = fallbackProducts;

function leafIcon(){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M12 2c5 3 8 7 8 12a8 8 0 01-16 0c0-5 3-9 8-12z"/><path d="M12 6v14"/></svg>`;
}

function waLink(productName){
  const msg = encodeURIComponent(`Merhaba, "${productName}" ürünü hakkında bilgi almak istiyorum.`);
  return `https://wa.me/${SITE_CONFIG.waNumber}?text=${msg}`;
}

function render(list){
  const grid = document.getElementById('product-grid');
  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="card-media">
        <span class="card-badge">${p.cat}</span>
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">` : leafIcon()}
      </div>
      <div class="card-body">
        <span class="card-cat">${p.cat}</span>
        <h3>${p.name}</h3>
        <p class="card-desc">${p.desc}</p>
        <div class="card-foot" style="justify-content:flex-end;">
          <a class="order-btn" href="${waLink(p.name)}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39c1.45.79 3.08 1.21 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0012.04 2z"/></svg>
            Bilgi Al
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

function buildCategoryPills(){
  const scroll = document.getElementById('cat-scroll');
  const cats = ["Tümü", ...new Set(products.map(p => p.cat))];
  scroll.innerHTML = cats.map((c, i) =>
    `<a href="#urunler" class="cat-pill${i === 0 ? ' is-active' : ''}" data-cat="${c}">${c}</a>`
  ).join('');
  scroll.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      scroll.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      const cat = pill.dataset.cat;
      render(cat === 'Tümü' ? products : products.filter(p => p.cat === cat));
    });
  });
}

// Google Sheet sütun adlarını (Kategori, Ürün Adı, Açıklama, Görsel URL) iç formata çevirir
function mapSheetRow(row){
  return {
    cat: row["Kategori"] || "Diğer",
    name: row["Ürün Adı"] || row["Urun Adi"] || "",
    desc: row["Açıklama"] || row["Aciklama"] || "",
    image: row["Görsel URL"] || row["Gorsel URL"] || row["Görsel"] || "",
  };
}

async function loadProducts(){
  const status = document.getElementById('load-status');
  if (!SITE_CONFIG.sheetWebAppUrl){
    status.textContent = "Örnek ürünler gösteriliyor — Google Sheets bağlantısı henüz kurulmadı.";
    buildCategoryPills();
    render(products);
    return;
  }
  status.textContent = "Ürünler yükleniyor…";
  try{
    const res = await fetch(`${SITE_CONFIG.sheetWebAppUrl}?type=products`);
    if (!res.ok) throw new Error("Ağ hatası");
    const rows = await res.json();
    const mapped = rows.map(mapSheetRow).filter(p => p.name);
    if (mapped.length === 0) throw new Error("Boş veri");
    products = mapped;
    status.textContent = "";
  } catch(err){
    status.textContent = "Tablo şu an okunamadı, örnek ürünler gösteriliyor.";
    products = fallbackProducts;
  }
  buildCategoryPills();
  render(products);
}

document.addEventListener('DOMContentLoaded', loadProducts);
