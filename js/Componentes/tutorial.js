(function() {
    document.addEventListener('DOMContentLoaded', function() {
        const menuBtn = document.querySelector('.btn-menu');
        
        // sessionStorage se limpia automáticamente cuando el usuario cierra la pestaña o el navegador
        const hasInteracted = sessionStorage.getItem('menuBtnInteracted');
        
        if (!menuBtn) return;
        
        // Si no hay registro de interacción en esta sesión, activamos las ondas
        if (!hasInteracted) {
            menuBtn.classList.add('animated');
        }
        
        function stopAnimation() {
            // Quitamos la clase de las ondas inmediatamente
            menuBtn.classList.remove('animated');
            
            // Guardamos el estado para que no vuelva a aparecer MIENTRAS la pestaña esté abierta
            sessionStorage.setItem('menuBtnInteracted', 'true');
            
            // Removemos el listener para optimizar recursos
            menuBtn.removeEventListener('click', stopAnimation);
        }
        
        // Escuchamos el clic para marcar el botón como "visto"
        menuBtn.addEventListener('click', stopAnimation);
    });
})();