/**
 * Inicializa el sistema de búsqueda unificado.
 * * @param {Object} map - La instancia del mapa Leaflet.
 * @param {Map} indexMap - Un objeto Map() que contiene { 'CLAVE': Layer }.
 * @param {Object} config - Configuración específica de cada mapa.
 * @param {Function} config.onFound - Función que se ejecuta al encontrar el predio (recibe el layer).
 * @param {string} [config.inputId='claveSearch'] - ID del input HTML.
 * @param {string} [config.optionsId='claveOptions'] - ID del datalist HTML.
 * @param {string} [config.btnId='claveGo'] - ID del botón de búsqueda HTML.
 */
function initSearchSystem(map, indexMap, config) {
    const input = document.getElementById(config.inputId || 'claveSearch');
    const dataList = document.getElementById(config.optionsId || 'claveOptions');
    const btn = document.getElementById(config.btnId || 'claveGo');

    if (!input || !dataList) {
        console.warn('Search system: Elementos del DOM no encontrados.');
        return;
    }

    // --- 1. Lógica de Bloqueo del Mapa (UX) ---
    const toggleMapInteraction = (enable) => {
        const interactions = ['dragging', 'touchZoom', 'doubleClickZoom', 'scrollWheelZoom', 'boxZoom', 'keyboard'];
        interactions.forEach(i => map[i][enable ? 'enable' : 'disable']());
        if (map.tap) map.tap[enable ? 'enable' : 'disable']();
        
        // Opcional: Estilo visual al contenedor del input
        if(input.parentElement) {
            enable ? input.parentElement.classList.remove('search-focused') 
                   : input.parentElement.classList.add('search-focused');
        }
    };

    input.addEventListener('focus', () => toggleMapInteraction(false));
    input.addEventListener('blur', () => setTimeout(() => toggleMapInteraction(true), 200));

    // --- 2. Autocompletado y Filtrado ---
    input.addEventListener('input', function() {
        // Solo números
        this.value = this.value.replace(/[^0-9]/g, '');
        
        const val = this.value.trim(); // Las claves son numéricas, no hace falta uppercase
        dataList.innerHTML = '';
        
        if (!val) return;

        // Convertimos las llaves a array solo cuando se necesita buscar
        // Ojo: Si el mapa es muy grande, conviene cachear las keys fuera del evento input
        const keys = Array.from(indexMap.keys()); 
        
        let count = 0;
        for (let i = 0; i < keys.length; i++) {
            if (keys[i].includes(val)) {
                const op = document.createElement('option');
                op.value = keys[i];
                dataList.appendChild(op);
                count++;
                if (count >= 5) break; // Límite de sugerencias
            }
        }
    });

    // --- 3. Ejecutar Búsqueda ---
    const executeSearch = () => {
        const val = input.value.trim();
        // Intentamos buscar tal cual, o convertimos a string si el mapa usa strings
        const layer = indexMap.get(val) || indexMap.get(val.toUpperCase());

        if (!layer) {
            alert('No se encontró la CLAVE: ' + val);
            return;
        }

        // Ejecutamos la lógica personalizada definida en cada mapa
        if (config.onFound && typeof config.onFound === 'function') {
            config.onFound(layer);
        } else {
            // Comportamiento por defecto si no se pasa callback
            layer.fire('click');
        }
    };

    if (btn) btn.addEventListener('click', executeSearch);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') executeSearch(); });
}