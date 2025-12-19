let datosMetodologia = [];
let bloqueActual = 0;

/* Inicializa la carga de datos si la variable global existe */
function iniciarMetodologia() {
    if (typeof DATA_METODOLOGIA !== 'undefined') {
        datosMetodologia = DATA_METODOLOGIA.bloques;
        mostrarBloque(0);
        crearNavegacion();
    } else {
        console.error('No se encontraron los datos en DATA_METODOLOGIA');
    }
}

/* Renderiza el bloque actual actualizando textos, imágenes y barra de progreso */
function mostrarBloque(indice) {
    if (indice < 0 || indice >= datosMetodologia.length) return;
    
    bloqueActual = indice;
    const bloque = datosMetodologia[indice];
    
    const seccionPill = document.getElementById('seccion-pill');
    const faseTxt = document.getElementById('fase-txt');
    
    if(seccionPill) seccionPill.textContent = bloque.seccion || "METODOLOGÍA";
    if(faseTxt) faseTxt.textContent = bloque.fase || "";

    const izquierda = document.getElementById('izq-imgOtxt');
    actualizarContenidoMultiple(izquierda, bloque.contenidoIzquierda);
    
    const derecha = document.getElementById('der-imgOtxt');
    actualizarContenidoMultiple(derecha, bloque.contenidoDerecha);
    
    actualizarIndicadores();
}

/* Gestiona la creación dinámica del contenido (texto, imagen, tabla, carrusel) dentro de un contenedor */
function actualizarContenidoMultiple(contenedorPrincipal, contenido) {
    contenedorPrincipal.innerHTML = '';
    
    if (!contenido) return;
    
    const items = Array.isArray(contenido) ? contenido : [contenido];
    if (items.length === 0) return;

    const primerItem = items[0];
    if (primerItem.tituloCaja) {
        const h3 = document.createElement('h3');
        h3.innerHTML = primerItem.tituloCaja; 
        h3.className = 'titulo-externo-recuadro'; 
        contenedorPrincipal.appendChild(h3);
    }

    const cajaInterna = document.createElement('div');
    cajaInterna.className = 'caja-contenido-estilo'; 
    
    if (items.length === 1 && items[0].tipo === 'imagen') {
        cajaInterna.classList.add('modo-solo-imagen'); 
    }
    
    items.forEach(item => {
        crearElementoContenido(cajaInterna, item);
    });
    
    contenedorPrincipal.appendChild(cajaInterna);
}

/* Factoría que decide qué elemento HTML crear según el tipo de dato */
function crearElementoContenido(contenedor, item) {
    if (item.tipo === 'texto') {
        const div = document.createElement('div');
        div.innerHTML = item.contenido;
        div.className = 'contenido-texto';
        
        if (item.centrado === true) {
            div.classList.add('centrado-total');
        }
        contenedor.appendChild(div);
    }
    else if (item.tipo === 'imagen') {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || "Imagen";
        img.className = 'contenido-imagen';
    
        if (item.sinSombra === true) {
            img.classList.add('sin-sombra');
        }
        contenedor.appendChild(img);
    }
    else if (item.tipo === 'tabla') {
        crearTabla(contenedor, item);
    }
    else if (item.tipo === 'carrusel') {
        crearCarruselStack(contenedor, item);
    }
}

/* Construye una tabla HTML dinámica a partir de los datos JSON */
function crearTabla(contenedor, item) {
    const tablaWrapper = document.createElement('div');
    tablaWrapper.className = 'contenido-tabla';
    
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

/* Genera la barra de navegación inferior agrupando los slides por fases */
function crearNavegacion() {
    const barraNav = document.getElementById('barra-nav');
    if (!barraNav) return;
    
    barraNav.innerHTML = '';
    
    const grupos = [];
    let grupoActual = null;

    datosMetodologia.forEach((bloque, index) => {
        const nombreFase = bloque.fase || "General"; 

        if (!grupoActual || grupoActual.nombre !== nombreFase) {
            grupoActual = {
                nombre: nombreFase,
                indices: []
            };
            grupos.push(grupoActual);
        }
        grupoActual.indices.push(index);
    });

    const btnPrev = document.createElement('button');
    btnPrev.className = 'btn-nav-flotante';
    btnPrev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btnPrev.onclick = () => { if(bloqueActual > 0) mostrarBloque(bloqueActual - 1); };
    barraNav.appendChild(btnPrev);

    grupos.forEach((grupo, indexGrupo) => {
        const divGrupo = document.createElement('div');
        divGrupo.className = 'grupo-nav';
        divGrupo.id = `grupo-${indexGrupo}`; 

        const titulo = document.createElement('span');
        titulo.className = 'titulo-fase-nav';
        titulo.textContent = grupo.nombre; 
        divGrupo.appendChild(titulo);

        const barraProgreso = document.createElement('div');
        barraProgreso.className = 'barra-progreso-fase';

        grupo.indices.forEach(indiceGlobal => {
            const segmento = document.createElement('button');
            segmento.className = 'segmento-nav';
            segmento.id = `nav-ind-${indiceGlobal}`; 
            segmento.onclick = () => mostrarBloque(indiceGlobal);
            barraProgreso.appendChild(segmento);
        });

        divGrupo.appendChild(barraProgreso);
        barraNav.appendChild(divGrupo);
    });

    const btnNext = document.createElement('button');
    btnNext.className = 'btn-nav-flotante';
    btnNext.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btnNext.onclick = () => { if(bloqueActual < datosMetodologia.length - 1) mostrarBloque(bloqueActual + 1); };
    barraNav.appendChild(btnNext);
}

/* Actualiza visualmente qué segmento y fase están activos en la navegación */
function actualizarIndicadores() {
    document.querySelectorAll('.segmento-nav').forEach(el => el.classList.remove('activo'));
    document.querySelectorAll('.grupo-nav').forEach(el => el.classList.remove('fase-activa'));

    const segmentoActual = document.getElementById(`nav-ind-${bloqueActual}`);
    if (segmentoActual) {
        segmentoActual.classList.add('activo');
        
        const grupoPadre = segmentoActual.closest('.grupo-nav');
        if (grupoPadre) {
            grupoPadre.classList.add('fase-activa');
        }
    }
}

/* Crea un carrusel  */
function crearCarruselStack(contenedor, item) {
    if (!item.imagenes || item.imagenes.length === 0) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'carrusel-stack-wrapper';

    const cartas = item.imagenes.map((imgData, index) => {
        const img = document.createElement('img');
        img.src = imgData.src;
        img.alt = imgData.alt || `Imagen ${index}`;
        img.className = 'carrusel-carta';
        img.onclick = () => {
            if (index === (estadoActual + 1) % item.imagenes.length) {
                avanzar();
            }
        };
        wrapper.appendChild(img);
        return img;
    });

    const btnPrev = document.createElement('button');
    btnPrev.className = 'carrusel-btn btn-prev';
    btnPrev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    btnPrev.onclick = retroceder;

    const btnNext = document.createElement('button');
    btnNext.className = 'carrusel-btn btn-next';
    btnNext.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    btnNext.onclick = avanzar;

    wrapper.appendChild(btnPrev);
    wrapper.appendChild(btnNext);
    contenedor.appendChild(wrapper);

    let estadoActual = 0;
    const total = item.imagenes.length;

    function actualizarClases() {
        cartas.forEach((carta, index) => {
            carta.className = 'carrusel-carta';
            let diferencia = (index - estadoActual + total) % total;

            if (diferencia === 0) {
                carta.classList.add('pos-activa'); 
            } else if (diferencia === 1) {
                carta.classList.add('pos-siguiente'); 
            } else if (diferencia === total - 1) {
                carta.classList.add('pos-anterior'); 
            } else {
                carta.classList.add('pos-oculta'); 
            }
        });
    }

    function avanzar() {
        estadoActual = (estadoActual + 1) % total;
        actualizarClases();
    }

    function retroceder() {
        estadoActual = (estadoActual - 1 + total) % total;
        actualizarClases();
    }

    actualizarClases();
}

document.addEventListener('DOMContentLoaded', iniciarMetodologia);