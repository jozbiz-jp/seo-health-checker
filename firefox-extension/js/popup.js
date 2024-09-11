// Load stored results when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
  loadResultsFromStorage();
});

const totalRequiredMetricsCount = 6;
const totalOptionalMetricsCount = 20;
const requiredMetricWeight = 15; // 90/6
const optionalMetricWeight = 0.5; // 10/20

document.getElementById('seo-check-trigger').addEventListener('click', () => {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const activeTab = tabs[0].id;

    browser.tabs.executeScript(activeTab, {
      code: `(${checkSEOTags})()`
    }).then((results) => {
      // Display results after getting them from the page
      if (results && results[0] && results[0].requiredResultInfo && results[0].requiredResultCount && results[0].optionalResultInfo && results[0].optionalResultCount) {
        const analysisData = {
          requiredInfo: results[0].requiredResultInfo,
          requiredCount: results[0].requiredResultCount,
          optionalInfo: results[0].optionalResultInfo,
          optionalCount: results[0].optionalResultCount,
        };
        loadWithTransition(true);
        displayResults(analysisData);
        saveResultsToStorage(analysisData);
      }
    });
  });
});

function loadWithTransition(flag) {
  document.getElementById('seo-health-loading').style.display = flag ? "block" : "none";
  flag ? setTimeout(function () {
    document.getElementById('seo-health-loading').style.display = "none";
    document.getElementById('seo-health-results').style.display = "block";
  }, 5000) : document.getElementById('seo-health-results').style.display = "block";
}

// Function to check SEO tags and return results
function checkSEOTags() {
  const requiredResults = [];
  const optionalResults = [];
  let requiredResultCount = 0;
  let optionalResultCount = 0;
  const requiredMetaTags = {
    charset: document.querySelector('meta[charset]')?.content,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    keywords: document.querySelector('meta[name="keywords"]')?.content,
    robots: document.querySelector('meta[name="robots"]')?.content,
    language: document.querySelector('meta[name="language"]')?.content,
  };

  const optionalMetaTags = {
    subject: document.querySelector('meta[name="subject"]')?.content,
    copyright: document.querySelector('meta[name="copyright"]')?.content,
    author: document.querySelector('meta[name="author"]')?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogDescription: document.querySelector('meta[property="og:description"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    ogUrl: document.querySelector('meta[property="og:url"]')?.content,
    ogSiteName: document.querySelector('meta[property="og:site_name"]')?.content,
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.content,
    twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content,
    twitterDescription: document.querySelector('meta[name="twitter:description"]')?.content,
    revisitAfter: document.querySelector('meta[name="revisit-after"]')?.content,
    rating: document.querySelector('meta[name="rating"]')?.content,
    distribution: document.querySelector('meta[name="distribution"]')?.content,
    mobileOptimized: document.querySelector('meta[name="MobileOptimized"]')?.content,
    viewport: document.querySelector('meta[name="viewport"]')?.content,
    appleMobileWebAppCapable: document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.content,
    appleMobileWebAppStatusBarStyle: document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.content,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    hreflang: document.querySelector('link[rel="alternate"][hreflang]')?.href
  };

  // Required meta tags check
  for (const [key, value] of Object.entries(requiredMetaTags)) {
    if (!value) {
      requiredResults.push(`${key} tag is missing or empty.`);
    } else {
      requiredResults.push(`${key}: ${value}`);
      requiredResultCount++;
    }
  }

  // Optional meta tags check
  for (const [key, value] of Object.entries(optionalMetaTags)) {
    if (!value) {
      optionalResults.push(`${key} tag is missing or empty.`);
    } else {
      optionalResults.push(`${key}: ${value}`);
      optionalResultCount++;
    }
  }

  return { requiredResultInfo: requiredResults, requiredResultCount, optionalResultInfo: optionalResults, optionalResultCount };
}

// Function to display SEO results in the popup
function displayResults(data) {
  const requiredResultsList = document.getElementById('seo-required-results');
  requiredResultsList.innerHTML = ''; // Clear any previous results
  const optionalResultsList = document.getElementById('seo-optional-results');
  optionalResultsList.innerHTML = ''; // Clear any previous results

  // Display required data analysis
  if (data?.requiredInfo?.length > 0) {
    data.requiredInfo.forEach(result => {
      const listItem = document.createElement('li');
      listItem.textContent = result;
      listItem.className = result.includes("tag is missing or empty.") ? "txt-error" : "txt-success";
      requiredResultsList.appendChild(listItem);
    });
  }

  // Display optional data analysis
  if (data?.optionalInfo?.length > 0) {
    data.optionalInfo.forEach(result => {
      const listItem = document.createElement('li');
      listItem.textContent = result;
      listItem.className = result.includes("tag is missing or empty.") ? "txt-error" : "txt-success";
      optionalResultsList.appendChild(listItem);
    });
  }

  let totalAnalysisScore = 0;
  let requiredAnalysisScore = 0;
  let optionalAnalysisScore = 0;

  requiredAnalysisScore = (data.requiredCount * requiredMetricWeight);
  requiredAnalysisScore = Math.round(requiredAnalysisScore);

  optionalAnalysisScore = (data.optionalCount * optionalMetricWeight);
  optionalAnalysisScore = Math.round(optionalAnalysisScore);

  totalAnalysisScore = requiredAnalysisScore + optionalAnalysisScore;

  renderSEOResults(totalAnalysisScore);
}

function renderSEOResults(resCount) {
  let color = "blue";
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  const score = resCount && resCount > 0 ? parseInt((resCount / 100) * 100) : 0;

  const offset = circumference - (circumference * score / 100);
  if (score >= 75) {
    color = "green";
  } else if (score >= 45) {
    color = "orange";
  } else if (score >= 25) {
    color = "yellow";
  } else {
    color = "red";
  }
  const stroke = "#" + color + "grad";
  const text_color = color + "-grad-text";
  $(".number").addClass(text_color);
  $(".number").html(score);

  $("#circle-stroke").css("stroke", `url(${stroke})`);
  $("#circle-stroke").animate(
    {
      "stroke-dasharray": circumference,
      "stroke-dashoffset": offset
    },
    1000
  );
}

// Save results to browser.storage.local
function saveResultsToStorage(processedData) {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const tabURL = new URL(tabs[0].url).host;

    // Get existing data first
    browser.storage.local.get('seoData').then((data) => {
      const seoData = data.seoData || {};

      // Add or update the current URL's SEO result
      seoData[tabURL] = { requiredInfo: processedData.requiredInfo, requiredCount: processedData.requiredCount, optionalInfo: processedData.optionalInfo, optionalCount: processedData.optionalCount };

      // Limit the number of URLs to 100
      const keys = Object.keys(seoData);
      if (keys.length > 100) {
        delete seoData[keys[0]]; // Remove the oldest entry
      }

      // Save the updated data back to storage
      browser.storage.local.set({ seoData });
    });
  });
}

// Load saved results from browser.storage.local
function loadResultsFromStorage() {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    const activeTabURL = new URL(tabs[0].url).host;

    // Get the stored data
    browser.storage.local.get('seoData').then((data) => {
      const seoData = data.seoData || {};
      const seoResultsForTab = seoData[activeTabURL];

      // Check if we have stored results for the active tab URL
      if (seoResultsForTab && seoResultsForTab.requiredInfo && seoResultsForTab.requiredCount && seoResultsForTab.optionalInfo && seoResultsForTab.optionalCount) {
        const savedAnalysisData = {
          requiredInfo: seoResultsForTab.requiredInfo,
          requiredCount: seoResultsForTab.requiredCount,
          optionalInfo: seoResultsForTab.optionalInfo,
          optionalCount: seoResultsForTab.optionalCount,
        };
        loadWithTransition(false);
        displayResults(savedAnalysisData);
      }
    });
  });
}
