document.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.header__burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = mobileMenu ? mobileMenu.querySelector('.mobile-menu__overlay') : null;
  const closeButtons = mobileMenu ? mobileMenu.querySelectorAll('[data-mobile-menu-close]') : [];
  const navLinks = mobileMenu ? mobileMenu.querySelectorAll('.mobile-menu__nav a') : [];
  const desktopMenu = document.querySelector('.header__menu');
  const desktopLinks = desktopMenu ? Array.from(desktopMenu.querySelectorAll('a')) : [];
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  let focusableElements = [];
  let previouslyFocusedElement = null;

  function openMenu() {
    if (!mobileMenu) return;
    if (mobileMenu.classList.contains('mobile-menu--open')) return;

    previouslyFocusedElement = document.activeElement;

    mobileMenu.classList.add('mobile-menu--open');
    document.body.classList.add('mobile-menu-open');

    if (burgerButton) {
      burgerButton.classList.add('header__burger--active');
      burgerButton.setAttribute('aria-expanded', 'true');
    }

    mobileMenu.setAttribute('aria-hidden', 'false');

    focusableElements = Array.from(mobileMenu.querySelectorAll(focusableSelectors));
    if (focusableElements.length) {
      focusableElements[0].focus({ preventScroll: true });
    }

    document.addEventListener('keydown', handleKeydown);
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('mobile-menu--open');
    document.body.classList.remove('mobile-menu-open');

    if (burgerButton) {
      burgerButton.classList.remove('header__burger--active');
      burgerButton.setAttribute('aria-expanded', 'false');
    }

    mobileMenu.setAttribute('aria-hidden', 'true');

    document.removeEventListener('keydown', handleKeydown);
    if (previouslyFocusedElement && previouslyFocusedElement.focus) {
      previouslyFocusedElement.focus({ preventScroll: true });
    }
  }

  function handleKeydown(evt) {
    if (evt.key === 'Escape') {
      closeMenu();
      return;
    }

    if (evt.key !== 'Tab' || focusableElements.length === 0) {
      return;
    }

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];
    const isShift = evt.shiftKey;

    if (!isShift && document.activeElement === lastEl) {
      evt.preventDefault();
      firstEl.focus();
    } else if (isShift && document.activeElement === firstEl) {
      evt.preventDefault();
      lastEl.focus();
    }
  }

  if (burgerButton && mobileMenu) {
    burgerButton.addEventListener('click', openMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  if (closeButtons && closeButtons.length) {
    closeButtons.forEach((btn) => btn.addEventListener('click', closeMenu));
  }

  if (navLinks && navLinks.length) {
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  }

  function initDesktopMenuGlider() {
    if (!desktopMenu || !desktopLinks.length) return;

    let glider = desktopMenu.querySelector('.header__menu-glider');
    if (!glider) {
      glider = document.createElement('span');
      glider.className = 'header__menu-glider';
      desktopMenu.appendChild(glider);
    }

    const mq = window.matchMedia('(max-width: 1100px)');

    const setGlider = (target) => {
      if (!target || mq.matches) return;
      const rect = target.getBoundingClientRect();
      const menuRect = desktopMenu.getBoundingClientRect();
      const offsetX = rect.left - menuRect.left;

      glider.style.width = `${rect.width + 8}px`;
      glider.style.transform = `translate3d(${offsetX - 4}px, -50%, 0)`;
      glider.classList.add('is-active');
    };

    const resetGlider = () => {
      glider.classList.remove('is-active');
    };

    const handleEnter = (event) => {
      const target = event.currentTarget;
      setGlider(target);
    };

    desktopLinks.forEach((link) => {
      link.addEventListener('pointerenter', handleEnter);
      link.addEventListener('focus', handleEnter);
    });

    desktopMenu.addEventListener('pointerleave', resetGlider);
    desktopMenu.addEventListener('blur', (evt) => {
      if (!desktopMenu.contains(evt.relatedTarget)) {
        resetGlider();
      }
    }, true);

    mq.addEventListener('change', (event) => {
      if (event.matches) {
        glider.classList.remove('is-active');
      }
    });
  }

  initDesktopMenuGlider();
});


