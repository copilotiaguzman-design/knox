// ========================================
// KNOX - Script Principal
// ========================================

// Elementos del DOM
const accessScreen = document.getElementById('access-screen');
const jokeScreen = document.getElementById('joke-screen');
const mainScreen = document.getElementById('main-screen');
const birthdateInput = document.getElementById('birthdate-input');
const accessBtn = document.getElementById('access-btn');
const continueBtn = document.getElementById('continue-btn');

// Clave para localStorage
const STORAGE_KEY = 'knox_user_data';

// ========================================
// FUNCIONES PRINCIPALES
// ========================================

/**
 * Verifica si el usuario ya ingresó sus datos
 */
function checkExistingUser() {
    const userData = localStorage.getItem(STORAGE_KEY);
    
    if (userData) {
        const data = JSON.parse(userData);
        if (data.registered === true) {
            // Usuario ya registrado, ir directo al contenido
            showMainScreen();
            return true;
        }
    }
    return false;
}

/**
 * Guarda los datos del usuario
 */
function saveUserData(birthdate) {
    const userData = {
        birthdate: birthdate,
        registered: true,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    console.log('📅 Datos guardados:', userData);
}

/**
 * Valida el formato de la fecha (DD/MM/AAAA)
 */
function validateDateFormat(dateString) {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(regex);
    
    if (!match) return false;
    
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    
    // Validación básica
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    
    return true;
}

/**
 * Formatea automáticamente la entrada de fecha
 */
function formatDateInput(value) {
    // Remover todo excepto números
    let numbers = value.replace(/\D/g, '');
    
    // Limitar a 8 dígitos
    numbers = numbers.substring(0, 8);
    
    // Agregar las barras
    if (numbers.length >= 4) {
        return numbers.substring(0, 2) + '/' + numbers.substring(2, 4) + '/' + numbers.substring(4);
    } else if (numbers.length >= 2) {
        return numbers.substring(0, 2) + '/' + numbers.substring(2);
    }
    
    return numbers;
}

/**
 * Muestra la pantalla del chiste
 */
function showJokeScreen() {
    accessScreen.classList.add('hidden');
    jokeScreen.classList.remove('hidden');
}

/**
 * Muestra la pantalla principal
 */
function showMainScreen() {
    accessScreen.classList.add('hidden');
    jokeScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    
    // Scroll al inicio
    window.scrollTo(0, 0);
}

/**
 * Maneja el intento de acceso
 */
function handleAccess() {
    const birthdate = birthdateInput.value.trim();
    
    if (!birthdate) {
        shakeInput();
        return;
    }
    
    if (!validateDateFormat(birthdate)) {
        shakeInput();
        return;
    }
    
    // Guardar los datos
    saveUserData(birthdate);
    
    // Mostrar la pantalla del chiste
    showJokeScreen();
}

/**
 * Efecto de shake para input inválido
 */
function shakeInput() {
    birthdateInput.style.animation = 'shake 0.5s ease-in-out';
    birthdateInput.style.borderColor = '#e74c3c';
    
    setTimeout(() => {
        birthdateInput.style.animation = '';
        birthdateInput.style.borderColor = '';
    }, 500);
}

// Agregar animación de shake al CSS dinámicamente
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-10px); }
        40% { transform: translateX(10px); }
        60% { transform: translateX(-10px); }
        80% { transform: translateX(10px); }
    }
`;
document.head.appendChild(shakeStyle);

// ========================================
// EVENT LISTENERS
// ========================================

// Formateo automático de la fecha mientras escribe
birthdateInput.addEventListener('input', (e) => {
    const cursorPos = e.target.selectionStart;
    const oldLength = e.target.value.length;
    
    e.target.value = formatDateInput(e.target.value);
    
    const newLength = e.target.value.length;
    const newCursorPos = cursorPos + (newLength - oldLength);
    
    e.target.setSelectionRange(newCursorPos, newCursorPos);
});

// Click en botón de acceso
accessBtn.addEventListener('click', handleAccess);

// Enter en el input
birthdateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleAccess();
    }
});

// Click en continuar (después del chiste)
continueBtn.addEventListener('click', showMainScreen);

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario ya está registrado
    if (!checkExistingUser()) {
        // Mostrar pantalla de acceso
        accessScreen.classList.remove('hidden');
        
        // Focus en el input
        setTimeout(() => {
            birthdateInput.focus();
        }, 500);
    }
});

// ========================================
// EXTRAS - Efectos visuales
// ========================================

// Efecto parallax suave en las cards al mover el mouse
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.beetle-card');
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    cards.forEach((card, index) => {
        const intensity = 5 + (index * 0.5);
        const rotateX = mouseY * intensity;
        const rotateY = mouseX * intensity * -1;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
});

// Reset de la transformación cuando el mouse sale
document.addEventListener('mouseleave', () => {
    const cards = document.querySelectorAll('.beetle-card');
    cards.forEach(card => {
        card.style.transform = '';
    });
});
