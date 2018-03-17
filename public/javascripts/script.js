'use strict';
var list = document.getElementsByClassName('insertion-form');
var onSubmitHandler = () => {
    var input = document.getElementsByClassName('insertion-form__input');
    console.info(input[0].value);
};
list[0].addEventListener('submit', onSubmitHandler);
