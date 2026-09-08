// Sheet bağlanana kadar / bağlantı koparsa gösterilecek örnek kadro.
// Bunu kendi güncel kadronuzla değiştirmek için kod düzenlemenize gerek yok —
// Google Sheet'inizdeki "Ekip" sekmesini düzenlemeniz yeterli.
const fallbackTeam = [
  { name: "Ad Soyad", title: "Unvan — Üniversite" },
];

function renderTeam(list){
  const grid = document.getElementById('team-grid');
  if (!grid) return;
  grid.innerHTML = list.map(m => `
    <div class="service-card">
      <h3>${m.name}</h3>
      <p>${m.title}</p>
    </div>
  `).join('');
}

function mapTeamRow(row){
  return {
    name: row["Ad Soyad"] || "",
    title: row["Unvan"] || "",
  };
}

async function loadTeam(){
  const status = document.getElementById('team-status');
  let team = fallbackTeam;
  if (SITE_CONFIG.sheetWebAppUrl){
    try{
      const res = await fetch(`${SITE_CONFIG.sheetWebAppUrl}?type=team`);
      if (!res.ok) throw new Error("Ağ hatası");
      const rows = await res.json();
      const mapped = rows.map(mapTeamRow).filter(m => m.name);
      if (mapped.length > 0){
        team = mapped;
        if (status) status.textContent = "";
      } else {
        throw new Error("Boş veri");
      }
    } catch(err){
      if (status) status.textContent = "Kadro tablosu okunamadı, örnek veriler gösteriliyor.";
    }
  } else if (status){
    status.textContent = "Örnek kadro gösteriliyor — Google Sheets bağlantısı henüz kurulmadı.";
  }
  renderTeam(team);
}

document.addEventListener('DOMContentLoaded', loadTeam);
