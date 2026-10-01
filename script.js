document.addEventListener('DOMContentLoaded', () => {

  // 1. LOADER HIGH-TECH
  const loader = document.getElementById('loader');
  const loaderWord = document.getElementById('loader-word');
  const words = ['INNOVATION', 'PERFORMANCE', 'VENTES', 'RICODEV'];
  let wordIdx = 0;

  const wordInterval = setInterval(() => {
    wordIdx = (wordIdx + 1) % words.length;
    if (loaderWord) loaderWord.textContent = words[wordIdx];
  }, 300);

  window.addEventListener('load', () => {
    setTimeout(() => {
      clearInterval(wordInterval);
      if (loader) loader.classList.add('hidden');
    }, 800);
  });

  // 2. TOGGLE THÈME SOMBRE / CLAIR
  const themeToggle = document.getElementById('themeToggle');
  const htmlTag = document.documentElement;

  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlTag.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlTag.setAttribute('data-theme', newTheme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  });

  // 3. CONVERTISSEUR DE DEVISE & TAUX EN DIRECT
  const rates = { XOF: 1, EUR: 0.0015, USD: 0.0016, CAD: 0.0022 };
  const symbols = { XOF: 'FCFA', EUR: '€', USD: '$', CAD: '$' };
  const currencySelect = document.getElementById('currencySelect');

  function convertAndFormat(amountInXOF, targetCurrency) {
    const rate = rates[targetCurrency] || 1;
    const converted = amountInXOF * rate;
    
    if (targetCurrency === 'XOF') {
      return `${Math.round(converted).toLocaleString('fr-FR')} FCFA`;
    }
    return `${converted.toFixed(2)} ${symbols[targetCurrency]}`;
  }

  function updateAllPrices() {
    const curr = currencySelect.value;
    document.querySelectorAll('.price-val').forEach(el => {
      const xofVal = parseFloat(el.getAttribute('data-xof'));
      if (!isNaN(xofVal)) {
        el.innerHTML = convertAndFormat(xofVal, curr);
      }
    });
    updateEstimator();
  }

  currencySelect.addEventListener('change', updateAllPrices);

  // 4. SIMULATEUR DE DEVIS DYNAMIQUE
  const basePrices = { vitrine: 100000, catalogue: 180000 };
  const radioOptions = document.querySelectorAll('input[name="projectType"]');
  const checkboxOptions = document.querySelectorAll('.checkbox-grid input[type="checkbox"]');
  
  const basePriceDisplay = document.getElementById('basePriceDisplay');
  const optionsPriceDisplay = document.getElementById('optionsPriceDisplay');
  const totalPriceDisplay = document.getElementById('totalPriceDisplay');

  function updateEstimator() {
    const selectedType = document.querySelector('input[name="projectType"]:checked').value;
    const baseVal = basePrices[selectedType];
    
    let optionsVal = 0;
    checkboxOptions.forEach(cb => {
      if (cb.checked) optionsVal += parseFloat(cb.value);
    });

    const totalVal = baseVal + optionsVal;
    const curr = currencySelect.value;

    basePriceDisplay.textContent = convertAndFormat(baseVal, curr);
    optionsPriceDisplay.textContent = convertAndFormat(optionsVal, curr);
    totalPriceDisplay.textContent = convertAndFormat(totalVal, curr);

    // Mise à jour de l'état visuel des cartes radio
    document.querySelectorAll('.radio-card').forEach(card => {
      const input = card.querySelector('input');
      card.classList.toggle('active', input.checked);
    });
  }

  radioOptions.forEach(r => r.addEventListener('change', updateEstimator));
  checkboxOptions.forEach(c => c.addEventListener('change', updateEstimator));

  // Envoi Devis sur WhatsApp
  const btnSendQuoteWhatsApp = document.getElementById('btnSendQuoteWhatsApp');
  btnSendQuoteWhatsApp.addEventListener('click', () => {
    const selectedType = document.querySelector('input[name="projectType"]:checked').value === 'vitrine' ? 'Site Vitrine Essentiel' : 'Catalogue Web WhatsApp Pro';
    
    let opts = [];
    checkboxOptions.forEach(cb => {
      if (cb.checked) {
        opts.push(cb.parentElement.textContent.trim());
      }
    });

    const totalText = totalPriceDisplay.textContent;
    let msg = `Bonjour RICOdev ! J'ai effectué un devis sur votre site :\n\n`;
    msg += `• Projet : ${selectedType}\n`;
    msg += `• Options : ${opts.length > 0 ? opts.join(', ') : 'Aucune'}\n`;
    msg += `• Total Estimé : ${totalText}\n\n`;
    msg += `Je souhaite en discuter et adapter le tarif selon mon budget !`;

    window.open(`https://wa.me/2250508214483?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // 5. QUIZ DIAGNOSTIC INTERACTIF
  let quizScore = 0;
  const quizSteps = [
    document.getElementById('quizStep1'),
    document.getElementById('quizStep2'),
    document.getElementById('quizStep3')
  ];
  const quizResult = document.getElementById('quizResult');

  document.querySelectorAll('.btn-quiz-opt').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const score = parseInt(e.target.getAttribute('data-score'));
      quizScore += score;

      const currentStep = quizSteps.find(step => step.classList.contains('active'));
      const currentIndex = quizSteps.indexOf(currentStep);

      currentStep.classList.remove('active');

      if (currentIndex + 1 < quizSteps.length) {
        quizSteps[currentIndex + 1].classList.add('active');
      } else {
        quizResult.classList.add('active');
      }
    });
  });

  document.getElementById('btnQuizWhatsApp').addEventListener('click', () => {
    const msg = `Bonjour RICOdev ! J'ai passé le test de diagnostic (Score: ${quizScore}/9). Mon entreprise a besoin d'un Catalogue WhatsApp pour automatiser ses ventes !`;
    window.open(`https://wa.me/2250508214483?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // 6. FAQ AVEC RECHERCHE EN DIRECT
  const faqSearchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  faqSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    faqItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      const keywords = item.getAttribute('data-keywords') || '';
      
      if (text.includes(query) || keywords.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });

  // 7. MODAL QR CODE DÉMO
  const qrModal = document.getElementById('qrModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalQrCodeImg = document.getElementById('modalQrCodeImg');

  document.querySelectorAll('.btn-qr-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const link = btn.getAttribute('data-link');
      modalQrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
      qrModal.classList.add('active');
    });
  });

  btnCloseModal.addEventListener('click', () => {
    qrModal.classList.remove('active');
  });

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.classList.remove('active');
  });

  // 8. POPUP SOCIAL PROOF DISCRÈTE
  const socialProofToast = document.getElementById('socialProofToast');
  const toastClientName = document.getElementById('toastClientName');
  const toastActionText = document.getElementById('toastActionText');

  const notifications = [
    { name: 'Kévin M. (Abidjan)', action: 'vient de commander le Pack Catalogue Pro !' },
    { name: 'Awa T. (Bouaké)', action: 'a effectué une simulation de devis.' },
    { name: 'Marc A. (San-Pédro)', action: 'a validé un Pack Vitrine Essentiel.' }
  ];

  let notifIndex = 0;

  function showToast() {
    const currentNotif = notifications[notifIndex];
    toastClientName.textContent = currentNotif.name;
    toastActionText.textContent = currentNotif.action;

    socialProofToast.classList.add('active');

    setTimeout(() => {
      socialProofToast.classList.remove('active');
    }, 4000);

    notifIndex = (notifIndex + 1) % notifications.length;
  }

  // Première notification après 5 secondes, puis répétition toutes les 20 secondes
  setTimeout(() => {
    showToast();
    setInterval(showToast, 20000);
  }, 5000);

  // Initialisation du simulateur
  updateEstimator();
});
