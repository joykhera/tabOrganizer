export async function getAllTabs() {
    return await chrome.tabs.query({ currentWindow: true });
}

export async function getActiveTabURL() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}