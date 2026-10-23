
// ==========================================
// LR APPAREL - SCRIPT.JS
// ==========================================

// GANTI dengan nomor WhatsApp admin yang sebenarnya.
// Format: 62 + nomor tanpa angka 0 di depan.
// Contoh: 081234567890 menjadi 6281234567890.
const NOMOR_ADMIN = "6282335793398";

// Data katalog dan harga awal per potong.
// Silakan sesuaikan harga dengan harga resmi LR APPAREL.
const DAFTAR_DESAIN = [
  {
    kode: "LR-001",
    nama: "Jersey Bola",
    harga: 100000,
    deskripsi: "Sporty, dinamis, dan modern.",
    gambar: "images/velocity.jpg",
    warna: "#c7f36b",
    latar: "linear-gradient(140deg, #293d1b, #131d15)"
  },
  {
    kode: "LR-002",
    nama: "Phantom",
    harga: 110000,
    deskripsi: "Minimalis dengan karakter kuat.",
    gambar: "images/phantom.jpg",
    warna: "#d7dce6",
    latar: "linear-gradient(140deg, #354254, #151d29)"
  },
  {
    kode: "LR-003",
    nama: "Striker",
    harga: 120000,
    deskripsi: "Tampilan berani untuk tim kompetitif.",
    gambar: "images/striker.jpg",
    warna: "#ff9d72",
    latar: "linear-gradient(140deg, #552e2b, #241819)"
  }
];

// Biaya tambahan bahan per potong.
const BIAYA_BAHAN = {
  dryfit: 0,
  premium: 10000,
  interlock: 15000
};

const NAMA_BAHAN = {
  dryfit: "Dryfit Standar",
  premium: "Emboss",
  interlock: "Interlock"
};

// Mengambil elemen HTML berdasarkan ID.
const elemen = (id) => document.getElementById(id);

const katalogGrid = elemen("catalogGrid");
const form = elemen("orderForm");
const inputDesain = elemen("desain");
const inputJumlah = elemen("jumlah");
const inputDP = elemen("dp");
const inputBahan = elemen("bahan");
const inputTanggal = elemen("target");

// Format angka menjadi Rupiah.
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

// Menghasilkan tanggal lokal format YYYY-MM-DD.
function tanggalLokalHariIni() {
  const sekarang = new Date();
  const tahun = sekarang.getFullYear();
  const bulan = String(sekarang.getMonth() + 1).padStart(2, "0");
  const hari = String(sekarang.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
}

// Mengambil data desain berdasarkan kode yang dipilih.
function cariDesain(kode) {
  return DAFTAR_DESAIN.find((desain) => desain.kode === kode);
}

// Membuat kartu katalog dari data desain.
function buatKatalog() {
  katalogGrid.innerHTML = "";

  DAFTAR_DESAIN.forEach((desain) => {
    const kartu = document.createElement("article");
    kartu.className = "product-card";
    kartu.dataset.kode = desain.kode;

    kartu.innerHTML = `
      <div class="product-art"
           style="background: ${desain.latar}">
        <div class="mini-jersey"
             style="background: ${desain.warna}; color: #111809;">
          LR
        </div>
        <span class="design-code">${desain.kode}</span>
      </div>

      <div class="product-info">
        <h3>${desain.nama}</h3>
        <p>${desain.deskripsi}</p>

        <div class="product-bottom">
          <div class="product-price">
            ${formatRupiah(desain.harga)}
            <small>Harga awal / potong</small>
          </div>

          <button class="choose-button"
                  type="button"
                  data-pilih="${desain.kode}">
            Pilih Desain
          </button>
        </div>
      </div>
    `;

    katalogGrid.appendChild(kartu);
  });

  // Mengisi pilihan desain pada formulir.
  DAFTAR_DESAIN.forEach((desain) => {
    const opsi = document.createElement("option");
    opsi.value = desain.kode;
    opsi.textContent = `${desain.kode} - ${desain.nama}`;
    inputDesain.appendChild(opsi);
  });

  perbaruiKartuTerpilih();
}

// Menandai kartu desain yang sedang dipilih.
function perbaruiKartuTerpilih() {
  document.querySelectorAll(".product-card").forEach((kartu) => {
    const terpilih = kartu.dataset.kode === inputDesain.value;

    kartu.classList.toggle("is-selected", terpilih);

    const tombol = kartu.querySelector(".choose-button");
    tombol.textContent = terpilih ? "Terpilih" : "Pilih Desain";
  });
}

// Menghitung total, DP, dan sisa pembayaran.
function hitungBiaya() {
  const desain = cariDesain(inputDesain.value);
  const jumlah = Number(inputJumlah.value);
  const persentaseDP = Number(inputDP.value);
  const kodeBahan = inputBahan.value;

  const jumlahValid =
    Number.isInteger(jumlah) && jumlah >= 1 && jumlah <= 500;

  const hargaDesain = desain ? desain.harga : 0;
  const tambahanBahan = BIAYA_BAHAN[kodeBahan] ?? 0;
  const hargaSatuan = hargaDesain + tambahanBahan;

  const total = jumlahValid ? hargaSatuan * jumlah : 0;
  const nilaiDP = Math.round(total * persentaseDP / 100);
  const sisa = total - nilaiDP;

  elemen("ringkasanDesain").textContent =
    desain ? `${desain.kode} - ${desain.nama}` : "Belum dipilih";

  elemen("ringkasanJumlah").textContent =
    jumlahValid ? `${jumlah} potong` : "Jumlah belum valid";

  elemen("hargaSatuan").textContent = formatRupiah(hargaSatuan);

  elemen("ringkasanBahan").textContent =
    NAMA_BAHAN[kodeBahan] || "Belum dipilih";

  elemen("total").textContent = formatRupiah(total);
  elemen("nilaiDP").textContent = formatRupiah(nilaiDP);
  elemen("sisa").textContent = formatRupiah(sisa);

  perbaruiKartuTerpilih();

  return {
    desain,
    jumlah,
    jumlahValid,
    kodeBahan,
    hargaSatuan,
    total,
    persentaseDP,
    nilaiDP,
    sisa
  };
}

// Memilih desain dengan mengeklik kartu katalog.
katalogGrid.addEventListener("click", (event) => {
  const tombol = event.target.closest("[data-pilih]");

  if (!tombol) return;

  inputDesain.value = tombol.dataset.pilih;
  hitungBiaya();

  elemen("pemesanan").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// Perbarui estimasi saat pilihan formulir berubah.
[inputDesain, inputJumlah, inputDP, inputBahan].forEach((input) => {
  input.addEventListener("input", hitungBiaya);
  input.addEventListener("change", hitungBiaya);
});

// Mengubah nomor pelanggan ke format internasional.
function formatNomorPelanggan(nomor) {
  let angka = nomor.replace(/\D/g, "");

  if (angka.startsWith("0")) {
    angka = "62" + angka.slice(1);
  } else if (angka.startsWith("8")) {
    angka = "62" + angka;
  }

  return angka;
}

// Menampilkan tanggal target dalam format Indonesia.
function formatTanggalIndonesia(tanggal) {
  if (!tanggal) return "Belum ditentukan";

  const [tahun, bulan, hari] = tanggal.split("-").map(Number);
  const tanggalObjek = new Date(tahun, bulan - 1, hari);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(tanggalObjek);
}

// Membuat pesan pesanan dan membuka WhatsApp.
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  // Ganti nomor admin di atas sebelum memakai fitur ini.
  if (!/^\d{10,15}$/.test(NOMOR_ADMIN) ||
      NOMOR_ADMIN === "6281234567890") {
    alert(
      "Silakan ganti NOMOR_ADMIN di script.js dengan nomor WhatsApp admin LR APPAREL yang benar."
    );
    return;
  }

  const hasil = hitungBiaya();

  if (!hasil.desain) {
    alert("Silakan pilih desain jersi terlebih dahulu.");
    inputDesain.focus();
    return;
  }

  if (!hasil.jumlahValid) {
    alert("Jumlah jersi harus berupa angka bulat antara 1 sampai 500.");
    inputJumlah.focus();
    return;
  }

  const tanggalTarget = inputTanggal.value;

  if (tanggalTarget && tanggalTarget < tanggalLokalHariIni()) {
    alert("Tanggal target selesai tidak boleh berada di masa lalu.");
    inputTanggal.focus();
    return;
  }

  const nomorPelanggan = formatNomorPelanggan(elemen("wa").value);

  if (!/^\d{10,15}$/.test(nomorPelanggan)) {
    alert("Periksa kembali nomor WhatsApp Anda.");
    elemen("wa").focus();
    return;
  }

  const nama = elemen("nama").value.trim();
  const namaTim = elemen("tim").value.trim();
  const daftarPemain = elemen("pemain").value.trim();
  const catatan = elemen("catatan").value.trim();

  const pesan = [
    "HALO LR APPAREL, SAYA INGIN MEMESAN JERSI",
    "",
    "DATA PEMESAN",
    `Nama: ${nama}`,
    `WhatsApp: ${nomorPelanggan}`,
    `Nama tim: ${namaTim}`,
    "",
    "DETAIL PESANAN",
    `Kode desain: ${hasil.desain.kode}`,
    `Nama desain: ${hasil.desain.nama}`,
    `Bahan: ${NAMA_BAHAN[hasil.kodeBahan]}`,
    `Jumlah: ${hasil.jumlah} potong`,
    `Harga per potong: ${formatRupiah(hasil.hargaSatuan)}`,
    `Estimasi total: ${formatRupiah(hasil.total)}`,
    `DP (${hasil.persentaseDP}%): ${formatRupiah(hasil.nilaiDP)}`,
    `Perkiraan sisa pembayaran: ${formatRupiah(hasil.sisa)}`,
    `Target selesai: ${formatTanggalIndonesia(tanggalTarget)}`,
    "",
    "NAMA DAN NOMOR PEMAIN",
    daftarPemain || "Belum dicantumkan",
    "",
    "CATATAN TAMBAHAN",
    catatan || "Tidak ada",
    "",
    "Mohon konfirmasi harga final, jadwal produksi, dan cara pembayaran. Terima kasih."
  ];

  const teksPesan = encodeURIComponent(pesan.join("\n"));
  const urlWhatsApp = `https://wa.me/${NOMOR_ADMIN}?text=${teksPesan}`;

  // Membuka WhatsApp pada tab baru.
  window.open(urlWhatsApp, "_blank", "noopener,noreferrer");
});

// Tetapkan tanggal minimum pada input target selesai.
inputTanggal.min = tanggalLokalHariIni();

// Tampilkan tahun saat ini di footer.
elemen("tahun").textContent = new Date().getFullYear();

// Jalankan fungsi awal ketika script dimuat.
buatKatalog();
hitungBiaya();
