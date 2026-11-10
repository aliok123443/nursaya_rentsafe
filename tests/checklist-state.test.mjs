import test from 'node:test';
import assert from 'node:assert/strict';
import { checklistData } from '../src/js/data.js';
import { readChecklistState, setChecklistItem } from '../src/js/checklist-state.mjs';
import { legalDocuments, legalReferences } from '../src/js/legal-sources.js';

const itemIds = checklistData.flatMap((category) => category.items.map((item) => item.id));
const validIds = new Set(itemIds);

test('every checklist item toggles independently', () => {
  for (const id of itemIds) {
    const updated = setChecklistItem({}, id, true, validIds);
    assert.deepEqual(updated, { [id]: true }, `${id} must not update other items`);
    assert.deepEqual(setChecklistItem(updated, id, false, validIds), { [id]: false });
  }
});

test('multiple items remain independent through repeated changes', () => {
  let state = {};
  for (const id of itemIds) state = setChecklistItem(state, id, true, validIds);
  assert.equal(Object.values(state).filter(Boolean).length, itemIds.length);

  state = setChecklistItem(state, itemIds[1], false, validIds);
  assert.equal(state[itemIds[1]], false);
  assert.equal(state[itemIds[0]], true);
  assert.equal(state[itemIds[2]], true);

  state = setChecklistItem(state, itemIds[1], true, validIds);
  assert.equal(Object.values(state).filter(Boolean).length, itemIds.length);
});

test('state survives serialization and ignores unknown or invalid values', () => {
  const serialized = JSON.stringify({ [itemIds[0]]: true, [itemIds[1]]: false, unrelated: true });
  assert.deepEqual(readChecklistState(serialized, validIds), {
    [itemIds[0]]: true,
    [itemIds[1]]: false
  });
  assert.deepEqual(readChecklistState('', validIds), {});
});

test('unknown checklist IDs cannot mutate state', () => {
  const state = { [itemIds[0]]: true };
  assert.equal(setChecklistItem(state, 'unknown', true, validIds), state);
});

test('every checklist item has a review-pending legal-source record', () => {
  assert.equal(legalReferences.length, itemIds.length);
  assert.deepEqual(new Set(legalReferences.map((reference) => reference.checklistItemId)), validIds);
  for (const reference of legalReferences) {
    assert.equal(reference.status, 'NEEDS_REVIEW');
    assert.ok(reference.document);
    assert.ok(Object.values(legalDocuments).includes(reference.document));
  }
});
