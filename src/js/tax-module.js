import { taxModes } from './data.js';
import { getLanguage, tr } from './i18n.js';
import { renderSource } from './source-renderer.js';

let renderCurrentTaxLanguage = null;

export function initTaxModule() {
  if (renderCurrentTaxLanguage) {
    renderCurrentTaxLanguage();
    return;
  }

  const tabContainer = document.getElementById('tax-mode-tabs');
  const articleContainer = document.getElementById('tax-article');
  const resultContainer = document.getElementById('tax-results');
  const form = document.getElementById('tax-form');
  const modeSelect = document.getElementById('tax-mode-select');
  const rentInput = document.getElementById('monthly-rent');
  const periodInput = document.getElementById('rent-period');
  const extraInput = document.getElementById('extra-income');

  if (!tabContainer || !articleContainer || !resultContainer || !form || !modeSelect || !rentInput || !periodInput || !extraInput) {
    return;
  }

  let hasCalculated = false;
  let hasValidationError = false;
  const validationMessage = 'Салық сомасын анықтау үшін жалдау ақысы, мерзім және режимін енгізу қажет.';
  const amountTooLargeMessage = 'Енгізілген сомалар тым үлкен. Енгізілген сандарды тексеріңіз.';

  const showMode = (modeId) => {
    const selected = taxModes.find((mode) => mode.id === modeId) || taxModes[0];
    articleContainer.innerHTML = `
      <h3>${tr(selected.title)}</h3>
      <p>${tr(selected.description)}</p>
      <p class="mono">${tr('Дереккөз:')} ${renderSource(selected.source)}</p>
    `;
  };

  const renderTabs = () => {
    const selectedMode = modeSelect.value || 'overview';
    tabContainer.innerHTML = taxModes.map((mode) => `
      <button class="tax-mode-tab ${mode.id === selectedMode ? 'active' : ''}" type="button" data-mode-id="${mode.id}" aria-pressed="${mode.id === selectedMode}">
        ${tr(mode.title)}
      </button>
    `).join('');

    tabContainer.querySelectorAll('.tax-mode-tab').forEach((button) => {
      button.addEventListener('click', () => {
        const selected = button.dataset.modeId;
        modeSelect.value = selected === 'overview' ? '' : selected;
        tabContainer.querySelectorAll('.tax-mode-tab').forEach((tab) => {
          const active = tab === button;
          tab.classList.toggle('active', active);
          tab.setAttribute('aria-pressed', String(active));
        });
        showMode(selected);
      });
    });

    const selectedArticle = taxModes.find((mode) => mode.id === selectedMode) || taxModes[0];
    showMode(selectedArticle.id);
  };

  const showValidationError = (message, field) => {
    hasValidationError = true;
    resultContainer.dataset.errorMessage = message;
    resultContainer.setAttribute('role', 'alert');
    resultContainer.innerHTML = `<p>${tr(message)}</p>`;
    field?.focus();
  };

  const calculateIncome = () => {
    const monthlyRent = Number(rentInput.value);
    const months = Number(periodInput.value);
    const extraIncome = extraInput.value === '' ? 0 : Number(extraInput.value);

    if (!Number.isFinite(monthlyRent) || monthlyRent <= 0) {
      showValidationError(validationMessage, rentInput);
      hasCalculated = false;
      return;
    }
    if (!Number.isInteger(months) || months < 1) {
      showValidationError(validationMessage, periodInput);
      hasCalculated = false;
      return;
    }
    if (!Number.isFinite(extraIncome) || extraIncome < 0) {
      showValidationError(validationMessage, extraInput);
      hasCalculated = false;
      return;
    }
    if (!modeSelect.value) {
      showValidationError(validationMessage, modeSelect);
      hasCalculated = false;
      return;
    }

    const locale = getLanguage() === 'kk' ? 'kk-KZ' : getLanguage() === 'ru' ? 'ru-KZ' : 'en-KZ';
    const totalIncome = monthlyRent * months + extraIncome;
    if (!Number.isFinite(totalIncome)) {
      showValidationError(amountTooLargeMessage, rentInput);
      hasCalculated = false;
      return;
    }

    const currency = (amount) => `${amount.toLocaleString(locale)} ${tr('теңге')}`;
    resultContainer.removeAttribute('role');
    delete resultContainer.dataset.errorMessage;
    hasValidationError = false;
    resultContainer.innerHTML = `
      <h4>${tr('Есептелген кіріс')}</h4>
      <p>${tr('Бір айлық жалдау ақысы:')} ${currency(monthlyRent)}</p>
      <p>${tr('Жалдау мерзімі:')} ${months} ${tr('ай')}</p>
      <p>${tr('Қосымша табыс:')} ${currency(extraIncome)}</p>
      <p><strong>${tr('Жалпы табыс:')} ${currency(totalIncome)}</strong></p>
      <p>${tr('Бұл ақпараттық есептеу. Нақты салық міндеттемесінің анықтамасы режимді, табыс көзі мен ресми дереккөздердің актуалдығын ескере отырып жүргізіледі.')}</p>
      <p class="mono">${tr('Дереккөз:')} ${renderSource({ documentId: 'tax', articles: '718–720' })}</p>
    `;
    hasCalculated = true;
  };

  modeSelect.addEventListener('change', () => {
    const selected = modeSelect.value || 'overview';
    tabContainer.querySelectorAll('.tax-mode-tab').forEach((tab) => {
      const active = tab.dataset.modeId === selected;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-pressed', String(active));
    });
    showMode(selected);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    calculateIncome();
  });

  renderCurrentTaxLanguage = () => {
    renderTabs();
    if (hasCalculated) {
      calculateIncome();
    } else if (hasValidationError) {
      const currentMessage = resultContainer.dataset.errorMessage || validationMessage;
      resultContainer.innerHTML = `<p>${tr(currentMessage)}</p>`;
    }
  };
  window.addEventListener('rentsafe:languagechange', renderCurrentTaxLanguage);
  renderCurrentTaxLanguage();
}
