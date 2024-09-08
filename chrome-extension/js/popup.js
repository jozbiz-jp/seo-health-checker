// Load stored results when the popup is opened
document.addEventListener('DOMContentLoaded', () => {
  loadResultsFromStorage();
});

const totalRequiredMetricsCount = 6;
const totalOptionalMetricsCount = 20;
const requiredMetricWeight = 15; // 90/6
const optionalMetricWeight = 0.5; // 10/20


document.getElementById('seo-check-trigger').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: activeTab },
      function: checkSEOTags
    }, (results) => {
      console.log("results", results)
      // Display results after getting them from the page
      if (results && results[0].result && results[0].result?.requiredResultInfo && results[0].result?.requiredResultCount && results[0].result?.optionalResultInfo && results[0].result?.optionalResultCount) {
        const analysisData = {
          requiredInfo: results[0].result.requiredResultInfo,
          requiredCount: results[0].result.requiredResultCount,
          optionalInfo: results[0].result.optionalResultInfo,
          optionalCount: results[0].result.optionalResultCount,
        }
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
    charset: document.querySelector('meta[charset]')?.content, // Ensures proper encoding
    title: document.title, // Page title, critical for SEO
    description: document.querySelector('meta[name="description"]')?.content, // SEO meta description
    keywords: document.querySelector('meta[name="keywords"]')?.content, // Optional but used for keywords
    robots: document.querySelector('meta[name="robots"]')?.content, // Tells search engines whether to index
    language: document.querySelector('meta[name="language"]')?.content, // Language tag (not as critical but recommended)
  };

  const optionalMetaTags = {
    subject: document.querySelector('meta[name="subject"]')?.content, // Subject of the website
    copyright: document.querySelector('meta[name="copyright"]')?.content, // Copyright information
    author: document.querySelector('meta[name="author"]')?.content, // Author's name or company
    ogTitle: document.querySelector('meta[property="og:title"]')?.content, // OpenGraph title (for social sharing)
    ogDescription: document.querySelector('meta[property="og:description"]')?.content, // OpenGraph description (for social sharing)
    ogImage: document.querySelector('meta[property="og:image"]')?.content, // OpenGraph image (for social sharing)
    ogUrl: document.querySelector('meta[property="og:url"]')?.content, // OpenGraph URL
    ogSiteName: document.querySelector('meta[property="og:site_name"]')?.content, // Site name for OpenGraph
    twitterCard: document.querySelector('meta[name="twitter:card"]')?.content, // Twitter card meta tag
    twitterTitle: document.querySelector('meta[name="twitter:title"]')?.content, // Twitter title
    twitterDescription: document.querySelector('meta[name="twitter:description"]')?.content, // Twitter description
    revisitAfter: document.querySelector('meta[name="revisit-after"]')?.content, // How often a page is revisited
    rating: document.querySelector('meta[name="rating"]')?.content, // Content rating
    distribution: document.querySelector('meta[name="distribution"]')?.content, // Distribution scope (global)
    mobileOptimized: document.querySelector('meta[name="MobileOptimized"]')?.content, // Mobile optimization meta tag
    viewport: document.querySelector('meta[name="viewport"]')?.content, // Viewport settings for responsiveness
    appleMobileWebAppCapable: document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.content, // iOS capability
    appleMobileWebAppStatusBarStyle: document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.content, // iOS status bar styling
    canonical: document.querySelector('link[rel="canonical"]')?.href, // Canonical URL, important for duplicate content
    hreflang: document.querySelector('link[rel="alternate"][hreflang]')?.href // For international/multilingual SEO
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

  console.log("proc data", requiredResults, requiredResultCount, optionalResults, optionalResultCount);
  return { requiredResultInfo: requiredResults, requiredResultCount, optionalResultInfo: optionalResults, optionalResultCount };
}

// Function to display SEO results in the popup
function displayResults(data) {
  const requiredResultsList = document.getElementById('seo-required-results');
  requiredResultsList.innerHTML = ''; // Clear any previous results
  const optionalResultsList = document.getElementById('seo-optional-results');
  optionalResultsList.innerHTML = ''; // Clear any previous results

  // const listItem = document.createElement('li');
  // listItem.textContent = JSON.stringify(data);
  // requiredResultsList.appendChild(listItem);

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

  console.log("analysis scores", requiredAnalysisScore, optionalAnalysisScore)

  renderSEOResults(totalAnalysisScore);
}

function renderSEOResults(resCount) {
  let color = "blue";
  // Assuming the radius of the circle is 85 (adjust based on your actual circle's radius)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  // Calculate the score as a percentage (resCount is divided by totalMetrics)
  const score = resCount && resCount > 0 ? parseInt((resCount / 100) * 100) : 0;

  // Calculate the stroke-dashoffset based on the score
  const offset = circumference - (circumference * score / 100);
  if (score >= 15) color = "green";
  else if (score <= 10) color = "red";
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

// Save results to chrome.storage.local
function saveResultsToStorage(processedData) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabURL = new URL(tabs[0].url).host;  // Get active tab URL

    // Get existing data first
    chrome.storage.local.get('seoData', (data) => {
      const seoData = data.seoData || {};

      // Add or update the current URL's SEO result
      seoData[tabURL] = { requiredInfo: processedData.requiredInfo, requiredCount: processedData.requiredCount, optionalInfo: processedData.optionalInfo, optionalCount: processedData.optionalCount };

      // Limit the number of URLs to 100
      const keys = Object.keys(seoData);
      if (keys.length > 100) {
        // Remove the oldest entry (the first one in the object)
        delete seoData[keys[0]];
      }

      // Save the updated data back to storage
      chrome.storage.local.set({ seoData }, () => {
        console.log('SEO results and tab URL saved.');
      });
    });
  });
}

// Load saved results from chrome.storage.local
function loadResultsFromStorage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTabURL = new URL(tabs[0].url).host;  // Get active tab URL

    // Get the stored data
    chrome.storage.local.get('seoData', (data) => {
      const seoData = data.seoData || {};
      const seoResultsForTab = seoData[activeTabURL];

      // Check if we have stored results for the active tab URL
      if (seoResultsForTab && seoResultsForTab.requiredInfo && seoResultsForTab.requiredCount && seoResultsForTab.optionalInfo && seoResultsForTab.optionalCount) {
        const savedAnalysisData = {
          requiredInfo: seoResultsForTab.requiredInfo,
          requiredCount: seoResultsForTab.requiredCount,
          optionalInfo: seoResultsForTab.optionalInfo,
          optionalCount: seoResultsForTab.optionalCount,
        }
        loadWithTransition(false);
        displayResults(savedAnalysisData);
      } else {
        console.log("No SEO results found for this tab in storage.");
      }
    });
  });
}