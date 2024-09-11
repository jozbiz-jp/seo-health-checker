browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "displayResults") {
    // Use browser.storage.local.set to store the SEO results
    browser.storage.local.set({ seoResults: message.results }).then(() => {
      console.log("SEO results stored.");
    }).catch((error) => {
      console.error("Error storing SEO results: ", error);
    });
  }
});
