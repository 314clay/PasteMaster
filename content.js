chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pasteText') {
    const activeElement = document.activeElement;
    const startPosition = activeElement.selectionStart;
    const endPosition = activeElement.selectionEnd;
    const oldValue = activeElement.value;
    const pastedValue = request.text;

    activeElement.value = oldValue.slice(0, startPosition) + pastedValue + oldValue.slice(endPosition);
    activeElement.selectionStart = startPosition + pastedValue.length;
    activeElement.selectionEnd = startPosition + pastedValue.length;
    activeElement.focus();
  }
});