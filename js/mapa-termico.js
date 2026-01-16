// =============================================================================
// 1. CONFIGURACIÓN DE ZONAS
// =============================================================================
const ZONAS = [
    {
        id: 0,
        nombre: "Ordóñez Lasso",
        imagenUrl: '../images/O-LASSO.webp',
        bounds: [[-2.887742, -79.035163], [-2.893486, -79.025961]],
        leyenda: { titulo: "Temp. Ordóñez Lasso", min: "0°C", mid: "24°C", max: "48°C" }
    },
    {
        id: 1,
        nombre: "Totoracocha",
        imagenUrl: '../images/TOTORACOCHA.webp',
        bounds: [[-2.889611, -78.979463], [-2.893870, -78.975874]],
        leyenda: { titulo: "Temp. Totoracocha", min: "0°C", mid: "20.5°C", max: "41°C" }
    },
    {
        id: 2,
        nombre: "Primero de Mayo",
        imagenUrl: '../images/PRIMERO-DE-MAYO.webp',
        bounds: [[-2.904853, -79.041181], [-2.909150, -79.034282]],
        leyenda: { titulo: "Temp. Primero de Mayo", min: "0°C", mid: "27.5°C", max: "55°C" }
    }
];

// =============================================================================
// 2. GESTIÓN DE ESTADO Y DOM
// =============================================================================
const state = {
    map: null,
    baseLayer: null,
    activeOverlay: null,
    activeZoneId: null
};

const DOM = {
    loadingOverlay: null,
    loadingText: null,
    legend: {
        container: null, title: null, min: null, mid: null, max: null
    }
};

// =============================================================================
// 3. INICIALIZACIÓN
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
    DOM.loadingOverlay = document.getElementById('loadingOverlay');
    DOM.loadingText = document.querySelector('.loading-text');
    DOM.legend.container = document.getElementById('thermalLegend');
    DOM.legend.title = document.getElementById('legendTitle');
    DOM.legend.min = document.getElementById('legendMin');
    DOM.legend.mid = document.getElementById('legendMid');
    DOM.legend.max = document.getElementById('legendMax');

    initMapAndPreload();
});

async function initMapAndPreload() {
    // Inicializar Mapa
    state.map = L.map('map', {
        zoomControl: false,
        center: [-2.898, -79.03], // Centro aproximado de Cuenca
        zoom: 14,                // Zoom inicial ajustado
        minZoom: 14,             // RESTRICCIÓN: Nivel barrio/ciudad (Igual al otro mapa)
        maxZoom: 20,
        maxBounds: [[-2.95, -79.10], [-2.80, -78.90]], // Opcional: Limita la navegación a Cuenca
        preferCanvas: true
    });

    L.control.zoom({ position: 'topleft' }).addTo(state.map);
    new L.Hash(state.map);

    state.map.createPane('pane_BaseMap').style.zIndex = 400;
    state.map.createPane('pane_ThermalOverlay').style.zIndex = 405;

    state.baseLayer = L.tileLayer('https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
        pane: 'pane_BaseMap',
        opacity: 1.0,
        attribution: '&copy; Cuenca Solar'
    }).addTo(state.map);

    if(DOM.loadingText) DOM.loadingText.textContent = "Preparando visualización...";

    try {
        const baseMapPromise = new Promise((resolve) => {
            state.baseLayer.on('load', resolve);
            setTimeout(resolve, 3000); 
        });

        const imagePromises = ZONAS.map(zona => preloadImageAndDecode(zona.imagenUrl));

        await Promise.all([baseMapPromise, ...imagePromises]);
        console.log("✓ Imágenes decodificadas y listas.");
        
    } catch (error) {
        console.warn("Iniciando con advertencias:", error);
    } finally {
        hideLoading(); // ¡AHORA SÍ FUNCIONARÁ!
    }
}

function preloadImageAndDecode(url) {
    return new Promise((resolve) => {
        const img = new Image();
        
        img.onload = () => resolve(url);
        img.onerror = () => {
            console.warn(`⚠️ No se pudo cargar la imagen: ${url}`);
            resolve(null);
        };

        img.src = url;

        // Optimización INP (Intento de decodificación anticipada)
        if (img.decode) {
            img.decode()
                .then(() => resolve(url))
                .catch(() => {
                    // Si falla decode, dejamos que onload resuelva silenciosamente
                });
        }
    });
}

// === FUNCIÓN QUE FALTABA ===
function hideLoading() {
    if (DOM.loadingOverlay) {
        DOM.loadingOverlay.classList.add('hidden');
        // Esperamos la transición CSS antes de quitarlo del layout
        setTimeout(() => DOM.loadingOverlay.style.display = 'none', 500);
    }
}

// =============================================================================
// 4. LÓGICA DE CONTROL (OPTIMIZADA PARA RESPUESTA INMEDIATA)
// =============================================================================

window.toggleZone = function(zoneIndex) {
    const config = ZONAS[zoneIndex];
    if (!config) return;

    // 1. Feedback visual inmediato (Prioridad INP)
    updateButtonStyles(zoneIndex);

    // 2. Ceder control al navegador para pintar el botón
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            performHeavyMapUpdate(zoneIndex, config);
        });
    });
};

function performHeavyMapUpdate(zoneIndex, config) {
    if (state.activeZoneId === zoneIndex) {
        removeActiveLayer();
        DOM.legend.container.style.display = 'none';
        updateButtonStyles(null); 
        state.activeZoneId = null;
        return;
    }

    removeActiveLayer();

    state.activeOverlay = L.imageOverlay(config.imagenUrl, config.bounds, {
        opacity: 1,
        pane: 'pane_ThermalOverlay',
        interactive: false
    });

    state.activeOverlay.addTo(state.map);
    state.map.fitBounds(config.bounds, { padding: [50, 50], animate: true, duration: 0.8 });

    DOM.legend.title.textContent = config.leyenda.titulo;
    DOM.legend.min.textContent = config.leyenda.min;
    DOM.legend.mid.textContent = config.leyenda.mid;
    DOM.legend.max.textContent = config.leyenda.max;
    DOM.legend.container.style.display = 'block';

    state.activeZoneId = zoneIndex;
}

function removeActiveLayer() {
    if (state.activeOverlay) {
        state.map.removeLayer(state.activeOverlay);
        state.activeOverlay = null;
    }
}

function updateButtonStyles(activeIndex) {
    const allButtons = document.querySelectorAll('.zone-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));

    if (activeIndex !== null && activeIndex !== state.activeZoneId) {
        const activeBtn = document.getElementById(`btn-zone-${activeIndex}`);
        if (activeBtn) activeBtn.classList.add('active');
    }
}