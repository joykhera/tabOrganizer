import { getAllTabs, getActiveTabURL } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
    const organizeTabsButton = document.getElementById("organizeTabsButton");
    const revertTabsButton = document.getElementById("revertTabsButton");

    organizeTabsButton.addEventListener("click", async () => {
        const activeTabURL = await getActiveTabURL();
        const allTabs = await getAllTabs();
        await organizeTabs(allTabs);

        const d = await organizeTabs(allTabs);

        chrome.tabs.sendMessage(activeTabURL.id, {
            type: "ORGANIZE",
            value: d,
        });
    });

    revertTabsButton.addEventListener("click", async () => {
        const allTabs = await getAllTabs();
        await revertTabs(allTabs);
    });
});

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

    return tabs;
};

const revertTabs = async (tabs) => {
    const oldTabsOrder = (await chrome.storage.sync.get('oldTabsOrder'))['oldTabsOrder'];
    for (const tab of tabs) {
        if (tab.id in oldTabsOrder) {
            chrome.tabs.move(tab.id, { index: oldTabsOrder[tab.id] });
        }
    }
}