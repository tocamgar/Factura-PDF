// Elementos del DOM
const form = document.getElementById('facturaForm');
const preview = document.getElementById('preview');
const itemsContainer = document.getElementById('itemsContainer');
const btnAgregarItem = document.getElementById('btnAgregarItem');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnDescargarPDF = document.getElementById('btnDescargarPDF');
const btnImprimir = document.getElementById('btnImprimir');
const btnGuardarFactura = document.getElementById('btnGuardarFactura');
const btnCargarFactura = document.getElementById('btnCargarFactura');
const inputCargarArchivo = document.getElementById('inputCargarArchivo');
const fechaInput = document.getElementById('fecha');

// Establecer fecha actual por defecto
const hoy = new Date().toISOString().split('T')[0];
fechaInput.value = hoy;

// Event listeners
form.addEventListener('input', actualizarPreview);
form.addEventListener('change', actualizarPreview);
btnAgregarItem.addEventListener('click', agregarItem);
btnLimpiar.addEventListener('click', limpiarFormulario);
btnDescargarPDF.addEventListener('click', descargarPDF);
btnImprimir.addEventListener('click', imprimirFactura);
btnGuardarFactura.addEventListener('click', guardarFactura);
btnCargarFactura.addEventListener('click', () => inputCargarArchivo.click());
inputCargarArchivo.addEventListener('change', cargarFactura);
itemsContainer.addEventListener('click', eliminarItem);

// Función para agregar un nuevo item
function agregarItem(e) {
    e.preventDefault();
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
        <input type="text" class="descripcion" placeholder="Descripción del producto/servicio" required>
        <input type="number" class="cantidad" placeholder="Cantidad" value="1" min="1" required>
        <input type="number" class="precio" placeholder="Precio (€)" value="0" min="0" step="0.01" required>
        <button type="button" class="btn btn-danger btn-eliminar" title="Eliminar">✕</button>
    `;
    itemsContainer.appendChild(item);
    
    // Agregar event listeners a los nuevos inputs
    item.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', actualizarPreview);
        input.addEventListener('change', actualizarPreview);
    });
    
    actualizarPreview();
}

// Función para eliminar un item
function eliminarItem(e) {
    if (e.target.classList.contains('btn-eliminar')) {
        e.preventDefault();
        e.target.parentElement.remove();
        actualizarPreview();
    }
}

// Función para obtener los datos actuales
function obtenerDatos() {
    const items = [];
    document.querySelectorAll('.item').forEach(item => {
        items.push({
            descripcion: item.querySelector('.descripcion').value,
            cantidad: parseInt(item.querySelector('.cantidad').value) || 0,
            precio: parseFloat(item.querySelector('.precio').value) || 0
        });
    });

    return {
        empresa: document.getElementById('empresa').value,
        numero: document.getElementById('numero').value,
        fecha: document.getElementById('fecha').value,
        cliente: document.getElementById('cliente').value,
        rut: document.getElementById('rut').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        items: items,
        iva: parseFloat(document.getElementById('iva').value) || 0,
        notas: document.getElementById('notas').value
    };
}

// Función para cargar datos en el formulario
function cargarDatos(datos) {
    document.getElementById('empresa').value = datos.empresa;
    document.getElementById('numero').value = datos.numero;
    document.getElementById('fecha').value = datos.fecha;
    document.getElementById('cliente').value = datos.cliente;
    document.getElementById('rut').value = datos.rut;
    document.getElementById('email').value = datos.email;
    document.getElementById('direccion').value = datos.direccion;
    document.getElementById('iva').value = datos.iva;
    document.getElementById('notas').value = datos.notas;

    // Limpiar items anteriores
    itemsContainer.innerHTML = '';

    // Cargar items
    datos.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <input type="text" class="descripcion" placeholder="Descripción del producto/servicio" value="${item.descripcion}" required>
            <input type="number" class="cantidad" placeholder="Cantidad" value="${item.cantidad}" min="1" required>
            <input type="number" class="precio" placeholder="Precio (€)" value="${item.precio}" min="0" step="0.01" required>
            <button type="button" class="btn btn-danger btn-eliminar" title="Eliminar">✕</button>
        `;
        itemsContainer.appendChild(itemDiv);

        // Agregar event listeners
        itemDiv.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', actualizarPreview);
            input.addEventListener('change', actualizarPreview);
        });
    });

    actualizarPreview();
}

// Función para guardar factura en archivo JSON
function guardarFactura() {
    const datos = obtenerDatos();
    
    if (!datos.numero.trim()) {
        alert('Por favor, ingrese un número de factura');
        return;
    }

    const jsonString = JSON.stringify(datos, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura_${datos.numero.replace(/[\/\\:*?"<>|]/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Mostrar notificación
    mostrarNotificacion(`✓ Factura guardada como: factura_${datos.numero}.json`, 'success');
}

// Función para cargar factura desde archivo JSON
function cargarFactura(e) {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar que sea un archivo JSON
    if (!file.name.endsWith('.json')) {
        alert('Por favor, seleccione un archivo JSON válido');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            const datos = JSON.parse(event.target.result);
            
            // Validar que el archivo tenga la estructura correcta
            if (!datos.empresa || !datos.numero || !Array.isArray(datos.items)) {
                throw new Error('Archivo inválido: estructura de factura no reconocida');
            }
            
            cargarDatos(datos);
            mostrarNotificacion(`✓ Factura cargada correctamente: ${datos.numero}`, 'success');
        } catch (error) {
            alert(`Error al cargar el archivo: ${error.message}`);
        }
    };

    reader.readAsText(file);
    
    // Limpiar el input
    inputCargarArchivo.value = '';
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    // Animar entrada
    setTimeout(() => notificacion.classList.add('mostrar'), 10);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => notificacion.remove(), 300);
    }, 3000);
}

// Función para calcular totales
function calcularTotales(datos) {
    const subtotal = datos.items.reduce((sum, item) => sum + (item.cantidad * item.precio), 0);
    const ivaAmount = subtotal * (datos.iva / 100);
    const total = subtotal + ivaAmount;

    return { subtotal, ivaAmount, total };
}

// Función para formatear euros
function formatearEuros(valor) {
    return '€ ' + valor.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Función para formatear fecha
function formatearFecha(fecha) {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Función para actualizar la vista previa
function actualizarPreview() {
    const datos = obtenerDatos();
    const { subtotal, ivaAmount, total } = calcularTotales(datos);

    let html = `
        <div class="invoice-info">
            <div class="info-item"><span class="info-label">Empresa:</span> ${datos.empresa}</div>
            <div class="info-item"><span class="info-label">Número:</span> ${datos.numero}</div>
            <div class="info-item"><span class="info-label">Fecha:</span> ${formatearFecha(datos.fecha)}</div>
            <div class="info-item"><span class="info-label">Cliente:</span> ${datos.cliente}</div>
        </div>

        <div style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
            <div class="info-item"><span class="info-label">RUT/ID:</span> ${datos.rut}</div>
            <div class="info-item"><span class="info-label">Email:</span> ${datos.email}</div>
            <div class="info-item"><span class="info-label">Dirección:</span> ${datos.direccion}</div>
        </div>
    `;

    // Tabla de items
    if (datos.items.length > 0) {
        html += `
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Descripción</th>
                        <th style="width: 80px;" class="text-right">Cantidad</th>
                        <th style="width: 100px;" class="text-right">Precio Unit.</th>
                        <th style="width: 100px;" class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
        `;

        datos.items.forEach(item => {
            const totalItem = item.cantidad * item.precio;
            html += `
                <tr>
                    <td>${item.descripcion}</td>
                    <td class="text-right">${item.cantidad}</td>
                    <td class="text-right">${formatearEuros(item.precio)}</td>
                    <td class="text-right">${formatearEuros(totalItem)}</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>

            <div class="totales">
                <div class="totales-row">
                    <span>Subtotal:</span>
                    <span>${formatearEuros(subtotal)}</span>
                </div>
                <div class="totales-row">
                    <span>IVA (${datos.iva}%):</span>
                    <span>${formatearEuros(ivaAmount)}</span>
                </div>
                <div class="totales-row total">
                    <span>TOTAL:</span>
                    <span>${formatearEuros(total)}</span>
                </div>
            </div>
        `;
    } else {
        html += '<div class="empty-state">Agregue items para ver la factura</div>';
    }

    if (datos.notas) {
        html += `<div class="nota"><strong>Notas:</strong><br> ${datos.notas}</div>`;
    }

    preview.innerHTML = html;
}

// Función para descargar el PDF
function descargarPDF() {
    const datos = obtenerDatos();
    
    if (datos.items.length === 0) {
        alert('Debe agregar al menos un item a la factura');
        return;
    }

    const element = document.createElement('div');
    element.innerHTML = preview.innerHTML;
    
    const opt = {
        margin: 10,
        filename: `factura_${datos.numero.replace(/\//g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'letter' }
    };

    html2pdf().set(opt).from(element).save();
}

// Función para imprimir
function imprimirFactura() {
    const datos = obtenerDatos();
    
    if (datos.items.length === 0) {
        alert('Debe agregar al menos un item a la factura');
        return;
    }

    const ventana = window.open('', '', 'width=800,height=600');
    ventana.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Factura ${datos.numero}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .invoice-header { border-bottom: 3px solid #1f4788; padding-bottom: 15px; margin-bottom: 15px; }
                .invoice-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
                .info-item { padding: 5px 0; }
                .info-label { font-weight: bold; color: #1f4788; }
                .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .invoice-table th { background: #1f4788; color: white; padding: 10px; text-align: left; font-weight: bold; }
                .invoice-table td { padding: 8px 10px; border-bottom: 1px solid #ddd; }
                .text-right { text-align: right; }
                .totales { margin-top: 20px; border-top: 2px solid #1f4788; padding-top: 15px; }
                .totales-row { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-bottom: 8px; }
                .totales-row.total { font-size: 16px; font-weight: bold; color: #1f4788; border-top: 1px solid #ddd; padding-top: 10px; }
                .nota { background: #ecf0f1; padding: 10px; border-radius: 5px; margin-top: 15px; font-size: 12px; }
                @media print { body { padding: 0; } }
            </style>
        </head>
        <body>
            ${preview.innerHTML}
            <script>
                window.print();
            </script>
        </body>
        </html>
    `);
    ventana.document.close();
}

// Función para limpiar el formulario
function limpiarFormulario() {
    if (confirm('¿Desea limpiar todo el formulario?')) {
        form.reset();
        itemsContainer.innerHTML = `
            <div class="item">
                <input type="text" class="descripcion" placeholder="Descripción del producto/servicio" required>
                <input type="number" class="cantidad" placeholder="Cantidad" value="1" min="1" required>
                <input type="number" class="precio" placeholder="Precio (€)" value="0" min="0" step="0.01" required>
                <button type="button" class="btn btn-danger btn-eliminar" title="Eliminar">✕</button>
            </div>
        `;
        
        // Agregar event listeners
        document.querySelectorAll('.item input').forEach(input => {
            input.addEventListener('input', actualizarPreview);
            input.addEventListener('change', actualizarPreview);
        });
        
        document.getElementById('fecha').value = hoy;
        actualizarPreview();
        mostrarNotificacion('✓ Formulario limpiado correctamente', 'success');
    }
}

// Inicializar
actualizarPreview();