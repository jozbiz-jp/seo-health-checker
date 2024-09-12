# SEO Health Checker

SEO Health Checker is a browser extension designed to analyze the SEO-related meta tags of any webpage. It highlights critical SEO tags and optional tags for social sharing, helping web developers and SEO professionals ensure the presence and correctness of essential meta information.

# Extension Links:
[Chrome Extension](https://chromewebstore.google.com/detail/seo-health-checker/dlebdpdkfegojclikbaangielkafnhag)
<br/>
[Firefox Extension](https://addons.mozilla.org/en-GB/firefox/addon/seo-health-checker/)

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Features](#features)
4. [How It Works](#how-it-works)
5. [Meta Tags Analyzed](#meta-tags-analyzed)
   - [Required Meta Tags](#required-meta-tags)
   - [Optional Meta Tags](#optional-meta-tags)
6. [Storage of Results](#storage-of-results)
7. [Development Setup](#development-setup)
8. [Usage](#usage)
9. [Contributing](#contributing)
10. [License](#license)

## Overview

SEO Health Checker is a tool to easily scan and analyze SEO-related meta tags on any webpage. It helps identify missing or incomplete SEO tags that are important for search engine indexing and social sharing. The extension also saves results for up to 100 URLs.

## Installation

To install SEO Health Checker in Chrome:

1. Download the extension files from the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** by toggling the switch at the top right.
4. Click **Load unpacked** and select the folder where the extension files are located.
5. The extension will now appear in your Chrome toolbar, ready for use.

## Features

- Scans webpages for essential SEO meta tags.
- Differentiates between required SEO tags and optional tags (e.g., OpenGraph, Twitter Cards).
- Highlights missing or incomplete required tags.
- Stores the SEO results of up to 100 webpages.
- Provides a user-friendly interface for viewing detailed SEO results.
  
## How It Works

1. **SEO Analysis**: 
   - When you visit a webpage, click the SEO Health Checker icon in the browser toolbar.
   - The extension scans the page’s meta tags, analyzing both required and optional tags.
   
2. **SEO Report**: 
   - The results are displayed in the popup, indicating which required tags are missing or incomplete.
   - Optional meta tags for social sharing (OpenGraph, Twitter Cards, etc.) are also displayed.

3. **Result Storage**: 
   - Results for up to 100 URLs are stored locally. If the limit is exceeded, older entries are removed.

## Meta Tags Analyzed

### Required Meta Tags
The following meta tags are critical for SEO and are checked by the extension. Each of these carry 15 points in the total website score:

```html
<!-- Character encoding, ensures proper encoding -->
<meta charset="UTF-8">

<!-- Page title, critical for SEO -->
<title>Your Page Title</title>

<!-- SEO meta description, provides a summary of the page content -->
<meta name="description" content="Your meta description, up to 150-160 characters">

<!-- Keywords (less important for SEO, but still used by some search engines) -->
<meta name="keywords" content="keyword1, keyword2, keyword3">

<!-- Robots meta tag, controls how search engines index the page -->
<meta name="robots" content="index, follow">

<!-- Language tag, specifies the language of the page -->
<meta name="language" content="en">
```

### Optional Meta Tags
These meta tags are optional but important for social sharing and user experience. Each of these carry 0.5 points in the total website score:

```html
<!-- Subject of the website -->
<meta name="subject" content="Your website's subject">

<!-- Copyright information -->
<meta name="copyright" content="Your company name">

<!-- Author's name or company -->
<meta name="author" content="Author Name or Company Name">

<!-- OpenGraph title (for social sharing) -->
<meta property="og:title" content="OpenGraph Title">

<!-- OpenGraph description (for social sharing) -->
<meta property="og:description" content="OpenGraph Description">

<!-- OpenGraph image (for social sharing) -->
<meta property="og:image" content="https://example.com/image.jpg">

<!-- OpenGraph URL -->
<meta property="og:url" content="https://example.com">

<!-- Site name for OpenGraph -->
<meta property="og:site_name" content="Site Name">

<!-- Twitter card meta tag -->
<meta name="twitter:card" content="summary_large_image">

<!-- Twitter title -->
<meta name="twitter:title" content="Twitter Title">

<!-- Twitter description -->
<meta name="twitter:description" content="Twitter Description">

<!-- How often a page is revisited -->
<meta name="revisit-after" content="7 days">

<!-- Content rating -->
<meta name="rating" content="General">

<!-- Distribution scope (global) -->
<meta name="distribution" content="Global">

<!-- Mobile optimization meta tag -->
<meta name="MobileOptimized" content="320">

<!-- Viewport settings for responsiveness -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- iOS capability -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- iOS status bar styling -->
<meta name="apple-mobile-web-app-status-bar-style" content="black">

<!-- Canonical URL, important for duplicate content -->
<link rel="canonical" href="https://example.com">

<!-- For international/multilingual SEO -->
<link rel="alternate" hreflang="en" href="https://example.com/en">

```


## Storage of Results
The extension stores SEO analysis results for up to 100 URLs using Chrome's chrome.storage.local. The results are associated with the URL of the webpage, and when the limit is exceeded, the oldest entries are removed. Each result contains details of both required and optional meta tags.

## Development Setup
To set up the extension for development:

1. Clone the repository.
2. Open Chrome and navigate to chrome://extensions/.
3. Enable Developer Mode.
4. Click Load unpacked and select the extension folder.
5. Make changes to the JavaScript files and reload the extension for testing.

## Usage
1. Navigate to any webpage.
2. Click the SEO Health Checker icon in your Chrome toolbar and click on "Run Analysis" button.
3. The extension will display a detailed analysis of the webpage’s meta tags.
4. If the page has missing or incomplete tags, they will be highlighted in the results.
5. The results are stored locally for future reference.


## Contributing
Contributions are welcome! Please see our [Contributing Guidelines](./CONTRIBUTING.md) for more information.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
