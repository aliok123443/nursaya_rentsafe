import { docCards, rights, duties, legalTopics, scenarios, glossary, templates, checklistData } from './data.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initChecklist, updateDashboard, getChecklistState } from './checklist.js';
import { initTaxModule } from './tax-module.js';
import { initLanguageSelector, tr } from './i18n.js';
import { renderSource } from './source-renderer.js';
import { readChecklistState, setChecklistItem } from './checklist-state.mjs';

let modalTrigger = null;

function openModal(title, htmlContent) {
  const modal = document.getElementById('info-modal');
  const modalContent = document.getElementById('modal-content');
  if (!modal || !modalContent) return;

  modalTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  modalContent.innerHTML = `
    <h3 id="modal-title">${title}</h3>
    <div class="modal-content">${htmlContent}</div>
  `;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  modal.querySelector('.modal-close')?.focus();
}

function closeModal() {
  const modal = document.getElementById('info-modal');
  if (!modal) return;
  const wasOpen = modal.classList.contains('is-open');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (wasOpen && modalTrigger?.isConnected) modalTrigger.focus();
  modalTrigger = null;
}

function renderDocGrid() {
  const grid = document.getElementById('doc-grid');
  if (!grid) return;

  grid.innerHTML = docCards.map((item) => `
    <article class="doc-card">
      <span class="mono">${tr(item.purpose)}</span>
      <h3>${tr(item.title)}</h3>
      <p>${tr(item.use)}</p>
      <p><strong>${tr('Ескерту:')}</strong> ${tr(item.notes)}</p>
      <p class="mono">${tr('Дереккөз:')} ${renderSource(item.source)}</p>
    </article>
  `).join('');
}

function renderRights() {
  const rightsList = document.getElementById('rights-list');
  const dutiesList = document.getElementById('duties-list');
  if (rightsList) {
    rightsList.innerHTML = rights.map((item) => `<li>${tr(item)}</li>`).join('');
  }
  if (dutiesList) {
    dutiesList.innerHTML = duties.map((item) => `<li>${tr(item)}</li>`).join('');
  }
}

function renderExplorer() {
  const explorer = document.getElementById('explorer-layout');
  if (!explorer) return;

  explorer.innerHTML = `
    <div class="explorer-list">
      ${legalTopics.map((topic) => `
        <button class="explorer-item" type="button" data-topic-id="${topic.id}">
          <span class="mono">${tr(topic.title)}</span>
          <p>${tr(topic.summary)}</p>
        </button>
      `).join('')}
    </div>
    <div class="explorer-panel" id="explorer-panel">
      <h3>${tr(legalTopics[0].title)}</h3>
      <p>${tr(legalTopics[0].detail)}</p>
      <ul>
        <li>${tr('Құқықтар: мүліктің заңды пайдаланылуы, келісім, есептеме.')}</li>
        <li>${tr('Міндеттемелер: құжаттар, нәтиже және жауапкершілік.')}</li>
        <li>${tr('Дереккөз:')} ${renderSource(legalTopics[0].source)}</li>
      </ul>
    </div>
  `;

  explorer.querySelectorAll('.explorer-item').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = legalTopics.find((topic) => topic.id === button.dataset.topicId) || legalTopics[0];
      const panel = document.getElementById('explorer-panel');
      if (!panel) return;
      panel.innerHTML = `
        <h3>${tr(selected.title)}</h3>
        <p>${tr(selected.detail)}</p>
        <ul>
          <li>${tr('Қолдану:')} ${tr(selected.summary)}</li>
          <li>${tr('Негізгі құқықтар: мүлік, келісім, есеп және қорғау.')}</li>
          <li>${tr('Негізгі міндеттемелер: ақпарат, есеп, құқықтар мен ережелер.')}</li>
          <li>${tr('Дереккөз:')} ${renderSource(selected.source)}</li>
        </ul>
      `;
    });
  });
}

function renderScenarios() {
  const list = document.getElementById('scenario-list');
  const detail = document.getElementById('scenario-detail');
  if (!list || !detail) return;

  list.innerHTML = scenarios.map((scenario, index) => `
    <button class="scenario-card ${index === 0 ? 'active' : ''}" type="button" data-scenario-id="${scenario.id}" aria-pressed="${index === 0}">
      <h3>${tr(scenario.title)}</h3>
    </button>
  `).join('');

  const renderScenario = (id) => {
    const scenario = scenarios.find((item) => item.id === id) || scenarios[0];
    detail.innerHTML = `
      <h3>${tr(scenario.title)}</h3>
      <ul>
        ${scenario.steps.map((step) => `<li>${tr(step)}</li>`).join('')}
      </ul>
      <p class="source-note">${tr('Құқықтық бағдар:')} ${renderSource(scenario.source)}</p>
    `;
  };

  list.querySelectorAll('.scenario-card').forEach((card) => {
    card.addEventListener('click', () => {
      list.querySelectorAll('.scenario-card').forEach((item) => {
        const active = item === card;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      renderScenario(card.dataset.scenarioId);
    });
  });

  renderScenario(scenarios[0].id);
}

function renderGlossary() {
  const grid = document.getElementById('glossary-grid');
  if (!grid) return;

  grid.innerHTML = glossary.map((entry) => `
    <button class="glossary-item" type="button" data-term="${entry.term}" data-definition="${entry.meaning}">
      <span class="mono">${tr(entry.term)}</span>
      <p>${tr(entry.meaning)}</p>
    </button>
  `).join('');

  grid.querySelectorAll('.glossary-item').forEach((item) => {
    item.addEventListener('click', () => {
      const title = tr(item.dataset.term || '');
      const description = tr(item.dataset.definition || '');
      openModal(title, `
        <p>${description}</p>
        <p>${tr('Қарапайым тілмен айтқанда')}</p>
      `);
    });
  });
}

function renderDocCenter() {
  const grid = document.getElementById('doc-center-grid');
  if (!grid) return;

  grid.innerHTML = templates.map((template) => `
    <article class="doc-template">
      <span class="mono">${tr(template.title)}</span>
      <p>${tr(template.description)}</p>
      <p class="mono">${tr('Дереккөз:')} ${renderSource(template.source)}</p>
    </article>
  `).join('');
}

function renderProductPreview(state = getChecklistState()) {
  const list = document.getElementById('product-preview-list');
  if (!list) return;

  const items = checklistData.flatMap((category) => category.items).slice(0, 3);
  const completed = checklistData.flatMap((category) => category.items)
    .filter((item) => state[item.id]).length;
  const total = checklistData.reduce((sum, category) => sum + category.items.length, 0);
  const count = document.getElementById('preview-progress-count');
  const bar = document.getElementById('preview-progress-bar');
  const progress = bar?.parentElement;

  if (count) count.textContent = `${completed}/${total}`;
  if (bar) bar.style.width = `${total ? (completed / total) * 100 : 0}%`;
  progress?.setAttribute('aria-valuemax', String(total));
  progress?.setAttribute('aria-valuenow', String(completed));
  list.innerHTML = items.map((item) => `
    <a class="product-preview-row ${state[item.id] ? 'is-complete' : ''}" href="#checklist-${item.id}">
      <span class="preview-check" aria-hidden="true">
        ${state[item.id] ? '<svg viewBox="0 0 20 20"><path d="m4 10 4 4 8-8" /></svg>' : ''}
      </span>
      <span>${tr(item.text)}</span>
      <svg class="preview-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M10 5l5 5-5 5" /></svg>
    </a>
  `).join('');
}

function bindModal() {
  const modal = document.getElementById('info-modal');
  if (!modal) return;

  modal.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && (target.dataset.close === 'true' || target.classList.contains('modal-close'))) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!modal.classList.contains('is-open')) return;

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

function bindHandover() {
  const list = document.getElementById('handover-list');
  const count = document.getElementById('handover-count');
  if (!list || !count) return;

  const items = [
    { id: 'condition', label: 'Пәтердің жағдайы' },
    { id: 'furniture', label: 'Жиһаз' },
    { id: 'appliances', label: 'Тұрмыстық техника' },
    { id: 'keys', label: 'Кілттер' },
    { id: 'meters', label: 'Есептегіш көрсеткіштері' },
    { id: 'defects', label: 'Бұрыннан бар ақаулар' },
    { id: 'photos', label: 'Фотофиксация' },
    { id: 'notes', label: 'Тараптардың ескертулері' }
  ];
  const itemIds = new Set(items.map((item) => item.id));
  const storageKey = 'rentsafe-handover-v1';
  let saved = {};

  const loadState = () => {
    const serialized = localStorage.getItem(storageKey);
    if (!serialized) return {};
    try {
      const parsed = JSON.parse(serialized);
      if (Array.isArray(parsed)) {
        return Object.fromEntries(
          parsed
            .filter((index) => Number.isInteger(index) && items[index])
            .map((index) => [items[index].id, true])
        );
      }
      return readChecklistState(serialized, itemIds);
    } catch (error) {
      console.warn('Saved handover checklist data is invalid and was cleared.', error);
      localStorage.removeItem(storageKey);
      return {};
    }
  };

  const updateCount = () => {
    count.textContent = `${items.filter((item) => saved[item.id]).length}/${items.length}`;
  };

  const render = () => {
    list.innerHTML = items.map((item) => `
      <li class="${saved[item.id] ? 'is-complete' : ''}">
        <label>
          <input type="checkbox" data-handover-id="${item.id}" ${saved[item.id] ? 'checked' : ''} />
          <span>${tr(item.label)}</span>
        </label>
      </li>
    `).join('');
    updateCount();
  };

  saved = loadState();
  list.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.dataset.handoverId) return;
    saved = setChecklistItem(saved, input.dataset.handoverId, input.checked, itemIds);
    localStorage.setItem(storageKey, JSON.stringify(saved));
    input.closest('li')?.classList.toggle('is-complete', input.checked);
    updateCount();
  });

  render();
  window.addEventListener('rentsafe:languagechange', render);
}

function init() {
  initLanguageSelector();
  renderDocGrid();
  renderRights();
  renderExplorer();
  renderScenarios();
  renderGlossary();
  renderDocCenter();
  bindHandover();
  bindModal();
  initNavigation();
  initAnimations();
  initChecklist();
  renderProductPreview();
  window.addEventListener('rentsafe:checklistchange', (event) => {
    renderProductPreview(event.detail.state);
  });
  initTaxModule();
  updateDashboard();
  document.documentElement.classList.add('js-ready');

  window.addEventListener('rentsafe:languagechange', () => {
    closeModal();
    renderDocGrid();
    renderRights();
    renderExplorer();
    renderScenarios();
    renderGlossary();
    renderDocCenter();
    renderProductPreview();
    updateDashboard();
  });
}

init();