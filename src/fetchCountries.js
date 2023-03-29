export function fetchCountries(name) {
  const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Oops, there is no country with that name`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const countries = data.map(country => ({
        name: country.name.official,
        capital: country.capital?.[0] || 'Unknown',
        population: country.population || 'Unknown',
        flag: country.flags?.svg || '',
        languages: Object.values(country.languages),
      }));
      return countries;
    })
    .catch(error => {
      console.error(error);
      throw error;
    });
}
