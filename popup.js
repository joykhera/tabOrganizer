import { getAllTabs } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const organizeTabsButton = document.getElementById("organizeTabsButton");
    const revertTabsButton = document.getElementById("revertTabsButton");

    organizeTabsButton.addEventListener("click", async () => {
        const allTabs = await getAllTabs();
        await organizeTabs(allTabs);
    });

    revertTabsButton.addEventListener("click", async () => {
        const allTabs = await getAllTabs();
        await revertTabs(allTabs);
    });
});

// chrome.tabs.onActivated.addListener(async activeInfo => {
//     if (activeInfo.tabId && activeInfo.windowId) {
//         chrome.tabs.sendMessage(activeInfo.tabId, {
//             type: "NEW",
//             value: activeInfo.tabId,
//         });

//         const allTabs = await getAllTabs();
//         chrome.tabs.move(activeInfo.tabId, { index: allTabs.length - 1 });
//     }
// });

const organizeTabs = async (tabs) => {
    const oldTabs = JSON.parse(JSON.stringify(tabs));

    tabs.forEach(tab => tab.hostname = new URL(tab.url).hostname);
    tabs.sort((a, b) => a.hostname.localeCompare(b.hostname));

    for (let i = 0; i < tabs.length; i++) {
        tabs[i].index = i;
        chrome.tabs.move(tabs[i].id, { index: i });
    }

    const oldTabsOrder = {};
    oldTabs.forEach(tab => oldTabsOrder[tab.id] = tab.index);
    const sameTabOrder = tabs.every(tab => tab.index === oldTabsOrder[tab.id]);

    if (!sameTabOrder) {
        await chrome.storage.sync.set({ 'oldTabsOrder': oldTabsOrder });
    }

    const temp = []
    for (const tab of tabs) {
        if (tab.index !== oldTabsOrder[tab.id]) {
            temp.push({ id: tab.id, index: tab.index });
        }
    }

    return [sameTabOrder, oldTabsOrder, tabs, temp]
};

const revertTabs = async (tabs) => {
    const oldTabsOrder = (await chrome.storage.sync.get('oldTabsOrder'))['oldTabsOrder'];
    for (const tab of tabs) {
        if (tab.id in oldTabsOrder) {
            chrome.tabs.move(tab.id, { index: oldTabsOrder[tab.id] });
        }
    }
}