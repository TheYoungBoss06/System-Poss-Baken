// Verificar token al cargar la vista
export function cargarPOSVenta() {
  verificarToken(); // Asegura que esté autenticado

  // Elementos del DOM
  const facturaProductos = document.querySelector('.factura-productos');
  const totalElement = document.getElementById('total');
  const btnVender = document.querySelector('.btn-vender');
  const btnNuevo = document.getElementById('btn-nuevo-venta');
  const clienteInput = document.getElementById('cliente-input');

  let productos = [];
  let total = 0;
  let clienteNombre = '';

  cargarProductos();

  // Evento para buscar productos
  document.getElementById('filtroNombre')?.addEventListener('input', buscarProductos);

  // Botón "+ Nuevo"
  btnNuevo?.addEventListener('click', () => {
    clienteNombre = clienteInput.value.trim();
    console.log('Cliente guardado:', clienteNombre);
    if (clienteNombre) {
      alert('Nombre agregado con éxito: ' + clienteNombre);
      clienteInput.value = '';
    } else {
      alert('Por favor, ingresa el nombre del cliente');
    }
  });

  // Botón "Vender"
  btnVender?.addEventListener('click', manejarVenta);

  async function cargarProductos() {
    try {
      const respuesta = await fetch('http://127.0.0.1:3000/api/productos');
      const data = await respuesta.json();
      productos = data.default;
      mostrarProductos(productos);
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  function mostrarProductos(productos) {
    const container = document.getElementById('producto-container');
    container.innerHTML = '';

    productos.forEach(producto => {
      const productoDiv = document.createElement('div');
      productoDiv.classList.add('producto-card');

      const imagenSrc = producto.imagen || 'img/img-no-disponible.png';

      productoDiv.innerHTML = `
        <img class="producto-img" src="${imagenSrc}" alt="${producto.nombre}">
        <div class="producto-nombre"><strong>Nombre:</strong> ${producto.nombre}</div>
        <div class="producto-cantidad"><strong>Cantidad:</strong> ${producto.cantidad}</div>
        <div class="producto-precio"><strong>Precio:</strong> RD$${producto.precio_compra.toFixed(2)}</div>
        <button class="btn-agregar">+</button>
      `;

      const btnAgregar = productoDiv.querySelector('.btn-agregar');
      btnAgregar.addEventListener('click', () => agregarProductoAFactura(producto));
      container.appendChild(productoDiv);
    });
  }

  function buscarProductos() {
    const filtroNombre = document.getElementById('filtroNombre').value.toLowerCase();
    const productosFiltrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(filtroNombre) ||
      producto.codigo_local.toLowerCase().includes(filtroNombre)
    );
    mostrarProductos(productosFiltrados);
  }

  function agregarProductoAFactura(producto) {
    const mensaje = facturaProductos.querySelector('p');
    if (mensaje) mensaje.remove();

    let itemFactura = facturaProductos.querySelector(`.item-factura[data-id="${producto.id}"]`);

    if (itemFactura) {
      const cantidadElement = itemFactura.querySelector('.cantidad');
      let cantidad = parseInt(cantidadElement.textContent);
      cantidad++;
      cantidadElement.textContent = cantidad;
    } else {
      itemFactura = document.createElement('div');
      itemFactura.classList.add('item-factura');
      itemFactura.dataset.id = producto.id;

      itemFactura.innerHTML = `
        <img src="${producto.imagen || 'img/img-no-disponible.png'}" alt="${producto.nombre}" class="factura-img">
        <div class="info">
          <span class="nombre">${producto.nombre}</span><br>
          <small>Cantidad: <span class="cantidad">1</span></small><br>
          <small>Precio: RD$${producto.precio_compra.toFixed(2)}</small><br>
          <button class="btn-eliminar">Eliminar</button>
        </div>
      `;

      const btnEliminar = itemFactura.querySelector('.btn-eliminar');
      btnEliminar.addEventListener('click', () => eliminarProductoDeFactura(itemFactura, producto.precio_compra));

      facturaProductos.appendChild(itemFactura);
    }

    total += producto.precio_compra;
    actualizarTotal();
  }

  function eliminarProductoDeFactura(itemFactura, precio) {
    const cantidadElement = itemFactura.querySelector('.cantidad');
    let cantidad = parseInt(cantidadElement.textContent);

    if (cantidad > 1) {
      cantidad--;
      cantidadElement.textContent = cantidad;
      total -= precio;
    } else {
      itemFactura.remove();
      total -= precio;
    }

    actualizarTotal();
  }

  function actualizarTotal() {
    totalElement.textContent = total.toLocaleString('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });
  }

  function manejarVenta() {
    if (!clienteNombre) {
      alert("Por favor, ingresa el nombre del cliente.");
      return;
    }

    if (total === 0) {
      alert("No hay productos en la factura.");
      return;
    }

    const venta = {
      cliente: clienteNombre,
      productos: [],
      total: total
    };

    const productosFactura = document.querySelectorAll('.item-factura');
    productosFactura.forEach(item => {
      const nombre = item.querySelector('.nombre').textContent;
      const cantidad = parseInt(item.querySelector('.cantidad').textContent);
      const smalls = item.querySelectorAll('.info small');
      const precioTexto = smalls[1].textContent; // El segundo <small> tiene el precio
      const precio = parseFloat(precioTexto.replace('Precio: RD$', '').trim());


      venta.productos.push({
        nombre,
        cantidad,
        imagen: item.querySelector('img').src,
        precio
      });
    });

    let mensajeVenta = `Cliente: ${venta.cliente}\n\nProductos vendidos:\n`;
    venta.productos.forEach(producto => {
      mensajeVenta += `- ${producto.nombre} (Cantidad: ${producto.cantidad}) - RD$${(producto.precio * producto.cantidad).toFixed(2)}\n`;
    });
    mensajeVenta += `\nTotal a pagar: ${venta.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}`;
    alert(mensajeVenta);

    console.log('Venta realizada:', venta);

    // Enviar al backend
    fetch('http://localhost:3000/api/facturas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token') // si tu backend requiere autenticación
      },
      body: JSON.stringify(venta)
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al registrar la venta');
        return res.json();
      })
      .then(data => {
        console.log('Venta registrada con éxito en el backend:', data);
        alert('Venta registrada correctamente.');
      })
      .catch(err => {
        console.error('Error al enviar la venta al backend:', err);
        alert('Error al registrar la venta.');
      });

    facturaProductos.innerHTML = '';
    total = 0;
    actualizarTotal();
    clienteInput.value = '';
  }
}

// Función de verificación de token
export function verificarToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/Fronen/pages/login.html';
  } else {
    fetch('http://localhost:3000/validate', {
      method: 'GET',
      headers: {
        'token': token
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Token inválido');
        return res.json();
      })
      .then(data => {
        console.log('Token válido:', data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/Fronen/pages/login.html';
      });
  }
}
