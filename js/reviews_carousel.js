import { onValue } from 'firebase/database';
import firebaseApp from './firebase.js'; // Importa la instancia de Firebase

document.addEventListener('DOMContentLoaded', () => {
    const swiperWrapper = document.querySelector('.mySwiper .swiper-wrapper');
    let reviews = [];
    let mySwiper = null; // Variable para almacenar la instancia de Swiper

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
                        spaceBetween: 0
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
                centeredSlides: true,
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

    // Añadir listener para actualizar Swiper en el redimensionamiento de la ventana
    window.addEventListener('resize', () => {
        if (mySwiper) {
            mySwiper.update();
        }
    });

    // Removimos los listeners de botones y updateCarousel manual ya que Swiper los maneja
    // Removimos window.addEventListener('resize', updateCarousel); ya que Swiper es responsivo por defecto
}); 