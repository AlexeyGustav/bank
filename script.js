// Modal window

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);

const openModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function () {
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(button => button.addEventListener('click', openModalWindow))

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});

// Мягкое перемещение 
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1')

btnScrollTo.addEventListener('click', function (e)
{
  const section1Coords = section1.getBoundingClientRect();
  console.log(section1Coords);
  // нижнем консоле мы получим координаты для кнопки btnScrollTo
  console.log(e.target.getBoundingClientRect());
  console.log(
    'текущее прокручивание: x, y',
    window.pageXOffset,
    window.pageYOffset
  );
  console.log(
    'Ширина и высота viewport',
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
  );

  section1.scrollIntoView({ behavior: 'smooth'});

});

// 1.Добавляем Listener для общего родителя
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // 2.Определить target элемент
  console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    const href = e.target.getAttribute('href');
    console.log(href);
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
  }
}); 

// ///////// ВКЛАДКИ ///////////////////

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabContents = document.querySelectorAll('.operations__content');

tabContainer.addEventListener('click', function(e){
  const clickedButton = e.target;
  console.log(clickedButton);
  // Guard clause - Пункт охраны
  if (!clickedButton) return;

  // активная вкладка
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedButton.classList.add('operations__tab--active');

  // активный контент
  tabContents.forEach(content => content.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clickedButton.dataset.tab}`).classList.add('operations__content--active');
});

// /////////Анимация потускнения на панели навигации ///////////////

const nav = document.querySelector('.nav');

const navLinkHoverAnimation = function (e, opacity){
  if (e.target.classList.contains('nav__link')) {
    const linkOvner = e.target;
    const siblingLinks = linkOvner.closest('.nav__links').querySelectorAll('.nav__link');
    const logo = linkOvner.closest('.nav').querySelector('img');
    const logoText = linkOvner.closest('.nav').querySelector('.nav__text');

    siblingLinks.forEach(el => {
      if (el !== linkOvner) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
    logoText.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', function(e) {
  navLinkHoverAnimation(e, 0.4)
});

nav.addEventListener('mouseout', function(e) {
  navLinkHoverAnimation(e, 1)
});

// /////////Sticky navigation(прилепание хедера)//////Cпособ №1/////

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height;

const getStickyNav = function (entries) {
  const entry = entries[0];
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerObserver = new IntersectionObserver(getStickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);


//////////////////////// Появление частей сайта /////////////////////////////////

const allSections = document.querySelectorAll('.section');

const apperanceSection = function(entries, observer) {
  const entry = entries[0];
  // console.log('entry', entry);
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
};

const sectionObserver = new IntersectionObserver(apperanceSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});


////////////////// Имплементация Lazy loading для избражений ////////////////////////////////////

const lazyImages = document.querySelectorAll('img[data-src]');
// console.log(lazyImages)

const loadImages = function (entries, observer) {
  const entry = entries[0];
  // console.log(entry);

  if(!entry.isIntersecting) return;

  // Меняем изображение на изображение с высоким разрешением
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};


const lazyImagesObserver = new IntersectionObserver (loadImages, {
  root: null,
  threshold: 0.7,
  rootMargin: '300px',
});
lazyImages.forEach(image => lazyImagesObserver.observe(image));


/////////////////////////////////////// СЛАЙДЕР //////////////////////////////////////////////////////

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots')

let currentSlide = 0;
const slideNumber = slides.length;

const createDots = function () {
  slides.forEach(function (_, index) {
    dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${index}"></button>`);
  });
};

createDots();

const activateCurrentDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'))
  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active')
}

activateCurrentDot(0);

const moveToSlide = function(slide) {
  slides.forEach(
    (s, index) =>
      (s.style.transform = `translateX(${(index - slide) * 100}%)`)
  );
}

moveToSlide(0);

slides.forEach(
  (slide, index) => (slide.style.transform = `translateX(${index * 100}%)`)
  // 1 - 0%; 2 - 100%, 3 - 200%; 4 - 300%
);

const nextSlide = function() {
  if(currentSlide === slideNumber - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  // 1 - -100%; 2 - 0%, 3 - 100%; 4 - 200%
  activateCurrentDot(currentSlide);
}

const previousSlide = function() {
  if(currentSlide === 0) {
    currentSlide = slideNumber - 1;
  } else {
    currentSlide--;
  }

  moveToSlide(currentSlide);
  // 1 - -100%; 2 - 0%, 3 - 100%; 4 - 200%
  activateCurrentDot(currentSlide);
}

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

document.addEventListener('keydown', function(e) {
  // console.log(e)
  if(e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') previousSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    moveToSlide(slide)
    activateCurrentDot(slide);
  };
});


/////////////////////Life cicle DOM Events///////////////////

document.addEventListener('DOMContentLoaded', function(e) {
  console.log('Деровево DOM загружено');
});

window.addEventListener('load', function (e){
  console.log('Страница полностью загружена', e);
});

window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
})