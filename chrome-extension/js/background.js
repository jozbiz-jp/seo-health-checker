chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "displayResults") {
    chrome.storage.local.set({ seoResults: message.results }, () => {
      console.log("SEO results stored.");
    });
  }
});