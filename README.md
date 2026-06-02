# Generador de Facturas PDF

Aplicación completa en HTML y JavaScript para crear y descargar facturas en PDF.

## Características

✅ **100% HTML y JavaScript** - Sin necesidad de servidor backend
✅ **Descarga de PDF** - Exporta las facturas como archivos PDF
✅ **Vista Previa en Vivo** - Ve los cambios en tiempo real
✅ **Impresión Directa** - Imprime las facturas desde el navegador
✅ **Configuración Flexible** - Personaliza IVA, moneda y más
✅ **Responsivo** - Funciona en dispositivos móviles
✅ **Sin Dependencias Externas** - Solo usa html2pdf.js

## Cómo Usar

1. **Descarga los archivos:**
   - `index.html`
   - `app.js`

2. **Abre `index.html` en tu navegador**
   - No necesita instalación ni servidor
   - Funciona completamente offline (excepto la primera carga de html2pdf.js)

3. **Completa los campos:**
   - Datos de la empresa
   - Datos del cliente
   - Items (productos/servicios)
   - Configuración (IVA, moneda, notas)

4. **Descarga o imprime:**
   - Haz clic en "💾 Descargar PDF" para guardar
   - O en "🖨 Imprimir" para imprimir directamente

## Funcionalidades

### Gestión de Items
- ➕ Agregar múltiples items
- ✕ Eliminar items
- 📊 Cálculo automático de totales

### Configuración
- 💰 Soporte para múltiples monedas (CLP, USD, EUR)
- 📊 IVA personalizable
- 📝 Campos de notas y términos de pago

### Vista Previa
- 👁️ Preview en vivo mientras editas
- 📄 Aspecto profesional
- 📋 Formato de página carta

## Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (solo para cargar html2pdf.js la primera vez)

## Estructura de Archivos

```
.
├── index.html      # Interfaz HTML
├── app.js          # Lógica JavaScript
└── README.md       # Este archivo
```

## Personalización

### Cambiar Empresa Predeterminada
Edita en `index.html` los valores por defecto:

```html
<input type="text" id="empresa" value="Mi Empresa">
<input type="text" id="numero" value="001-001-000001">
```

### Agregar más Monedas
Edita el `<select>` en `index.html`:

```html
<select id="moneda">
    <option value="$">Pesos Chilenos ($)</option>
    <option value="USD">Dólares (USD)</option>
    <option value="EUR">Euros (EUR)</option>
    <!-- Agrega más aquí -->
</select>
```

## Notas Importantes

- Los datos se guardan **solo en la sesión actual** (no persiste si cierras)
- Para guardar datos de forma permanente, necesitarías agregar LocalStorage
- Los PDFs se generan **en el navegador**, sin enviar datos a servidores

## Mejoras Futuras

- 💾 Guardar facturas con LocalStorage
- 📊 Historial de facturas
- 🎨 Más plantillas de diseño
- 📧 Envío de facturas por email
- 📝 Base de datos con clientes y productos frecuentes

## Licencia

Libre de usar para fines personales y comerciales.
