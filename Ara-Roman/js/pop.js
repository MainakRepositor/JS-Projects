const callButton = document.querySelector('.popup-button');
const popup = document.querySelector('.popup');
const closeButton = popup.querySelector('.close-button');

popupToggle = () => {
  popup.classList.toggle('popup_opened');
}

closeOnBlack = (event) => {
  if (event.target === event.currentTarget) popupToggle();
}

callButton.addEventListener('click', popupToggle);
closeButton.addEventListener('click', popupToggle);
popup.addEventListener('click', closeOnBlack);