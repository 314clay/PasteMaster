function pasteText(activeElement, pastedValue) {
  const startPosition = activeElement.selectionStart;
  const endPosition = activeElement.selectionEnd;
  const oldValue = activeElement.value;

  activeElement.value = oldValue.slice(0, startPosition) + pastedValue + oldValue.slice(endPosition);
  activeElement.selectionStart = startPosition + pastedValue.length;
  activeElement.selectionEnd = startPosition + pastedValue.length;
  activeElement.focus();
}

function pasteTextToContentEditableDiv(element, text) {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.setEndAfter(node);
  selection.removeAllRanges();
  selection.addRange(range);
  element.focus();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'pasteText') {
    const activeElement = document.activeElement;
    const pastedValue = request.text;

    if (activeElement.getAttribute('contenteditable') === 'true') {
      pasteTextToContentEditableDiv(activeElement, pastedValue);
    } else {
      pasteText(activeElement, pastedValue);
    }
  }
});
