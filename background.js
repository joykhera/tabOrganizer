async function getAllTabs() {
  return await chrome.tabs.query({ currentWindow: true });
}

chrome.tabs.onActivated.addListener(async activeInfo => {
  if (activeInfo.tabId && activeInfo.windowId) {
    chrome.tabs.sendMessage(activeInfo.tabId, {
      type: "NEW",
      value: activeInfo.tabId,
    });

    const allTabs = await getAllTabs();
    setTimeout(() => {
      chrome.tabs.move(activeInfo.tabId, { index: allTabs.length - 1 });
    }, 100);
  }
});