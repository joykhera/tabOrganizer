// async function getAllTabs() {
//     return await chrome.tabs.query({ currentWindow: true });
// };

// (() => {
//     chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
//         const { type, value } = obj;

//         switch (type) {
//             case "NEW":
//                 console.log('type, value', type, value);
//                 // const allTabs = await getAllTabs();
//                 // chrome.tabs.move(activeInfo.tabId, { index: allTabs.length - 1 });
//                 break;

//             default:
//                 console.log("Unknown message type", type, value)
//                 break;
//         }
//     });

// })();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const { type, value } = message;
    switch (type) {
        case "NEW":
            console.log('Tab activated:', value);
            // You can perform your tab manipulation here
            break;
        default:
            console.error("Unknown message type:", type);
            break;
    }
    sendResponse(); // Responding to the message (even if you do not send back data)
});