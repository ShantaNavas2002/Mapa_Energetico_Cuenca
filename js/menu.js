// Función para cargar el menú
async function cargarMenu() {
    try {
        const response = await fetch('menu.html');
        const html = await response.text();
        document.getElementById('menu-container').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// Función para toggle del menú (la que ya tenías)
function toggleMenu() {
    const menu = document.getElementById('menuLateral');
    menu.classList.toggle('activo');
}

// Cargar el menú cuando la página esté lista
document.addEventListener('DOMContentLoaded', cargarMenu);