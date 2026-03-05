# Bad UI Login: Shoot to Type

Proyek login absurd: untuk mengisi `username` dan `password`, user harus menembak karakter yang beterbangan di layar.

## Demo Credentials
- Username: `andhikapp28`
- Password: `dipa28`

Validasi login saat ini **tidak case-sensitive** (huruf besar/kecil dianggap sama), yang penting urutan karakter sesuai.

## Fitur
- Input login via tembak karakter terbang (tanpa input text normal).
- Karakter berisi huruf, angka, dan simbol dengan gerakan acak.
- Karakter tidak hilang setelah ditembak, jadi bisa dipakai berulang.
- Mode field aktif: pilih `Username` atau `Password` sebelum menembak.
- Password ditampilkan sebagai bullet (`•`).
- Enemy icon (mis. `💣`, `☠`, `🧨`) yang jika ditembak menghapus 1 karakter terakhir.
- Tombol login normal saat password pendek, lalu berubah jadi tombol terbang saat password > 5 karakter.
- Jika gagal menekan login terbang dalam 5 detik, muncul popup ejekan.
- Popup sukses saat login benar.
- Link GitHub di pojok kiri bawah.

## Cara Main
1. Buka `index.html` di browser.
2. Klik field `Username` atau `Password` untuk memilih target input.
3. Tembak karakter yang diinginkan untuk menyusun teks login.
4. Hindari enemy icon agar karakter tidak terhapus.
5. Saat password sudah lebih dari 5 karakter, kejar tombol login yang terbang.
6. Klik tombol login terbang untuk validasi.

## Struktur File
- `index.html` - Struktur UI dan modal popup.
- `styles.css` - Style panel, arena, karakter, modal, dan link footer.
- `script.js` - Logika game, input shooting, enemy effect, mode login terbang, dan validasi.

## Menjalankan Lokal
Tidak butuh build tool.

```bash
# opsi 1: buka langsung
index.html

# opsi 2: pakai static server (opsional)
python -m http.server 8080
```

Lalu akses `http://localhost:8080` jika memakai static server.
