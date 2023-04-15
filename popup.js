document.getElementById('save').addEventListener('click', () => {
  const info = document.getElementById('info').value;
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
        });
      } else {
        console.log('Information already saved:', info);
      }
    });
  }
});


chrome.storage.sync.get('savedInfo', (data) => {
  if (data.savedInfo && Array.isArray(data.savedInfo)) {
    displaySavedInfo(data.savedInfo);
  }
});

function displaySavedInfo(savedInfo) {
  const savedInfoList = document.getElementById('savedInfoList');
  savedInfoList.innerHTML = '';
  savedInfo.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.innerText = item;
    savedInfoList.appendChild(listItem);
  });
}