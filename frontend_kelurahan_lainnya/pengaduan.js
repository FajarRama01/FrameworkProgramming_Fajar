document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('pengaduan-list-container');
    const apiUrl = 'http://127.0.0.1:8000/api/pengaduan/'; // Sesuaikan dengan endpoint Django Anda
    const token = localStorage.getItem('authToken');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
    }

    // Fungsi Render Card Pengaduan
    function renderPengaduanCard(p, index) {
        const card = document.createElement('div');
        card.className = 'card mb-3 shadow-sm border-start border-primary border-4';
        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <h5 class="card-title text-primary">${escapeHtml(p.judul)}</h5>
                    <span class="badge bg-info text-dark">${escapeHtml(p.status || 'Pending')}</span>
                </div>
                <p class="card-text mt-2">${escapeHtml(p.isi_pengaduan)}</p>
                <hr>
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-sm btn-outline-primary btn-edit">Edit</button>
                    <button class="btn btn-sm btn-outline-danger btn-delete">Hapus</button>
                </div>
            </div>
        `;
        card.dataset.index = index;
        card.dataset.id = p.id;
        return card;
    }

    // Load Data (GET)
    async function loadPengaduan() {
        container.innerHTML = '<div class="text-center my-5"><div class="spinner-border"></div></div>';
        try {
            const resp = await fetch(apiUrl, { 
                headers: { 'Authorization': 'Token ' + token } 
            });
            if (!resp.ok) throw new Error('Gagal mengambil data');
            
            const data = await resp.json();
            const list = Array.isArray(data) ? data : (data.results || []);
            
            container.innerHTML = '';
            if (list.length === 0) {
                container.innerHTML = '<div class="alert alert-info">Belum ada pengaduan masuk.</div>';
                return;
            }

            const row = document.createElement('div');
            row.className = 'row';
            list.forEach((p, idx) => {
                const col = document.createElement('div');
                col.className = 'col-12';
                col.appendChild(renderPengaduanCard(p, idx));
                row.appendChild(col);
            });
            container.appendChild(row);
            attachHandlers(list);
        } catch (err) {
            container.innerHTML = '<div class="alert alert-danger">Error koneksi ke server.</div>';
        }
    }

    // Modal & Handlers
    const pengaduanModal = new bootstrap.Modal(document.getElementById('pengaduanModal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    function attachHandlers(list) {
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.card').dataset.id;
                const data = list.find(item => item.id == id);
                document.getElementById('pengaduan-id').value = data.id;
                document.getElementById('judul').value = data.judul;
                document.getElementById('isi_pengaduan').value = data.isi_pengaduan;
                pengaduanModal.show();
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.getElementById('confirm-delete-btn').dataset.id = e.target.closest('.card').dataset.id;
                deleteModal.show();
            });
        });
    }

    // Simpan/Update (POST/PUT) [cite: 78]
    document.getElementById('pengaduan-save-btn').addEventListener('click', async () => {
        const id = document.getElementById('pengaduan-id').value;
        const payload = {
            judul: document.getElementById('judul').value,
            isi_pengaduan: document.getElementById('isi_pengaduan').value
        };

        try {
            const url = id ? `${apiUrl}${id}/` : apiUrl;
            const method = id ? 'PUT' : 'POST';
            const resp = await fetch(url, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + token 
                },
                body: JSON.stringify(payload)
            });

            if (resp.ok) {
                pengaduanModal.hide();
                loadPengaduan();
            } else {
                alert('Gagal menyimpan pengaduan.');
            }
        } catch (err) {
            console.error(err);
        }
    });

    // Hapus (DELETE)
    document.getElementById('confirm-delete-btn').addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        try {
            await fetch(`${apiUrl}${id}/`, { 
                method: 'DELETE', 
                headers: { 'Authorization': 'Token ' + token } 
            });
            deleteModal.hide();
            loadPengaduan();
        } catch (err) {
            alert('Gagal menghapus.');
        }
    });

    document.getElementById('add-pengaduan-btn').addEventListener('click', () => {
        document.getElementById('pengaduan-form').reset();
        document.getElementById('pengaduan-id').value = '';
        pengaduanModal.show();
    });

    loadPengaduan();
});