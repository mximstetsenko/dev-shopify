(() => {
  document.addEventListener('DOMContentLoaded', () => {
    // Example: simple focus style helper; replace with real modules later
    const body = document.body;
    function handleFirstTab(e) {
      if (e.key === 'Tab') {
        body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }
    window.addEventListener('keydown', handleFirstTab);
  });
})();


