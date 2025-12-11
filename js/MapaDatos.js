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

// Devuelve  elementos SVG del layer 
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
//  LÓGICA 


var currentChart = null; // Una sola variable 
var currentChartStart = 0; 

function getChartData(props) {
    return [
        {label:'Enero',     sum:'SUM_C_ENER', emax:'E_M_ENE',  erec:'E_R_ENE'},
        {label:'Febrero',   sum:'SUM_C_FEBR', emax:'E_M_FEB',  erec:'E_R_FEB'},
        {label:'Marzo',     sum:'SUM_C_MARZ', emax:'E_M_MAR',  erec:'E_R_MAR'},
        {label:'Abril',     sum:'SUM_C_ABRI', emax:'E_M_ABR',  erec:'E_R_ABR'},
        {label:'Mayo',      sum:'SUM_C_MAYO', emax:'E_M_MAY',  erec:'E_R_MAY'},
        {label:'Junio',     sum:'SUM_C_JUNI', emax:'E_M_JUN',  erec:'E_R_JUN'},
        {label:'Julio',     sum:'SUM_C_JULI', emax:'E_M_JUL',  erec:'E_R_JUL'},
        {label:'Agosto',    sum:'SUM_C_AGOS', emax:'E_M_AGO',  erec:'E_R_AGO'},
        {label:'Septiembre',sum:'SUM_C_SEP',  emax:'E_M_SEP',  erec:'E_R_SEP'},
        {label:'Octubre',   sum:'SUM_C_OCTU', emax:'E_M_OCT',  erec:'E_R_OCT'},
        {label:'Noviembre', sum:'SUM_C_NOVI', emax:'E_M_NOV',  erec:'E_R_NOV'},
        {label:'Diciembre', sum:'SUM_C_DIC',  emax:'E_M_DIC',  erec:'E_R_DIC'}
    ].map(m => ({
        label: m.label,
        sum : Number(props[m.sum]  ?? 0),
        emax: Number(props[m.emax] ?? 0),
        erec: Number(props[m.erec] ?? 0)
    }));
}

// Renderiza el gráfico en el Canvas
function renderSharedChart(allData, startIndex) {
    var ctx = document.getElementById('energyChart');
    if (!ctx) return;

    if (currentChart) { currentChart.destroy(); }

    // Tomamos solo 2 meses
    var sliceData = allData.slice(startIndex, startIndex + 2);
    var labels = sliceData.map(d => d.label);

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Consumo', data: sliceData.map(d => d.sum), backgroundColor: '#D9D9D9', borderColor: '#585859', borderWidth: 1 },              
                { label: 'Energía recomendada', data: sliceData.map(d => d.erec), backgroundColor: '#FDAA76', borderColor: '#FF9C60', borderWidth: 1 },
                { label: 'Energía máxima', data: sliceData.map(d => d.emax), backgroundColor: '#BCD1AC', borderColor: "#B0CC66 ",  borderWidth: 1 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { 
                legend: { position: 'top' }, 
                tooltip: { enabled: true } 
            },
            scales: { 
                x: { ticks: { autoSkip: false } }, 
                y: { 
                    beginAtZero: true,
                    
                    title: {
                        display: true,
                        text: 'kWh',      
                        font: {
                            
                            size: 14
                        },
                        padding: {bottom: 10} 
                    }
                    
                } 
            }
        }
    });

    // Actualizar etiqueta de texto
    var rangeLabel = document.getElementById('chartRangeLabel');
    if (rangeLabel) rangeLabel.textContent = labels.join(' – ');
}

// Inicializa la lógica del gráfico 
function initChart(feature) {
    var allData = getChartData(feature.properties || {});
    currentChartStart = 0; 
    renderSharedChart(allData, currentChartStart);

    
    var prevBtn = document.getElementById('chartPrev');
    var nextBtn = document.getElementById('chartNext');

    if (prevBtn) prevBtn.onclick = function() {
        currentChartStart = Math.max(0, currentChartStart - 2);
        renderSharedChart(allData, currentChartStart);
    };
    if (nextBtn) nextBtn.onclick = function() {
        currentChartStart = Math.min(10, currentChartStart + 2);
        renderSharedChart(allData, currentChartStart);
    };
}

// =============================================================================
// CONSTRUCTOR HTML DEL PANEL CON LÓGICA CONDICIONAL
// =============================================================================

function buildPanelContent(feature, sectorTitle) {
    var p = feature.properties;
    
    // Función helper para valores
    function val(k) { 
        return (p[k] !== null && p[k] !== undefined) ? String(p[k]) : '-'; 
    }

    // ========================================================================
    // VERIFICACIÓN DE CONDICIONES ESPECIALES
    // ========================================================================
    
    // Si X_1 o X_2 es igual a 1, mostrar panel alternativo 1
    if (p.X_1 == 1 || p.X_2 == 1) {
        return `
        <div class="popup-card">
          <div class="popup-title">
            <span class="key mono">Clave Catastral:</span>
            <strong>${val('CLAVE')}</strong>
          </div>
          
          <div class="alert-panel">
            <div class= "panel1">
              <h3>Datos Insuficientes</h3>
            </div>
          </div>
        </div>`;
    }
    
    // Si X_3 es igual a 1, mostrar panel alternativo 2
    if (p.X_3 == 1) {
        return `
        <div class="popup-card">
          <div class="popup-title">
            <span class="key mono">Clave Catastral:</span>
            <strong>${val('CLAVE')}</strong>
          </div>
          
           <div class="alert-panel">
            <div class= "panel2">
              <h3>Los paneles solare no pueden proveer la energia suficiente</h3>
            </div>
          </div>
        </div>`;
    }

    // ========================================================================
    // PANEL NORMAL (cuando no se cumplen las condiciones especiales)
    // ========================================================================
    
    function solarCard(imgSrc, label, key, suffix) {
        // 1. Obtenemos el valor crudo directamente de las propiedades (p)
        var rawValue = p[key]; 
        var valor = '-'; // Valor por defecto si es nulo

        // Verificamos si existe el dato
        if (rawValue !== null && rawValue !== undefined) {
            
            // 2. LISTA DE CLAVES QUE NECESITAN DECIMALES
            // (Asegúrate de usar los nombres exactos que tienes en tu código: RES_02, etc.)
            var clavesConDecimales = ['RES_02', 'RES_04', 'RES_06', 'RES_08'];

            if (clavesConDecimales.includes(key)) {
                // 3. APLICAMOS EL FORMATO: Convertir a número y fijar 2 decimales
                // Number() asegura que sea número, toFixed(2) corta a 2 decimales
                valor = Number(rawValue).toFixed(2);
            } else {
                // Para el resto (como número de paneles), lo dejamos como texto normal
                valor = String(rawValue);
            }
        }

        // Agregamos el sufijo ($, años, etc) si el valor es válido
        if (suffix && valor !== '-') valor += ' ' + suffix;

        return `
        <div class="solar-card">
            <div class="solar-icon">
                <img src="${imgSrc}" alt="icono" style="width:100%; height:100%; object-fit:contain;">
            </div>
            <div class="solar-info">
                <span class="solar-label">${label}</span>
                <span class="solar-value-box">${valor}</span>
            </div>
        </div>`;
    }

    return `
    <div class="popup-card">
      
      <div class="popup-title" style="display: flex; justify-content: space-between; align-items: center;">
        
        <div style="text-align: left; margin-left: 1%;">
            <span style="font-size: 0.9rem; display: block; opacity: 0.8;">Clave Catastral</span>
            <strong style="font-size: 1.2rem;">${val('CLAVE')}</strong>
        </div>

        <div style="display: flex; gap: 20px; text-align: right; margin-right: 7%;">
            
            <div style="display: flex; flex-direction: column;">
                <span class="key mono" style="font-size: 0.9rem; opacity: 0.8;">Nº Medidores</span>
                <strong style="font-size: 1.1rem;">${val('X_5')}</strong>
            </div>

            <div style="display: flex; flex-direction: column;">
                <span class="key mono" style="font-size: 0.9rem; opacity: 0.8;">Nº Pisos</span>
                <strong style="font-size: 1.1rem;">${val('X_6')}</strong>
            </div>

        </div>

      </div>

        
      </div>
      

      <details class="section" data-section="datos" open>
        <summary>
            <div class="summary-content">
                <span>Implementacion de paneles solares Sistemas On-Grid (Sin bateria)</span>
                <img src="images/UI_Pestaña1.svg" class="header-img" alt="Sin batería">
            </div>
            <span class="chev">▾</span>
        </summary>
        
        <div class="section-body">
          <div class="solar-grid">
            ${solarCard('images/UI_panel1.svg', 'Número de paneles recomendado según su consumo eléctrico:', 'RES_01', '')}
            ${solarCard('images/UI_Inversion2.svg', 'Inversión:', 'RES_02', '$')}
            ${solarCard('images/UI_RecuInversion3.svg', 'Tiempo de recuperación de la inversión:', 'RES_03', 'años')}
            ${solarCard('images/UI_Ahorro4.svg', 'Ahorro anual posterior a la inversión:', 'RES_04', '$')}
          </div>
        </div>
      </details>

      <details class="section" data-section="bateria">
        <summary>
            <div class="summary-content">
                <span>Implementacion de paneles solares Sistemas Off-Grid (Con bateria)</span>
                <img src="images/UI_Pestaña2.svg" class="header-img" alt="Con batería">
            </div>
            <span class="chev">▾</span>
        </summary>

        <div class="section-body">
          <div class="solar-grid">
            ${solarCard('images/UI_panel1.svg', 'Número de paneles recomendado según su consumo eléctrico:', 'RES_05', '')}
            ${solarCard('images/UI_Inversion2.svg', 'Inversión:', 'RES_06', '$')}
            ${solarCard('images/UI_RecuInversion3.svg', 'Tiempo de recuperación de la inversión', 'RES_07', 'años')}
            ${solarCard('images/UI_Ahorro4.svg', 'Ahorro anual posterior a la inversión:', 'RES_08', '$')}
          </div>
        </div>
      </details>
      
      <details class="section" data-section="grafico" open>
        <summary>
          <div class="summary-content">
            <span>Análisis energético mensual</span>
            <img src="images/UI_Pestaña3.svg" class="header-img" alt="Icono de barras">
          </div>
          <span class="chev">▾</span>
        </summary>
        <div class="section-body">
          <div id="chartControls" style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:8px">
            <button id="chartPrev" type="button">◄</button>
            <div id="chartRangeLabel" class="mono">...</div>
            <button id="chartNext" type="button">►</button>
          </div>
          <div style="height:260px"><canvas id="energyChart"></canvas></div>
        </div>
      </details>
    </div>`;
}

// =============================================================================
//  generar Graficos (Paneles etc)

function crearGestorCapa(tituloSector) {
    return function(feature, layer) {
        
        layer.on({
            mouseout: function(e) {
                for (var i in e.target._eventParents) {
                    if (typeof e.target._eventParents[i].resetStyle === 'function') {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                }
                if (__selectedLayer === e.target) markSelected(e.target);
            },
            mouseover: highlightFeature,
        });

        // 2. Clic
        layer.on('click', function() {
            selectLayer(layer);
            
            
            var html = buildPanelContent(feature, tituloSector);
            
            
            var panel = document.getElementById('featurePanel');
            var content = document.getElementById('featurePanelContent');
            content.innerHTML = html;
            panel.classList.remove('hidden');

            
            var groups = panel.querySelectorAll('details.section');
            groups.forEach(function(d){
                d.addEventListener('toggle', function(){
                    if (d.open) groups.forEach(o => { if (o!==d) o.removeAttribute('open'); });
                    var chev = d.querySelector('.chev');
                    if (chev) chev.style.transform = d.open ? 'rotate(180deg)' : 'rotate(0deg)';
                });
            });

           
            setTimeout(function() { initChart(feature); }, 50);
        });
    };
}

// =============================================================================
// 4. DEFINICIÓN DE CAPAS 

// --- TOTORACOCHA ---
function style_TOTORACOCHA_1_0() {
    return { pane: 'pane_TOTORACOCHA_1', opacity: 1, color: 'rgba(35,35,35,1.0)', weight: 1.0, fill: true, fillOpacity: 1, fillColor: '#BDBEBF', interactive: true };
}
map.createPane('pane_TOTORACOCHA_1');
map.getPane('pane_TOTORACOCHA_1').style.zIndex = 401;

var layer_TOTORACOCHA_1 = new L.geoJson(json_TOTORACOCHA_1, {
    interactive: true,
    dataVar: 'json_TOTORACOCHA_1',
    layerName: 'layer_TOTORACOCHA_1',
    pane: 'pane_TOTORACOCHA_1',
    // Fabri
    onEachFeature: crearGestorCapa("Totoracocha"), 
    style: style_TOTORACOCHA_1_0,
});
bounds_group.addLayer(layer_TOTORACOCHA_1);
map.addLayer(layer_TOTORACOCHA_1);


// --- PRIMERO DE MAYO ---
function style_PRIMERODEMAYO_2() {
    return { pane: 'pane_PRIMERODEMAYO_2', opacity: 1, color: 'rgba(35,35,35,1.0)', weight: 1.0, fill: true, fillOpacity: 1, fillColor: '#BDBEBF', interactive: true };
}
map.createPane('pane_PRIMERODEMAYO_2');
map.getPane('pane_PRIMERODEMAYO_2').style.zIndex = 401;

var layer_PRIMERODEMAYO_2 = new L.geoJson(json_PRIMERODEMAYO_2, {
    interactive: true,
    dataVar: 'json_PRIMERODEMAYO_2',
    layerName: 'layer_PRIMERODEMAYO_2',
    pane: 'pane_PRIMERODEMAYO_2',
    
    onEachFeature: crearGestorCapa("Primero de Mayo"), 
    style: style_PRIMERODEMAYO_2,
});
bounds_group.addLayer(layer_PRIMERODEMAYO_2);
map.addLayer(layer_PRIMERODEMAYO_2);


// --- ORDOÑEZ LASO ---
function style_ORDOEZLASO_3_0() {
    return { pane: 'pane_ORDOEZLASO_3', opacity: 1, color: 'rgba(35,35,35,1.0)', weight: 1.0, fill: true, fillOpacity: 1, fillColor: '#BDBEBF', interactive: true };
}
map.createPane('pane_ORDOEZLASO_3');
map.getPane('pane_ORDOEZLASO_3').style.zIndex = 403;

var layer_ORDOEZLASO_3 = new L.geoJson(json_ORDOEZLASO_3, {
    interactive: true,
    dataVar: 'json_ORDOEZLASO_3',
    layerName: 'layer_ORDOEZLASO_3',
    pane: 'pane_ORDOEZLASO_3',
    // Reutilizamos de nuevo:
    onEachFeature: crearGestorCapa("Ordoñez Laso"), 
    style: style_ORDOEZLASO_3_0,
});
bounds_group.addLayer(layer_ORDOEZLASO_3);
map.addLayer(layer_ORDOEZLASO_3);


// ===================
//  Buscador por CLAVE 


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

// Recorre  grupos GeoJSON
[
  typeof layer_TOTORACOCHA_1 !== 'undefined' ? layer_TOTORACOCHA_1 : null,
  typeof layer_PRIMERODEMAYO_2 !== 'undefined' ? layer_PRIMERODEMAYO_2 : null,
  typeof layer_ORDOEZLASO_3 !== 'undefined' ? layer_ORDOEZLASO_3 : null
].forEach(function(group){
  if (!group || typeof group.eachLayer !== 'function') return;
  group.eachLayer(registerByClave);
});

// Autocompletar
var __claveKeys = Array.from(__claveIndex.keys());

// 5 opciones 
(function wireClaveAutocomplete(){
  var input = document.getElementById('claveSearch');
  var dl    = document.getElementById('claveOptions');
  if (!input || !dl) return;

  input.addEventListener('input', function () {
    var texto = this.value.trim().toUpperCase();

    // Limpiar opciones actuales
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


// centa el panel
var DEFAULT_PANEL_WIDTH = 420;
function goToClave(q) {
  if (!q) return;
  var key = String(q).trim().toUpperCase();
  var layer = __claveIndex.get(key);
  if (!layer) {
    alert('No encontré la CLAVE: ' + q);
    return;
  }

  var b = (typeof layer.getBounds === 'function') ? layer.getBounds() : null;
  if (b && b.isValid && b.isValid()) {

    var panel = document.querySelector('.ui-panel');
    var panelWidth = DEFAULT_PANEL_WIDTH;
    if (panel) {
      panelWidth = Math.max(DEFAULT_PANEL_WIDTH, panel.offsetWidth || 0);
    }

    map.fitBounds(b, {
      maxZoom: 18,
      animate: true,
      paddingTopLeft: [20, 20],
      paddingBottomRight: [panelWidth + 20, 20] 
    });

    setTimeout(function(){ layer.fire('click'); }, 250);
  } else {
    layer.fire('click');
  }
}

// =============================================================================
// CAPA DE CATEGORÍAS (SHAPE_FINAL_WEBDATOS_WEB_FINAL_TOTAL_0)
// =============================================================================

// Verificar que el archivo se cargó
if (typeof json_Usos === 'undefined') {
    console.error('ERROR: No se cargó el archivo XD');
}

// Estilo verde para la capa de categorías
function style_CATEGORIAS_4() {
    return { 
        pane: 'pane_CATEGORIAS_4', 
        opacity: 1, 
        color: 'rgba(35,35,35,1.0)',  // Borde gris oscuro
        weight: 1.0, 
        fill: true, 
        fillOpacity: 0.7, 
        fillColor: '#4ade80',  // Verde
        interactive: true 
    };
}

// Crear el pane para la capa
map.createPane('pane_CATEGORIAS_4');
map.getPane('pane_CATEGORIAS_4').style.zIndex = 404;

// Crear la capa de categorías
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
            
            // Mapeo de categorías a imágenes (ahora todo en minúsculas)
            if (cat.includes('vivienda') || cat.includes('residencia')) {
                return 'images/Vivienda-Residencia.png';
            }
            if (cat.includes('servicio')) {
                return 'images/Servicio.png';
            }
            if (cat.includes('comercio')) {
                return 'images/Comercio.png';
            }
            if (cat.includes('equipamiento') || cat.includes('público')) {
                return 'images/Equipamiento-Publico.png';
            }
            if (cat.includes('desuso') || cat.includes('vacante')) {
                return 'images/Desuso-Vacantes.png';  // ← AGREGUÉ .png
            }
            if (cat.includes('espacio') || cat.includes('abierto') || cat.includes('parque') || cat.includes('plaza')) {
                return 'images/Parques-Plaza.png';
            }
            
            return 'images/default.jpg'; // Imagen por defecto
        }
        
        // Crear el contenido del popup
        var titulo = p.CAT_GENERA || 'Sin Información';
        var imagen = getImagenCategoria(p.CAT_GENERA);
        var actividadPB = p.ACT_PB || 'Sin información';
        
        // DEBUG: Agregar console.log temporal para verificar
        console.log('Categoría:', titulo);
        console.log('Imagen seleccionada:', imagen);
        
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
                     onerror="this.onerror=null; this.src='images/default.jpg'; console.error('No se pudo cargar:', '${imagen}');">
                
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
        
        // Bind popup que aparece en hover
        layer.bindPopup(popupContent);
        
        // Eventos de hover
        layer.on({
            mouseover: function(e) {
                this.openPopup();
                highlightFeature(e);
            },
            mouseout: function(e) {
                this.closePopup();
                for (var i in e.target._eventParents) {
                    if (typeof e.target._eventParents[i].resetStyle === 'function') {
                        e.target._eventParents[i].resetStyle(e.target);
                    }
                }
            }
        });
    }
});

bounds_group.addLayer(layer_CATEGORIAS_4);
// NO la agregamos al mapa todavía (se activa con el switch)

console.log('Capa de categorías creada (pero oculta)');

// =============================================================================
// SWITCH: Alternar entre capas solares y categorías
// =============================================================================

// =============================================================================
// BUSCADORES SEPARADOS PARA CADA MODO
// =============================================================================

var __claveIndex = new Map();  // Para modo solar
var __categoriaIndex = new Map();  // Para modo categoría
var __modoActual = 'solar';  // 'solar' o 'categoria'

// ============= REGISTRAR CAPAS SOLARES POR CLAVE =============
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

// Recorre grupos GeoJSON de capas solares
[
  typeof layer_TOTORACOCHA_1 !== 'undefined' ? layer_TOTORACOCHA_1 : null,
  typeof layer_PRIMERODEMAYO_2 !== 'undefined' ? layer_PRIMERODEMAYO_2 : null,
  typeof layer_ORDOEZLASO_3 !== 'undefined' ? layer_ORDOEZLASO_3 : null
].forEach(function(group){
  if (!group || typeof group.eachLayer !== 'function') return;
  group.eachLayer(registerByClave);
});

// ============= REGISTRAR CAPA DE CATEGORÍAS =============
function registerByCategoria(layer) {
  try {
    var f = layer && layer.feature;
    var cat = f && f.properties && f.properties.CAT_GENERA;
    if (cat != null) {
      var key = String(cat).trim().toUpperCase();
      // Guardamos en un array porque pueden haber múltiples predios con la misma categoría
      if (!__categoriaIndex.has(key)) {
        __categoriaIndex.set(key, []);
      }
      __categoriaIndex.get(key).push(layer);
    }
  } catch(e) { /* silencio */ }
}

// Registrar layer_CATEGORIAS_4
if (typeof layer_CATEGORIAS_4 !== 'undefined') {
  layer_CATEGORIAS_4.eachLayer(registerByCategoria);
}

// ============= AUTOCOMPLETADO DINÁMICO =============
(function wireAutocomplete(){
  var input = document.getElementById('claveSearch');
  var dl = document.getElementById('claveOptions');
  if (!input || !dl) return;

  input.addEventListener('input', function() {
    var texto = this.value.trim().toUpperCase();
    
    // Limpiar opciones actuales
    dl.innerHTML = '';
    if (!texto) return;

    var count = 0;
    var maxOptions = 5;

    if (__modoActual === 'solar') {
      // Buscar en claves catastrales
      var claveKeys = Array.from(__claveIndex.keys());
      for (var i = 0; i < claveKeys.length && count < maxOptions; i++) {
        var key = claveKeys[i];
        if (key.indexOf(texto) !== -1) {
          var op = document.createElement('option');
          op.value = key;
          dl.appendChild(op);
          count++;
        }
      }
    } else {
      // Buscar en categorías
      var catKeys = Array.from(__categoriaIndex.keys());
      for (var j = 0; j < catKeys.length && count < maxOptions; j++) {
        var catKey = catKeys[j];
        if (catKey.indexOf(texto) !== -1) {
          var op2 = document.createElement('option');
          op2.value = catKey;
          dl.appendChild(op2);
          count++;
        }
      }
    }
  });
})();

// ============= FUNCIÓN DE BÚSQUEDA SEGÚN MODO ACTIVO =============
var DEFAULT_PANEL_WIDTH = 420;

function buscarYAbrir(query) {
  if (!query) return;
  
  var key = String(query).trim().toUpperCase();
  
  if (__modoActual === 'solar') {
    // MODO SOLAR: Buscar por CLAVE
    var layer = __claveIndex.get(key);
    if (!layer) {
      alert('No encontré la CLAVE CATASTRAL: ' + query);
      return;
    }
    
    // Hacer zoom y abrir panel
    var b = (typeof layer.getBounds === 'function') ? layer.getBounds() : null;
    if (b && b.isValid && b.isValid()) {
      var panel = document.querySelector('.ui-panel');
      var panelWidth = DEFAULT_PANEL_WIDTH;
      if (panel) {
        panelWidth = Math.max(DEFAULT_PANEL_WIDTH, panel.offsetWidth || 0);
      }

      map.fitBounds(b, {
        maxZoom: 18,
        animate: true,
        paddingTopLeft: [20, 20],
        paddingBottomRight: [panelWidth + 20, 20]
      });

      setTimeout(function(){ layer.fire('click'); }, 250);
    } else {
      layer.fire('click');
    }
    
  } else {
    // MODO CATEGORÍA: Buscar por CATEGORÍA
    var layers = __categoriaIndex.get(key);
    if (!layers || layers.length === 0) {
      alert('No encontré la CATEGORÍA: ' + query);
      return;
    }
    
    // Si hay múltiples predios con esa categoría, tomar el primero o hacer zoom a todos
    var firstLayer = layers[0];
    
    // Opción 1: Hacer zoom al primero y abrir popup
    if (firstLayer.getLatLng) {
      map.setView(firstLayer.getLatLng(), 18);
      setTimeout(function(){ firstLayer.openPopup(); }, 250);
    } else if (firstLayer.getBounds) {
      map.fitBounds(firstLayer.getBounds(), { maxZoom: 18 });
      setTimeout(function(){ firstLayer.openPopup(); }, 250);
    }
    
    // Opción 2: Si quieres hacer zoom a TODOS los predios de esa categoría
    // Descomenta esto y comenta la Opción 1
    /*
    var group = L.featureGroup(layers);
    map.fitBounds(group.getBounds(), { maxZoom: 18 });
    setTimeout(function(){ firstLayer.openPopup(); }, 250);
    */
  }
}

// ============= EVENTOS DEL BUSCADOR =============
(function wireSearchUI(){
  var input = document.getElementById('claveSearch');
  var btn = document.getElementById('claveGo');
  if (!input || !btn) return;

  btn.addEventListener('click', function(){
    buscarYAbrir(input.value);
  });

  input.addEventListener('keydown', function(e){
    if (e.key === 'Enter') buscarYAbrir(input.value);
  });
})();

// ============= ACTUALIZAR PLACEHOLDER Y MODO AL CAMBIAR SWITCH =============
(function configurarSwitch(){
    var toggle = document.getElementById('modeToggle');
    var input = document.getElementById('claveSearch');
    
    if (!toggle) {
        console.error('ERROR: No se encontró el switch #modeToggle');
        return;
    }

    // Guardamos las 3 capas originales
    var capasOriginales = [
        layer_TOTORACOCHA_1, 
        layer_PRIMERODEMAYO_2, 
        layer_ORDOEZLASO_3
    ];

    // Evento del switch
    toggle.addEventListener('change', function() {
        console.log('Switch activado:', this.checked);
        
        if (this.checked) {
            // SWITCH ACTIVADO: Modo Categoría
            console.log('Modo Categoría activado');
            __modoActual = 'categoria';
            
            // Cambiar placeholder del buscador
            if (input) {
                input.placeholder = 'Buscar por CATEGORÍA...';
                input.value = ''; // Limpiar búsqueda anterior
            }
            
            // Cambiar capas
            capasOriginales.forEach(function(capa) {
                map.removeLayer(capa);
            });
            map.addLayer(layer_CATEGORIAS_4);
            
        } else {
            // SWITCH DESACTIVADO: Modo Solar
            console.log('Modo Solar activado');
            __modoActual = 'solar';
            
            // Cambiar placeholder del buscador
            if (input) {
                input.placeholder = 'Buscar por CLAVE CATASTRAL...';
                input.value = ''; // Limpiar búsqueda anterior
            }
            
            // Cambiar capas
            map.removeLayer(layer_CATEGORIAS_4);
            capasOriginales.forEach(function(capa) {
                map.addLayer(capa);
            });
        }
        
        // Cerrar el panel si está abierto
        closeFeaturePanel();
    });
    
    console.log('Switch configurado correctamente');
})();
(function configurarSwitch(){
    var toggle = document.getElementById('modeToggle');
    
    if (!toggle) {
        console.error('ERROR: No se encontró el switch #modeToggle');
        return;
    }

    // Guardamos las 3 capas originales
    var capasOriginales = [
        layer_TOTORACOCHA_1, 
        layer_PRIMERODEMAYO_2, 
        layer_ORDOEZLASO_3
    ];

    // Evento del switch
    toggle.addEventListener('change', function() {
        console.log('Switch activado:', this.checked);
        
        if (this.checked) {
            // SWITCH ACTIVADO: Ocultar capas solares y mostrar categorías
            console.log('Modo Categoría activado');
            capasOriginales.forEach(function(capa) {
                map.removeLayer(capa);
            });
            map.addLayer(layer_CATEGORIAS_4);
        } else {
            // SWITCH DESACTIVADO: Mostrar capas solares y ocultar categorías
            console.log('Modo Solar activado');
            map.removeLayer(layer_CATEGORIAS_4);
            capasOriginales.forEach(function(capa) {
                map.addLayer(capa);
            });
        }
        
        // Cerrar el panel si está abierto
        closeFeaturePanel();
    });
    
    console.log('Switch configurado correctamente');
})();
// =============================================================================
// BUSCADORES SEPARADOS PARA CADA MODO BORRARRRRRRR
// =============================================================================

var __claveIndex = new Map();  // Para modo solar
var __categoriaIndex = new Map();  // Para modo categoría
var __modoActual = 'solar';  // 'solar' o 'categoria'

// ============= REGISTRAR CAPAS SOLARES POR CLAVE =============
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

// Recorre grupos GeoJSON de capas solares
[
  typeof layer_TOTORACOCHA_1 !== 'undefined' ? layer_TOTORACOCHA_1 : null,
  typeof layer_PRIMERODEMAYO_2 !== 'undefined' ? layer_PRIMERODEMAYO_2 : null,
  typeof layer_ORDOEZLASO_3 !== 'undefined' ? layer_ORDOEZLASO_3 : null
].forEach(function(group){
  if (!group || typeof group.eachLayer !== 'function') return;
  group.eachLayer(registerByClave);
});

// ============= REGISTRAR CAPA DE CATEGORÍAS =============
function registerByCategoria(layer) {
  try {
    var f = layer && layer.feature;
    var cat = f && f.properties && f.properties.CAT_GENERA;
    if (cat != null) {
      var key = String(cat).trim().toUpperCase();
      // Guardamos en un array porque pueden haber múltiples predios con la misma categoría
      if (!__categoriaIndex.has(key)) {
        __categoriaIndex.set(key, []);
      }
      __categoriaIndex.get(key).push(layer);
    }
  } catch(e) { /* silencio */ }
}

// Registrar layer_CATEGORIAS_4
if (typeof layer_CATEGORIAS_4 !== 'undefined') {
  layer_CATEGORIAS_4.eachLayer(registerByCategoria);
}

// ============= AUTOCOMPLETADO DINÁMICO =============
(function wireAutocomplete(){
  var input = document.getElementById('claveSearch');
  var dl = document.getElementById('claveOptions');
  if (!input || !dl) return;

  input.addEventListener('input', function() {
    var texto = this.value.trim().toUpperCase();
    
    // Limpiar opciones actuales
    dl.innerHTML = '';
    if (!texto) return;

    var count = 0;
    var maxOptions = 5;

    if (__modoActual === 'solar') {
      // Buscar en claves catastrales
      var claveKeys = Array.from(__claveIndex.keys());
      for (var i = 0; i < claveKeys.length && count < maxOptions; i++) {
        var key = claveKeys[i];
        if (key.indexOf(texto) !== -1) {
          var op = document.createElement('option');
          op.value = key;
          dl.appendChild(op);
          count++;
        }
      }
    } else {
      // Buscar en categorías
      var catKeys = Array.from(__categoriaIndex.keys());
      for (var j = 0; j < catKeys.length && count < maxOptions; j++) {
        var catKey = catKeys[j];
        if (catKey.indexOf(texto) !== -1) {
          var op2 = document.createElement('option');
          op2.value = catKey;
          dl.appendChild(op2);
          count++;
        }
      }
    }
  });
})();

// ============= FUNCIÓN DE BÚSQUEDA SEGÚN MODO ACTIVO =============
var DEFAULT_PANEL_WIDTH = 420;

function buscarYAbrir(query) {
  if (!query) return;
  
  var key = String(query).trim().toUpperCase();
  
  if (__modoActual === 'solar') {
    // MODO SOLAR: Buscar por CLAVE
    var layer = __claveIndex.get(key);
    if (!layer) {
      alert('No encontré la CLAVE CATASTRAL: ' + query);
      return;
    }
    
    // Hacer zoom y abrir panel
    var b = (typeof layer.getBounds === 'function') ? layer.getBounds() : null;
    if (b && b.isValid && b.isValid()) {
      var panel = document.querySelector('.ui-panel');
      var panelWidth = DEFAULT_PANEL_WIDTH;
      if (panel) {
        panelWidth = Math.max(DEFAULT_PANEL_WIDTH, panel.offsetWidth || 0);
      }

      map.fitBounds(b, {
        maxZoom: 18,
        animate: true,
        paddingTopLeft: [20, 20],
        paddingBottomRight: [panelWidth + 20, 20]
      });

      setTimeout(function(){ layer.fire('click'); }, 250);
    } else {
      layer.fire('click');
    }
    
  } else {
    // MODO CATEGORÍA: Buscar por CATEGORÍA
    var layers = __categoriaIndex.get(key);
    if (!layers || layers.length === 0) {
      alert('No encontré la CATEGORÍA: ' + query);
      return;
    }
    
    // Si hay múltiples predios con esa categoría, tomar el primero o hacer zoom a todos
    var firstLayer = layers[0];
    
    // Opción 1: Hacer zoom al primero y abrir popup
    if (firstLayer.getLatLng) {
      map.setView(firstLayer.getLatLng(), 18);
      setTimeout(function(){ firstLayer.openPopup(); }, 250);
    } else if (firstLayer.getBounds) {
      map.fitBounds(firstLayer.getBounds(), { maxZoom: 18 });
      setTimeout(function(){ firstLayer.openPopup(); }, 250);
    }
    
    // Opción 2: Si quieres hacer zoom a TODOS los predios de esa categoría
    // Descomenta esto y comenta la Opción 1
    /*
    var group = L.featureGroup(layers);
    map.fitBounds(group.getBounds(), { maxZoom: 18 });
    setTimeout(function(){ firstLayer.openPopup(); }, 250);
    */
  }
}

// ============= EVENTOS DEL BUSCADOR =============
(function wireSearchUI(){
  var input = document.getElementById('claveSearch');
  var btn = document.getElementById('claveGo');
  if (!input || !btn) return;

  btn.addEventListener('click', function(){
    buscarYAbrir(input.value);
  });

  input.addEventListener('keydown', function(e){
    if (e.key === 'Enter') buscarYAbrir(input.value);
  });
})();

// ============= ACTUALIZAR PLACEHOLDER Y MODO AL CAMBIAR SWITCH =============
(function configurarSwitch(){
    var toggle = document.getElementById('modeToggle');
    var input = document.getElementById('claveSearch');
    
    if (!toggle) {
        console.error('ERROR: No se encontró el switch #modeToggle');
        return;
    }

    // Guardamos las 3 capas originales
    var capasOriginales = [
        layer_TOTORACOCHA_1, 
        layer_PRIMERODEMAYO_2, 
        layer_ORDOEZLASO_3
    ];

    // Evento del switch
    toggle.addEventListener('change', function() {
        console.log('Switch activado:', this.checked);
        
        if (this.checked) {
            // SWITCH ACTIVADO: Modo Categoría
            console.log('Modo Categoría activado');
            __modoActual = 'categoria';
            
            // Cambiar placeholder del buscador
            if (input) {
                input.placeholder = 'Buscar por CATEGORÍA...';
                input.value = ''; // Limpiar búsqueda anterior
            }
            
            // Cambiar capas
            capasOriginales.forEach(function(capa) {
                map.removeLayer(capa);
            });
            map.addLayer(layer_CATEGORIAS_4);
            
        } else {
            // SWITCH DESACTIVADO: Modo Solar
            console.log('Modo Solar activado');
            __modoActual = 'solar';
            
            // Cambiar placeholder del buscador
            if (input) {
                input.placeholder = 'Buscar por CLAVE CATASTRAL...';
                input.value = ''; // Limpiar búsqueda anterior
            }
            
            // Cambiar capas
            map.removeLayer(layer_CATEGORIAS_4);
            capasOriginales.forEach(function(capa) {
                map.addLayer(capa);
            });
        }
        
        // Cerrar el panel si está abierto
        closeFeaturePanel();
    });
    
    console.log('Switch configurado correctamente');
})();
//-------HASTAACAAA-----------------------------------------------------------------------------------------------------------------------------------------------------------------------


(function wireSearchUI(){
  var input = document.getElementById('claveSearch');
  var btn   = document.getElementById('claveGo');
  if (!input || !btn) return;

  btn.addEventListener('click', function(){
    goToClave(input.value);
  });

  input.addEventListener('keydown', function(e){
    if (e.key === 'Enter') goToClave(input.value);
  });
  
})();