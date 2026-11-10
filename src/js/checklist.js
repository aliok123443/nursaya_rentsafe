import { checklistData } from './data.js';
import { readChecklistState, setChecklistItem } from './checklist-state.mjs';
import { getLegalReference } from './legal-sources.js';
import { getLanguage, tr } from './i18n.js';

const STORAGE_KEY = 'rentsafe-checklist-v1';
const checklistItems = checklistData.flatMap((category) => category.items);
const checklistIds = new Set(checklistItems.map((item) => item.id));
let rerenderChecklist = null;

function loadState() {
  const serialized = localStorage.getItem(STORAGE_KEY);
  try {
    return readChecklistState(serialized, checklistIds);
  } catch (error) {
    console.warn('Saved checklist data is invalid and was cleared.', error);
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

export function getChecklistState() {
  return loadState();
}

export function initChecklist() {
  if (rerenderChecklist) {
    rerenderChecklist();
    return;
  }

  const panel = document.getElementById('checklist-panel');
  const searchInput = document.getElementById('checklist-search');
  const filterButtons = [...document.querySelectorAll('.filter-btn[data-filter]')];
  if (!panel || !searchInput) return;

  let saved = loadState();
  let currentFilter = 'all';
  let currentQuery = '';

  const renderLegalReference = (itemId) => {
    const reference = getLegalReference(itemId);
    if (!reference) return '';

    const language = getLanguage();
    const documentTitle = reference.document.title[language];
    const citation = [
      reference.document.number,
      reference.document.date,
      reference.article ? `${tr('Баптар')}: ${reference.article}` : ''
    ].filter(Boolean).join(' · ');
    const url = reference.officialUrl
      ? `<a href="${reference.officialUrl}" target="_blank" rel="noopener noreferrer">${tr('Ресми мәтін')}</a>`
      : `<span>${tr('Ресми сілтеме осы тексеруде қолжетімді болмады.')}</span>`;

    return `
      <details class="checklist-source">
        <summary>${tr('Құқықтық негіз')}</summary>
        <div>
          <strong>${reference.basisLabel[language]}</strong>
          <p>${documentTitle}${citation ? ` · ${citation}` : ''}</p>
          <p>${tr('Бұл сілтеме байланысты норманы іздеуге арналған; оның қолданыстағы мәтіні мен нақты жағдайға қолданылуы әлі расталған жоқ.')}</p>
          <p>${tr('Дереккөз мәртебесі')}: ${tr('Тексеруді қажет етеді')}</p>
          ${url}
        </div>
      </details>
    `;
  };

  const render = () => {
    const filteredCategories = checklistData
      .map((category) => ({
        ...category,
        items: category.items.filter((item) => {
          const text = `${tr(item.text)} ${tr(item.explanation)}`.toLocaleLowerCase(getLanguage());
          const matchesQuery = text.includes(currentQuery);
          const isDone = Boolean(saved[item.id]);
          if (currentFilter === 'done') return matchesQuery && isDone;
          if (currentFilter === 'pending') return matchesQuery && !isDone;
          return matchesQuery;
        })
      }))
      .filter((category) => category.items.length > 0);

    panel.innerHTML = filteredCategories.length
      ? filteredCategories.map((category) => {
        const checked = category.items.filter((item) => Boolean(saved[item.id])).length;
        return `
          <article class="checklist-card">
            <div class="checklist-category">
              <h3>${tr(category.category)}</h3>
              <span class="progress-badge mono">${checked}/${category.items.length}</span>
            </div>
            <div class="checklist-list">
              ${category.items.map((item) => `
                <div class="checklist-item ${saved[item.id] ? 'is-complete' : ''}">
                  <input
                    id="checklist-${item.id}"
                    type="checkbox"
                    data-checklist-id="${item.id}"
                    aria-label="${tr(item.text)}"
                    ${saved[item.id] ? 'checked' : ''}
                  />
                  <span class="item-copy">
                    <label class="checklist-label" for="checklist-${item.id}"><strong>${tr(item.text)}</strong></label>
                    <small>${tr(item.explanation)}</small>
                    ${renderLegalReference(item.id)}
                  </span>
                </div>
              `).join('')}
            </div>
          </article>
        `;
      }).join('')
      : `<p class="checklist-empty" role="status">${tr('Ешбір тапсырма табылмады.')}</p>`;

    const completed = checklistItems.filter((item) => saved[item.id]).length;
    const progressLabel = document.getElementById('checklist-progress');
    if (progressLabel) progressLabel.textContent = `${completed}/${checklistItems.length}`;

    const resetButton = document.getElementById('checklist-reset');
    if (resetButton) resetButton.textContent = tr('Тазалау');

    updateDashboard(saved);
    window.dispatchEvent(new CustomEvent('rentsafe:checklistchange', {
      detail: {
        state: saved,
        total: checklistItems.length,
        completed: checklistItems.filter((item) => saved[item.id]).length
      }
    }));
  };

  panel.addEventListener('change', (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'checkbox' || !input.dataset.checklistId) return;

    saved = setChecklistItem(saved, input.dataset.checklistId, input.checked, checklistIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    if ((currentFilter === 'done' && !input.checked) || (currentFilter === 'pending' && input.checked)) {
      render();
      return;
    }

    const row = input.closest('.checklist-item');
    row?.classList.toggle('is-complete', input.checked);

    const category = input.closest('.checklist-card');
    if (category) {
      const boxes = [...category.querySelectorAll('input[data-checklist-id]')];
      const progress = category.querySelector('.progress-badge');
      if (progress) progress.textContent = `${boxes.filter((box) => box.checked).length}/${boxes.length}`;
    }

    const completed = checklistItems.filter((item) => saved[item.id]).length;
    const progressLabel = document.getElementById('checklist-progress');
    if (progressLabel) progressLabel.textContent = `${completed}/${checklistItems.length}`;
    updateDashboard(saved);
    window.dispatchEvent(new CustomEvent('rentsafe:checklistchange', {
      detail: {
        state: saved,
        total: checklistItems.length,
        completed: checklistItems.filter((item) => saved[item.id]).length
      }
    }));
  });

  searchInput.addEventListener('input', () => {
    currentQuery = searchInput.value.trim().toLocaleLowerCase(getLanguage());
    render();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter || 'all';
      filterButtons.forEach((filterButton) => {
        const active = filterButton === button;
        filterButton.classList.toggle('is-active', active);
        filterButton.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  });

  const resetButton = document.getElementById('checklist-reset');
  resetButton?.addEventListener('click', () => {
    if (!window.confirm(tr('Чек-листтегі барлық белгіні өшіргіңіз келе ме?'))) return;
    localStorage.removeItem(STORAGE_KEY);
    saved = {};
    render();
  });

  rerenderChecklist = () => {
    saved = loadState();
    currentQuery = searchInput.value.trim().toLocaleLowerCase(getLanguage());
    render();
  };
  window.addEventListener('rentsafe:languagechange', rerenderChecklist);
  render();
}

export function updateDashboard(state = loadState()) {
  const dashboard = document.getElementById('dashboard-grid');
  if (!dashboard) return;

  const total = checklistItems.length;
  const completed = checklistItems.filter((item) => state[item.id]).length;
  const cards = [
    { label: 'Жалпы дайындық деңгейі', value: `${Math.round((completed / total) * 100)}%` },
    { label: 'Орындалған тапсырмалар', value: `${completed}/${total}` },
    { label: 'Қалған тапсырмалар', value: `${total - completed}` }
  ];

  dashboard.innerHTML = cards.map((card) => `
    <article class="dashboard-card">
      <span>${tr(card.label)}</span>
      <strong>${tr(card.value)}</strong>
    </article>
  `).join('');
}
