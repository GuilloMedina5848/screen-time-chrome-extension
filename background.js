// Add global variables that will be used throughout rest of program.
let currentTabId = null;
let startTime = Date.now();

// Creates an alarm called 'trackTime' for tracking time in active tab every 5 seconds.
chrome.alarms.create('trackTime', {periodInMinutes: 1/12}); //5 secs

// The following funtion handles the update current tab time functionality.
function updateCurrentTabTime() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        // No active tab
        if (tabs.length === 0) return; 

        let tab = tabs[0];
        // No URL, likely a new tab or special page
        if (!tab.url) return; 

        let url = new URL(tab.url).hostname;
        let currentTime = Date.now();
        
        // Check if we're still on the same tab
        if (currentTabId === tab.id){
            // Calculate time spent in seconds
            let timeSpent = (currentTime - startTime) / 1000;
            updateSiteTime(url, timeSpent);
        }

        // Update the current tab and reset the start time
        currentTabId = tab.id;
        startTime = currentTime;
    });
}

// The following function is to update the site time in storage.
function updateSiteTime(url, timeSpent) {
    chrome.storage.local.get({siteTime: {}}, function(data) {
      let siteTime = data.siteTime;
      if (siteTime[url]) {
        siteTime[url] += timeSpent;
      } else {
        siteTime[url] = timeSpent;
      }
      chrome.storage.local.set({siteTime}, () => {
        console.log('Site time updated', siteTime);
      });
    });
} 

// Event Listener that listens for the alarm and then update the time spent on the current site.
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'trackTime') {
        updateCurrentTabTime();
    }
});

// Event Listener for to handle tab switching whenever you open a new tab.
chrome.tabs.onActivated.addListener(function(activeInfo) {
    // Reset start time when switching tabs
    startTime = Date.now();
    currentTabId = activeInfo.tabId;
});

// Event Listener for tab updates to catch navigations in the same tab.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.active && changeInfo.url) {
        let url = new URL(changeInfo.url).hostname;
        let currentTime = Date.now();
        let timeSpent = (currentTime - startTime) / 1000;
        updateSiteTime(url, timeSpent);
        // Reset the timer for the current tab
        startTime = currentTime;
        currentTabId = tabId;
    }
});

// Event Listener for window focus changes to reset the timer appropriately.
chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        currentTabId = null; // No window is focused
    } else {
        chrome.tabs.query({active: true, windowId: windowId}, function(tabs) {
            if (tabs.length > 0) {
                currentTabId = tabs[0].id;
            }
        });
    }
    startTime = Date.now(); // Reset start time whenever window focus changes
});