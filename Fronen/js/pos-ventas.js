
  // Verificar si el token está presente en el localStorage
  const token = localStorage.getItem('token');

  if (!token) {
      // Si no hay token, redirigir al login
      window.location.href = '/Fronen/pages/login.html';
  } else {
      // Validar el token con el backend
      fetch('http://localhost:3000/validate', {
          method: 'GET',
          headers: {
              'token': token // Enviar el token al backend
          }
      })
      .then(res => {
          if (!res.ok) {
              throw new Error('Token inválido');
          }
          return res.json();
      })
      .then(data => {
          console.log('Token válido:', data);
      })
      .catch(() => {
          // Si el token es inválido, redirigir al login
          localStorage.removeItem('token');
          window.location.href = '/Fronen/pages/login.html';
      });
  }

  
let productos = []; // Lista de productos disponibles
let total = 0; // Total acumulado
const facturaProductos = document.querySelector('.factura-productos');
const totalElement = document.getElementById('total');
const btnVender = document.querySelector('.btn-vender'); // Botón Vender
const btnNuevo = document.getElementById('btn-nuevo'); // Botón "+ Nuevo"
const clienteInput = document.getElementById('cliente-input'); // Campo de cliente
let clienteNombre = ''; // Nombre del cliente

// Función para cargar productos
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

// Función para mostrar productos
function mostrarProductos(productos) {
  const container = document.getElementById('producto-container');
  container.innerHTML = '';

  productos.forEach(producto => {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto-card');

    const imagenSrc = producto.imagen ? producto.imagen : 'img/img-no-disponible.png';

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
// Función para filtrar los productos por nombre y código
function buscarProductos() {
  const filtroNombre = document.getElementById('filtroNombre').value.toLowerCase(); // Obtener el texto de búsqueda
  const productosFiltrados = productos.filter(producto => {
    const nombreCoincide = producto.nombre.toLowerCase().includes(filtroNombre); // Verificar si el nombre coincide
    const codigoCoincide = producto.codigo_local.toLowerCase().includes(filtroNombre); // Verificar si el código coincide
    return nombreCoincide || codigoCoincide; // Mostrar si coincide con el nombre o el código
  });

  mostrarProductos(productosFiltrados); // Mostrar los productos filtrados
}
// Función para agregar producto a la factura
function agregarProductoAFactura(producto) {
  const mensaje = facturaProductos.querySelector('p');
  if (mensaje) mensaje.remove(); // Quitar el mensaje inicial si existe

  // Verificar si el producto ya está en la factura
  let itemFactura = facturaProductos.querySelector(`.item-factura[data-id="${producto.id}"]`);

  if (itemFactura) {
    // Ya existe, aumentamos la cantidad
    const cantidadElement = itemFactura.querySelector('.cantidad');
    let cantidad = parseInt(cantidadElement.textContent);
    cantidad++;
    cantidadElement.textContent = cantidad;
  } else {
    // No existe, creamos uno nuevo
    itemFactura = document.createElement('div');
    itemFactura.classList.add('item-factura');
    itemFactura.dataset.id = producto.id; // Guardamos el ID para identificarlo

    itemFactura.innerHTML = `
      <img src="${producto.imagen ? producto.imagen : 'img/img-no-disponible.png'}" alt="${producto.nombre}" class="factura-img">
      <div class="info">
        <span class="nombre">${producto.nombre}</span><br>
        <small>Cantidad: <span class="cantidad">1</span></small><br>
        <small>Precio: RD$${producto.precio_compra.toFixed(2)}</small><br>
        <button class="btn-eliminar">Eliminar</button>
      </div>
    `;

    // Agregar el evento para eliminar el producto
    const btnEliminar = itemFactura.querySelector('.btn-eliminar');
    btnEliminar.addEventListener('click', () => eliminarProductoDeFactura(itemFactura, producto.precio_compra));

    facturaProductos.appendChild(itemFactura);
  }

  // Actualizar total
  total += producto.precio_compra;
  actualizarTotal(); // Llamamos a la función para actualizar el total
}

// Función para eliminar producto de la factura
function eliminarProductoDeFactura(itemFactura, precio) {
  const cantidadElement = itemFactura.querySelector('.cantidad');
  let cantidad = parseInt(cantidadElement.textContent);

  if (cantidad > 1) {
    // Si la cantidad es mayor a 1, disminuimos la cantidad
    cantidad--;
    cantidadElement.textContent = cantidad;
    total -= precio;
  } else {
    // Si la cantidad es 1, eliminamos el producto de la factura
    itemFactura.remove();
    total -= precio;
  }

  // Actualizamos el total
  actualizarTotal(); // Llamamos a la función para actualizar el total
}

// Función para actualizar el total
function actualizarTotal() {
  totalElement.textContent = total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' });
}

// Función para manejar el envío de la venta
// Función para manejar el envío de la venta
function manejarVenta() {
  // Verificar si ya se ha ingresado el nombre del cliente antes de proceder
  if (!clienteNombre) {
    alert("Por favor, ingresa el nombre del cliente.");
    return;
  }

  if (total === 0) {
    alert("No hay productos en la factura.");
    return;
  }

  // Crear la estructura de la venta
  const venta = {
    cliente: clienteNombre,
    productos: [],
    total: total
  };

  // Recopilar los productos
  const productosFactura = document.querySelectorAll('.item-factura');
  productosFactura.forEach(item => {
    const nombre = item.querySelector('.nombre').textContent;
    const cantidad = parseInt(item.querySelector('.cantidad').textContent);
    
    // Obtener el precio correctamente, asegurándose de que sea un número
    const precioTexto = item.querySelector('.info small').textContent;
    const precio = parseFloat(precioTexto.replace('Precio: RD$', '').trim());

    venta.productos.push({ nombre, cantidad, imagen: item.querySelector('img').src, precio });
    console.log('Producto agregado a la venta:', { nombre, cantidad, total }); // Verificar los productos agregados
  });

  // Generar el mensaje de la alerta
  let mensajeVenta = `Cliente: ${venta.cliente}\n\nProductos vendidos:\n`;
  venta.productos.forEach(producto => {
    mensajeVenta += `- ${producto.nombre} (Cantidad: ${producto.cantidad}) - RD$${(producto.precio * producto.cantidad).toFixed(2)}\n`;
  });

  // Formatear el total con el formato adecuado en RD$
  mensajeVenta += `\nTotal a pagar: ${venta.total.toLocaleString('es-DO', { style: 'currency', currency: 'DOP' })}`;

  // Mostrar la alerta con el resumen de la venta
  alert(mensajeVenta);

  // Enviar la venta a la API o donde sea necesario
  console.log('Venta realizada:', venta);

  // Resetear la factura
  facturaProductos.innerHTML = '';
  total = 0;
  actualizarTotal(); // Resetear el total en la interfaz
  clienteInput.value = '';
}



// Agregar evento para el botón "+ Nuevo" para guardar el nombre del cliente
btnNuevo.addEventListener('click', () => {
  clienteNombre = clienteInput.value.trim();  // Obtener el valor del input y eliminar los espacios innecesarios

  console.log('Cliente guardado al hacer clic en Nuevo:', clienteNombre); // Verificar el valor del nombre al hacer clic en Nuevo

  if (clienteNombre) {
    // Mostrar alerta confirmando que el nombre fue guardado
    alert('Nombre agregado con éxito: ' + clienteNombre);
    clienteInput.value = '';  // Limpiar el campo de texto después de agregar el nombre
  } else {
    alert('Por favor, ingresa el nombre del cliente');  // Si no se ingresa nombre, mostrar alerta
  }
});

// Agregar evento para el botón "Vender"
btnVender.addEventListener('click', manejarVenta);

// Cargar productos al inicio
cargarProductos();