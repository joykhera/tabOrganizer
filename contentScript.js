chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const { type, value } = message;
    switch (type) {
        case "NEW":
            console.log('Tab activated:', value);
            break;
        
        case "ORGANIZE":
            console.log('Open tabs:', value);
            break;
        
        default:
            console.error("Unknown message type:", type, value);
            break;
    }
    sendResponse(); // Responding to the message (even if you do not send back data)
});