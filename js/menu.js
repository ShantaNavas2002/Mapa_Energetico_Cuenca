// Función para cargar el menú
async function cargarMenu() {
    try {
        const response = await fetch('legend/menu.html');
        const html = await response.text();
        document.getElementById('menu-container').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// FUNCIÓN CONSOLIDADA: Toggle del menú lateral principal, incluyendo el cambio de ícono
function toggleMenu() {
    const menu = document.getElementById('menuLateral');
    const overlay = document.getElementById('overlay');
    
    // Selector corregido para encontrar el ícono dentro de .btn-menu
    const icono = document.querySelector('.btn-menu i'); 

    // 1. Toggle de las clases 'activo'
    menu.classList.toggle('activo');
    overlay.classList.toggle('activo');

    // 2. Lógica para cambiar el ícono
    if (icono) { // Asegura que el ícono exista antes de intentar cambiarlo
        if (menu.classList.contains('activo')) {
            icono.classList.remove('fa-bars');
            icono.classList.add('fa-times'); 
        } else {
            icono.classList.remove('fa-times');
            icono.classList.add('fa-bars'); 
        }
    }
}

// NUEVA FUNCIÓN: Toggle para el sub-menú de "Otros Proyectos"
function toggleSubMenu(event, subMenuId) {
    // Evita que el enlace # navegue la página
    event.preventDefault(); 
    
    const subMenu = document.getElementById(subMenuId);
    const item = subMenu.parentNode; // El <li> padre
    
    // 1. Alterna la clase 'abierto' en el <li> padre
    item.classList.toggle('abierto');
    
    // 2. Alterna la visibilidad con 'max-height' para CSS
    if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null; // Cierra el menú
    } else {
        // Abre el menú, ajustando la altura al contenido
        subMenu.style.maxHeight = subMenu.scrollHeight + "px"; 
    }
}

// Cargar el menú cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarMenu);

// Cerrar menú si se hace click en el fondo oscuro (overlay)
// Se necesita que el overlay esté cargado en el DOM para poder adjuntar el listener
document.addEventListener('DOMContentLoaded', function() {
    const overlayElement = document.getElementById('overlay');
    if (overlayElement) {
        overlayElement.addEventListener('click', toggleMenu);
    }
});