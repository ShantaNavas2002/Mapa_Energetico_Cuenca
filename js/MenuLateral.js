// Función para cargar el menú
async function cargarMenu() {
    try {
        const response = await fetch('../legend/menu.html');
        const html = await response.text();
        document.getElementById('menu-container').innerHTML = html;
        
        // NUEVO: Llamamos a la función de marcado justo después de insertar el HTML
        marcarPaginaActiva();

    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}

// NUEVA FUNCIÓN: Detecta la URL y marca el link correspondiente
function marcarPaginaActiva() {
    // 1. Obtener la URL actual (sin parámetros como ?id=1)
    const currentUrl = window.location.href.split(/[?#]/)[0];
    
    // 2. Obtener todos los links del menú
    // Nota: Asegúrate de que tu fetch carga el menú dentro de un elemento con ID o clase conocida
    const links = document.querySelectorAll('#menu-container a');

    links.forEach(link => {
        // Comparamos la propiedad 'href' completa del link con la URL actual
        if (link.href === currentUrl) {
            
            // A. Agregar clase visual al link
            link.classList.add('pagina-actual');

            // B. Lógica para Sub-menús (Opcional pero recomendado)
            // Si el link está dentro de un sub-menú, hay que abrirlo automáticamente
            const parentSubMenu = link.closest('ul'); // Busca el UL padre
            
            // Verificamos si ese UL es un submenú (asumiendo que tiene un ID o clase específica)
            // Si usas la estructura de tu toggleSubMenu, el UL probablemente está oculto.
            if (parentSubMenu && parentSubMenu.id !== 'menuLateral') {
                const parentLi = parentSubMenu.parentNode; // El LI que contiene el submenú
                
                // Abrimos el menú usando la lógica de altura y clases
                parentLi.classList.add('abierto');
                parentSubMenu.style.maxHeight = parentSubMenu.scrollHeight + "px";
            }
        }
    });
}

// ... (Resto de tus funciones toggleMenu, toggleSubMenu igual que antes) ...

// FUNCIÓN CONSOLIDADA: Toggle del menú lateral principal
function toggleMenu() {
    const menu = document.getElementById('menuLateral');
    const overlay = document.getElementById('overlay');
    const icono = document.querySelector('.btn-menu i'); 

    menu.classList.toggle('activo');
    overlay.classList.toggle('activo');

    if (icono) {
        if (menu.classList.contains('activo')) {
            icono.classList.remove('fa-bars');
            icono.classList.add('fa-times'); 
        } else {
            icono.classList.remove('fa-times');
            icono.classList.add('fa-bars'); 
        }
    }
}

// Toggle para sub-menús
function toggleSubMenu(event, subMenuId) {
    event.preventDefault(); 
    const subMenu = document.getElementById(subMenuId);
    const item = subMenu.parentNode; 
    
    item.classList.toggle('abierto');
    
    if (subMenu.style.maxHeight) {
        subMenu.style.maxHeight = null; 
    } else {
        subMenu.style.maxHeight = subMenu.scrollHeight + "px"; 
    }
}

// Listeners iniciales
document.addEventListener('DOMContentLoaded', cargarMenu);

document.addEventListener('DOMContentLoaded', function() {
    const overlayElement = document.getElementById('overlay');
    if (overlayElement) {
        overlayElement.addEventListener('click', toggleMenu);
    }

    
});