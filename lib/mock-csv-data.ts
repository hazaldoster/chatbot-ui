/**
 * Mock CSV data for development purposes
 * This is used when the actual CSV file cannot be accessed
 */
export const getMockCSVData = () => {
  return {
    headers: [
      "product_id",
      "name",
      "url",
      "price",
      "rating",
      "rating_count",
      "subcategory",
      "description",
      "comments",
      "color"
    ],
    rows: [
      [
        "865221272",
        "NYX Professional Makeup The Brow Glue Instant Brow Styler",
        "https://example.com/product1",
        "1.079,98 TL",
        "4.3",
        "17",
        "kas_maskarasi",
        "Kaşların hiç bu kadar güçlü ve doğal durmamıştı! NYX Professional Makeup'ın en yeni ve kısa sürede dünya çapında çok sevilen Brow Glue şeffaf kaş sabitleyici maskarası tanış.",
        "Ürünlerim geldi kargo paketlemesi çok iyiydi zorla açtım ürünlerden de gayet memnunum",
        "Turuncu"
      ],
      [
        "758807533",
        "Maybelline New York Tattoo Brow 36H Kaş Makarası 260 Deep Brown",
        "https://example.com/product2",
        "501,88 TL",
        "4.5",
        "25",
        "kas_maskarasi",
        "Tattoo brow 36h kaş boyası 260 deep brown uzun süre kalıcı etki sağlayan kaş maskarası | Suya, tere, bulaşmalara, transfere karşı dayanıklı formüle sahiptir",
        "Çok güzel bir ürün, kesinlikle tavsiye ederim",
        "Kahverengi"
      ],
      [
        "761171646",
        "Maybelline New York Tattoo Brow 36h Maskarası 250 Blonde X 2 Adet",
        "https://example.com/product3",
        "907,17 TL",
        "4.2",
        "18",
        "kas_maskarasi",
        "Maybelline New York Tattoo Brow 36H Maskarası 250 Blonde x 2 Adet, Uzun süre kalıcı etki sağlayan kaş maskarası",
        "Ürün beklediğim gibi çıktı, çok memnunum",
        "Kahverengi"
      ],
      [
        "892345671",
        "L'Oreal Paris True Match Fondöten 1.R/1.C Rose Ivory",
        "https://example.com/product4",
        "799,90 TL",
        "4.7",
        "42",
        "fondoten",
        "L'Oreal Paris True Match Fondöten, cildinize mükemmel uyum sağlayan formülü ile doğal bir görünüm sunar. Cildinizin alt tonuna uygun olarak geliştirilen renk seçenekleri ile kusursuz bir makyaj için idealdir.",
        "Cildimde çok doğal duruyor, kesinlikle tavsiye ederim",
        "Bej"
      ],
      [
        "723456789",
        "MAC Retro Matte Lipstick Ruby Woo",
        "https://example.com/product5",
        "1.250,00 TL",
        "4.8",
        "67",
        "ruj",
        "MAC'in ikonik mat kırmızı ruju Ruby Woo, uzun süre kalıcı formülü ve yoğun pigmentasyonu ile dudaklarınızda mükemmel bir görünüm sağlar.",
        "En sevdiğim kırmızı ruj, her kadının makyaj çantasında olmalı",
        "Kırmızı"
      ],
      [
        "634567890",
        "Clinique Moisture Surge 100H Auto-Replenishing Hydrator",
        "https://example.com/product6",
        "1.850,00 TL",
        "4.6",
        "38",
        "nemlendirici",
        "Clinique'in yenilikçi nemlendirici kremi, cildinize 100 saat boyunca nem sağlar. Hafif jel formülü ile cilt tarafından hızla emilir ve yağlı bir his bırakmaz.",
        "Cildim çok daha nemli ve canlı görünüyor, kesinlikle tekrar alacağım",
        "Şeffaf"
      ],
      [
        "545678901",
        "Dior Backstage Eye Palette 001 Warm Neutrals",
        "https://example.com/product7",
        "2.100,00 TL",
        "4.9",
        "53",
        "goz_farı",
        "Dior Backstage Eye Palette, profesyonel makyaj artistlerinin favorisi olan nötr tonlarla dolu bir palet. Mat ve simli bitişlere sahip dokuz renk içerir.",
        "Renkleri çok pigmentli ve karıştırması kolay, günlük makyaj için mükemmel",
        "Kahverengi/Bej"
      ],
      [
        "456789012",
        "Estée Lauder Double Wear Stay-in-Place Foundation",
        "https://example.com/product8",
        "2.450,00 TL",
        "4.8",
        "89",
        "fondoten",
        "24 saat kalıcı, orta-tam kapatıcılığa sahip fondöten. Yağlı ciltte bile akmaz, bulaşmaz ve transfer olmaz.",
        "Yıllardır kullanıyorum, benim için en iyi fondöten",
        "Bej"
      ]
    ]
  }
}
