let words;
const keycaps = document.querySelectorAll('.keycap');
const wordList = document.querySelector('.dictionary-list');
const toastBody = document.querySelector('.toast-body');
const myToast = new bootstrap.Toast(document.querySelector('.toast'));

fetch('../json/dictionary-list.json')
  .then(response => response.json())
  .then(data => words = data) // массив объектов, созданных из файла JSON
  .catch(error => console.error(error)
);

function searchWordsUa(letter) {
  return words.filter(word => {
    const name_ua = word.name_ua.toLowerCase();
    return name_ua.charAt(0) === letter.toLowerCase();
  }).map(word => ({ name: word.name_ua, translate: word.name_en, description: word.description_ua }));
}

function searchWordsEn(letter) {
  return words.filter(word => {
    const name_en = word.name_en.toLowerCase();
    return name_en.charAt(0) === letter.toLowerCase();
  }).map(word => ({ name: word.name_en, translate: word.name_ua, description: word.description_en }));
}

keycaps.forEach(keycap => {
  keycap.addEventListener('click', () => {

    const keycapValue = keycap.querySelector('a').textContent;

    if (/[а-яґєії]/i.test(keycapValue)) {
      const wordsUa = searchWordsUa(keycapValue);
      if (wordsUa.length > 0) {
        clearWordList();
        wordsUa.forEach(word => addWordToDOM(word));
        wordList.focus();
      } else {
        showToast();
      }
    }

    if (/^[a-z\s]+$/i.test(keycapValue)) {
      const wordsEn = searchWordsEn(keycapValue);
      if (wordsEn.length > 0) {
        clearWordList();
        wordsEn.forEach(word => addWordToDOM(word));
        wordList.focus();
      } else {
        showToast();
      }
    }

  }); 
});

function addWordToDOM(word) {
  const randomID = idGenerator();
  const listItem = document.createElement('li');
  listItem.classList.add('w-50', 'p-2');

  const dropdownLink = document.createElement('a');
  dropdownLink.classList.add('ms-2');
  dropdownLink.setAttribute('aria-controls', `${randomID}`);
  dropdownLink.setAttribute('aria-expanded', 'false');
  dropdownLink.setAttribute('role', 'button');
  dropdownLink.setAttribute('href', `#${randomID}`);
  dropdownLink.setAttribute('data-bs-toggle', 'collapse');
  dropdownLink.innerText = word.name;

  const dropdownBlock = document.createElement('div');
  dropdownBlock.classList.add('collapse', 'px-2');
  dropdownBlock.setAttribute('id', `${randomID}`);

  dropdownBlock.innerHTML = `
    <h4 class="my-2">${word.translate}</h4>
    <p class="m-0 p-0">${word.description}</p>
  `;

  listItem.appendChild(dropdownLink);  
  listItem.appendChild(dropdownBlock);  
  wordList.appendChild(listItem); 
}

function idGenerator() {
  return `collapse-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
}

function clearWordList() {
  wordList.innerHTML = '';
}

function showTime() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:
          ${now.getMinutes().toString().padStart(2, '0')}:
          ${now.getSeconds().toString().padStart(2, '0')}`;
}

function showToast() {
  const toastContainer = document.querySelector('#toastContainer');
  const toastEl = document.createElement('div');
  toastEl.classList.add('toast', 'text-bg-danger');
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'assertive');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.innerHTML = `
    <div class="toast-header">
      <div class="rounded me-2"><i class="bi bi-robot"></i></div>
      <strong class="me-auto">Robot assistant</strong>
      <small>${showTime()}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body text-bg-dark">
      <h5>Вибачте, але на цю букву немає слів у словнику.</h5>
    </div>
  `;
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
  toastContainer.appendChild(toastEl);
}