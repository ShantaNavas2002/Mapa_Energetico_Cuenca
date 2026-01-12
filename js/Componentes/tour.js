document.addEventListener('DOMContentLoaded', () => {
    const TARGET_CLAVE = "0703010002000";

    // --- 0. INYECCIÓN DE ESTILOS CSS (Para bloquear polígonos durante el tour) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Clase para deshabilitar interacción solo en los polígonos del mapa */
        .tour-active path.leaflet-interactive {
            pointer-events: none !important;
            cursor: default !important;
        }
    `;
    document.head.appendChild(style);

    // --- 1. CONFIGURACIÓN DE DRIVER.JS ---
    const driver = window.driver.js.driver({
        animate: true,
        showProgress: true,
        
        // Textos
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: 'Finalizar',
        progressText: 'Paso {{current}} de {{total}}',

        // Configuración visual
        allowClose: true,
        overlayColor: '#000000cc',
        stageRadius: 10,

        // HOOK PRINCIPAL: Abrir acordeones automáticamente
        onHighlightStarted: (element, step) => {
            if (element && element.tagName === 'DETAILS') {
                element.open = true;
            } else if (step.popover && step.popover.title) {
                handleAccordionExpansion(step.popover.title);
            }
        },

        // HOOK DE LIMPIEZA: Reactivar interacción al cerrar/terminar
        onDestroyed: () => {
            togglePolygonInteraction(true); // Reactiva los clics en el mapa
        }
    });

    // --- 2. BOTÓN DE INICIO ---
    const startBtn = document.createElement('button');
    startBtn.className = 'tour-start-btn';
    startBtn.innerHTML = '<div><p>Guía</p></div>';
    startBtn.onclick = startTour;
    document.body.appendChild(startBtn);

    // --- 3. LÓGICA DEL TOUR ---
    function startTour() {
        if (!window.AppSolar || !window.AppSolar.claveIndex) {
            console.warn("Datos no cargados aún.");
            return;
        }

        // --- PASO NUEVO: CERRAR PANEL SI ESTÁ ABIERTO ---
        const closeBtn = document.getElementById('panelCloseBtn');
        const panel = document.getElementById('featurePanel');
        
        // Si el panel existe y NO está oculto, simulamos clic en cerrar
        // Esto activa tu lógica existente en mapa-fotovoltaico.js (unmarkSelected)
        if (closeBtn && panel && !panel.classList.contains('hidden')) {
            closeBtn.click();
        }

        // A) BLOQUEAMOS LA INTERACCIÓN AL INICIAR
        togglePolygonInteraction(false);

        // Funciones Helper
        function getPolygonElement() {
            const layer = window.AppSolar.claveIndex.get(TARGET_CLAVE);
            return (layer && typeof layer.getElement === 'function') ? layer.getElement() : null;
        }

        function prepareMapFeature() {
            const layer = window.AppSolar.claveIndex.get(TARGET_CLAVE);
            if (layer) {
                // Ajustamos zoom con espacio para el panel a la derecha
                window.AppSolar.map.fitBounds(layer.getBounds(), { paddingBottomRight: [450, 50], maxZoom: 19 });
                // Simulamos clic para abrir el panel del predio objetivo
                layer.fire('click');
            }
        }

        // Definición de Pasos
        driver.setSteps([
            {
                element: '#claveSearch',
                popover: { title: 'Buscador de Predio', description: 'Ingresa la Clave Catastral para localizar el predio de interes.', side: 'bottom', align: 'start' }
            },
            {
                element: getPolygonElement(),
                popover: { title: 'Predio Identificado', description: 'Figura representativa del predio (Polígono) .', side: 'top' },
                onHighlightStarted: () => {
                   const layer = window.AppSolar.claveIndex.get(TARGET_CLAVE);
                   if(layer) window.AppSolar.map.fitBounds(layer.getBounds());
                }
            },
            {
                element: '#featurePanel',
                popover: { title: 'Ficha del Predio', description: 'Información técnica detallada.', side: 'left', align: 'center' },
                onHighlightStarted: prepareMapFeature
            },
            {
                element: '.popup-card .popup-title',
                popover: { title: 'Datos Generales', description: 'Información general del predio: Clave catastral, medidores y altura.', side: 'left' }
            },
            {
                element: '#featurePanelContent details:nth-of-type(1)',
                popover: { title: 'Sistemas On-Grid', description: 'Datos recolectados con Conexión a red sin baterías.', side: 'left' }
            },
            {
                element: '#featurePanelContent details:nth-of-type(2)',
                popover: { title: 'Sistemas Off-Grid', description: 'Datos recolectados con el uso de baterías.', side: 'left' }
            },
            {
                element: '#featurePanelContent details:nth-of-type(3)',
                popover: { title: 'Análisis Energético Mensual', description: 'Gráfico comparativo del comportamiento energético mes a mes.', side: 'left' }
            },
            {
                element: '.map-legend',
                popover: { title: 'Leyenda del Mapa', description: 'Guía de colores para identificar el número de pisos (0-16 pisos).', side: 'top', align: 'end' }
            }
        ]);

        driver.drive();
    }

    // --- 4. FUNCIONES DE UTILIDAD ---

    // Función que activa/desactiva el bloqueo de clics
    function togglePolygonInteraction(enable) {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        if (enable) {
            mapContainer.classList.remove('tour-active');
        } else {
            mapContainer.classList.add('tour-active');
        }
    }

    function handleAccordionExpansion(title) {
        const content = document.getElementById('featurePanelContent');
        if (!content) return;
        
        const details = content.querySelectorAll('details');
        details.forEach(det => {
            const summary = det.querySelector('summary');
            if (summary) {
                const textHTML = summary.innerText.toLowerCase().trim();
                const textTitle = title.toLowerCase().trim();
                if (textHTML.includes(textTitle)) {
                    det.open = true;
                }
            }
        });
    }
});