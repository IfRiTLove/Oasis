// Функциональность для хотспотов
document.addEventListener('DOMContentLoaded', function () {
  const hotspots = document.querySelectorAll('.hotspot');

  hotspots.forEach((hotspot, index) => {
    const dot = hotspot.querySelector('.dot');
    const tooltip = hotspot.querySelector('.tooltip');

    // Анимация при загрузке страницы
    setTimeout(() => {
      dot.style.animation = 'pulse 2s infinite';
    }, index * 200);

    // Клик по хотспоту
    hotspot.addEventListener('click', function () {
      // Убираем активное состояние у всех хотспотов
      hotspots.forEach(h => h.classList.remove('active'));

      // Добавляем активное состояние к текущему
      this.classList.add('active');

      // Показываем tooltip при клике
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
      tooltip.style.transform = 'translateY(0)';

      // Скрываем tooltip через 3 секунды
      setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.transform = 'translateY(10px)';
        this.classList.remove('active');
      }, 3000);
    });

    // Дополнительные hover эффекты
    hotspot.addEventListener('mouseenter', function () {
      this.style.transform = 'scale(1.1)';
    });

    hotspot.addEventListener('mouseleave', function () {
      this.style.transform = 'scale(1)';
    });
  });

  // Скрытие tooltip при клике вне хотспота
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.hotspot')) {
      hotspots.forEach(hotspot => {
        const tooltip = hotspot.querySelector('.tooltip');
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.style.transform = 'translateY(10px)';
        hotspot.classList.remove('active');
      });
    }
  });
});

// CSS анимация для пульсации
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(42, 245, 152, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(42, 245, 152, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(42, 245, 152, 0);
        }
    }
    
    .hotspot.active .dot {
        animation: none;
        box-shadow: 0 0 0 8px rgba(42, 245, 152, 0.6);
    }
`;
document.head.appendChild(style);

// Функциональность простого слайдера
document.addEventListener('DOMContentLoaded', function() {
  const cardsContainer = document.querySelector('.cards-container');
  const cards = document.querySelector('.cards');

  if (cardsContainer && cards) {
    // Получаем ширину одной карточки с учетом gap
    function getCardWidth() {
      const card = cards.querySelector('.card');
      if (!card) return 0;

      const cardWidth = card.offsetWidth;
      const gap = parseInt(getComputedStyle(cards).gap) || 32;

      return cardWidth + gap;
    }


    // Обновляем состояние кнопок при прокрутке
    cardsContainer.addEventListener('scroll', updateButtons);

    // Начальная проверка состояния кнопок
    updateButtons();

    // Обработка колесика мыши для горизонтального скролла
    cardsContainer.addEventListener('wheel', function(e) {
      // Если зажат Shift, позволяем обычную вертикальную прокрутку
      if (e.shiftKey) return;

      e.preventDefault();

      // Конвертируем вертикальную прокрутку в горизонтальную
      const scrollAmount = e.deltaY * 2; // Увеличиваем чувствительность
      cardsContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }, { passive: false });

    // Поддержка перетаскивания мышью
    let isDragging = false;
    let startDragX = 0;
    let scrollStartX = 0;

    cardsContainer.addEventListener('mousedown', function(e) {
      isDragging = true;
      startDragX = e.clientX;
      scrollStartX = cardsContainer.scrollLeft;
      cardsContainer.style.cursor = 'grabbing';
      e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;

      const deltaX = e.clientX - startDragX;
      cardsContainer.scrollLeft = scrollStartX - deltaX;
      e.preventDefault();
    });

    document.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        cardsContainer.style.cursor = 'grab';
      }
    });

    // Предотвращаем выделение текста при перетаскивании и кликах
    cardsContainer.addEventListener('selectstart', function(e) {
      e.preventDefault();
    });

    cardsContainer.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    });

    // Предотвращаем выделение текста для всех дочерних элементов
    const allCardElements = cardsContainer.querySelectorAll('*');
    allCardElements.forEach(element => {
      element.addEventListener('selectstart', function(e) {
        e.preventDefault();
      });
    });

    // Поддержка тачпад жестов
    let isScrolling = false;
    let startX, startY;

    cardsContainer.addEventListener('touchstart', function(e) {
      isScrolling = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    cardsContainer.addEventListener('touchmove', function(e) {
      if (!startX || !startY) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = startX - currentX;
      const diffY = startY - currentY;

      // Определяем, является ли это горизонтальным скроллом
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 10) {
        e.preventDefault();
        isScrolling = true;

        cardsContainer.scrollBy({
          left: diffX,
          behavior: 'auto' // Используем auto для более плавного скролла пальцем
        });

        startX = currentX;
        startY = currentY;
      }
    }, { passive: false });

    // Обработка клавиш стрелок для навигации
    document.addEventListener('keydown', function(e) {
      // Проверяем, что фокус не в input или textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const scrollAmount = getCardWidth();

      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          cardsContainer.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
          });
          break;
        case 'ArrowRight':
          e.preventDefault();
          cardsContainer.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
          });
          break;
      }
    });

    // Обновляем при изменении размера окна
    window.addEventListener('resize', function() {
      // Обновление размеров при изменении окна браузера
    });
  }
});

// Функциональность бесконечной бегущей строки для блока popular
document.addEventListener('DOMContentLoaded', function() {
  const popularBlock = document.querySelector('.popular');

  // Создаем дублированный контент для бесконечной прокрутки только в диапазоне 361px-768px
  if (popularBlock && window.innerWidth <= 768 && window.innerWidth >= 361) {
    const shippingItems = Array.from(popularBlock.querySelectorAll('.shipping'));

    // Создаем 5 наборов клонов (5 * 4 = 20 клонов, итого 24 элемента)
    for (let i = 0; i < 5; i++) {
      shippingItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('shipping-clone');
        popularBlock.appendChild(clone);
      });
    }
  }
});

// Функциональность бургер-меню
document.addEventListener('DOMContentLoaded', function() {
  const burgerMenu = document.getElementById('burger-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  if (burgerMenu && mobileMenu) {
    // Переключение меню
    burgerMenu.addEventListener('click', function() {
      const isOpen = mobileMenu.style.display === 'flex';
      mobileMenu.style.display = isOpen ? 'none' : 'flex';

      // Переключение класса для анимации
      burgerMenu.classList.toggle('active');
    });

    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
      if (!burgerMenu.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.style.display = 'none';
        burgerMenu.classList.remove('active');
      }
    });

    // Закрытие меню при клике на ссылку
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.style.display = 'none';
        burgerMenu.classList.remove('active');
      });
    });
  }
});





