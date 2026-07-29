/**
 * TEST-ONLY DUMMY LAYOUT INTEGRATION — safe to remove after layout testing.
 *
 * Stores the dummy layout config in localStorage (key: dummy_layout_config).
 * This works 100% without any backend deployment — both the HomeLayoutBuilder
 * (admin portal) and the DummyLayoutPage (admin portal /dummy-layout route)
 * run on the same origin (localhost:3000) so they share the same localStorage.
 *
 * REMOVAL: Delete this file and remove its import from HomeLayoutBuilder.jsx.
 */

const DUMMY_STORAGE_KEY = 'dummy_layout_config';
const DUMMY_META_KEY    = 'dummy_layout_meta';

/**
 * Saves the current staged layout to localStorage.
 * No backend call — works instantly regardless of backend status.
 *
 * @param {Array} layout - The current staged layout array from the editor.
 * @returns {Promise<object>} Result object.
 */
export const applyLayoutToDummy = async (layout) => {
  const payload = layout.map((item, idx) => ({
    id:            item.id,
    sectionKey:    item.sectionKey,
    sectionLabel:  item.sectionLabel || '',
    displayOrder:  idx + 1,
    isVisible:     item.isVisible !== false,
    configJson:    item.configJson || '{}'
  }));

  const savedAt = new Date().toISOString();
  localStorage.setItem(DUMMY_STORAGE_KEY, JSON.stringify(payload));
  localStorage.setItem(DUMMY_META_KEY, JSON.stringify({ savedAt, sections: payload.length }));

  return {
    message: 'Dummy layout saved to local storage. Production layout was NOT changed.',
    sections: payload.length,
    savedAt
  };
};

/**
 * Reads the current dummy layout from localStorage.
 * Returns an empty array if nothing has been saved yet.
 *
 * @returns {Array} Array of dummy layout sections.
 */
export const getDummyLayout = () => {
  try {
    const raw = localStorage.getItem(DUMMY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) || [];
  } catch {
    return [];
  }
};

/**
 * Returns metadata about the last saved dummy layout.
 * @returns {{ savedAt: string, sections: number } | null}
 */
export const getDummyMeta = () => {
  try {
    const raw = localStorage.getItem(DUMMY_META_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Clears the dummy layout from localStorage.
 * Does not affect the production layout or any other data.
 *
 * @returns {Promise<object>} Result object.
 */
export const resetDummyLayout = async () => {
  localStorage.removeItem(DUMMY_STORAGE_KEY);
  localStorage.removeItem(DUMMY_META_KEY);
  return { message: 'Dummy layout reset. Production layout was NOT changed.' };
};
