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
    } else {
      clearResults();
    }
  }, DEBOUNCE_DELAY)
);

function renderCountries(countries) {
  countryList.innerHTML = '';
  countries.forEach(country => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = country.flag;
    img.alt = `Flag of ${country.name}`;
    li.appendChild(img);
    li.appendChild(document.createTextNode(country.name));
    li.addEventListener('click', () => {
      displayCountryInfo(country);
    });
    countryList.appendChild(li);
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
  clearResults();
}

function clearResults() {
  countryList.innerHTML = '';
}
