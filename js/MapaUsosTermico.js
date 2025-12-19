// =============================================================================
// CONFIGURACIÓN GLOBAL Y ESTILOS
// =============================================================================

// Mapeo de categorías a colores e imágenes
const CATEGORY_CONFIG = [
    { keywords: ['servicio'], color: '#F2AB1F', img: 'images/Servicio.png' },
    { keywords: ['comercio'], color: '#ED7D31', img: 'images/Comercio.png' },
    { keywords: ['desuso', 'vacante'], color: '#7F7F7F', img: 'images/Desuso-Vacantes.png' },
    { keywords: ['espacio', 'abierto', 'parque', 'plaza'], color: '#668A4C', img: 'images/Parques-Plaza.png' },
    { keywords: ['equipamiento'], color: '#C00000', img: 'images/Equipamiento-Publico.png' },
    { keywords: ['vivienda', 'residencia'], color: '#104358', img: 'images/Vivienda-Residencia.png' }
];

const DEFAULT_STYLE = { color: '#CCCCCC', img: 'images/default.jpg' };

// =============================================================================
// INICIALIZACIÓN DEL MAPA
// =============================================================================

var map = L.map('map', {
    zoomControl: false,
    maxZoom: 28,
    minZoom: 14
}).fitBounds([[-2.908626027397235, -79.04784062706698], [-2.8875146284421516, -79.01489480969526]]);

var hash = new L.Hash(map);
map.attributionControl.setPrefix(' <a href="https://leafletjs.com">Leaflet</a> &middot');
var autolinker = new Autolinker({ truncate: { length: 30, location: 'smart' } });

L.control.zoom({ position: 'topleft' }).addTo(map);

// Capa Base (CartoDB Light)
map.createPane('pane_Positronretina_0');
map.getPane('pane_Positronretina_0').style.zIndex = 400;
var layer_Positronretina_0 = L.tileLayer('https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
    pane: 'pane_Positronretina_0',
    opacity: 1.0,
    attribution: '<a href="https://cartodb.com/basemaps/">Map tiles by CartoDB</a>, Data by OSM.',
    minZoom: 1,
    maxZoom: 28,
    minNativeZoom: 5,
    maxNativeZoom: 20
});
map.addLayer(layer_Positronretina_0);

// =============================================================================
// GESTIÓN DE INTERACCIÓN Y RESALTADO
// =============================================================================

var highlightLayer;
var __selectedLayer = null;

function highlightFeature(e) {
    if (__selectedLayer === e.target) return;
    highlightLayer = e.target;

    if (e.target.feature.geometry.type === 'LineString' || e.target.feature.geometry.type === 'MultiLineString') {
        highlightLayer.setStyle({ color: '#ffff00' });
    } else {
        highlightLayer.setStyle({ fillColor: 'rgba(98, 119, 112)', fillOpacity: 1 });
    }
}

// Obtiene elementos SVG asociados a un layer para manipulación de clases CSS
function getLayerElements(layer) {
    var el = (typeof layer.getElement === 'function') ? layer.getElement() : layer._path;
    if (!el) return [];
    if (el.tagName && el.tagName.toLowerCase() === 'g') {
        return Array.from(el.querySelectorAll('path.leaflet-interactive'));
    }
    return [el];
}

function markSelected(layer) {
    if (typeof layer.bringToFront === 'function') layer.bringToFront();
    if (typeof layer.setStyle === 'function') {
        layer.setStyle({ weight: 3, color: '#2563eb', fillOpacity: 0.85 });
    }
    getLayerElements(layer).forEach(p => { if (p) p.classList.add('feature-selected'); });
}

function unmarkSelected(layer) {
    if (!layer) return;
    // Reset estilo capa padre
    if (layer._eventParents) {
        Object.values(layer._eventParents).forEach(parent => {
            if (typeof parent.resetStyle === 'function') parent.resetStyle(layer);
        });
    }
    getLayerElements(layer).forEach(p => { if (p) p.classList.remove('feature-selected'); });
}

function selectLayer(layer) {
    if (__selectedLayer && __selectedLayer !== layer) unmarkSelected(__selectedLayer);
    __selectedLayer = layer;
    markSelected(layer);
}

// Gestión del Panel Lateral
function closeFeaturePanel() {
    var panel = document.getElementById('featurePanel');
    if (panel) panel.classList.add('hidden');
    if (__selectedLayer) {
        unmarkSelected(__selectedLayer);
        __selectedLayer = null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('panelCloseBtn');
    if (btn) {
        btn.addEventListener('click', closeFeaturePanel);
        document.addEventListener('keydown', ev => {
            if (ev.key === 'Escape') closeFeaturePanel();
        });
    }
});

// =============================================================================
// LÓGICA DE ESTILOS Y POPUPS
// =============================================================================

// Retorna la configuración (color/imagen) basada en la categoría
function getCategorySettings(categoria) {
    if (!categoria) return DEFAULT_STYLE;
    const cat = String(categoria).toLowerCase().trim();
    
    const found = CATEGORY_CONFIG.find(conf => 
        conf.keywords.some(keyword => cat.includes(keyword))
    );
    return found || DEFAULT_STYLE;
}

function style_CATEGORIAS_4(feature) {
    var settings = getCategorySettings(feature.properties.CAT_GENERA);
    return {
        pane: 'pane_CATEGORIAS_4',
        opacity: 1,
        color: 'rgba(35,35,35,1.0)',
        weight: 1.0,
        fill: true,
        fillOpacity: 0.7,
        fillColor: settings.color,
        interactive: true
    };
}

function createPopupContent(props) {
    var titulo = props.CAT_GENERA || 'Sin Información';
    var actividadPB = props.ACT_PB || 'Sin información';
    var settings = getCategorySettings(props.CAT_GENERA);

    return `
        <div style="min-width: 250px; padding: 10px; font-family: 'Roboto', sans-serif;">
            <div style="background: linear-gradient(135deg, rgba(98, 119, 112) 0%, rgba(98, 119, 112) 100%); 
                        padding: 15px; border-radius: 8px 8px 0 0; margin: -10px -10px 15px -10px;">
                <h3 style="margin: 0; color: white; font-size: 1.2rem; font-weight: 700;">${titulo}</h3>
            </div>
            <img src="${settings.img}" alt="${titulo}" 
                 style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; 
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);" 
                 onerror="this.onerror=null; this.src='images/default.jpg';">
            <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid rgb(238 211 168);">
                <p style="margin: 0; color: #64748b; font-size: 0.85rem; font-weight: 500; text-transform: uppercase;">
                    Actividad Principal
                </p>
                <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 1rem; font-weight: 600;">
                    ${actividadPB}
                </p>
            </div>
        </div>
    `;
}

// =============================================================================
// CAPA GEOJSON
// =============================================================================

map.createPane('pane_CATEGORIAS_4');
map.getPane('pane_CATEGORIAS_4').style.zIndex = 404;

var layer_CATEGORIAS_4 = new L.geoJson(json_Usos, {
    interactive: true,
    pane: 'pane_CATEGORIAS_4',
    style: style_CATEGORIAS_4,
    onEachFeature: function (feature, layer) {
        layer.bindPopup(createPopupContent(feature.properties));

        layer.on({
            mouseover: highlightFeature,
            mouseout: function (e) {
                if (e.target._eventParents) {
                    Object.values(e.target._eventParents).forEach(p => {
                        if (typeof p.resetStyle === 'function') p.resetStyle(e.target);
                    });
                }
                if (__selectedLayer === e.target) markSelected(e.target);
            },
            click: function (e) {
                selectLayer(layer);
            }
        });
    }
});

map.addLayer(layer_CATEGORIAS_4);

var bounds = layer_CATEGORIAS_4.getBounds();
if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] });

// =============================================================================
// SISTEMA DE BÚSQUEDA (INDEX & AUTOCOMPLETE)
// =============================================================================

var __claveIndex = new Map();

// Indexación de capas por CLAVE
if (typeof layer_CATEGORIAS_4 !== 'undefined' && layer_CATEGORIAS_4) {
    layer_CATEGORIAS_4.eachLayer(function (layer) {
        try {
            var clave = layer.feature?.properties?.CLAVE;
            if (clave) __claveIndex.set(String(clave).trim().toUpperCase(), layer);
        } catch (e) { /* Silencio en errores de indexado */ }
    });
}

var __claveKeys = Array.from(__claveIndex.keys());

// Configuración UI del buscador
(function initSearchUI() {
    var input = document.getElementById('claveSearch');
    var dl = document.getElementById('claveOptions');
    var btn = document.getElementById('claveGo');

    if (!input || !dl || !btn) return;

    // Autocompletado
    input.addEventListener('input', function () {
        var texto = this.value.trim().toUpperCase();
        dl.innerHTML = '';
        if (!texto) return;

        var matches = 0;
        for (var i = 0; i < __claveKeys.length; i++) {
            if (__claveKeys[i].indexOf(texto) !== -1) {
                var op = document.createElement('option');
                op.value = __claveKeys[i];
                dl.appendChild(op);
                matches++;
                if (matches >= 5) break; // Límite de resultados
            }
        }
    });

    // Acción de búsqueda
    function executeSearch() {
        var key = input.value.trim().toUpperCase();
        var layer = __claveIndex.get(key);

        if (!layer) {
            alert('No se encontró la CLAVE: ' + input.value);
            return;
        }

        var b = (typeof layer.getBounds === 'function') ? layer.getBounds() : null;
        if (b && b.isValid && b.isValid()) {
            map.fitBounds(b, { maxZoom: 18, animate: true, padding: [50, 50] });
            setTimeout(() => {
                layer.fire('click');
                layer.openPopup();
            }, 300);
        } else {
            layer.fire('click');
            layer.openPopup();
        }
    }

    btn.addEventListener('click', executeSearch);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') executeSearch(); });
})();