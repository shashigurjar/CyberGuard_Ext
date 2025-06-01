console.log('Background script loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PAGE_DATA') {
    console.log('Received data from content script:', message.payload);

    // You can now:
    // - Run ML predictions
    // - Store it in local storage
    // - Forward it to backend
  }
});
