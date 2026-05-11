const page = {
  init() {
    this.cacheElements();
    this.bindEvents();
    this.startReveal();
    this.startCounters();
    this.startHeroParallax();
    this.fillDynamicYear();
  },

  cacheElements() {
    this.navToggle = document.querySelector('.nav-toggle');
    this.navLinks = document.querySelectorAll('.nav-links a');
    this.reveals = document.querySelectorAll('.reveal');
    this.counterItems = document.querySelectorAll('.impact-num');
    this.heroSection = document.querySelector('#hero');
    this.footerYear = document.querySelector('#current-year');
  },

  bindEvents() {
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => document.body.classList.toggle('nav-open'));
    }

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900 && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
      }
    });

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => document.body.classList.remove('nav-open'));
    });
  },

  startReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 0.04}s`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    this.reveals.forEach(el => observer.observe(el));
  },

  startCounters() {
    const threshold = 0.3;
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const endValue = parseInt(element.dataset.value, 10) || parseInt(element.textContent, 10);
        this.animateNumber(element, endValue, 1800);
        obs.unobserve(element);
      });
    }, { threshold });

    this.counterItems.forEach(item => counterObserver.observe(item));
  },

  animateNumber(element, endValue, duration) {
    const startValue = 0;
    const timestampStart = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - timestampStart) / duration, 1);
      const value = Math.floor(progress * endValue);
      element.textContent = value < endValue ? `${value}+` : `${endValue}+`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  },

  startHeroParallax() {
    if (!this.heroSection) return;

    this.heroSection.addEventListener('mousemove', (event) => {
      const rect = this.heroSection.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const card = this.heroSection.querySelector('.hero-card-stack');
      const background1 = this.heroSection.querySelector('.hero-bg-circle-1');
      const background2 = this.heroSection.querySelector('.hero-bg-circle-2');
      if (card) {
        card.style.transform = `translate3d(${x * 12}px, ${y * 10}px, 0)`;
      }
      if (background1) {
        background1.style.transform = `translate3d(${x * 20}px, ${y * 15}px, 0)`;
      }
      if (background2) {
        background2.style.transform = `translate3d(${x * -18}px, ${y * -12}px, 0)`;
      }
    });

    this.heroSection.addEventListener('mouseleave', () => {
      const card = this.heroSection.querySelector('.hero-card-stack');
      const background1 = this.heroSection.querySelector('.hero-bg-circle-1');
      const background2 = this.heroSection.querySelector('.hero-bg-circle-2');
      if (card) card.style.transform = '';
      if (background1) background1.style.transform = '';
      if (background2) background2.style.transform = '';
    });
  },

  fillDynamicYear() {
    if (this.footerYear) {
      this.footerYear.textContent = new Date().getFullYear();
    }
  },
};

document.addEventListener('DOMContentLoaded', () => page.init());
