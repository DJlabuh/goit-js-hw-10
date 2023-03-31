import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './fetchCountries.js';
import './css/styles.css';

const searchBox = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;

searchBox.addEventListener(
  'input',
  debounce(() => {
    const searchTerm = searchBox.value.trim();
    clearResults();
    if (searchTerm !== '') {
      fetchCountries(searchTerm)
        .then(countries => {
          if (countries.length > 10) {
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
          } else if (countries.length > 1) {
            renderCountries(countries);
          } else if (countries.length === 1) {
            displayCountryInfo(countries[0]);
          }
        })
        .catch(error => {
          console.error(error);
          Notiflix.Notify.failure(error.message);
        });
    }
  }, DEBOUNCE_DELAY)
);

function renderCountries(countries) {
  countryList.innerHTML = '';
  const listItems = countries.map(country => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = country.flag;
    img.alt = `Flag of ${country.name}`;
    li.appendChild(img);
    li.appendChild(document.createTextNode(country.name));
    return li;
  });
  countryList.append(...listItems);

  countryList.addEventListener('click', event => {
    const clickedListItem = event.target.closest('li');
    if (clickedListItem && countryList.contains(clickedListItem)) {
      const clickedCountry = countries.find(
        country => country.name === clickedListItem.textContent
      );
      displayCountryInfo(clickedCountry);
    }
  });
}

function displayCountryInfo(country) {
  const { name, capital, population, flag, languages } = country;
  const html = `
    <h2 class="country-info-name">${name}</h2>
    <img class="country-info-img" src="${flag}" alt="Flag of ${name}">
    <p><strong>Capital:</strong> ${capital}</p>
    <p><strong>Population:</strong> ${population.toLocaleString()}</p>
    <p><strong>Languages:</strong> ${languages}</p>
  `;
  countryInfo.innerHTML = html;
}

function clearResults() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
