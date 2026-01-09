/* =============================================================================
   ALERTA DE BIENVENIDA - JAVASCRIPT
   ============================================================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // Crear estructura HTML de la alerta
    const alertaHTML = `
        <div class="alerta-overlay" id="alertaInicio">
            <div class="alerta-contenedor">
                <h2 class="alerta-titulo">¡Bienvenido al Mapa Fotovoltaico!</h2>
                <p class="alerta-texto">
                    Este visor presenta la cantidad de <strong>paneles fotovoltaicos</strong> necesarios para abastecer el consumo actual de cada predio. 
                    <br>
                    Para ver esta información, da click dentro de los predios disponibles o introduce tu clave catastral en el buscador de predios en la parte superior izquierda.  
                    <br>
                    Para más información de como navegar en el visor utiliza el tutorial interactivo al dar click sobre la pestaña <strong>GUÍA</strong> ubicada en la parte inferior derecha. 
                    <br>
                    Si no encuentras tu predio ahora, vuelve a consultar esta página más adelante, continuamos actualizando la información regularmente. 
                    <br>
                    <br>
                    Última actualización febrero 2026.
                </p>
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
    
    // Mostrar la alerta después de un pequeño delay para la transición
    setTimeout(() => {
        overlay.classList.add('active');
    }, 100);
    
    // Función para cerrar la alerta
    function cerrarAlerta() {
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
        // Si el click es directamente en el overlay (no en el contenedor)
        if (e.target === overlay) {
            // No hacer nada - la alerta solo se cierra con el botón
            e.stopPropagation();
        }
    });
    
    // Prevenir cierre con tecla Escape (opcional - puedes comentar esto si lo prefieres)
    // document.addEventListener('keydown', function(e) {
    //     if (e.key === 'Escape' && overlay.classList.contains('active')) {
    //         cerrarAlerta();
    //     }
    // });
    
});