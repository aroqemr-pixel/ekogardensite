// Sheet bağlanana kadar / bağlantı koparsa gösterilecek örnek hizmetler.
// Ekleme/çıkarma için kod düzenlemenize gerek yok — Google Sheet'inizdeki
// "Hizmetler" sekmesini düzenlemeniz yeterli.
const fallbackServices = [
  { title: "Üretim", desc: "Kendi fidanlık ve repikaj alanlarımızda süs bitkisi üretimi." },
  { title: "Pazarlama", desc: "\"Antalya Sardunyaları\" ve diğer ürünlerimizin Türkiye geneline pazarlanması." },
  { title: "Danışmanlık", desc: "Peyzaj ve bitki bakımı konularında profesyonel danışmanlık hizmeti." },
];

const serviceIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c5 3 8 7 8 12a8 8 0 01-16 0c0-5 3-9 8-12z"/><path d="M12 6v14"/></svg>`;

function renderServices(list){
  const grid = document.getElementById('services-grid');
  if (!grid) return;
  grid.innerHTML = list.map(s => `
    <div class="service-card">
      <div class="icon">${serviceIcon}</div>
      <h3>${s.title}</h3>
      <p>${s.desc}</p>
    </div>
  `).join('');
}

function mapServiceRow(row){
  return {
    title: row["Baslik"] || row["Başlık"] || "",
    desc: row["Aciklama"] || row["Açıklama"] || "",
  };
}

async function loadServices(){
  const status = document.getElementById('services-status');
  let services = fallbackServices;
  if (SITE_CONFIG.sheetWebAppUrl){
    try{
      const res = await fetch(`${SITE_CONFIG.sheetWebAppUrl}?type=services`);
      if (!res.ok) throw new Error("Ağ hatası");
      const rows = await res.json();
      const mapped = rows.map(mapServiceRow).filter(s => s.title);
      if (mapped.length > 0){
        services = mapped;
        if (status) status.textContent = "";
      } else {
        throw new Error("Boş veri");
      }
    } catch(err){
      if (status) status.textContent = "Hizmet tablosu okunamadı, örnek veriler gösteriliyor.";
    }
  } else if (status){
    status.textContent = "Örnek hizmetler gösteriliyor — Google Sheets bağlantısı henüz kurulmadı.";
  }
  renderServices(services);
}

document.addEventListener('DOMContentLoaded', loadServices);
