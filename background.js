// Open options page when clicking the extension icon
browser.browserAction.onClicked.addListener(() => {
  browser.runtime.openOptionsPage();
});
