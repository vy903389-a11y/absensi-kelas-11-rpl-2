const studentForm = document.getElementById("studentForm");
const attendanceTable = document.getElementById("attendanceTable");
const message = document.getElementById("message");

let students = JSON.parse(localStorage.getItem("pramaAttendance")) || [];

// TANGGAL HARI INI
function showDate() {
    const today = new Date();

    document.getElementById("today").textContent =
        today.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
}

// SIMPAN DATA
function saveData() {
    localStorage.setItem(
        "pramaAttendance",
        JSON.stringify(students)
    );
}

// TAMBAH SISWA
studentForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim();

    if (!name || !studentClass) {
        showMessage("Lengkapi nama dan kelas terlebih dahulu!");
        return;
    }

    students.push({
        id: Date.now(),
        name: name,
        studentClass: studentClass,
        status: "Hadir"
    });

    saveData();
    renderTable();

    studentForm.reset();

    showMessage("Siswa berhasil ditambahkan! 🩵");
});

// TAMPILKAN TABEL
function renderTable() {
    attendanceTable.innerHTML = "";

    students.forEach((student, index) => {
        const row = document.createElement("tr");

        const no = document.createElement("td");
        no.textContent = index + 1;

        const name = document.createElement("td");
        name.textContent = student.name;

        const kelas = document.createElement("td");
        kelas.textContent = student.studentClass;

        const statusCell = document.createElement("td");
        const select = document.createElement("select");

        select.className = "status-select";

        ["Hadir", "Sakit", "Izin", "Alpa"].forEach(status => {
            const option = document.createElement("option");
            option.value = status;
            option.textContent = status;
            option.selected = student.status === status;
            select.appendChild(option);
        });

        select.addEventListener("change", function() {
            student.status = this.value;
            saveData();
            updateStats();
            showMessage("Status kehadiran diperbarui! 💙");
        });

        statusCell.appendChild(select);

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑️ Hapus";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            if (confirm("Yakin ingin menghapus siswa ini?")) {
                students = students.filter(s => s.id !== student.id);

                saveData();
                renderTable();

                showMessage("Data siswa berhasil dihapus!");
            }
        });

        actionCell.appendChild(deleteButton);

        row.append(no, name, kelas, statusCell, actionCell);

        attendanceTable.appendChild(row);
    });

    updateStats();
}

// HITUNG STATISTIK
function updateStats() {
    const total = students.length;

    const count = {
        Hadir: 0,
        Sakit: 0,
        Izin: 0,
        Alpa: 0
    };

    students.forEach(student => {
        if (count[student.status] !== undefined) {
            count[student.status]++;
        }
    });

    document.getElementById("total").textContent = total;

    document.getElementById("hadir").textContent = count.Hadir;
    document.getElementById("sakit").textContent = count.Sakit;
    document.getElementById("izin").textContent = count.Izin;
    document.getElementById("alpa").textContent = count.Alpa;

    document.getElementById("recapHadir").textContent = count.Hadir;
    document.getElementById("recapSakit").textContent = count.Sakit;
    document.getElementById("recapIzin").textContent = count.Izin;
    document.getElementById("recapAlpa").textContent = count.Alpa;
}

// TOMBOL SIMPAN
document.getElementById("saveBtn").addEventListener("click", function() {
    saveData();
    showMessage("Absensi berhasil disimpan! 💾");
});

// HAPUS SEMUA DATA
document.getElementById("clearBtn").addEventListener("click", function() {
    if (students.length === 0) {
        showMessage("Belum ada data untuk dihapus.");
        return;
    }

    if (confirm("Yakin ingin menghapus semua data siswa?")) {
        students = [];

        saveData();
        renderTable();

        showMessage("Semua data berhasil dihapus! 🗑️");
    }
});

// EKSPOR CSV
document.getElementById("exportBtn").addEventListener("click", function() {
    if (students.length === 0) {
        showMessage("Belum ada data untuk diekspor!");
        return;
    }

    let csv = "No,Nama,Kelas,Status Kehadiran\n";

    students.forEach((student, index) => {
        const safe = value =>
            '"' + String(value).replace(/"/g, '""') + '"';

        csv += [
            index + 1,
            safe(student.name),
            safe(student.studentClass),
            safe(student.status)
        ].join(",") + "\n";
    });

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "Rekap_Absensi_Prama_Artha.csv";

    link.click();

    URL.revokeObjectURL(url);

    showMessage("File CSV berhasil dibuat! 📥");
});

// PESAN
function showMessage(text) {
    message.textContent = text;
}

// JALANKAN PROGRAM
showDate();
renderTable();