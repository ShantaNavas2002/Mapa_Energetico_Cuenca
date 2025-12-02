// cargarDatos.js
let datosMetodologia = [];
let bloqueActual = 0;

// Cargar datos del JSON
async function cargarDatosJSON() {
    try {
        const response = await fetch('data/metodologia-data.json');
        const data = await response.json();
        datosMetodologia = data.bloques;
        mostrarBloque(0);
        crearNavegacion();
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
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
    actualizarContenido(izquierda, bloque.contenidoIzquierda);
    
    // Actualizar contenido derecho
    const derecha = document.getElementById('der-imgOtxt');
    actualizarContenido(derecha, bloque.contenidoDerecha);
    
    // Actualizar indicadores de navegación
    actualizarIndicadores();
}

// Actualizar contenido (texto o imagen)
function actualizarContenido(elemento, contenido) {
    elemento.innerHTML = '';
    
    if (contenido.tipo === 'texto') {
        const p = document.createElement('p');
        p.textContent = contenido.contenido;
        p.className = 'contenido-texto';
        elemento.appendChild(p);
    } else if (contenido.tipo === 'imagen') {
        const img = document.createElement('img');
        img.src = contenido.src;
        img.alt = contenido.alt;
        img.className = 'contenido-imagen';
        elemento.appendChild(img);
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarDatosJSON);