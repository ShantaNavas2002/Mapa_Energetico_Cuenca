var highlightLayer;
function highlightFeature(e) {
    if (__selectedLayer === e.target) return;
    highlightLayer = e.target;

    if (e.target.feature.geometry.type === 'LineString' || e.target.feature.geometry.type === 'MultiLineString') {
        highlightLayer.setStyle({
            color: '#ffff00',
        });
    } else {
        highlightLayer.setStyle({
            fillColor: 'rgba(98, 119, 112)',
            fillOpacity: 1
        });
    }
}

var map = L.map('map', {
    zoomControl:false, maxZoom:28, minZoom:14
}).fitBounds([[-2.908626027397235,-79.04784062706698],[-2.8875146284421516,-79.01489480969526]]);

var hash = new L.Hash(map);
map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

var zoomControl = L.control.zoom({
    position: 'topleft'
}).addTo(map);

var bounds_group = new L.featureGroup([]);

map.createPane('pane_Positronretina_0');
map.getPane('pane_Positronretina_0').style.zIndex = 400;
var layer_Positronretina_0 = L.tileLayer('https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
    pane: 'pane_Positronretina_0',
    opacity: 1.0,
    attribution: '<a href="https://cartodb.com/basemaps/">Map tiles by CartoDB, under CC BY 3.0. Data by OpenStreetMap, under ODbL.</a>',
    minZoom: 1,
    maxZoom: 28,
    minNativeZoom: 5,
    maxNativeZoom: 20
});
layer_Positronretina_0;
map.addLayer(layer_Positronretina_0);

var __selectedLayer = null;

// Devuelve elementos SVG del layer 
function getLayerElements(layer){
    var el = (typeof layer.getElement === 'function') ? layer.getElement() : layer._path;
    if (!el) return [];
    if (el.tagName && el.tagName.toLowerCase() === 'g') {
        return Array.from(el.querySelectorAll('path.leaflet-interactive'));
    }
    return [el];
}

function markSelected(layer){
    if (typeof layer.bringToFront === 'function') layer.bringToFront();
    
    if (typeof layer.setStyle === 'function') {
        layer.setStyle({ weight: 3, color: '#2563eb', fillOpacity: 0.85 });
    }
    getLayerElements(layer).forEach(function(p){ if (p) p.classList.add('feature-selected'); });
}

function unmarkSelected(layer){
    if (!layer) return;
    // Reset de estilo de la capa padre 
    for (var i in layer._eventParents) {
        if (typeof layer._eventParents[i].resetStyle === 'function') {
            layer._eventParents[i].resetStyle(layer);
        }
    }
    getLayerElements(layer).forEach(function(p){ if (p) p.classList.remove('feature-selected'); });
}

function selectLayer(layer){
    if (__selectedLayer && __selectedLayer !== layer) {
        unmarkSelected(__selectedLayer);
    }
    __selectedLayer = layer;
    markSelected(layer);
}

// Cerrar panel 
function closeFeaturePanel(){
    var panel = document.getElementById('featurePanel');
    if (panel) panel.classList.add('hidden');
    if (__selectedLayer) {
        unmarkSelected(__selectedLayer);
        __selectedLayer = null;
    }
}

// Conecta tecla ESC una sola vez
(function wireCloseOnce(){
    document.addEventListener('DOMContentLoaded', function(){
        var btn = document.getElementById('panelCloseBtn');
        if (btn && !btn._wired){
            btn._wired = true;
            btn.addEventListener('click', closeFeaturePanel);
            document.addEventListener('keydown', function(ev){
                if (ev.key === 'Escape') closeFeaturePanel();
            });
        }
    });
})();

// =============================================================================
// FUNCIÓN PARA OBTENER COLOR SEGÚN CATEGORÍA
// =============================================================================

function getColorByCategoria(categoria) {
    if (!categoria) return '#CCCCCC';
    
    var cat = String(categoria).toLowerCase().trim();
    
    if (cat.includes('servicio')) {
        return '#7F8C18'; 
    }
    if (cat.includes('comercio')) {
        return '#3d4717ff'; 
    }
    if (cat.includes('desuso') || cat.includes('vacante')) {
        return '#595347'; 
    }
    if (cat.includes('espacio') || cat.includes('abierto') || cat.includes('parque') || cat.includes('plaza')) {
        return '#915a2dff'; 
    }
    if (cat.includes('equipamiento')) {
        return '#D9D9D9'; 
    }
    if (cat.includes('vivienda') || cat.includes('residencia')) {
        return '#F2DB94'; 
    }
    
    return '#CCCCCC'; 
}

// =============================================================================
// ESTILO DE LA CAPA
// =============================================================================

function style_CATEGORIAS_4(feature) {
    var categoria = feature.properties.CAT_GENERA;
    return { 
        pane: 'pane_CATEGORIAS_4', 
        opacity: 1, 
        color: 'rgba(35,35,35,1.0)',
        weight: 1.0, 
        fill: true, 
        fillOpacity: 0.7, 
        fillColor: getColorByCategoria(categoria),
        interactive: true 
    };
}

// Crear el pane para la capa
map.createPane('pane_CATEGORIAS_4');
map.getPane('pane_CATEGORIAS_4').style.zIndex = 404;

// =============================================================================
// CREAR LA CAPA CON EVENTO CLICK
// =============================================================================

var layer_CATEGORIAS_4 = new L.geoJson(json_Usos, {
    interactive: true,
    pane: 'pane_CATEGORIAS_4',
    style: style_CATEGORIAS_4,
    onEachFeature: function(feature, layer) {
        var p = feature.properties;
        
        // Función para obtener la imagen según la categoría
        function getImagenCategoria(categoria) {
            if (!categoria) return 'images/default.jpg';
            
            var cat = String(categoria).toLowerCase().trim();
            
            if (cat.includes('vivienda')) {
                return 'images/Vivienda-Residencia.png';
            }
            if (cat.includes('servicio')) {
                return 'images/Servicio.png';
            }
            if (cat.includes('comercio')) {
                return 'images/Comercio.png';
            }
            if (cat.includes('equipamiento')) {
                return 'images/Equipamiento-Publico.png';
            }
            if (cat.includes('desuso') || cat.includes('vacante')) {
                return 'images/Desuso-Vacantes.png';
            }
            if (cat.includes('espacio') || cat.includes('abierto')) {
                return 'images/Parques-Plaza.png';
            }
            
            return 'images/default.jpg'; 
        }
        
        var titulo = p.CAT_GENERA || 'Sin Información';
        var imagen = getImagenCategoria(p.CAT_GENERA);
        var actividadPB = p.ACT_PB || 'Sin información';
        
        var popupContent = `
            <div style="min-width: 250px; padding: 10px; font-family: 'Roboto', sans-serif;">
                <div style="background: linear-gradient(135deg, rgba(98, 119, 112) 0%, rgba(98, 119, 112) 100%); 
                            padding: 15px; border-radius: 8px 8px 0 0; margin: -10px -10px 15px -10px;">
                    <h3 style="margin: 0; color: white; font-size: 1.2rem; font-weight: 700;">
                        ${titulo}
                    </h3>
                </div>
                
                <img src="${imagen}" alt="${titulo}" 
                     style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 15px; 
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);" 
                     onerror="this.onerror=null; this.src='images/default.jpg';">
                
                <div style="background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid rgb(238 211 168);">
                    <p style="margin: 0; color: #64748b; font-size: 0.85rem; font-weight: 500; 
                              text-transform: uppercase; letter-spacing: 0.5px;">
                        Actividad Principal
                    </p>
                    <p style="margin: 5px 0 0 0; color: #1e293b; font-size: 1rem; font-weight: 600;">
                        ${actividadPB}
                    </p>
                </div>
            </div>
        `;
        
        // Bind popup para click
        layer.bindPopup(popupContent);
        
        // Eventos: solo mouseover para highlight, popup en click
        layer.on({
            mouseover: highlightFeature,
            mouseout: function(e) {
                for (var i in e.target._eventParents) {
                    if (typeof e.target._eventParents[i].resetStyle === 'function') {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                }
                if (__selectedLayer === e.target) markSelected(e.target);
            },
            click: function(e) {
                // El popup se abre automáticamente con bindPopup
                selectLayer(layer);
            }
        });
    }
});

map.addLayer(layer_CATEGORIAS_4);

// =============================================================================
// BUSCADOR POR CLAVE
// =============================================================================

var __claveIndex = new Map();

function registerByClave(layer) {
    try {
        var f = layer && layer.feature;
        var clave = f && f.properties && f.properties.CLAVE;
        if (clave != null) {
            var key = String(clave).trim().toUpperCase();
            __claveIndex.set(key, layer); 
        }
    } catch(e) { /* silencio */ }
}

// Registrar todas las capas en el índice
if (typeof layer_CATEGORIAS_4 !== 'undefined' && layer_CATEGORIAS_4) {
    layer_CATEGORIAS_4.eachLayer(registerByClave);
}

// Obtener todas las claves para autocompletar
var __claveKeys = Array.from(__claveIndex.keys());

// Autocompletar - máximo 5 opciones
(function wireClaveAutocomplete(){
    var input = document.getElementById('claveSearch');
    var dl = document.getElementById('claveOptions');
    if (!input || !dl) return;

    input.addEventListener('input', function () {
        var texto = this.value.trim().toUpperCase();
        
        dl.innerHTML = '';
        if (!texto) return;

        var count = 0;
        for (var i = 0; i < __claveKeys.length && count < 5; i++) {
            var key = __claveKeys[i];
            
            if (key.indexOf(texto) !== -1) {
                var op = document.createElement('option');
                op.value = key;
                dl.appendChild(op);
                count++;
            }
        }
    });
})();

// Función para ir a la clave y abrir popup
function goToClave(q) {
    if (!q) return;
    var key = String(q).trim().toUpperCase();
    var layer = __claveIndex.get(key);
    
    if (!layer) {
        alert('No se encontró la CLAVE: ' + q);
        return;
    }

    var b = (typeof layer.getBounds === 'function') ? layer.getBounds() : null;
    if (b && b.isValid && b.isValid()) {
        map.fitBounds(b, {
            maxZoom: 18,
            animate: true,
            padding: [50, 50]
        });
        
        // Esperar a que el zoom termine y abrir el popup
        setTimeout(function(){
            layer.fire('click');
            layer.openPopup();
        }, 300);
    } else {
        layer.fire('click');
        layer.openPopup();
    }
}

// Conectar el buscador
(function wireSearchUI(){
    var input = document.getElementById('claveSearch');
    var btn = document.getElementById('claveGo');
    if (!input || !btn) return;

    btn.addEventListener('click', function(){
        goToClave(input.value);
    });

    input.addEventListener('keydown', function(e){
        if (e.key === 'Enter') goToClave(input.value);
    });
})();