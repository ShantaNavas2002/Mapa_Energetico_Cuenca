 // Barra deespegable
    function toggleMenu() {
        const menu = document.getElementById('menuLateral');
        const overlay = document.getElementById('overlay');
        const icono = document.querySelector('.btn-lateral i');

        
        menu.classList.toggle('activo');
        overlay.classList.toggle('activo');

        
        if (menu.classList.contains('activo')) {
            icono.classList.remove('fa-bars');
            icono.classList.add('fa-times'); 
        } else {
            icono.classList.remove('fa-times');
            icono.classList.add('fa-bars'); 
        }
    }

    // Cerrar menú si se hace click en el fondo oscuro (overlay)
    document.getElementById('overlay').addEventListener('click', function() {
        toggleMenu();
    });
