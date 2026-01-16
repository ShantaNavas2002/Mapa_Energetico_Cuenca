/* =============================================================================
   ALERTA DE BIENVENIDA - JAVASCRIPT (CON OPCIÓN "NO MOLESTAR")
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. VERIFICACIÓN DE SESIÓN
    // Si la variable 'alerta_visto' existe en la sesión, detenemos el script aquí.
    if (sessionStorage.getItem('alerta_visto') === 'true') {
        return; 
    }

    // Crear estructura HTML de la alerta (Se agregó el bloque div.alerta-opciones)
    const alertaHTML = `
        <div class="alerta-overlay" id="alertaInicio">
            <div class="alerta-contenedor">
                <h2 class="alerta-titulo">¡Bienvenido al Mapa Fotovoltaico!</h2>
                <p class="alerta-texto">
                    Este visor presenta la cantidad de <strong>paneles fotovoltaicos</strong> necesarios para abastecer el consumo actual de cada predio. 
                    <br>
                    Para ver esta información, da click dentro de los predios disponibles o introduce tu clave catastral en el buscador de predios en la parte superior izquierda.  
                    <br>
                    Para más información de como navegar en el visor utiliza el tutorial interactivo al dar click sobre el botón <strong>Guía</strong> ubicado en la parte inferior derecha. 
                    <br>
                    Si no encuentras tu predio ahora, vuelve a consultar esta página más adelante, continuamos actualizando la información regularmente. 
                    <br>
                    <br>
                    Última actualización febrero 2026.
                </p>

                <div class="alerta-opciones">
                    <label>
                        <input type="checkbox" id="chkNoMolestar">
                        No volver a mostrar.
                    </label>
                </div>

                <div class="alerta-acciones">
                    <button class="alerta-btn-entendido" id="btnEntendido">
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Inyectar la alerta al body
    document.body.insertAdjacentHTML('beforeend', alertaHTML);
    
    // Referencias
    const overlay = document.getElementById('alertaInicio');
    const btnEntendido = document.getElementById('btnEntendido');
    const chkNoMolestar = document.getElementById('chkNoMolestar'); // Referencia al checkbox
    
    // Mostrar la alerta después de un pequeño delay para la transición
    setTimeout(() => {
        overlay.classList.add('active');
    }, 100);
    
    // Función para cerrar la alerta
    function cerrarAlerta() {
        // 2. LÓGICA DE GUARDADO
        // Si el usuario marcó el checkbox, guardamos la marca en sessionStorage
        if (chkNoMolestar && chkNoMolestar.checked) {
            sessionStorage.setItem('alerta_visto', 'true');
        }

        overlay.classList.remove('active');
        
        // Remover del DOM después de la transición
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
    
    // Event listener del botón
    btnEntendido.addEventListener('click', cerrarAlerta);
    
    // Prevenir que se cierre clickeando el overlay (solo con el botón)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            e.stopPropagation();
        }
    });
});