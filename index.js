require('dotenv').config();

const {inquirerMenu, pause, readInput, listCities} = require('./helpers/inquirer');
const Searches = require('./models/searches');

const main = async () => {

    const searches = new Searches();
    let opt;

    do {

        opt = await inquirerMenu();

        switch( opt ) {
            case 1:
                // Show message
                const place = await readInput('City: ');

                // Search places
                const places = await searches.city(place);

                // Select place
                const selectedId = await listCities(places);

                // To avoid a error with the following sentences and pass to next iteration
                if ( selectedId === 0 ) continue;

                const selectedPlace = places.find(l => l.id === selectedId);

                // Save in DB
                searches.addHistory(selectedPlace.name)

                // Place info -> name, longitude and latitude
                const {name: placeName, lng, lat} = selectedPlace;

                // Weather
                const {temp, min, max, desc} = await searches.cityWeather(lat, lng);

                // Show up results
                console.clear();
                console.log('\nCity information\n'.green);
                console.log('City:', placeName.green);
                console.log('Lat:', lat);
                console.log('Lng:', lng);
                console.log('Temperature:', temp);
                console.log('Min:', min);
                console.log('Max:', max);
                console.log('How is it?: ', desc.green);
                break;

            case 2:
                searches.capitalizedHistory.forEach( (place, i) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ place }`);
                })
                break;
        }

        if ( opt !== 0 ) await pause();

    } while ( opt !== 0 )
}

main();