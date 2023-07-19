const { parse } = require('csv-parse');
const fs = require('fs');

// This function defines a list of habitable planets.
const habitablePlanets = [];

// This function determines whether a planet is habitable.
function isHabitablePlanet(planet) {
  // The planet is habitable if it is confirmed, has an insolation between 0.36 and 1.11, and has a planetary radius less than 1.6.
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

// This function reads the CSV file and parses it into an array of objects.
fs.createReadStream('kepler_data.csv')
  // This line tells the parser to ignore lines that start with a '#'.
  .pipe(parse({
    comment: '#',
    columns: true,
  }))
  // This line iterates over the parsed data and adds any habitable planets to the list of habitable planets.
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  // This line prints an error message if there is an error.
  .on('error', (err) => {
    console.log(err);
  })
  // This line prints the names of the habitable planets and the number of habitable planets found.
  .on('end', () => {
    console.log(habitablePlanets.map((planet) => {
      return planet['kepler_name'];
    }));
    console.log(`${habitablePlanets.length} habitable planets found!`);
  });
