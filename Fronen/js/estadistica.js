const apiUrl = "http://127.0.0.1:3000/api/estadisticas"; 

// Obtener estadísticas
export async function obtenerDatos() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const datos = Array.isArray(data) ? data[0] : data;

    const productosVendidos = datos.productos_vendidos;
    const categoriaVendida = datos.categoria_mas_vendida;
    const ingresosTotales = datos.ingreso_total;

    document.getElementById("productos-vendidos").textContent = productosVendidos;
    document.getElementById("categoria-vendida").textContent = categoriaVendida;
    document.getElementById("ingreso-total").textContent = `$${ingresosTotales.toFixed(2)}`;

    renderGrafico(productosVendidos, ingresosTotales);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    document.getElementById("productos-vendidos").textContent = "Error al cargar datos";
    document.getElementById("categoria-vendida").textContent = "Error al cargar datos";
    document.getElementById("ingreso-total").textContent = "Error al cargar datos";
  }
}

// Gráfico de barras
function renderGrafico(productosVendidos, ingresosTotales) {
  const ctx = document.getElementById('graficoVentas').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Productos Vendidos', 'Ingreso Total'],
      datasets: [{
        data: [productosVendidos, ingresosTotales],
        backgroundColor: ['#ffcc00', '#2196f3'],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { enabled: true }
      }
    }
  });
}

// Cargar facturas y mostrarlas en tarjetas
export function cargarFacturas() {
  fetch('http://127.0.0.1:3000/api/facturas')
    .then(res => res.json())
    .then(data => mostrarFacturas(data))
    .catch(error => {
      console.error('Error al cargar las facturas:', error);
    });
}

function mostrarFacturas(facturas) {
  const container = document.getElementById('facturas-container');
  container.innerHTML = '';

  facturas.forEach((factura, index) => {
    const card = document.createElement('div');
    card.classList.add('factura-card');

    let productosHTML = '';
    factura.productos.forEach(producto => {
      productosHTML += `
        <div class="producto">
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <div>
            <div><strong>${producto.nombre}</strong></div>
            <div>Cantidad: ${producto.cantidad}</div>
            <div>Precio: RD$${producto.precio.toFixed(2)}</div>
          </div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="factura-header">Factura #${index + 1} - Cliente: ${factura.cliente}</div>
      ${productosHTML}
      <div><strong>Total:</strong> RD$${factura.total.toFixed(2)}</div>
    `;

    container.appendChild(card);
  });
}

// Ejecutar todo al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  obtenerDatos();
  cargarFacturas();
});
