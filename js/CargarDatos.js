// Variable local para manejar el estado
let datosMetodologia = []; // Se llenará con los datos del archivo .js
let bloqueActual = 0;

// INICIALIZACIÓN (Ya no es 'cargarDatosJSON', ahora es 'iniciar')
function iniciarMetodologia() {
    // Verificamos si la variable DATA_METODOLOGIA (del otro archivo) existe
    if (typeof DATA_METODOLOGIA !== 'undefined') {
        
        // Asignamos los datos del archivo externo a nuestra variable local
        datosMetodologia = DATA_METODOLOGIA.bloques;
        
        // Iniciamos la vista
        mostrarBloque(0);
        crearNavegacion();
        
    } else {
        console.error('No se encontraron los datos en DATA_METODOLOGIA');
        mostrarError();
    }
}

// Mostrar error (se mantiene igual, pero el mensaje cambia un poco)
function mostrarError() {
    const titulo = document.getElementById('titulo');
    titulo.textContent = 'Error de datos';
    const subtitulo = document.getElementById('subtitulo');
    subtitulo.innerHTML = '<span>No se pudo cargar el archivo de configuración.</span>';
}

// Mostrar un bloque específico
function mostrarBloque(indice) {
    if (indice < 0 || indice >= datosMetodologia.length) return;
    
    bloqueActual = indice;
    const bloque = datosMetodologia[indice];
    
    // Actualizar título
    const titulo = document.getElementById('titulo');
    titulo.textContent = bloque.titulo;
    
    // Actualizar subtítulo
    const subtitulo = document.getElementById('subtitulo');
    subtitulo.innerHTML = bloque.subtitulo;
    
    // Actualizar contenido izquierdo
    const izquierda = document.getElementById('izq-imgOtxt');
    actualizarContenidoMultiple(izquierda, bloque.contenidoIzquierda);
    
    // Actualizar contenido derecho
    const derecha = document.getElementById('der-imgOtxt');
    actualizarContenidoMultiple(derecha, bloque.contenidoDerecha);
    
    // Actualizar indicadores de navegación
    actualizarIndicadores();
}

// ============================================================
// FUNCIÓN CLAVE: Detecta si es objeto único o array múltiple
// ============================================================
function actualizarContenidoMultiple(elemento, contenido) {
    elemento.innerHTML = '';
    
    // CASO 1: Es un array de múltiples contenidos
    if (Array.isArray(contenido)) {
        contenido.forEach(item => {
            crearElementoContenido(elemento, item);
        });
    } 
    // CASO 2: Es un solo objeto (compatibilidad con formato anterior)
    else if (contenido && typeof contenido === 'object') {
        crearElementoContenido(elemento, contenido);
    }
}

// ============================================================
// FUNCIÓN QUE CREA CADA ELEMENTO DE CONTENIDO
// ============================================================
function crearElementoContenido(contenedor, item) {
    
    // TIPO: TEXTO
    if (item.tipo === 'texto') {
        const div = document.createElement('div');
        div.innerHTML = item.contenido;
        div.className = 'contenido-texto';
        contenedor.appendChild(div);
    } 
    
    // TIPO: IMAGEN
    else if (item.tipo === 'imagen') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.className = 'contenido-imagen';
        contenedor.appendChild(img);
    }
    
    // TIPO: TABLA ESTRUCTURADA
    else if (item.tipo === 'tabla') {
        const tablaWrapper = document.createElement('div');
        tablaWrapper.className = 'contenido-tabla';
        
        // Título opcional de la tabla
        if (item.titulo) {
            const tituloTabla = document.createElement('h3');
            tituloTabla.textContent = item.titulo;
            tituloTabla.className = 'tabla-titulo';
            tablaWrapper.appendChild(tituloTabla);
        }
        
        // Crear tabla
        const tabla = document.createElement('table');
        tabla.className = 'tabla-datos';
        
        // Encabezados
        if (item.headers && item.headers.length > 0) {
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            item.headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            tabla.appendChild(thead);
        }
        
        // Cuerpo de la tabla
        if (item.filas && item.filas.length > 0) {
            const tbody = document.createElement('tbody');
            
            item.filas.forEach(fila => {
                const tr = document.createElement('tr');
                
                fila.forEach(celda => {
                    const td = document.createElement('td');
                    td.textContent = celda;
                    tr.appendChild(td);
                });
                
                tbody.appendChild(tr);
            });
            
            tabla.appendChild(tbody);
        }
        
        // Footer opcional (totales, etc.)
        if (item.footer && item.footer.length > 0) {
            const tfoot = document.createElement('tfoot');
            const footerRow = document.createElement('tr');
            
            item.footer.forEach((celda, index) => {
                const td = document.createElement('td');
                td.textContent = celda;
                if (index === item.footer.length - 1) {
                    td.className = 'tabla-total';
                }
                footerRow.appendChild(td);
            });
            
            tfoot.appendChild(footerRow);
            tabla.appendChild(tfoot);
        }
        
        tablaWrapper.appendChild(tabla);
        contenedor.appendChild(tablaWrapper);
    }
    
    // TIPO: TABLA SIMPLE (HTML directo)
    else if (item.tipo === 'tabla-simple') {
        const div = document.createElement('div');
        div.innerHTML = item.contenido;
        div.className = 'contenido-tabla contenido-tabla-simple';
        contenedor.appendChild(div);
    }
    
    // TIPO: SEPARADOR (opcional para espaciar elementos)
    else if (item.tipo === 'separador') {
        const hr = document.createElement('hr');
        hr.className = 'contenido-separador';
        contenedor.appendChild(hr);
    }
}

// Crear navegación con puntos
function crearNavegacion() {
    const barraNav = document.getElementById('barra-nav');
    barraNav.innerHTML = '';
    barraNav.className = 'barra-navegacion';
    
    datosMetodologia.forEach((bloque, indice) => {
        const indicador = document.createElement('button');
        indicador.className = 'nav-indicador';
        indicador.setAttribute('aria-label', `Ir a bloque ${indice + 1}`);
        indicador.onclick = () => mostrarBloque(indice);
        barraNav.appendChild(indicador);
    });
    
    // Botones de navegación
    const btnAnterior = document.createElement('button');
    btnAnterior.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btnAnterior.className = 'btn-nav btn-anterior';
    btnAnterior.onclick = navegarAnterior;
    
    const btnSiguiente = document.createElement('button');
    btnSiguiente.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btnSiguiente.className = 'btn-nav btn-siguiente';
    btnSiguiente.onclick = navegarSiguiente;
    
    barraNav.prepend(btnAnterior);
    barraNav.appendChild(btnSiguiente);
}

// Actualizar indicadores activos
function actualizarIndicadores() {
    const indicadores = document.querySelectorAll('.nav-indicador');
    indicadores.forEach((indicador, indice) => {
        if (indice === bloqueActual) {
            indicador.classList.add('activo');
        } else {
            indicador.classList.remove('activo');
        }
    });
    
    // Deshabilitar botones en extremos
    const btnAnterior = document.querySelector('.btn-anterior');
    const btnSiguiente = document.querySelector('.btn-siguiente');
    
    if (btnAnterior) {
        btnAnterior.disabled = bloqueActual === 0;
    }
    
    if (btnSiguiente) {
        btnSiguiente.disabled = bloqueActual === datosMetodologia.length - 1;
    }
}

// Navegación
function navegarAnterior() {
    if (bloqueActual > 0) {
        mostrarBloque(bloqueActual - 1);
    }
}

function navegarSiguiente() {
    if (bloqueActual < datosMetodologia.length - 1) {
        mostrarBloque(bloqueActual + 1);
    }
}

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navegarAnterior();
    if (e.key === 'ArrowRight') navegarSiguiente();
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', iniciarMetodologia);;