document.addEventListener('DOMContentLoaded', () => {
  // Select the input, save button, and saved info list
  const infoInput = document.getElementById('info');
  const saveButton = document.getElementById('save');
  const savedInfoList = document.getElementById('savedInfoList');

  // Set the initial selected item index to 0
  let selectedItemIndex = 0;

  // Function to update the selection and UI
function updateSelection() {
  const savedInfoItems = savedInfoList.querySelectorAll('li');
  savedInfoItems.forEach((item, index) => {
    if (index === selectedItemIndex) {
      item.classList.add('selected');
      item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          console.log(item.innerText);
        }
      });
    } else {
      item.classList.remove('selected');
    }
  });
}


  // Add event listeners for keydown events
  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        // If the selected item is already the first item, do nothing
        if (selectedItemIndex === 0) {
          return;
        }
        // Otherwise, move the selection up by one and update the UI
        selectedItemIndex--;
        updateSelection();
        break;
      case 'ArrowDown':
        // If the selected item is already the last item, do nothing
        if (selectedItemIndex === savedInfoList.childElementCount - 1) {
          return;
        }
        // Otherwise, move the selection down by one and update the UI
        selectedItemIndex++;
        updateSelection();
        break;
      case 'Enter':
        const savedInfoItems = savedInfoList.querySelectorAll('li');
        const selectedItem = savedInfoItems[selectedItemIndex];
        if (selectedItem) {
          const selectedText = selectedItem.innerText;
          // Send a message to the content script to paste the selected text
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'pasteText', text: selectedText }, () => {
              window.close(); // Close the popup after pasting the text
            });
          });
        }
        break;



    }
  });

  // Add event listener for when the list is clicked to update selection
  savedInfoList.addEventListener('click', (event) => {
    const clickedItem = event.target.closest('li');
    if (clickedItem) {
      selectedItemIndex = Array.from(savedInfoList.children).indexOf(clickedItem);
      updateSelection();
    }
  });

  // Load the saved info from storage and display it on the popup
  chrome.storage.sync.get('savedInfo', (data) => {
    if (data.savedInfo && Array.isArray(data.savedInfo)) {
      displaySavedInfo(data.savedInfo);
      selectedItemIndex = 0; // Set the initial selected item index to 0 after displaying the saved info
      updateSelection(); // Update the selection and UI
    }
  });

  // Add event listener for when the save button is clicked
  saveButton.addEventListener('click', () => {
    const info = infoInput.value;
    if (info) {
      chrome.storage.sync.get('savedInfo', (data) => {
        let savedInfo = data.savedInfo;
        if (!Array.isArray(savedInfo)) {
          savedInfo = [];
        }
        if (!savedInfo.includes(info)) { // check if info is already saved
          savedInfo.push(info);
          chrome.storage.sync.set({ 'savedInfo': savedInfo }, () => {
            console.log('Information saved:', info);
            displaySavedInfo(savedInfo);
            infoInput.value = ''; // clear the input field
            selectedItemIndex = savedInfo.length - 1; // Set the selected item index to the last item in the list
updateSelection(); // Update the selection and UI
});
} else {
console.log('Information already saved:', info);
}
});
}
});

// Function to display the saved info on the popup
function displaySavedInfo(savedInfo) {
savedInfoList.innerHTML = '';
savedInfo.forEach((item, index) => {
const listItem = document.createElement('li');
listItem.innerText = item;
savedInfoList.appendChild(listItem);
});
}

// Select the clear button
const clearButton = document.getElementById('clear');

// Add event listener for when the clear button is clicked
clearButton.addEventListener('click', () => {
chrome.storage.sync.remove('savedInfo', () => {
console.log('Saved information cleared.');
savedInfoList.innerHTML = '';
selectedItemIndex = 0;
updateSelection(); // Update the selection and UI
});
});

});



