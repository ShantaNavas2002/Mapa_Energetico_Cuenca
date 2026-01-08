

async function cargarMenu() {
    try {
        
        const menuPath = '/legend/menu.html';


        const response = await fetch(menuPath);
        
        if (!response.ok) {
            throw new Error(`No se pudo cargar el menú desde: ${menuPath}`);
        }

        let html = await response.text();

        if (!isPagesFolder) {
            
            html = html.replace(/\.\.\/pages\//g, 'pages/');
            
            html = html.replace(/\.\.\/index\.html/g, 'index.html');
        }

        document.getElementById('menu-container').innerHTML = html;
        
        marcarPaginaActiva();

    } catch (error) {
        console.error('Error al cargar el menú:', error);
    }
}


function marcarPaginaActiva() {

    const currentUrl = window.location.href.split(/[?#]/)[0];
    const links = document.querySelectorAll('#menu-container a');

    links.forEach(link => {
        if (link.href === currentUrl) {
            
            link.classList.add('pagina-actual');
            const parentSubMenu = link.closest('ul'); 
            
            if (parentSubMenu && parentSubMenu.id !== 'menuLateral') {
                const parentLi = parentSubMenu.parentNode;
                
                parentLi.classList.add('abierto');
                parentSubMenu.style.maxHeight = parentSubMenu.scrollHeight + "px";
            }
        }
    });
}

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