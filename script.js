class Carousel {
    constructor() {
    this.SLIDES_COUNT = 5;
    this.CODE_ARROW_LEFT = 'ArrowLeft';
    this.CODE_ARROW_RIGHT = 'ArrowRight';
    this.CODE_SPACE = ' ';
    this.TIMER_INTERVAL = 2000;

    this.currentSlide = 0;
    this.isPlaying = true;
    this.timerId = null;
    this.swipeStartX = 0;
    this.swipeEndX = 0;

    this.slides = document.querySelectorAll('.slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.pauseBtn = document.querySelector('.pause-btn');
    this.slidesContainer = document.querySelector('.slides');
    this.container = document.querySelector('#carousel');
    this.playIcon = document.querySelector('.play-icon');
    this.pauseIcon = document.querySelector('.pause-icon');

    this.init();
}

  goToSlide(n) {
    this.slides[this.currentSlide].classList.remove('active');
    this.indicators[this.currentSlide].classList.remove('active');

    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;

    this.slides[this.currentSlide].classList.add('active');
    this.indicators[this.currentSlide].classList.add('active');
  }

  nextSlide() {
    this.goToSlide(this.currentSlide + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentSlide - 1);
  }

  pause() {
    this.isPlaying = false;
    clearInterval(this.timerId);
    this.playIcon.classList.remove('hidden');
    this.pauseIcon.classList.add('hidden');
  }

  play() {
    this.isPlaying = true;
    this.timerId = setInterval(this.nextSlide.bind(this), this.TIMER_INTERVAL);
    this.playIcon.classList.add('hidden');
    this.pauseIcon.classList.remove('hidden');
  }

  pausePlayHandler() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  nextHandler() {
    this.pause();
    this.nextSlide();
  }

  prevHandler() {
    this.pause();
    this.prevSlide();
  }

  indicatorClickHandler(e) {
    const target = e.target;
    if (target.classList.contains('indicator')) {
      this.pause();
      this.goToSlide(Number(target.dataset.slideTo));
    }
  }

  keydownHandler(e) {
    switch (e.code) {
      case this.CODE_ARROW_LEFT:
        e.preventDefault();
        this.prevHandler();
        break;
      case this.CODE_ARROW_RIGHT:
        e.preventDefault();
        this.nextHandler();
        break;
      case 'Space':
      case this.CODE_SPACE:
        e.preventDefault();
        this.pausePlayHandler();
        break;
    }
  }

  swipeStart(e) {
    this.swipeStartX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
  }

  swipeEnd(e) {
    this.swipeEndX = e instanceof TouchEvent ? e.changedTouches[0].clientX : e.clientX;
    const diff = this.swipeEndX - this.swipeStartX;

    if (diff > 100) this.prevHandler();
    else if (diff < -100) this.nextHandler();
  }

  initSwipeEvents() {
    this.container.addEventListener('touchstart', this.swipeStart.bind(this), { passive: true });
    this.slidesContainer.addEventListener('mousedown', this.swipeStart.bind(this));
    this.container.addEventListener('touchend', this.swipeEnd.bind(this));
    this.slidesContainer.addEventListener('mouseup', this.swipeEnd.bind(this));
  }

  init() {
    this.timerId = setInterval(this.nextSlide.bind(this), this.TIMER_INTERVAL);

    this.pauseBtn.addEventListener('click', this.pausePlayHandler.bind(this));
    this.nextBtn.addEventListener('click', this.nextHandler.bind(this));
    this.prevBtn.addEventListener('click', this.prevHandler.bind(this));

    document
      .querySelector('.indicators-container')
      .addEventListener('click', this.indicatorClickHandler.bind(this));

    document.addEventListener('keydown', this.keydownHandler.bind(this));

    
    this.initSwipeEvents();
}
}

const carousel = new Carousel();
