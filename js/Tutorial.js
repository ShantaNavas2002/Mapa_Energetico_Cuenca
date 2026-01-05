// Script para controlar la animación de latido del botón del menú
(function() {
    // Esperar a que el DOM esté cargado
    document.addEventListener('DOMContentLoaded', function() {
        const menuBtn = document.querySelector('.btn-menu');
        const hasInteracted = localStorage.getItem('menuBtnInteracted');
        
        if (!menuBtn) return;
        
        // Si el usuario NO ha interactuado antes, agregar la animación
        if (!hasInteracted) {
            menuBtn.classList.add('animated');
        }
        
        // Función para detener la animación
        function stopAnimation() {
            menuBtn.classList.remove('animated');
            
            // Guardar en localStorage que ya interactuó
            localStorage.setItem('menuBtnInteracted', 'true');
            
            // Remover el event listener
            menuBtn.removeEventListener('click', stopAnimation);
        }
        
        // Detener animación al hacer click
        menuBtn.addEventListener('click', stopAnimation);
    });
    
    // Función para reiniciar la animación (útil para testing)
    window.resetMenuAnimation = function() {
        localStorage.removeItem('menuBtnInteracted');
        location.reload();
        console.log('Animación del menú reiniciada.');
    };
})();