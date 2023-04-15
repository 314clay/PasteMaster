chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'addText') {
    chrome.storage.sync.get('textLibrary', ({ textLibrary }) => {
      if (!textLibrary) {
        textLibrary = [];
      }
      textLibrary.push(request.text);
      chrome.storage.sync.set({ textLibrary }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'addText') {
    // Existing code...
  } else if (request.type === 'pasteText') {
    document.execCommand('insertText', false, request.text);
  }
});