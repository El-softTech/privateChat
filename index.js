import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";
const git = simpleGit();

// Fungsi untuk membuat commit dengan tanggal yang disesuaikan
const markCommit = (x, y) => {
  const date = moment()
    .subtract(1, "y")  // Mengurangi 1 tahun
    .add(1, "d")       // Menambahkan 1 hari
    .add(x, "w")       // Menambahkan x minggu
    .add(y, "d")       // Menambahkan y hari
    .format();         // Mengonversi menjadi format yang sesuai

  const data = { date: date };

  // Menulis data ke file
  jsonfile.writeFile(path, data, (err) => {
    if (err) return console.error("Error writing file:", err);
    console.log(`File written with date: ${date}`);
    
    // Menambahkan file ke staging area
    git.add([path], (err) => {
      if (err) return console.error("Error adding file:", err);
      console.log(`File added: ${path}`);
      
      // Melakukan commit
      git.commit(date, { "--date": date }, (err) => {
        if (err) return console.error("Error committing file:", err);
        console.log(`Commit made with date: ${date}`);
        
        // Melakukan push ke GitHub
        git.push("origin", "main", (err) => {
          if (err) return console.error("Error pushing commit:", err);
          console.log(`Pushed commit with date: ${date}`);
        });
      });
    });
  });
};

// Fungsi untuk membuat n commit
const makeCommits = (n) => {
  if (n === 0) {
    // Jika sudah tidak ada commit lagi, lakukan push terakhir
    git.push("origin", "main", (err) => {
      if (err) return console.error("Error pushing final commit:", err);
      console.log("Final push successful");
    });
    return;
  }

  // Menentukan nilai x dan y untuk menyesuaikan tanggal commit
  const x = random.int(0, 54);  // 0 hingga 54 minggu
  const y = random.int(0, 6);   // 0 hingga 6 hari
  const date = moment()
    .subtract(1, "y")
    .add(1, "d")
    .add(x, "w")
    .add(y, "d")
    .format();  // Format tanggal yang sesuai

  const data = { date: date, random: random.int(0, 1000000) }; // Tambahkan nilai acak agar file berubah setiap kali
  console.log(date);  // Menampilkan tanggal commit yang dibuat

  // Menulis data ke file
  jsonfile.writeFile(path, data, (err) => {
    if (err) return console.error("Error writing file:", err);

    // Menambahkan file ke staging area
    git.add([path], (err) => {
      if (err) return console.error("Error adding file:", err);
      
      // Melakukan commit
      git.commit(date, { "--date": date }, (err) => {
        if (err) return console.error("Error committing file:", err);

        // Rekursif untuk membuat commit berikutnya
        makeCommits(--n);
      });
    });
  });
};

// Memulai pembuatan commit sebanyak n
makeCommits(30);  // Ubah angka ini untuk menentukan jumlah commit
