# YouTube Lazy Loader

## Overview

**YouTube Lazy Loader** is a Tampermonkey/Greasemonkey user script designed to improve page performance on **machines with limited resources** when browsing YouTube, expecially on browsers like Firefox.
The initial goal was to **improve player loading and video playback time** by deferring the initialization of secondary page sections and components.
This script does **not aim to fix inherent performance issues of YouTube** but rather attempts to **reduce CPU spikes and initial JavaScript load**, allowing smoother video playback and interaction on older or less powerful systems.  
Because the script operates at a “universal” level, it may **not always work perfectly** and behavior may vary between browsers.

---

## Features

1. **Lazy-load micro-components**  
   - Interactive elements such as buttons (`like/share`), menus, and hovercards are not initialized until they become visible.  
   - Reduces initial JavaScript evaluation and event binding.

2. **Lazy-load thumbnails and GIFs**  
   - Video thumbnails, hover-preview images, and GIF animations are loaded only when they enter the viewport.  
   - Prevents unnecessary network requests and DOM calculations for content that isn’t visible.

3. **Dynamic sidebar & suggested video handling**  
   - The sidebar and suggested videos are suspended initially. Scripts and heavy DOM nodes are deferred until the user scrolls or hovers.  
   - Suggested videos are lazy-loaded **based on priority**, calculated using:
     - Visibility ratio (portion of element in viewport)  
     - Thumbnail size  
     - Position in the sidebar (top items = higher priority)  

4. **Adaptive preload based on connection speed**  
   - If the network is fast, suggested videos are preloaded sooner.  
   - On slower connections, preload is delayed to avoid CPU/network spikes.

5. **Delayed comment loading**  
   - Comment section requests are delayed proportionally to page load and current activity, preventing initial CPU spike.

6. **SPA-friendly**  
   - Observes YouTube’s single-page navigation changes and re-applies lazy-load logic on video or page change.

7. **Universal optimization philosophy**  
   - The script is designed to work **without removing visual elements** or breaking UX.  
   - It focuses purely on **background execution and deferred initialization**, allowing smoother playback and interaction.

---

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) or compatible userscript manager in your browser.  
2. Create a new userscript named `youtube-lazy-loader`.  
3. Copy and paste the [script content](https://github.com/aston89/Youtube-Lazy-Loader/blob/main/Yuotube-Lazy-Loader.js) into the Tampermonkey editor.  
4. Save and enable the script.  
5. Open YouTube; the script should automatically manage lazy loading.

---

## Limitations & Notes

- This script does **not fix YouTube’s native performance problems with firefox or network issues**.  
- Behavior may vary depending on browser version, extensions, YouTube layout changes, or system resources.  
- Lazy-loading may delay visibility of comments, sidebar, or hover previews; this is intentional for performance.  
- Since the script intercepts fetch calls and suspends certain DOM operations, some **dynamic features of YouTube may not trigger immediately**.  
- The script is **experimental**; although it generally works, full reliability is not guaranteed.

---

## Technical Details

- **Fetch interception**: The script wraps `window.fetch` to queue and defer heavy requests for comments, suggested videos, tracking, and feed content.  
- **Intersection Observer**: Used extensively to trigger lazy-loading only when elements are visible in the viewport.  
- **Micro-component deferral**: Interactive elements (`ytd-toggle-button-renderer`, `ytd-hovercard`, etc.) are stripped of inner content and re-initialized only when needed.  
- **Dynamic prioritization**: Suggested videos are ordered and loaded based on a calculated score from visibility ratio, size, and sidebar position.  
- **Connection-aware preload**: Uses `navigator.connection.downlink` (if available) to adapt preload timing for suggested videos.  
- **Delayed comment initialization**: Requests for comments are postponed to prevent initial spike in JavaScript execution.  
- **MutationObserver**: Monitors DOM changes to handle SPA navigation and re-apply lazy-load logic dynamically.

---

## Disclaimer

This script is designed for **educational and performance optimization purposes**.  
It is **not officially supported by YouTube** and may break if YouTube changes its DOM structure or JavaScript behavior.  
Use at your own risk. The goal is to **help lower-end systems experience smoother video playback**, not to patch YouTube itself.

---

