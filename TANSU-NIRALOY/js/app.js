/**
 * ==========================================================================
 * TANSU NIRALOY - APPLICATION BOOTSTRAPPER
 * Pure Vanilla JavaScript
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // Determine current active page tag from body data attribute
  const activePage = document.body.getAttribute("data-page") || "";

  // Mount common layout components
  if (typeof Components !== "undefined") {
    Components.mountHeader(activePage);
    Components.mountFooter();
  }

  // Header scroll shadow effect
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".site-header");
    if (header) {
      if (window.scrollY > 20) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
  });
});
