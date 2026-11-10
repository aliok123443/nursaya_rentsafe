export function readChecklistState(serialized, validIds) {
  if (!serialized) return {};

  const parsed = JSON.parse(serialized);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

  return Object.fromEntries(
    Object.entries(parsed).filter(([id, checked]) => validIds.has(id) && typeof checked === 'boolean')
  );
}

export function setChecklistItem(state, id, checked, validIds) {
  if (!validIds.has(id)) return state;
  return { ...state, [id]: Boolean(checked) };
}
