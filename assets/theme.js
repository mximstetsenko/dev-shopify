(() => {
  // src/js/index.js
  (() => {
    document.addEventListener("DOMContentLoaded", () => {
      const body = document.body;
      function handleFirstTab(e) {
        if (e.key === "Tab") {
          body.classList.add("user-is-tabbing");
          window.removeEventListener("keydown", handleFirstTab);
        }
      }
      window.addEventListener("keydown", handleFirstTab);
    });
  })();
})();
//# sourceMappingURL=theme.js.map
