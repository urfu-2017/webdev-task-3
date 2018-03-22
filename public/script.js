'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementsByClassName('place-creater__button')[0];
    button.addEventListener('click', createPlace);
});

function createPlace() {
    const place = document.getElementsByClassName('place-creater__input')[0].value;
    var places = document.getElementsByClassName('places')[0];
    var article = createArticle(place);
    places.appendChild(article);
    const input = document.getElementsByClassName('places__checked-control')[0];
    input.addEventListener('change', () => {
        const text = input.parentElement.previousElementSibling.lastElementChild;
        if (input.checked) {
            text.style.textDecoration = 'line-through';
        } else {
            text.style.textDecoration = 'none';
        }
    });
}

function createArticle(place) {
    var article = document.createElement('article');
    article.setAttribute('class', 'places__item');
    article.innerHTML = `<div class="places__control control">
            <div class="control__imgs">
                <img src="imgs/editing.png" 
                    alt="Изображение карандаша" class="places__editing-control"> 
                <img src="imgs/basket.png" 
                    alt="Изображение корзины" class="places__deleting-control">
            </div>
            <p class="control__text">${place}</p>
        </div>
        <div class="places__control">
            <p class="places__moving-control">&#11015;</p>
            <input type="checkbox" class="places__checked-control">
        </div>
    `;

    return article;
}
