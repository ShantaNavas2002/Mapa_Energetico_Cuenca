// =============================================================================
// 1. CONFIGURACIÓN DE ZONAS (AQUÍ EDITAS TÚ)
// =============================================================================
const ZONAS = [
    {
        id: 0, // No cambiar
        nombre: "Ordóñez Lasso",
        imagenUrl: '../images/O-LASSO.webp', // Tu primera imagen
        // TUS COORDENADAS EXACTAS DE LA PRIMERA IMAGEN
        bounds: [
            [-2.887742, -79.035163], 
            [-2.893486, -79.025961]
        ],
        // TU LEYENDA PERSONALIZADA PARA ESTA IMAGEN
        leyenda: {
            titulo: "Temp. Ordóñez Lasso",
            min: "15°C",
            mid: "22°C",
            max: "35°C"
        }
    },
    {
        id: 1, // No cambiar
        nombre: "Totoracocha",
        imagenUrl: '../images/TOTORACOCHA.webp', // CAMBIA ESTO por tu segunda imagen
        // PON AQUÍ LAS COORDENADAS DE LA SEGUNDA IMAGEN
        bounds: [
            [-2.89067, -78.979451],
            [-2.893225, -78.975818]  // Esquina Inferior Derecha
        ],
        // LEYENDA DISTINTA PARA LA ZONA 2
        leyenda: {
            titulo: "Temp. Zona Centro",
            min: "10°C",
            mid: "20°C",
            max: "30°C"
        }
    },
    {
        id: 2, // No cambiar
        nombre: "Primero de Mayo)",
        imagenUrl: '../images/PRIMERO-DE-MAYO.webp', // CAMBIA ESTO por tu tercera imagen
        // PON AQUÍ LAS COORDENADAS DE LA TERCERA IMAGEN
        bounds: [
            [-2.905087, -79.040625], // Esquina Superior Izquierda
            [-2.909185, -79.035558]  // Esquina Inferior Derecha
        ],
        // LEYENDA DISTINTA PARA LA ZONA 3
        leyenda: {
            titulo: "Temp. Industrial",
            min: "20°C",
            mid: "40°C",
            max: "60°C"
        }
    }
];

// =============================================================================
// 2. VARIABLES GLOBALES
// =============================================================================
let map;
let baseLayer;
let activeOverlay = null; // Guardará la capa de imagen actual
let activeZoneId = null;  // Guardará qué ID está activo (0, 1 o 2)

// =============================================================================
// 3. INICIALIZACIÓN
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    initMap();
});

function initMap() {
    // 1. Crear el mapa base centrado en Cuenca general
    map = L.map('map', {
        zoomControl: false,
        center: [-2.8975, -79.0225], // Centro general
        zoom: 13
    });

    // 2. Controles de Zoom y Hash
    L.control.zoom({ position: 'topleft' }).addTo(map);
    new L.Hash(map);

    // 3. Capa Base (CartoDB)
    map.createPane('pane_BaseMap');
    map.getPane('pane_BaseMap').style.zIndex = 400;
    
    baseLayer = L.tileLayer('https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
        pane: 'pane_BaseMap',
        opacity: 1.0,
        attribution: '&copy; Cuenca Solar'
    }).addTo(map);

    // 4. Configurar pane para las térmicas
    map.createPane('pane_ThermalOverlay');
    map.getPane('pane_ThermalOverlay').style.zIndex = 405;

    // Ocultar overlay de carga inicial
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 800);

    console.log("✓ Sistema Multi-Zona Inicializado");
}

// =============================================================================
// 4. LÓGICA DE CONTROL DE ZONAS (EL CEREBRO)
// =============================================================================

// Esta función se llama cuando haces clic en un botón
window.toggleZone = function(zoneIndex) {
    const config = ZONAS[zoneIndex];
    const legendDiv = document.getElementById('thermalLegend');
    
    // CASO A: Si hacemos clic en la zona que ya está activa -> La apagamos
    if (activeZoneId === zoneIndex) {
        console.log("Desactivando zona actual...");
        
        // Quitar capa del mapa
        if (activeOverlay) {
            map.removeLayer(activeOverlay);
            activeOverlay = null;
        }
        
        // Ocultar leyenda
        legendDiv.style.display = 'none';
        
        // Quitar estilo activo de los botones
        updateButtonStyles(null);
        
        activeZoneId = null;
        return; // Terminamos aquí
    }

    // CASO B: Si seleccionamos una zona nueva (o no había ninguna)
    console.log(`Activando Zona ${zoneIndex}: ${config.nombre}`);

    // 1. Si ya había otra capa puesta, la quitamos primero
    if (activeOverlay) {
        map.removeLayer(activeOverlay);
    }

    // 2. Crear la nueva imagen
    // Usamos las coordenadas (bounds) que TÚ configuras en el array ZONAS
    activeOverlay = L.imageOverlay(config.imagenUrl, config.bounds, {
        opacity: 0.8,
        pane: 'pane_ThermalOverlay',
        interactive: false
    });

    // 3. Añadir al mapa y hacer zoom
    activeOverlay.addTo(map);
    map.fitBounds(config.bounds, { padding: [50, 50], animate: true, duration: 1 });

    // 4. Actualizar la Leyenda con los datos de esta zona específica
    document.getElementById('legendTitle').textContent = config.leyenda.titulo;
    document.getElementById('legendMin').textContent = config.leyenda.min;
    document.getElementById('legendMid').textContent = config.leyenda.mid;
    document.getElementById('legendMax').textContent = config.leyenda.max;
    legendDiv.style.display = 'block';

    // 5. Actualizar estilos de los botones
    updateButtonStyles(zoneIndex);

    // 6. Manejo de errores de imagen
    activeOverlay.on('error', function() {
        alert(`Error: No se encuentra la imagen: ${config.imagenUrl}`);
    });

    // Guardar el estado
    activeZoneId = zoneIndex;
};

// Función cosmética para iluminar el botón seleccionado
function updateButtonStyles(activeIndex) {
    // Recorrer todos los botones y limpiar clase 'active'
    ZONAS.forEach(zona => {
        const btn = document.getElementById(`btn-zone-${zona.id}`);
        if (btn) btn.classList.remove('active');
    });

    // Si hay uno activo, ponerle la clase
    if (activeIndex !== null) {
        const activeBtn = document.getElementById(`btn-zone-${activeIndex}`);
        if (activeBtn) activeBtn.classList.add('active');
    }
}