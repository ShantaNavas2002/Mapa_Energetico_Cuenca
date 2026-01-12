document.addEventListener('DOMContentLoaded', () => {
    // Clave del predio objetivo
    const TARGET_CLAVE = "0703010002000";

    // 1. Configuración básica de Driver.js
    const driver = window.driver.js.driver({
        
        showProgress: false,
        animate: true,
       
        
        // Hook para abrir las pestañas del panel automáticamente
        onHighlightStarted: (element, step) => {
            if (step.popover && step.popover.title) {
                handleAccordionExpansion(step.popover.title);
            }
        }
    });

    // 2. Crear el Botón Flotante
    const startBtn = document.createElement('button');
    startBtn.className = 'tour-start-btn';
    startBtn.innerHTML = '<div><p>Guía</p></div>'; // O usa texto "?"
    startBtn.onclick = startTour;
    document.body.appendChild(startBtn);

    // 3. Función para iniciar
    function startTour() {
        // Verificación simple de datos
        if (!window.AppSolar || !window.AppSolar.claveIndex) {
            console.warn("Datos no cargados");
            return;
        }

        driver.setConfig({ steps: buildSteps() });
        driver.drive();
    }

    // --- Funciones Auxiliares (Solo para que el tour encuentre cosas) ---

    function getPolygonElement() {
        const layer = window.AppSolar.claveIndex.get(TARGET_CLAVE);
        return (layer && typeof layer.getElement === 'function') ? layer.getElement() : null;
    }

    function prepareMapFeature() {
        // Hace zoom y abre el panel para que el tour tenga qué señalar
        const layer = window.AppSolar.claveIndex.get(TARGET_CLAVE);
        if (layer) {
            window.AppSolar.map.fitBounds(layer.getBounds(), { paddingBottomRight: [450, 50], maxZoom: 19 });
            layer.fire('click');
        }
    }

    function handleAccordionExpansion(title) {
        // Abre la pestaña correcta del acordeón según el paso
        const panel = document.getElementById('featurePanelContent');
        if (!panel) return;
        const details = panel.querySelectorAll('details.section');
        
        details.forEach(d => d.removeAttribute('open')); // Resetea

        if (title.includes('On-Grid') && details[0]) details[0].setAttribute('open', '');
        else if (title.includes('Off-Grid') && details[1]) details[1].setAttribute('open', '');
        else if (title.includes('Análisis') && details[2]) details[2].setAttribute('open', '');
    }

    // 4. Los Pasos
    function buildSteps() {
        return [
            {
                element: '#claveSearch',
                popover: { title: 'Buscador de Predio', description: 'Busque un predio por su Clave Catastral.', side: 'bottom', align: 'start' }
            },
            {
                element: getPolygonElement(),
                popover: { title: 'Predio Identificado', description: 'Ubicación exacta resaltada en el mapa.', side: 'top' },
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
                popover: { title: 'Datos Generales', description: 'Clave catastral, medidores y altura.', side: 'left' }
            },
            {
                element: '#featurePanelContent details:nth-of-type(1)',
                popover: { title: 'Sistemas On-Grid', description: 'Conexión a red sin baterías.', side: 'left' }
            },
            {
                element: '#featurePanelContent details:nth-of-type(2)',
                popover: { title: 'Sistemas Off-Grid', description: 'Soluciones con baterías.', side: 'left' }
            },
            {
                element: '#featurePanelContent details:nth-of-type(3)',
                popover: { title: 'Análisis Energético', description: 'Gráfico de consumo mensual.', side: 'left' }
            },
            {
                element: '.map-legend',
                popover: { title: 'Leyenda del Mapa', description: 'Guía de colores por altura.', side: 'top', align: 'end'  }
                
            }
            
        ];
    
    }
});