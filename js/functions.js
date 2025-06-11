/**
 * Muestra una notificación toast en la interfaz de usuario.
 * @param {string} message - El mensaje a mostrar en el toast.
 * @param {'success'|'error'} type - El tipo de notificación (success o error).
 * @param {number} duration - La duración en milisegundos que el toast será visible.
 */
export function showToast(message, type = 'success', duration = 3000) {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');

    toastMessage.textContent = message;
    toast.className = 'toast-show'; // Mostrar toast

    if (type === 'error') {
        toast.classList.add('toast-error');
    } else {
        toast.classList.add('toast-success');
    }

    setTimeout(() => {
        toast.classList.remove('toast-show', 'toast-error', 'toast-success');
    }, duration);
}

export async function handleContactFormSubmit(event, firebaseApp) {
    event.preventDefault();

    const data = {
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        tipo: document.getElementById("tipo").value,
        mensaje: document.getElementById("mensaje").value,
        timestamp: new Date().toISOString()
    };

    try {
        await firebaseApp.pushData('contact_messages', data);
        document.getElementById("contact-form").reset();
        showToast("¡Mensaje de contacto enviado con éxito!", 'success');
    } catch (error) {
        console.error("Error al enviar el mensaje a Firebase:", error);
        showToast("Hubo un error al enviar el mensaje de contacto.", 'error');
    }
} 