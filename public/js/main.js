document.addEventListener('DOMContentLoaded', function() {
  const preloader = document.getElementById('preloader');
  
  if (!preloader) return;
  
  // Добавляем класс loading к body
  document.body.classList.add('loading');
  
  // Скрываем прелоадер когда страница полностью загружена
  window.addEventListener('load', function() {
    setTimeout(function() {
      hidePreloader(preloader);
    }, 1000);
  });

  // На всякий случай скрываем прелоадер через 3 секунды
  setTimeout(function() {
    if (preloader && preloader.style.visibility !== 'hidden') {
      hidePreloader(preloader);
    }
  }, 3000);
});

function hidePreloader(preloader) {
  preloader.style.opacity = '0';
  preloader.style.visibility = 'hidden';
  
  // Убираем класс loading и добавляем loaded
  document.body.classList.remove('loading');
  document.body.classList.add('loaded');
  
  setTimeout(function() {
    if (preloader.parentNode) {
      preloader.remove();
    }
  }, 500);
}


// Инициализация карусели
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.employee-carousel');
  const track = carousel.querySelector('.employee-carousel__track');
  const slides = carousel.querySelectorAll('.employee-carousel__slide');
  const prevBtn = carousel.querySelector('.employee-carousel__nav--prev');
  const nextBtn = carousel.querySelector('.employee-carousel__nav--next');
  const indicators = carousel.querySelectorAll('.employee-carousel__indicator');
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  
  // Функция для обновления позиции карусели
  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Обновление индикаторов
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
    
    // Обновление ARIA атрибутов
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', index !== currentIndex);
    });
  }
  
  // Переход к следующему слайду
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }
  
  // Переход к предыдущему слайду
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }
  
  // Переход к конкретному слайду
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }
  
  // Обработчики событий
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });
  
  // Автопрокрутка (опционально)
  let autoPlayInterval;
  
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000); // Смена каждые 5 секунд
  }
  
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }
  
  // Пауза автопрокрутки при наведении
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);
  
  // Инициализация
  updateCarousel();
  startAutoPlay();
});


$(document).ready(function() {
  $(document).on('click', '#ButtonReviewFormModal', () => {
    openModal('reviewFormModal');
  });
});

$(document).ready(function(){
  // Инициализация карусели
  $('.reviews-carousel').owlCarousel({
    margin: 12,
    nav: false,
    dots: true,
    dotsContainer: '#customDots',
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      1024: {
        items: 3
      }
    },
    onInitialized: function(event) {
      updateProgress(event);
      checkTextOverflow();
    },
    onTranslated: function(event) {
      updateProgress(event);
      checkTextOverflow();
    },
    onResized: function(event) {
      checkTextOverflow();
    }
  });

  // Кастомные кнопки навигации
  $('.reviews-button--next').click(function() {
    $('.reviews-carousel').trigger('next.owl.carousel');
  });
  
  $('.reviews-button--prev').click(function() {
    $('.reviews-carousel').trigger('prev.owl.carousel');
  });

  // Функция для обновления прогресса
  function updateProgress(event) {
    const current = event.item.index + 1;
    const total = event.item.count;
    const progress = (current / total) * 100;
    $('.pagination-progress').css('width', progress + '%');
  }

  // Кастомные точки
  $('.reviews-carousel').on('initialized.owl.carousel', function(event) {
    const dots = $('#customDots');
    dots.empty();
    
    for (let i = 0; i < event.item.count; i++) {
      dots.append('<button class="owl-dot"><span></span></button>');
    }
    
    $('.owl-dot').each(function(index) {
      $(this).click(function() {
        $('.reviews-carousel').trigger('to.owl.carousel', [index]);
      });
    });
  });

  // Проверка переполнения текста и показ кнопки "Читать полностью"
  function checkTextOverflow() {
    $('.review-card').each(function() {
      const $textElement = $(this).find('.review-card__text');
      const $readMoreBtn = $(this).find('.review-card__read-more');
      
      // Проверяем, превышает ли текст 7 строк
      if (isTextOverflowing($textElement[0])) {
        $readMoreBtn.show();
      } else {
        $readMoreBtn.hide();
      }
    });
  }

  // Функция проверки переполнения текста
  function isTextOverflowing(element) {
    const lineHeight = parseInt(getComputedStyle(element).lineHeight);
    const maxHeight = lineHeight * 7; // 7 строк
    return element.scrollHeight > maxHeight;
  }

  // Обработчик кнопки "Читать полностью"
  $(document).on('click', '.review-card__read-more', function() {
    const $card = $(this).closest('.review-card');
    const author = $card.find('.review-card__author').text();
    const rating = $card.find('.review-card__rating').html();
    const text = $card.find('.review-card__text').html();
    
    openReviewModal(author, rating, text);
  });

  // Функция открытия модального окна с отзывом
  function openReviewModal(author, rating, text) {
    $('#reviewModal .modal-review-author').text(author);
    $('#reviewModal .modal-review-rating').html(rating);
    $('#reviewModal .modal-review-text').html(text);
    openModal('reviewModal');
  }

  // Проверка при загрузке и изменении размера окна
  $(window).on('load resize', function() {
    setTimeout(checkTextOverflow, 100);
  });
});

// Универсальные функции для работы с модальными окнами
function initModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  // Закрытие по крестику
  const closeBtn = modal.querySelector('[data-modal-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modalId));
  }
  
  // Закрытие по клику вне окна
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });
  
  // Закрытие по ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal(modalId);
    }
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Фокусировка на модальном окне для доступности
    modal.setAttribute('aria-hidden', 'false');
    document.body.setAttribute('aria-hidden', 'true');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Возвращаем доступность
    modal.setAttribute('aria-hidden', 'true');
    document.body.setAttribute('aria-hidden', 'false');
  }
}

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  // Инициализируем все модальные окна на странице
  const modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(modal => {
    initModal(modal.id);
  });
});



  // Обработка открытия/закрытия меню
  document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');
    const header = document.getElementById('header');
    
    if (menuToggle && menuOverlay && menuClose) {
      menuToggle.addEventListener('click', function() {
        menuOverlay.classList.add('active');
        menuClose.classList.add('active');
        header.classList.add('active');
        menuToggle.classList.remove('active');
        
        document.body.style.overflow = 'hidden';
        
      });
      
      menuClose.addEventListener('click', function() {
        menuOverlay.classList.remove('active');
        menuClose.classList.remove('active');
        header.classList.remove('active');
        menuToggle.classList.add('active');

        document.body.style.overflow = '';
      });
      
      // Закрытие по клику вне меню
      menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
          menuOverlay.classList.remove('active');
           menuClose.classList.remove('active');
           header.classList.remove('active');
           menuToggle.classList.add('active');
          document.body.style.overflow = '';
        }
      });
      
      // Закрытие по ESC
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
          menuOverlay.classList.remove('active');
           menuClose.classList.remove('active');
           header.classList.remove('active');
           menuToggle.classList.add('active');
          document.body.style.overflow = '';
        }
      });

      
    }

    // Обработка языкового переключателя
    const languageSwitcher = document.getElementById('languageSwitcher');
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    if (languageSwitcher && languageDropdown) {
      // Открытие/закрытие выпадающего списка
      languageSwitcher.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('active');
        languageSwitcher.classList.toggle('active');
      });

      // Выбор языка
      languageOptions.forEach(option => {
        option.addEventListener('click', function() {
          const lang = this.getAttribute('data-lang');
          const text = this.querySelector('.language-option__text').textContent;
          const flagSvg = this.querySelector('.language-option__flag svg').cloneNode(true);
          
          // Обновляем основной переключатель
          document.querySelector('.language-text').textContent = text;
          document.querySelector('.language-flag').innerHTML = '';
          document.querySelector('.language-flag').appendChild(flagSvg);
          
          // Закрываем выпадающий список
          languageDropdown.classList.remove('active');
          languageSwitcher.classList.remove('active');
          
          // Здесь можно добавить логику смены языка
          console.log('Selected language:', lang);
        });
      });

      // Закрытие выпадающего списка при клике вне его
      document.addEventListener('click', function(e) {
        if (!languageSwitcher.contains(e.target)) {
          languageDropdown.classList.remove('active');
          languageSwitcher.classList.remove('active');
        }
      });

      // Закрытие по ESC
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          languageDropdown.classList.remove('active');
          languageSwitcher.classList.remove('active');
        }
      });
    }
  });




