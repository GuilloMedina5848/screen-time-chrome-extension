document.addEventListener('DOMContentLoaded', function() {
  let siteListElement = document.getElementById('siteList');

  // Fetch site time data from storage
  chrome.storage.local.get('siteTime', function (result) {
      let siteTime = result.siteTime || {};
      console.log(siteTime); // Log the retrieved site time data for debugging

      // Clear previous site list content
      siteListElement.innerHTML = '';

      // Create and append elements for each site time entry
      Object.keys(siteTime).forEach(url => {
          let timeSpent = siteTime[url];
          let element = document.createElement('div');
          element.textContent = `${url}: ${timeSpent.toFixed(2)} seconds`;
          siteListElement.appendChild(element);
      });

      // Check if no data is available and show a message
      if (Object.keys(siteTime).length === 0) {
          let noDataElement = document.createElement('div');
          noDataElement.textContent = 'No data available.';
          siteListElement.appendChild(noDataElement);
      }
  });
});

document.addEventListener('DOMContentLoaded', function() {
    let siteListElement = document.getElementById('siteList');

    // Fetch site time data from storage
    chrome.storage.local.get('siteTime', function (result) {
        let siteTime = result.siteTime || {};
        console.log(siteTime); // Log the retrieved site time data for debugging

        // Clear previous site list content
        siteListElement.innerHTML = '';

        // Create and append elements for each site time entry
        Object.keys(siteTime).forEach(url => {
            let timeSpent = siteTime[url];
            let element = document.createElement('div');
            element.textContent = `${url}: ${timeSpent.toFixed(2)} seconds`;
            siteListElement.appendChild(element);
        });

        // Check if no data is available and show a message
        if (Object.keys(siteTime).length === 0) {
            let noDataElement = document.createElement('div');
            noDataElement.textContent = 'No data available.';
            siteListElement.appendChild(noDataElement);
        }
    });

    // Event listener for the reset button
    let resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', function() {
        // Reset the time tracker
        resetTimeTracked();
    });

    // Function to reset time tracker
    function resetTimeTracked() {
        chrome.storage.local.set({ siteTime: {} }, function() {
            console.log('Time tracker reset');
            // Clear the site list content
            siteListElement.innerHTML = 'Time tracker reset.';
        });
    }
});
