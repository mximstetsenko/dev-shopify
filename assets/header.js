document.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.header__burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuHeader = mobileMenu ? mobileMenu.querySelector('.mobile-menu__header') : null;
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
  const burgerOriginalParent = burgerButton ? burgerButton.parentElement : null;
  const burgerOriginalNextSibling = burgerButton ? burgerButton.nextElementSibling : null;
  const burgerOpenLabel = burgerButton ? burgerButton.getAttribute('aria-label') || 'Open menu' : 'Open menu';
  const burgerCloseLabel = burgerButton
    ? burgerButton.getAttribute('data-close-label') || 'Close menu'
    : 'Close menu';

  function moveBurgerToMenuHeader() {
    if (!burgerButton || !mobileMenuHeader) return;
    if (mobileMenuHeader.contains(burgerButton)) return;
    mobileMenuHeader.prepend(burgerButton);
    burgerButton.classList.add('header__burger--in-menu');
    burgerButton.setAttribute('aria-label', burgerCloseLabel);
  }

  function restoreBurgerPosition() {
    if (!burgerButton || !burgerOriginalParent) return;
    if (burgerButton.parentElement === burgerOriginalParent) return;

    if (burgerOriginalNextSibling && burgerOriginalParent.contains(burgerOriginalNextSibling)) {
      burgerOriginalParent.insertBefore(burgerButton, burgerOriginalNextSibling);
    } else {
      burgerOriginalParent.insertBefore(burgerButton, burgerOriginalParent.firstChild);
    }

    burgerButton.classList.remove('header__burger--in-menu');
    burgerButton.setAttribute('aria-label', burgerOpenLabel);
  }

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
    moveBurgerToMenuHeader();

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
    restoreBurgerPosition();

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
    burgerButton.addEventListener('click', () => {
      if (mobileMenu.classList.contains('mobile-menu--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
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

    const getActiveLink = () =>
      desktopLinks.find(
        (link) =>
          link.classList.contains('header__menu-link--active') ||
          link.getAttribute('aria-current') === 'page'
      );

    let gliderCurrentLink = null;

    const setGliderLink = (target) => {
      if (gliderCurrentLink === target) return;

      if (gliderCurrentLink) {
        gliderCurrentLink.classList.remove('header__menu-link--glider-active');
      }

      gliderCurrentLink = target || null;

      if (gliderCurrentLink) {
        gliderCurrentLink.classList.add('header__menu-link--glider-active');
      }
    };

    const setGlider = (target) => {
      if (!target || mq.matches) return;
      const rect = target.getBoundingClientRect();
      const menuRect = desktopMenu.getBoundingClientRect();
      const offsetX = rect.left - menuRect.left;

      glider.style.width = `${rect.width + 8}px`;
      glider.style.transform = `translate3d(${offsetX - 4}px, -50%, 0)`;
      glider.classList.add('is-active');
      setGliderLink(target);
    };

    const hideGlider = () => {
      glider.classList.remove('is-active');
      glider.style.removeProperty('width');
      glider.style.removeProperty('transform');
      setGliderLink(null);
    };

    const handleEnter = (event) => {
      const target = event.currentTarget;
      setGlider(target);
    };

    const syncActiveLink = () => {
      if (mq.matches) {
        hideGlider();
        return;
      }

      const activeLink = getActiveLink();
      if (activeLink) {
        setGlider(activeLink);
      } else {
        hideGlider();
      }
    };

    desktopLinks.forEach((link) => {
      link.addEventListener('pointerenter', handleEnter);
      link.addEventListener('focus', handleEnter);
    });

    desktopMenu.addEventListener('pointerleave', syncActiveLink);
    desktopMenu.addEventListener('blur', (evt) => {
      if (!desktopMenu.contains(evt.relatedTarget)) {
        syncActiveLink();
      }
    }, true);

    syncActiveLink();

    mq.addEventListener('change', (event) => {
      if (event.matches) {
        hideGlider();
        return;
      }

      syncActiveLink();
    });

    window.addEventListener('resize', syncActiveLink);
  }

  initDesktopMenuGlider();
});


