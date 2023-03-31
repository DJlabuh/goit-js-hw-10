export function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => mapCountryData(data))
    .catch(error => {
      console.error(error);
      throw error;
    });
}

function mapCountryData(data) {
  return data.map(country => ({
    name: country.name.official,
    capital: country.capital?.[0] || 'Unknown',
    population: country.population || 'Unknown',
    flag: country.flags?.svg || '',
    languages: Object.values(country.languages),
  }));
}
