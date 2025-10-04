// Data dummy yang bisa kita gunakan di sisi klien sebelum menghubungkan ke server
// const products = [
//   { id: 1, name: 'Laptop', description: 'Laptop canggih dengan SSD 512GB dan RAM 8GB.' },
//   { id: 2, name: 'Smartphone', description: 'Smartphone terbaru dengan kamera 108MP.' },
//   { id: 3, name: 'Monitor', description: 'Monitor 27 inci 4K dengan refresh rate 144Hz.' }
// ];

// Fungsi untuk mengisi tabel
function populateTable() {
  const tableBody = $('#data-table-body');
  brands.forEach(brand => {
    const row = `
            <tr>
                <td><%= brand.no %></td>
                <td><%= brand.code %></td>
                <td><%= brand.nameTH %></td>
                <td><%= brand.nameEN %></td>
                <td><%= brand.keyword %></td>
                <td class="align-middle text-center">
                  <% if (brand.img) { %>
                    <img class="img" src="/uploads/brands/<%= brand.img %>"  width="100"/>
                  <% } else { %>
                    <img class="img" src="/img/NoPic.svg"  width="100"/>
                  <% } %>
                </td>
                <td class="align-middle text-center">
                  <a data-id="<%= brand.id %>" class="btn btn-info btn-circle btn-sm">
                    <i class="fas fa-eye"></i></a>
                  <a href="/pacEcatalog/Brands/Edit/<%= brand.id %>" class="btn btn-warning btn-circle btn-sm">
                    <i class="fas fa-pen"></i></a>
                  <a href="/pacEcatalog/Brands/Del/<%= brand.id %>" class="btn btn-danger btn-circle btn-sm"
                    onclick="return confirm('Do you want to delete the data?');">
                    <i class="fas fa-trash-alt"></i></a>
                </td>                
            </tr>
        `;
    tableBody.append(row);
  });
}

// Fungsi untuk menangani klik tombol "Lihat"
$(document).on('click', '.view-btn', function () {
  const productId = $(this).data('id');

  // Asumsi: ini adalah panggilan AJAX ke server
  // const apiUrl = `/api/products/${productId}`;
  // fetch(apiUrl)
  //     .then(response => response.json())
  //     .then(data => {
  //         // Isi modal dengan data
  //         const modalBody = $('#modal-content-body');
  //         modalBody.html(`
  //             <p><strong>ID:</strong> ${data.id}</p>
  //             <p><strong>Nama:</strong> ${data.name}</p>
  //             <p><strong>Deskripsi:</strong> ${data.description}</p>
  //         `);
  //         $('#productModal').modal('show');
  //     });

  // Contoh menggunakan data dummy (tanpa server)
  const brand = brands.find(p => p.id === productId);
  if (brand) {
    const modalBody = $('#modal-content-body');
    modalBody.html(`
            <p><strong>ID:</strong> ${brand.code}</p>
            <p><strong>Nama:</strong> ${brand.nameTH}</p>
            <p><strong>Deskripsi:</strong> ${brand.nameEN}</p>
        `);
    $('#productModal').modal('show');
  }
});

// Panggil fungsi untuk mengisi tabel saat halaman dimuat
$(document).ready(function () {
  populateTable();
});