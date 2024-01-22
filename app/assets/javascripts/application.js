//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {

  /*
  The loop below iterates over every link with 'tab-link' CSS class and adds an event listener to change the visibility of each tab contents
  This should gracefully degrade if JavaScript fails to load for whatever reason.
  */
 const tabLinks = Array.from(document.querySelectorAll('.tab-link')); // Create an array of all of the tab link elements
  const tabUrls = tabLinks.map(tab => tab.dataset['tab']) // Links we are expecting to see in the history
  tabLinks.forEach(tabLink => tabLink.addEventListener('click', event => { // Add an event listener for every link that fires when those links are followed
    event.preventDefault(); // Don't actually navigate to the page
    const link = event.target.getAttribute('data-tab'); // Get the tab name or number from its custom attribute
    changeTab(link, false); // Change tab
  }));
  window.addEventListener('popstate', event => { // When the user navigates via their browser history (including use of the forward/back buttons) this event fires
    const link = document.location.pathname; // Get ®whichever tab we're on (again we'd have to check which page we're viewing at this point)
    if (tabUrls.some(tabUrl => link === tabUrl)) { // Check if we're still on the tab (this would have to check for specific URL names in the MYVT portal)
      changeTab(link, true) // Change the tab (with the "navigating history" boolean set to true)
    }
  })

  function changeTab(tab, navigatingHistory) {
    if (!navigatingHistory) history.pushState(true, tab, [tab]);
    const oldActiveTabs = Array.from(document.querySelectorAll('*.active-tab'));
    oldActiveTabs.forEach(oldActiveTab => {
      oldActiveTab.classList.remove('active-tab')
      if (oldActiveTab.tagName === "A") {
        oldActiveTab.setAttribute('aria-selected', false)
        oldActiveTab.setAttribute('tabindex', -1)
      };
    });
    const newActiveTabs = Array.from(document.querySelectorAll(`*[data-tab="${tab}"]`));
    newActiveTabs.forEach(newActiveTab => {
      newActiveTab.classList.add('active-tab')
      if (newActiveTab.tagName === "A") {
        newActiveTab.setAttribute('aria-selected', true);
        newActiveTab.removeAttribute('tabindex')
        document.title = `${newActiveTab.textContent} – Facility management – Manage your vehicle testing`;
        document.querySelector('#current-page-crumb').textContent = newActiveTab.textContent;
      }
    });
  }

  const keys = { 37: -1, 38: -1, 39: 1, 40: 1 }
  tabLinks.forEach((tabLink, index) => tabLink.addEventListener('keydown', event => {
    if (event.keyCode == 37 || event.keyCode == 39) {
      event.preventDefault();
      const nextTab = tabLinks[index + keys[event.keyCode] < 0 ? tabLinks.length - 1 : (index + keys[event.keyCode]) % tabLinks.length]
      const link = nextTab.getAttribute('data-tab');
      changeTab(link, false); // Change tab
      nextTab.focus();
    }
  }));


})
