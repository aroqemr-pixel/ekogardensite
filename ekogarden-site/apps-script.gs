/**
 * EkoGarden Peyzaj - Ürün kataloğu için Google Apps Script Web App
 *
 * KURULUM:
 * 1. Google Sheets'te yeni bir tablo oluşturun.
 * 2. Sayfa adını "Urunler" yapın (Türkçe karakter kullanmayın: Ürünler değil, Urunler).
 * 3. İlk satıra şu başlıkları yazın (harfine dikkat edin):
 *    Kategori | Ürün Adı | Açıklama | Fiyat | Aktif
 * 4. Alttaki satırlara ürünlerinizi girin. "Aktif" sütununa EVET veya HAYIR yazın
 *    (HAYIR yazdığınız ürünler sitede görünmez, silmeden gizlemiş olursunuz).
 * 5. Üst menüden Uzantılar > Apps Script'i açın.
 * 6. Açılan editördeki örnek kodu silip bu dosyanın tamamını yapıştırın.
 * 7. Sağ üstten "Dağıt" (Deploy) > "Yeni Dağıtım" (New deployment) tıklayın.
 * 8. Tür olarak "Web Uygulaması" (Web app) seçin.
 * 9. "Kimin erişebileceği" (Who has access) alanında "Herkes" (Anyone) seçin.
 *    (Bu, sitenizin veriyi okuyabilmesi için gereklidir; tabloyu düzenleme
 *    yetkisi sadece sizde kalır, bu ayar sadece OKUMA erişimi verir.)
 * 10. Dağıt'a tıklayın, Google hesabınızla izin verin.
 * 11. Size verilen "Web app URL" (https://script.google.com/macros/s/.../exec)
 *     adresini kopyalayıp assets/site.js dosyasındaki SITE_CONFIG.sheetWebAppUrl
 *     değerine yapıştırın (aynı dosyada waNumber alanına da kendi WhatsApp
 *     numaranızı girin — tüm sayfalar bu tek dosyadan ayarları okur).
 * 12. Tabloda değişiklik yaptığınızda site birkaç saniye içinde otomatik günceller
 *     (sayfayı yenilediğinizde). Yeni dağıtım yapmanıza gerek yok, aynı URL çalışmaya devam eder.
 */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Urunler");
  var data = sheet.getDataRange().getValues();
  var headers = data.shift();

  var products = data
    .map(function (row) {
      var obj = {};
      headers.forEach(function (h, i) {
        obj[h] = row[i];
      });
      return obj;
    })
    .filter(function (p) {
      var aktif = String(p["Aktif"] || "").trim().toLowerCase();
      return aktif !== "hayır" && aktif !== "hayir" && aktif !== "no" && aktif !== "false";
    });

  return ContentService.createTextOutput(JSON.stringify(products)).setMimeType(
    ContentService.MimeType.JSON
  );
}
