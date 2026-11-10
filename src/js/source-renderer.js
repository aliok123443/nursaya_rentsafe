import { getLanguage, tr } from './i18n.js';
import { legalDocuments } from './legal-sources.js';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

export function renderSource(source) {
  if (!source) {
    return `<span>${tr('Практикалық материал — бұл заңның ресми нысаны емес.')}</span>`;
  }

  if (typeof source === 'string') {
    if (!/^https:\/\//i.test(source)) return escapeHtml(tr(source));
    return `<a href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer">${tr('Ресми дереккөзге өту')}</a>`;
  }

  const document = legalDocuments[source.documentId];
  if (!document) throw new Error(`Unknown legal source document: ${source.documentId}`);

  const language = getLanguage();
  const citation = [
    document.number,
    source.articles ? `${tr('Баптар')}: ${source.articles}` : ''
  ].filter(Boolean).join(' · ');
  const link = document.url
    ? `<a href="${escapeHtml(document.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(document.title[language])}</a>`
    : `<span>${escapeHtml(document.title[language])}</span>`;

  return `
    <span class="source-citation">${link}${citation ? ` · ${escapeHtml(citation)}` : ''}</span>
    <span class="source-status">${tr('Дереккөз бен нақты қолданылуы тексеруді қажет етеді.')}</span>
  `;
}
