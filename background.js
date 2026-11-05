// Closes a tab that navigates to a URL already open in another tab and
// switches to the existing one. Tabs inside any tab group are ignored on
// both sides, so automation groups (such as Claude in Chrome) are never touched.

const UNGROUPED = -1; // chrome.tabGroups.TAB_GROUP_ID_NONE

// Returns the comparable form of a URL, or null for pages we never dedupe.
function normalize(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    u.hash = '';
    return u.href;
  } catch {
    return null;
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!changeInfo.url || tab.groupId !== UNGROUPED) return;

  const url = normalize(changeInfo.url);
  if (!url) return;

  const tabs = await chrome.tabs.query({});
  const existing = tabs.find(
    (t) =>
      t.id !== tabId &&
      t.groupId === UNGROUPED &&
      normalize(t.url || t.pendingUrl || '') === url
  );
  if (!existing) return;

  try {
    await chrome.tabs.update(existing.id, { active: true });
    await chrome.windows.update(existing.windowId, { focused: true });
    await chrome.tabs.remove(tabId);
  } catch {
    // Either tab may have closed in the meantime; nothing to do.
  }
});
