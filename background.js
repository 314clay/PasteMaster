
chrome.runtime.onConnect.addListener((port) => {
  let activeTabId;
  let activeElementTagName;
  let activeElementPath = [];

  if (port.name === 'popup') {
    port.onMessage.addListener((message) => {
      if (message.action === 'storeFocusedElement') {
        activeTabId = message.tabId;
        activeElementTagName = message.tagName;
        activeElementPath = message.path;
      } else if (message.action === 'getFocusedElement') {
        port.postMessage({
          action: 'restoreFocus',
          tagName: activeElementTagName,
          path: activeElementPath,
        });
      }
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === '_execute_browser_action') {
    chrome.browserAction.openPopup();
  }
});
