// panggil fungsi readline 
const readline = require('./readline');
// panggil fungsi untuk menyimpan database sementara
const databaseKontak = require('./storage');

// buat object kosong untuk menampung inputan 
let objectKontak = {
    nama: '',
    nomorHp: ''
}

function viewMenu() { //fungsi untuk menampilkan halaman menu
    console.log("Selamat Datang Di Aplikasi Kontak !");
    console.log("====================================\n");
    console.log("Main Menu :\n");
    console.log("1.Tambah Data \n");
    console.log("2.Lihat Data \n");
    console.log("3.Hapus Data \n");
    console.log("4.Pencarian Data \n");
    console.log("5.Reset Data \n");
    readline.question(`Silahkan Masukan Pilihan Anda  :`, input => {
        mainMenu(Number(input))
    });
}

function mainMenu(pilihan) { // fungsi untuk mengatur pilihan menu
    switch (pilihan) {
        case 1:
            simpan()
            break;
        case 2:
            lihatData()
            break;
        case 3:
            hapusData()
            break;
        case 4:
            pencarianData()
            break;
        case 5:
            resetData()
            break;
        default:
            console.log("Pilihan Tidak Valid !");
            readline.close()
            break;
    }
}

function simpan() { // fungsi untuk menyimpan data
    console.log("Silahkan Masukan Data : ");
    readline.question("Nama :", (nama) => {
        if (typeof nama === 'string' && nama.trim() !== '') {
            objectKontak.nama = nama.trim();
            ambilInputanNomor();
        } else {
            console.log("Nama yang Anda masukkan tidak valid");
            simpan(); // meminta nama lagi jika input tidak valid
        }
    });
}

const ambilInputanNomor = () => { // fungsi untuk mengambil inputan nomor
    readline.question("Nomor :", (nomor) => {
        const nomorHp = parseFloat(nomor);
        if (!isNaN(nomorHp)) {
            if (isNomorHpExists(nomorHp)) {
                console.log("Nomor yang Anda masukkan sudah ada dalam data.");
                ambilInputanNomor(); // Meminta nomor lagi jika nomor sudah ada dalam data
            } else {
                objectKontak.nomorHp = nomorHp;
                databaseKontak.push(Object.assign({}, objectKontak)); // insert data kedalam array databaseKontak
                console.log(`Input data berhasil! Nama: ${objectKontak.nama}, Nomor: ${objectKontak.nomorHp}`);
                kembali();
            }
        } else {
            console.log("Nomor yang Anda masukkan tidak valid.");
            ambilInputanNomor(); // Meminta nomor lagi jika input tidak valid
        }
    });
}

function isNomorHpExists(nomorHp) {
    // Fungsi ini memeriksa apakah nomorHp sudah ada dalam databaseKontak
    return databaseKontak.some((kontak) => kontak.nomorHp === nomorHp);
}

const kembali = () => { // fungsi untuk navigasi kembali
    readline.question("Apakah Anda Ingin Kembali ? (y/n) :", (pilihan) => {
        if (pilihan === "y") {
            viewMenu()
        } else {
            readline.close()
        }
    });
}

function lihatData() { // fungsi untuk melihat list data
    console.table(databaseKontak);
    kembali()
}

function resetData() {
    // fungsi reset data 
    databaseKontak.length = 0; // menghapus database dengan mangatur panjangnya ke nol
    console.log("Data berhasil direset.");
    kembali();
}

function pencarianData() {
    // fungsi pencarian data 
    readline.question("Masukkan karakter yang ingin Anda cari dalam nama: ", (searchCharacter) => {
        const results = databaseKontak.filter((kontak) => kontak.nama.toLowerCase().includes(searchCharacter.toLowerCase()));

        if (results.length > 0) {
            console.log("Hasil pencarian:");
            console.table(results);
        } else {
            console.log("Data tidak ditemukan.");
        }

        kembali();
    });
}

function hapusData() {
    // fungsi hapus data
    readline.question("Masukkan nama yang ingin Anda hapus: ", (deleteName) => {
        const indexToDelete = databaseKontak.findIndex((kontak) => kontak.nama.toLowerCase() === deleteName.toLowerCase());

        if (indexToDelete !== -1) {
            databaseKontak.splice(indexToDelete, 1);
            console.log(`Data dengan nama "${deleteName}" berhasil dihapus.`);
        } else {
            console.log("Data tidak ditemukan.");
        }

        kembali();
    });
}

viewMenu() // panggil fungsi view menu untuk pertama kali
