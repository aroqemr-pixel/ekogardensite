Ana sayfa carousel'inde göstermek istediğiniz fotoğraf/videoları bu klasöre
yükleyin (GitHub: Add file > Upload files, bu klasörün içine girip sürükleyin).

Sonra assets/hero-carousel.js dosyasının en üstündeki heroSlides listesine
bir satır ekleyin, örnek:

{ type: "image", src: "assets/hero/sardunya.jpg", caption: "Antalya Sardunyaları", sub: "Kısa açıklama." },

Video için type: "video" yazıp src'yi .mp4 dosyanıza yönlendirin. Videolar
otomatik, sessiz ve döngüde oynar (autoplay muted loop) — tarayıcılar sesli
otomatik oynatmaya izin vermediği için ses kapalı başlar.

Video dosyalarını mümkünse 10-15 MB altında ve kısa (10-20 saniye) tutun,
aksi halde sitenin açılışı yavaşlar.
