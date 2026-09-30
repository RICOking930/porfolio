// Mots défilants dans l'écran de chargement
const words = ["DESIGN", "PERFORMANCE", "RICOdev"];
let index = 0;
const wordElement = document.getElementById('loader-word');

const wordInterval = setInterval(() => {
  index = (index + 1) % words.length;
  if (wordElement) {
    wordElement.textContent = words[index];
  }
}, 450);

// Disparition du loader au chargement complet
window.addEventListener('load', () => {
  setTimeout(() => {
    clearInterval(wordInterval);
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('fade-out');
    }
  }, 1600);
});

// Apparition automatique de la bulle WhatsApp après 4 secondes
setTimeout(() => {
  const waPopup = document.getElementById('waPopup');
  if (waPopup) {
    waPopup.classList.add('show');
  }
}, 4000);