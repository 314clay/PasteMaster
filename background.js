chrome.commands.onCommand.addListener((command) => {
  if (command === '_execute_browser_action') {
    chrome.browserAction.openPopup();
  }
});
