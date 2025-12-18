let datosMetodologia = [];
let bloqueActual = 0;

function iniciarMetodologia() {
    if (typeof DATA_METODOLOGIA !== 'undefined') {
        datosMetodologia = DATA_METODOLOGIA.bloques;
        mostrarBloque(0);
        crearNavegacion();
    } else {
        console.error('No se encontraron los datos en DATA_METODOLOGIA');
    }
}

function mostrarBloque(indice) {
    if (indice < 0 || indice >= datosMetodologia.length) return;
    
    bloqueActual = indice;
    const bloque = datosMetodologia[indice];
    
    // 1. ACTUALIZAR CABECERA (Sección y Fase)
    const seccionPill = document.getElementById('seccion-pill');
    const faseTxt = document.getElementById('fase-txt');
    
    if(seccionPill) seccionPill.textContent = bloque.seccion || "METODOLOGÍA";
    if(faseTxt) faseTxt.textContent = bloque.fase || "";

    // (Eliminado: Ya no buscamos ni actualizamos 'tema-titulo')

    // 2. ACTUALIZAR CONTENIDOS
    const izquierda = document.getElementById('izq-imgOtxt');
    actualizarContenidoMultiple(izquierda, bloque.contenidoIzquierda);
    
    const derecha = document.getElementById('der-imgOtxt');
    actualizarContenidoMultiple(derecha, bloque.contenidoDerecha);
    
    actualizarIndicadores();
}

// ============================================================
// FUNCIÓN CORREGIDA: Agrupa todo en una sola caja
// ============================================================
// En js/CargarDatos.js

function actualizarContenidoMultiple(contenedorPrincipal, contenido) {
    contenedorPrincipal.innerHTML = '';
    
    if (!contenido) return;
    
    const items = Array.isArray(contenido) ? contenido : [contenido];
    if (items.length === 0) return;

    // 1. TÍTULO EXTERNO (Si existe)
    const primerItem = items[0];
    if (primerItem.tituloCaja) {
        const h3 = document.createElement('h3');
        h3.textContent = primerItem.tituloCaja;
        h3.className = 'titulo-externo-recuadro'; 
        contenedorPrincipal.appendChild(h3);
    }

    // 2. CREAR CAJA INTERNA
    const cajaInterna = document.createElement('div');
    cajaInterna.className = 'caja-contenido-estilo'; 
    
    // --- DETECCIÓN AUTOMÁTICA DE "SOLO IMAGEN" ---
    // Si hay exactamente 1 elemento Y es de tipo 'imagen'
    if (items.length === 1 && items[0].tipo === 'imagen') {
        cajaInterna.classList.add('modo-solo-imagen'); // Añadimos clase especial
    }
    // ----------------------------------------------
    
    // Llenar contenido
    items.forEach(item => {
        crearElementoContenido(cajaInterna, item);
    });
    
    contenedorPrincipal.appendChild(cajaInterna);
}

function crearElementoContenido(contenedor, item) {
    // TEXTO
    if (item.tipo === 'texto') {
        const div = document.createElement('div');
        div.innerHTML = item.contenido;
        div.className = 'contenido-texto';
        contenedor.appendChild(div);
    } 
    // IMAGEN
    else if (item.tipo === 'imagen') {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt || "Imagen";
    img.className = 'contenido-imagen';
    
    // --- NUEVO: Detectar si el usuario pidió quitar la sombra ---
    if (item.sinSombra === true) {
        img.classList.add('sin-sombra');
    }
    // -----------------------------------------------------------

    contenedor.appendChild(img);
}
    // TABLA
    else if (item.tipo === 'tabla') {
        crearTabla(contenedor, item);
    }
}

// Función auxiliar para tablas
function crearTabla(contenedor, item) {
    const tablaWrapper = document.createElement('div');
    tablaWrapper.className = 'contenido-tabla';
    
    // Título opcional interno de la tabla (si se desea)
    if(item.tituloInterno) {
        const h4 = document.createElement('h4');
        h4.textContent = item.tituloInterno;
        tablaWrapper.appendChild(h4);
    }

    const tabla = document.createElement('table');
    tabla.className = 'tabla-datos'; 
    
    if (item.headers) {
        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        item.headers.forEach(h => {
            const th = document.createElement('th');
            th.innerHTML = h;
            tr.appendChild(th);
        });
        thead.appendChild(tr);
        tabla.appendChild(thead);
    }
    
    if (item.filas) {
        const tbody = document.createElement('tbody');
        item.filas.forEach(fila => {
            const tr = document.createElement('tr');
            fila.forEach(celda => {
                const td = document.createElement('td');
                td.innerHTML = celda; 
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        tabla.appendChild(tbody);
    }
    tablaWrapper.appendChild(tabla);
    contenedor.appendChild(tablaWrapper);
}

// Navegación


function crearNavegacion() {
    const barraNav = document.getElementById('barra-nav');
    if (!barraNav) return;
    
    barraNav.innerHTML = '';
    
    // 1. Agrupar los bloques por su nombre de 'fase'
    // Estructura resultante: [ { nombre: "Introducción", indices: [0, 1] }, ... ]
    const grupos = [];
    let grupoActual = null;

    datosMetodologia.forEach((bloque, index) => {
        // Usamos el campo 'fase' o un default si no existe
        const nombreFase = bloque.fase || "General"; 

        if (!grupoActual || grupoActual.nombre !== nombreFase) {
            // Nueva fase detectada
            grupoActual = {
                nombre: nombreFase,
                indices: []
            };
            grupos.push(grupoActual);
        }
        // Agregamos el índice de la diapositiva a este grupo
        grupoActual.indices.push(index);
    });

    // 2. Renderizar los grupos en el HTML
    // Agregamos flecha izquierda al principio
    const btnPrev = document.createElement('button');
    btnPrev.className = 'btn-nav-flotante';
    btnPrev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btnPrev.onclick = () => { if(bloqueActual > 0) mostrarBloque(bloqueActual - 1); };
    barraNav.appendChild(btnPrev);

    // Renderizamos las Fases
    grupos.forEach((grupo, indexGrupo) => {
        // Contenedor de la fase
        const divGrupo = document.createElement('div');
        divGrupo.className = 'grupo-nav';
        divGrupo.id = `grupo-${indexGrupo}`; // Para referencia

        // Título de la Fase
        const titulo = document.createElement('span');
        titulo.className = 'titulo-fase-nav';
        titulo.textContent = grupo.nombre; // Ej: "FASE I: Sectores..."
        divGrupo.appendChild(titulo);

        // Barra de progreso (contenedora de segmentos)
        const barraProgreso = document.createElement('div');
        barraProgreso.className = 'barra-progreso-fase';

        // Segmentos (botones individuales)
        grupo.indices.forEach(indiceGlobal => {
            const segmento = document.createElement('button');
            segmento.className = 'segmento-nav';
            segmento.id = `nav-ind-${indiceGlobal}`; // ID único para activarlo luego
            segmento.onclick = () => mostrarBloque(indiceGlobal);
            barraProgreso.appendChild(segmento);
        });

        divGrupo.appendChild(barraProgreso);
        barraNav.appendChild(divGrupo);
    });

    // Agregamos flecha derecha al final
    const btnNext = document.createElement('button');
    btnNext.className = 'btn-nav-flotante';
    btnNext.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btnNext.onclick = () => { if(bloqueActual < datosMetodologia.length - 1) mostrarBloque(bloqueActual + 1); };
    barraNav.appendChild(btnNext);
}

function actualizarIndicadores() {
    // 1. Limpiar estados activos previos
    document.querySelectorAll('.segmento-nav').forEach(el => el.classList.remove('activo'));
    document.querySelectorAll('.grupo-nav').forEach(el => el.classList.remove('fase-activa'));

    // 2. Activar el segmento actual
    const segmentoActual = document.getElementById(`nav-ind-${bloqueActual}`);
    if (segmentoActual) {
        segmentoActual.classList.add('activo');
        
        // 3. Activar el Título de la Fase padre
        // Subimos en el DOM: button -> div.barra -> div.grupo-nav
        const grupoPadre = segmentoActual.closest('.grupo-nav');
        if (grupoPadre) {
            grupoPadre.classList.add('fase-activa');
        }
    }
}

document.addEventListener('DOMContentLoaded', iniciarMetodologia);