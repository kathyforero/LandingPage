import { onValue } from 'firebase/database';
import firebaseApp from './firebase.js'; // Importa la instancia de Firebase

document.addEventListener('DOMContentLoaded', () => {
    const swiperWrapper = document.querySelector('.mySwiper .swiper-wrapper');
    let reviews = [];
    let mySwiper = null; // Variable para almacenar la instancia de Swiper

    // Reseñas dummy para mostrar si no hay datos en Firebase
    const dummyReviews = [
        { name: "Ana Torres", rating: 5, message: "¡Una experiencia culinaria excepcional! Cada plato es una obra de arte y el sabor inigualable. Volveré sin duda." },
        { name: "Carlos Mendoza", rating: 4, message: "Excelente servicio y ambiente acogedor. El postre de tres leches es una maravilla. ¡Muy recomendable!" },
        { name: "Sofía Vargas", rating: 5, message: "Me encantó el mix de shawarma, fresco y delicioso. La atención al cliente es de primera. ¡Mi nuevo lugar favorito en Guayaquil!" },
        { name: "Ricardo León", rating: 4, message: "Probé la torta decorada y superó mis expectativas. Ideal para cualquier celebración. El menú es muy variado." },
        { name: "Elena Gómez", rating: 5, message: "Los brigadeiros de uva son una sorpresa deliciosa. Un lugar con encanto y comida que te hace sentir como en casa. ¡Impecable!" }
    ];

    // Función para generar estrellas
    function generateStars(rating) {
        let starsHtml = '';
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                starsHtml += '★'; // Estrella llena
            } else {
                starsHtml += '☆'; // Estrella vacía
            }
        }
        return starsHtml;
    }

    // Función para renderizar las reseñas en el Swiper
    function renderReviews() {
        if (!swiperWrapper) return;

        swiperWrapper.innerHTML = ''; // Limpiar reseñas existentes

        if (reviews.length === 0) {
            swiperWrapper.innerHTML = '<p>No hay reseñas disponibles aún.</p>';
            // Si no hay reseñas, destruye la instancia de Swiper si existe
            if (mySwiper) {
                mySwiper.destroy(true, true);
                mySwiper = null;
            }
            return;
        }

        reviews.forEach(review => {
            const slide = document.createElement('div');
            slide.classList.add('swiper-slide');
            slide.innerHTML = `
                <div class="review-card">
                    <div class="stars">${generateStars(review.rating || 0)}</div>
                    <p>"${review.message}"</p>
                    <p class="author">- ${review.name}</p>
                </div>
            `;
            swiperWrapper.appendChild(slide);
        });

        // Re-inicializar Swiper si ya existe, o inicializarlo por primera vez
        if (mySwiper) {
            mySwiper.update(); // Actualiza Swiper con los nuevos slides
        } else {
            // Inicializar Swiper
            mySwiper = new Swiper('.mySwiper', {
                // Optional parameters
                loop: true, // Carrusel infinito

                // If we need pagination
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },

                // Navigation arrows
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },

                // And if we need scrollbar
                // scrollbar: {
                //     el: '.swiper-scrollbar',
                // },

                // Responsive breakpoints
                breakpoints: {
                    // when window width is >= 320px
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 25
                    },
                    // when window width is >= 768px
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 35
                    },
                    // when window width is >= 1024px
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 50
                    }
                },
                // centeredSlides: true, // Desactivado temporalmente
            });
        }
    }

    // Escuchar reseñas de Firebase en tiempo real
    const reviewsRef = firebaseApp.getDbRef('reviews');
    onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val();
        reviews = [];
        if (data) {
            for (const key in data) {
                reviews.push(data[key]);
            }
            // Opcional: Ordenar reseñas por timestamp si se añade uno al guardarlas
            // reviews.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        }

        // Si no hay reseñas de Firebase, usa las reseñas dummy
        if (reviews.length === 0) {
            reviews = [...dummyReviews]; // Copia las reseñas dummy
        }
        
        renderReviews(); // Vuelve a renderizar y/o inicializar/actualizar Swiper
    }, (error) => {
        console.error("Error al cargar las reseñas desde Firebase:", error);
        if (swiperWrapper) {
            swiperWrapper.innerHTML = '<p>Error al cargar las reseñas.</p>';
        }
    });

    // Removimos los listeners de botones y updateCarousel manual ya que Swiper los maneja
    // Removimos window.addEventListener('resize', updateCarousel); ya que Swiper es responsivo por defecto
}); 