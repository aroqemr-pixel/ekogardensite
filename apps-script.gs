/**
 * Eko/Garden Peyzaj - Site içeriği için Google Apps Script Web App
 *
 * Bu script TEK bir Google Sheets dosyasındaki 3 AYRI SEKMEyi (tab) okuyup
 * siteye JSON olarak sunar. Sitedeki ürünleri, kadroyu ve hizmetleri kod
 * yazmadan, sadece bu tabloyu düzenleyerek yönetirsiniz — tablonuz "admin
 * panelinizdir".
 *
 * KURULUM:
 * 1. Google Sheets'te yeni bir tablo (dosya) oluşturun.
 * 2. Alt kısımda sekme ekle (+) ile TAM OLARAK şu 3 sekmeyi oluşturun
 *    (isimler harfine harfine aynı olmalı, Türkçe karakter kullanmayın):
 *
 *    SEKME: Urunler       başlıklar: Kategori | Ürün Adı | Açıklama | Görsel URL | Aktif
 *    SEKME: Ekip          başlıklar: Ad Soyad | Unvan | Aktif
 *    SEKME: Hizmetler     başlıklar: Baslik | Aciklama | Aktif
 *
 *    Not: Urunler'de Fiyat sütunu YOK — sitede fiyat gösterilmiyor. Görsel URL
 *    isteğe bağlıdır; boş bırakılırsa ürün kartında yaprak ikonu gösterilir.
 *    Kendi fotoğrafınızı kullanmak için fotoğrafı GitHub reponuzdaki
 *    assets/products/ klasörüne yükleyip bu sütuna assets/products/dosyaadi.jpg
 *    şeklinde yazabilir, ya da herhangi bir görselin doğrudan linkini yapıştırabilirsiniz.
 *
 * 3. Her sekmenin ilk satırına yukarıdaki başlıkları yazın, alt satırlara
 *    kendi verinizi girin. "Aktif" sütununa EVET veya HAYIR yazın — HAYIR
 *    yazdığınız satır sitede görünmez (silmeden gizlemiş olursunuz, bir
 *    ürünü/kişiyi/hizmeti geçici kaldırmak için idealdir).
 * 4. Üst menüden Uzantılar > Apps Script'i açın.
 * 5. Açılan editördeki örnek kodu silip bu dosyanın TAMAMINI yapıştırın.
 * 6. Sağ üstten Dağıt (Deploy) > Yeni Dağıtım (New deployment).
 * 7. Tür olarak Web Uygulaması (Web app) seçin.
 * 8. "Kimin erişebileceği" alanında Herkes (Anyone) seçin — bu sadece
 *    OKUMA izni verir, tabloyu düzenleme yetkisi yine sadece sizdedir.
 * 9. Dağıt'a tıklayın, Google hesabınızla izin verin.
 * 10. Size verilen Web app URL'sini (https://script.google.com/macros/s/.../exec)
 *     kopyalayıp assets/site.js dosyasındaki SITE_CONFIG.sheetWebAppUrl
 *     değerine yapıştırın.
 * 11. Bundan sonra: ürün eklemek/çıkarmak, kadro güncellemek, hizmet
 *     eklemek/kaldırmak için SADECE bu tabloyu düzenlersiniz. Kaydettiğinizde
 *     site birkaç saniye içinde (sayfa yenilenince) otomatik güncellenir.
 *     Yeni bir dağıtım yapmanıza gerek yoktur, aynı URL çalışmaya devam eder.
 */
function doGet(e) {
  var type = ((e && e.parameter && e.parameter.type) || "products").toLowerCase();

  var sheetMap = {
    products: "Urunler",
    team: "Ekip",
    services: "Hizmetler",
  };

  var sheetName = sheetMap[type];
  if (!sheetName) {
    return jsonOutput([]);
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    return jsonOutput([]);
  }

  var data = sheet.getDataRange().getValues();
  var headers = data.shift();

  var rows = data
    .map(function (row) {
      var obj = {};
      headers.forEach(function (h, i) {
        obj[h] = row[i];
      });
      return obj;
    })
    .filter(function (r) {
      var aktif = String(r["Aktif"] || "").trim().toLowerCase();
      return aktif !== "hayır" && aktif !== "hayir" && aktif !== "no" && aktif !== "false";
    });

  return jsonOutput(rows);
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
