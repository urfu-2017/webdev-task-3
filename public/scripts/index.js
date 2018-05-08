'use strict';

const placesList = document.getElementsByClassName('places_list')[0];
const createButton = document.getElementsByClassName('create_button')[0];
const createInput = document.getElementsByClassName('create_input')[0];
const allPlaces = document.getElementsByClassName('places_all')[0];
const searchPlaces = document.getElementsByClassName('search_button')[0];
const searchInput = document.getElementsByClassName('search_input')[0];
const placesListItems = document.getElementsByClassName('places_list_item');
const deleteAllPlaces = document.getElementsByClassName('places_clear')[0];
const toVisitPlaces = document.getElementsByClassName('places_visit')[0];
const visitedPlaces = document.getElementsByClassName('places_novisit')[0];

window.onload = async () => {
    places = await placeApi.getAll();
    for (let place of places) {
        new Place(place);
    }
};
