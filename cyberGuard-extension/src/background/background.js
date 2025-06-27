console.log('Background script loaded');

let successfulImagePredictions = [];
let successfulURLPredictions = [];


// load predictions and store in chrome's storage
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'PAGE_DATA') {
    console.log('Received data from content script:', message.payload);

    const image_predictions = await fetchPredictions(message.payload.imageUrls, IMAGE_PREDICT_ENDPOINT);
    // const url_predictions = await fetchPredictions(message.payload.anchorUrls, URL_PREDICT_ENDPOINT);

    console.log('Image predictions: \n', image_predictions);

    successfulImagePredictions = image_predictions.filter(item => item.status === 'success');
    // successfulURLPredictions = url_predictions.filter(item => item.status === 'success');

    console.log('Successful image predictions: \n', successfulImagePredictions);

    chrome.storage.session.set({ successfulImagePredictions });
    chrome.storage.session.set({ successfulURLPredictions });
  }
});


// send the successful prediction arrays
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PHISHY_ENTRIES') {
    sendResponse({
      payload: {
        anchors: successfulURLPredictions,
        images: successfulImagePredictions
      }
    });
  }
  return true;
});


// clear storage on change of tab
chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.storage.session.remove(['successfulAnchors', 'successfulImagePredictions'], () => {
    console.log('Cleared prediction storage on tab switch');
  });

  urlCache.clear();
});


const API_BASE = 'http://127.0.0.1:8000';
const IMAGE_PREDICT_ENDPOINT = '/api/predict-image';
const URL_PREDICT_ENDPOINT = '/api/predict-url';

// In-memory cache: { url: { status, prediction, phishy_probability } }
const urlCache = new Map();

async function fetchPredictions(urls, ENDPOINT) {
  // Dedupe and split into uncached vs cached
  const uniqueUrls = Array.from(new Set(urls));
  const toFetch = uniqueUrls.filter(u => !urlCache.has(u));

  let fetchedResults = [];
  if (toFetch.length) {
    const response = await fetch(`${API_BASE}${ENDPOINT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ urls: toFetch })
    });
    if (!response.ok) {
      throw new Error(`Prediction API error: ${response.status}`);
    }
    let resObject = await response.json();
    fetchedResults = resObject.results;

    // console.log(fetchedResults);
    // Store each in cache
    Object.entries(fetchedResults).forEach(([url, res]) => {
      urlCache.set(url, {
        status: res.status,
        prediction: res.prediction,
        phishy_probability: res.phishy_probability
      });
    });

  }

  // Build final result array
  return uniqueUrls.map(url => {
    const { status, prediction, phishy_probability } = urlCache.get(url);
    return { url, status, prediction, phishy_probability };
  });
}
