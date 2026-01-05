document.addEventListener('DOMContentLoaded', function () {
    // =============================================================================
    // 1. CONFIGURACIÓN Y CONSTANTES
    // =============================================================================
    const CONFIG = {
        map: {
            start: [-2.898, -79.03], // Centro aproximado
            zoom: { min: 14, max: 28 },
            bounds: [[-2.9086, -79.0478], [-2.8875, -79.0148]]
        },
        styles: {
            highlight: { color: '#ffff00' },
            selected: { weight: 3, color: '#2563eb', fillOpacity: 0.85 },
            defaultFill: 'rgba(98, 119, 112)',
            defaultStroke: 'rgba(35,35,35,1.0)'
        },
        // Configuración de colores por pisos (Rango Min, Color)
        pisosColors: [
            { min: 19, color: '#1C6F03' },
            { min: 16, color: '#337F1D' },
            { min: 13, color: '#4A8F37' },
            { min: 10, color: '#619F51' },
            { min: 7,  color: '#78AF6B' },
            { min: 4,  color: '#8FBF85' },
            { min: 3,  color: '#A6CF9F' },
            { min: 2,  color: '#B5D7AF' },
            { min: 1,  color: '#C5DFC0' },
            { min: 0,  color: '#dadadaff' } // Fallback / 0 pisos
        ]
    };

    // Estado Global de la Aplicación
    const State = {
        selectedLayer: null,
        highlightLayer: null,
        currentChart: null,
        chartStartIndex: 0,
        claveIndex: new Map() // Para el buscador
    };

    // Referencias al DOM (Cache)
    const DOM = {
        panel: document.getElementById('featurePanel'),
        panelContent: document.getElementById('featurePanelContent'),
        closeBtn: document.getElementById('panelCloseBtn'),
        searchInput: document.getElementById('claveSearch'),
        searchOptions: document.getElementById('claveOptions'),
        searchBtn: document.getElementById('claveGo')
    };

    // =============================================================================
    // 2. INICIALIZACIÓN DEL MAPA
    // =============================================================================
    const map = L.map('map', {
        zoomControl: false,
        maxZoom: CONFIG.map.zoom.max,
        minZoom: CONFIG.map.zoom.min
    }).fitBounds(CONFIG.map.bounds);

    const hash = new L.Hash(map);
    map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
    new Autolinker({ truncate: { length: 30, location: 'smart' } });
    L.control.zoom({ position: 'topleft' }).addTo(map);

    // Mapa Base
    map.createPane('pane_Positronretina_0');
    map.getPane('pane_Positronretina_0').style.zIndex = 400;
    L.tileLayer('https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
        pane: 'pane_Positronretina_0',
        opacity: 1.0,
        attribution: 'Map tiles by CartoDB, CC BY 3.0. Data by OpenStreetMap, ODbL.',
        minZoom: 1, maxZoom: 28, minNativeZoom: 5, maxNativeZoom: 20
    }).addTo(map);

    const boundsGroup = L.featureGroup([]);

    // =============================================================================
    // 3. FUNCIONES DE ESTILO Y UTILIDAD
    // =============================================================================
    
    // Optimización: Búsqueda de color usando array.find en lugar de if/else anidados
    function getColorByPisos(pisos) {
        const num = Number(pisos);
        if (isNaN(num) || num === 0) return CONFIG.pisosColors[CONFIG.pisosColors.length - 1].color;
        const match = CONFIG.pisosColors.find(c => num >= c.min);
        return match ? match.color : CONFIG.pisosColors[CONFIG.pisosColors.length - 1].color;
    }

    function getLayerStyle(feature) {
        return {
            opacity: 1,
            color: CONFIG.styles.defaultStroke,
            weight: 1.0,
            fill: true,
            fillOpacity: 1,
            fillColor: getColorByPisos(feature.properties.X_4),
            interactive: true
        };
    }

    function getLayerElements(layer) {
        const el = (typeof layer.getElement === 'function') ? layer.getElement() : layer._path;
        if (!el) return [];
        if (el.tagName && el.tagName.toLowerCase() === 'g') {
            return Array.from(el.querySelectorAll('path.leaflet-interactive'));
        }
        return [el];
    }

    // =============================================================================
    // 4. LÓGICA DE INTERACCIÓN (Hover, Select)
    // =============================================================================

    function highlightFeature(e) {
        if (State.selectedLayer === e.target) return;
        State.highlightLayer = e.target;
        
        const isLine = e.target.feature.geometry.type.includes('LineString');
        State.highlightLayer.setStyle({
            color: CONFIG.styles.highlight.color,
            fillColor: isLine ? undefined : CONFIG.styles.defaultFill,
            fillOpacity: isLine ? undefined : 1
        });
    }

    function resetHighlight(e) {
        // Resetea al estilo original definido en el GeoJSON layer
        for (const i in e.target._eventParents) {
            if (typeof e.target._eventParents[i].resetStyle === 'function') {
                e.target._eventParents[i].resetStyle(e.target);
            }
        }
        // Si es el seleccionado, vuelve a marcarlo como seleccionado
        if (State.selectedLayer === e.target) markSelected(e.target);
    }

    function markSelected(layer) {
        if (typeof layer.bringToFront === 'function') layer.bringToFront();
        if (typeof layer.setStyle === 'function') layer.setStyle(CONFIG.styles.selected);
        getLayerElements(layer).forEach(p => p && p.classList.add('feature-selected'));
    }

    function unmarkSelected(layer) {
        if (!layer) return;
        // Reset genérico
        for (const i in layer._eventParents) {
            if (typeof layer._eventParents[i].resetStyle === 'function') {
                layer._eventParents[i].resetStyle(layer);
            }
        }
        getLayerElements(layer).forEach(p => p && p.classList.remove('feature-selected'));
    }

    function selectLayer(layer, feature, tituloSector) {
        if (State.selectedLayer && State.selectedLayer !== layer) {
            unmarkSelected(State.selectedLayer);
        }
        State.selectedLayer = layer;
        markSelected(layer);
        
        // Renderizar Panel y Gráfico
        renderPanel(feature, tituloSector);
    }

    // =============================================================================
    // 5. LÓGICA DE GRÁFICOS (CHART.JS)
    // =============================================================================

    function getChartData(props) {
        const months = [
            {l:'Enero',s:'SUM_C_ENER',m:'E_M_ENE',r:'E_R_ENE'}, {l:'Febrero',s:'SUM_C_FEBR',m:'E_M_FEB',r:'E_R_FEB'},
            {l:'Marzo',s:'SUM_C_MARZ',m:'E_M_MAR',r:'E_R_MAR'}, {l:'Abril',s:'SUM_C_ABRI',m:'E_M_ABR',r:'E_R_ABR'},
            {l:'Mayo',s:'SUM_C_MAYO',m:'E_M_MAY',r:'E_R_MAY'}, {l:'Junio',s:'SUM_C_JUNI',m:'E_M_JUN',r:'E_R_JUN'},
            {l:'Julio',s:'SUM_C_JULI',m:'E_M_JUL',r:'E_R_JUL'}, {l:'Agosto',s:'SUM_C_AGOS',m:'E_M_AGO',r:'E_R_AGO'},
            {l:'Septiembre',s:'SUM_C_SEP',m:'E_M_SEP',r:'E_R_SEP'}, {l:'Octubre',s:'SUM_C_OCTU',m:'E_M_OCT',r:'E_R_OCT'},
            {l:'Noviembre',s:'SUM_C_NOVI',m:'E_M_NOV',r:'E_R_NOV'}, {l:'Diciembre',s:'SUM_C_DIC',m:'E_M_DIC',r:'E_R_DIC'}
        ];
        
        return months.map(m => ({
            label: m.l,
            sum: Number(props[m.s] ?? 0),
            emax: Number(props[m.m] ?? 0),
            erec: Number(props[m.r] ?? 0)
        }));
    }

    function renderChart(allData) {
        const ctx = document.getElementById('energyChart');
        if (!ctx) return;

        if (State.currentChart) State.currentChart.destroy();

        const slice = allData.slice(State.chartStartIndex, State.chartStartIndex + 2);
        
        State.currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: slice.map(d => d.label),
                datasets: [
                    { label: 'Consumo', data: slice.map(d => d.sum), backgroundColor: '#D9D9D9', borderColor: '#585859', borderWidth: 1 },
                    { label: 'E. Recomendada', data: slice.map(d => d.erec), backgroundColor: '#BCD1AC', borderColor: '#B0CC66', borderWidth: 1 },
                    { label: 'E. Máxima', data: slice.map(d => d.emax), backgroundColor: '#FDAA76', borderColor: '#FF9C60', borderWidth: 1 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { position: 'top' }, tooltip: { enabled: true } },
                scales: { 
                    y: { beginAtZero: true, title: { display: true, text: 'kWh' } } 
                }
            }
        });

        const rangeLabel = document.getElementById('chartRangeLabel');
        if (rangeLabel) rangeLabel.textContent = slice.map(d => d.label).join(' – ');
    }

    function initChartControls(allData) {
        const prev = document.getElementById('chartPrev');
        const next = document.getElementById('chartNext');
        
        // Limpiar eventos anteriores clonando nodos (truco rápido) o reasignando
        if(prev) prev.onclick = () => {
            State.chartStartIndex = Math.max(0, State.chartStartIndex - 2);
            renderChart(allData);
        };
        if(next) next.onclick = () => {
            State.chartStartIndex = Math.min(10, State.chartStartIndex + 2);
            renderChart(allData);
        };
    }

    // =============================================================================
    // 6. GENERACIÓN DE HTML (TEMPLATES)
    // =============================================================================

    function renderPanel(feature, tituloSector) {
        const p = feature.properties;
        const val = (k) => (p[k] != null ? String(p[k]) : '-');

        // Helper para tarjetas solares
        const solarCard = (img, label, key, suffix = '') => {
            let raw = p[key];
            let valor = '-';
            if (raw != null) {
                // Si la clave está en la lista de enteros
                if (['RES_02', 'RES_04', 'RES_06', 'RES_08'].includes(key)) {
                    valor = Number(raw).toFixed(0);
                } else {
                    valor = String(raw);
                }
            }
            if (valor !== '-' && suffix) valor += ' ' + suffix;
            
            return `
            <div class="solar-card">
                <div class="solar-icon"><img src="${img}" style="width:100%; height:100%; object-fit:contain;"></div>
                <div class="solar-info"><span class="solar-label">${label}</span><span class="solar-value-box">${valor}</span></div>
            </div>`;
        };

        let htmlContent = '';

        // CASO 1: ALERTA (Sin consumo)
        if (p.X_1 == 1 || p.X_2 == 1) {
            htmlContent = `
            <div class="popup-card">
                <div class="popup-title"><span class="key mono">Clave Catastral:</span><strong>${val('CLAVE')}</strong></div>
                <div class="alert-panel"><div class="panel1"><h3>El predio no cuenta con un consumo actual</h3><img class="icono-alerta" src="images/IconoAlerta.png"></div></div>
            </div>`;
        } 
        // CASO 2: PANEL NORMAL
        else {
            const x10Html = (p.X_3 == 1) ? `<div style="display:flex;flex-direction:column;margin-top:8px;"><strong style="font-size:0.9rem;color:#e7444cff;">* ${val('X_10')}</strong></div>` : '';
            
            htmlContent = `
            <div class="popup-card">
                <div class="popup-title" style="display: flex; justify-content: space-between;">
                    <div style="text-align: left; margin-left: 1%;">
                        <span style="font-size: 0.9rem; display: block; opacity: 0.8;">Clave Catastral</span>
                        <strong style="font-size: 1.2rem;">${val('CLAVE')}</strong>
                        ${x10Html}
                    </div>
                    <div style="display: flex; gap: 20px; text-align: right; margin-right: 7%;">
                        <div style="display: flex; flex-direction: column;">
                            <span class="key mono" style="font-size: 0.9rem; opacity: 0.8;">Nº Medidores</span>
                            <strong style="font-size: 1.1rem;">${val('X_5')}</strong>
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <span class="key mono" style="font-size: 0.9rem; opacity: 0.8;">Nº Pisos</span>
                            <strong style="font-size: 1.1rem;">${val('X_4')}</strong>
                        </div>
                    </div>
                </div>

                <details class="section" open>
                    <summary><div class="summary-content"><span>Sistemas On-Grid (Sin baterías)</span><img src="images/UI_Pestaña2.svg" class="header-img"></div><span class="chev">▾</span></summary>
                    <div class="section-body"><div class="solar-grid">
                        ${solarCard('images/UI_panel1.svg', 'Paneles recomendados:', 'RES_01')}
                        ${solarCard('images/UI_Inversion2.svg', 'Inversión:', 'RES_02', '$')}
                        ${solarCard('images/UI_RecuInversion3.svg', 'Recuperación inversión:', 'RES_03')}
                        ${solarCard('images/UI_Ahorro4.svg', 'Ahorro anual:', 'RES_04', '$')}
                    </div></div>
                </details>

                <details class="section">
                    <summary><div class="summary-content"><span>Sistemas Off-Grid (Con baterías)</span><img src="images/UI_Pestaña1.svg" class="header-img"></div><span class="chev">▾</span></summary>
                    <div class="section-body"><div class="solar-grid">
                        ${solarCard('images/UI_panel1.svg', 'Paneles recomendados:', 'RES_05')}
                        ${solarCard('images/UI_Inversion2.svg', 'Inversión:', 'RES_06', '$')}
                        ${solarCard('images/UI_RecuInversion3.svg', 'Recuperación inversión:', 'RES_07')}
                        ${solarCard('images/UI_Ahorro4.svg', 'Ahorro anual:', 'RES_08', '$')}
                    </div></div>
                </details>

                <details class="section" open>
                    <summary><div class="summary-content"><span>Análisis energético mensual</span><img src="images/UI_Pestaña3.svg" class="header-img"></div><span class="chev">▾</span></summary>
                    <div class="section-body">
                        <div id="chartControls" style="display:flex;justify-content:center;gap:10px;margin-bottom:8px">
                            <button id="chartPrev">◄</button><div id="chartRangeLabel" class="mono">...</div><button id="chartNext">►</button>
                        </div>
                        <div style="height:260px"><canvas id="energyChart"></canvas></div>
                    </div>
                </details>
            </div>`;
        }

        // Inyectar HTML
        DOM.panelContent.innerHTML = htmlContent;
        DOM.panel.classList.remove('hidden');

        // Lógica de acordeón (Details/Summary)
        DOM.panelContent.querySelectorAll('details.section').forEach(d => {
            d.addEventListener('toggle', () => {
                if (d.open) {
                    DOM.panelContent.querySelectorAll('details.section').forEach(o => { if (o !== d) o.removeAttribute('open'); });
                }
                const chev = d.querySelector('.chev');
                if (chev) chev.style.transform = d.open ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        });

        // Inicializar Gráfico si no es alerta
        if (!(p.X_1 == 1 || p.X_2 == 1)) {
            const chartData = getChartData(p);
            State.chartStartIndex = 0;
            setTimeout(() => {
                renderChart(chartData);
                initChartControls(chartData);
            }, 50);
        }
    }

    // =============================================================================
    // 7. CARGA DE CAPAS (GEOJSON) - FACTORY PATTERN
    // =============================================================================
    
    function addGeoJsonLayer(data, title, zIndex) {
        if (typeof data === 'undefined') return; // Seguridad si falta el archivo JS

        const paneName = 'pane_' + title.replace(/\s+/g, '');
        map.createPane(paneName);
        map.getPane(paneName).style.zIndex = zIndex;

        const layer = new L.geoJson(data, {
            interactive: true,
            pane: paneName,
            style: getLayerStyle,
            onEachFeature: (feature, layer) => {
                // Registrar para búsqueda
                const clave = feature.properties?.CLAVE;
                if (clave) State.claveIndex.set(String(clave).trim().toUpperCase(), layer);

                // Eventos
                layer.on({
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: () => selectLayer(layer, feature, title)
                });
            }
        });

        boundsGroup.addLayer(layer);
        map.addLayer(layer);
        return layer;
    }

    // Cargar las capas dinámicamente
    // Asegúrate de que las variables json_TOTORACOCHA_1, etc. estén cargadas antes de este script
    addGeoJsonLayer(typeof json_TOTORACOCHA_1 !== 'undefined' ? json_TOTORACOCHA_1 : undefined, 'Totoracocha', 401);
    addGeoJsonLayer(typeof json_PRIMERODEMAYO_2 !== 'undefined' ? json_PRIMERODEMAYO_2 : undefined, 'Primero de Mayo', 402);
    addGeoJsonLayer(typeof json_ORDOEZLASO_3 !== 'undefined' ? json_ORDOEZLASO_3 : undefined, 'Ordoñez Laso', 403);

    // Ajustar vista
    if (boundsGroup.getLayers().length > 0) {
        map.fitBounds(boundsGroup.getBounds(), { padding: [50, 50] });
    }

    // =============================================================================
    // 8. BUSCADOR Y UI GLOBALES
    // =============================================================================

    function closePanel() {
        DOM.panel.classList.add('hidden');
        if (State.selectedLayer) {
            unmarkSelected(State.selectedLayer);
            State.selectedLayer = null;
        }
    }

    // Cerrar panel events
    if (DOM.closeBtn) DOM.closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });

    // Autocomplete y Búsqueda
    const keysArray = Array.from(State.claveIndex.keys()); // Cache de claves para búsqueda rápida

    if (DOM.searchInput) {
        DOM.searchInput.addEventListener('input', function() {
            const val = this.value.trim().toUpperCase();
            DOM.searchOptions.innerHTML = '';
            if (!val) return;

            // Filtrado optimizado: solo busca hasta encontrar 5 coincidencias
            let count = 0;
            for (let i = 0; i < keysArray.length; i++) {
                if (keysArray[i].includes(val)) {
                    const op = document.createElement('option');
                    op.value = keysArray[i];
                    DOM.searchOptions.appendChild(op);
                    count++;
                    if (count >= 5) break;
                }
            }
        });

        const goToClave = (val) => {
            if (!val) return;
            const key = val.trim().toUpperCase();
            const layer = State.claveIndex.get(key);
            
            if (!layer) {
                alert('No se encontró la CLAVE: ' + val);
                return;
            }

            const b = (typeof layer.getBounds === 'function') ? layer.getBounds() : null;
            if (b && b.isValid()) {
                const panelWidth = DOM.panel ? DOM.panel.offsetWidth : 420;
                map.fitBounds(b, {
                    maxZoom: 18, animate: true,
                    paddingTopLeft: [20, 20],
                    paddingBottomRight: [panelWidth + 20, 20]
                });
                setTimeout(() => layer.fire('click'), 250);
            } else {
                layer.fire('click');
            }
        };

        if (DOM.searchBtn) DOM.searchBtn.addEventListener('click', () => goToClave(DOM.searchInput.value));
        DOM.searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') goToClave(DOM.searchInput.value); });
    }


// =============================================================================
// 10. TOUR GUIADO CON DRIVER.JS
// =============================================================================

function initTutorial() {
    const driver = window.driver.js.driver;
    
    // Paso 1: Mostrar el buscador CON botón siguiente
    const step1Driver = driver({
        showProgress: true,
        showButtons: ['next'], // Solo botón siguiente, sin cerrar
        nextBtnText: 'Siguiente',
        progressText: 'Paso 1 de 8', // Contador manual fijo
        allowClose: false, // No se puede cerrar con ESC o click fuera
        disableActiveInteraction: true, // No se puede interactuar con el elemento
        steps: [
            {
                element: '.Buscador-Predio',
                popover: {
                    title: 'Buscador de Predios',
                    description: 'Aquí puedes buscar cualquier predio escribiendo su clave catastral. El sistema te sugerirá opciones mientras escribes.',
                    side: 'bottom',
                    align: 'center'
                }
            }
        ],
        onNextClick: () => {
            step1Driver.destroy();
            setTimeout(() => showPredioStep(), 300);
        }
    });

    step1Driver.drive();
}

function showPredioStep() {
    const driver = window.driver.js.driver;
    
    // Buscar el predio específico 0703010002000
    const targetClave = '0703010002000';
    const targetLayer = State.claveIndex.get(targetClave);
    
    if (!targetLayer) {
        alert('No se encontró el predio de ejemplo para el tutorial');
        return;
    }

    // Hacer zoom al predio
    const bounds = targetLayer.getBounds();
    if (bounds && bounds.isValid()) {
        map.fitBounds(bounds, {
            maxZoom: 17,
            padding: [100, 100],
            animate: true,
            duration: 1
        });
    }

    // Resaltar el predio de ejemplo
    targetLayer.setStyle({
        color: '#ffff00',
        weight: 4,
        fillOpacity: 0.7
    });

    // Esperar a que termine la animación del zoom
    setTimeout(() => {
        // Obtener el elemento SVG del predio
        const predioElement = targetLayer.getElement();
        
        const step2Driver = driver({
            showProgress: true,
            showButtons: ['previous', 'next'], // Anterior y Siguiente
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
            progressText: 'Paso 2 de 8', // Contador manual fijo
            allowClose: false,
            disableActiveInteraction: false, // Permitir click en el predio
            steps: [
                {
                    element: predioElement,
                    popover: {
                        title: 'Predio de Ejemplo',
                        description: `Este es un predio (polígono). Cada predio representa una propiedad o edificación. El color indica el número de pisos. <br><br><strong>Haz clic en este predio para continuar con el tutorial.</strong>`,
                        side: 'right',
                        align: 'center'
                    }
                }
            ],
            onPrevClick: () => {
                // Restaurar estilo y volver al buscador
                for (const i in targetLayer._eventParents) {
                    if (typeof targetLayer._eventParents[i].resetStyle === 'function') {
                        targetLayer._eventParents[i].resetStyle(targetLayer);
                    }
                }
                step2Driver.destroy();
                State.waitingForTutorialClick = false;
                State.tutorialTargetLayer = null;
                setTimeout(() => initTutorial(), 300);
            },
            onNextClick: () => {
                // Forzar click en el predio
                step2Driver.destroy();
                State.waitingForTutorialClick = true;
                State.tutorialTargetLayer = targetLayer;
                targetLayer.fire('click');
            }
        });

        step2Driver.drive();

        // Marcar que estamos esperando el click del tutorial
        State.waitingForTutorialClick = true;
        State.tutorialTargetLayer = targetLayer;

    }, 1000);
}

function showPanelSteps() {
    const driver = window.driver.js.driver;
    
    setTimeout(() => {
        // Variable para el contador manual
        let currentStep = 3; // Empieza en 3 porque ya pasamos buscador (1) y predio (2)
        
        const panelDriver = driver({
            showProgress: true,
            showButtons: ['previous', 'next'],
            nextBtnText: 'Siguiente',
            prevBtnText: 'Anterior',
            doneBtnText: 'Finalizar',
            progressText: 'Paso 3 de 8', // Inicial
            allowClose: false,
            disableActiveInteraction: true,
            steps: [
                {
                    element: '#featurePanel',
                    popover: {
                        title: 'Panel de Información del Predio',
                        description: 'Este panel muestra toda la información detallada del predio seleccionado: clave catastral, número de pisos, medidores y recomendaciones solares.',
                        side: 'left',
                        align: 'start'
                    }
                },
                {
                    element: '.popup-title',
                    popover: {
                        title: 'Identificación del Predio',
                        description: 'Aquí se muestra la clave catastral única del predio, el número de medidores eléctricos y el número de pisos de la edificación.',
                        side: 'left',
                        align: 'start'
                    }
                },
                {
                    element: '.section:first-of-type',
                    popover: {
                        title: 'Sistemas On-Grid (Sin baterías)',
                        description: 'Recomendaciones para sistemas solares conectados a la red eléctrica. Incluye: número de paneles necesarios, inversión inicial, tiempo de recuperación y ahorro anual estimado.',
                        side: 'left',
                        align: 'start'
                    }
                },
                {
                    element: '.section:nth-of-type(2)',
                    popover: {
                        title: 'Sistemas Off-Grid (Con baterías)',
                        description: 'Información sobre sistemas solares autónomos con almacenamiento en baterías. Ideal para mayor independencia energética.',
                        side: 'left',
                        align: 'start'
                    }
                },
                {
                    element: '.section:last-of-type',
                    popover: {
                        title: 'Análisis Energético Mensual',
                        description: 'Gráfico interactivo que muestra el consumo mensual comparado con la energía recomendada y máxima. Usa las flechas ◄ ► para navegar entre los meses del año.',
                        side: 'left',
                        align: 'start'
                    }
                },
                {
                    element: '.map-legend',
                    popover: {
                        title: 'Leyenda del Mapa',
                        description: 'Los colores del mapa representan el número de pisos de cada edificación. Desde gris (0 pisos) hasta verde oscuro (más de 16 pisos).',
                        side: 'left',
                        align: 'start'
                    }
                }
            ],
            onNextClick: (element, step) => {
                currentStep++;
                updateProgressText(currentStep);
                
                if (step.index === 5) {
                    // Último paso - Finalizar
                    panelDriver.destroy();
                    State.waitingForTutorialClick = false;
                    State.tutorialTargetLayer = null;
                    localStorage.setItem('cuencaSolarTutorialCompleted', 'true');
                } else {
                    panelDriver.moveNext();
                }
            },
            onPrevClick: (element, step) => {
                if (step.index === 0) {
                    // Si está en el primer paso del panel, volver al predio
                    panelDriver.destroy();
                    State.waitingForTutorialClick = false;
                    State.tutorialTargetLayer = null;
                    closePanel();
                    setTimeout(() => showPredioStep(), 300);
                } else {
                    currentStep--;
                    updateProgressText(currentStep);
                    panelDriver.movePrevious();
                }
            }
        });

        // Función para actualizar el texto del progreso
        function updateProgressText(step) {
            const progressElement = document.querySelector('.driver-popover-progress-text');
            if (progressElement) {
                progressElement.textContent = `Paso ${step} de 8`;
            }
        }

        // Actualizar el texto del botón según el paso
        function updateButtonText() {
            const interval = setInterval(() => {
                const activeIndex = panelDriver.getActiveIndex();
                const nextBtn = document.querySelector('.driver-popover-next-btn');
                
                if (nextBtn) {
                    if (activeIndex === 5) {
                        nextBtn.textContent = 'Finalizar';
                    } else {
                        nextBtn.textContent = 'Siguiente';
                    }
                }
                
                // Actualizar contador
                updateProgressText(3 + activeIndex);
            }, 100);

            // Limpiar intervalo cuando se destruya el driver
            setTimeout(() => clearInterval(interval), 100000);
        }

        panelDriver.drive();
        updateButtonText();

    }, 500);
}

// Modificar la función selectLayer original para detectar el click del tutorial
const originalSelectLayer = selectLayer;
selectLayer = function(layer, feature, tituloSector) {
    // Llamar a la función original
    originalSelectLayer(layer, feature, tituloSector);
    
    // Si estamos esperando el click del tutorial y es el layer correcto
    if (State.waitingForTutorialClick && State.tutorialTargetLayer === layer) {
        State.waitingForTutorialClick = false;
        showPanelSteps();
    }
};

// Botón para reiniciar el tutorial
function addTutorialButton() {
    const tutorialBtn = document.createElement('button');
    tutorialBtn.className = 'tutorial-btn';
    tutorialBtn.innerHTML = '<i class="fa-solid fa-question-circle"></i> Tutorial';
    tutorialBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        padding: 12px 20px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        transition: all 0.3s ease;
    `;
    
    tutorialBtn.addEventListener('mouseenter', () => {
        tutorialBtn.style.background = '#1d4ed8';
        tutorialBtn.style.transform = 'translateY(-2px)';
        tutorialBtn.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
    });
    
    tutorialBtn.addEventListener('mouseleave', () => {
        tutorialBtn.style.background = '#2563eb';
        tutorialBtn.style.transform = 'translateY(0)';
        tutorialBtn.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
    });
    
    tutorialBtn.addEventListener('click', () => {
        // Cerrar panel si está abierto
        if (DOM.panel && !DOM.panel.classList.contains('hidden')) {
            closePanel();
        }
        // Iniciar tutorial desde el principio
        setTimeout(() => initTutorial(), 300);
    });
    
    document.body.appendChild(tutorialBtn);
}

// Verificar si es la primera visita y mostrar tutorial automáticamente
function checkFirstVisit() {
    const hasCompletedTutorial = localStorage.getItem('cuencaSolarTutorialCompleted');
    
    // Solo mostrar si NO ha completado el tutorial
    if (!hasCompletedTutorial) {
        setTimeout(() => {
            initTutorial();
        }, 1500);
    }
}

// Inicializar
addTutorialButton();
checkFirstVisit();
});