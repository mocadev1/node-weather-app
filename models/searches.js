const fs = require('fs');

const axios = require('axios');

class Searches {
    history = [];
    dbPath = './db/database.json';

    constructor() {
        this.readDB();
    }

    get capitalizedHistory() {
        return this.history.map( place => {
            let words = place.split(' ');
            words = words.map(w => w[0].toUpperCase() + w.substring(1));

            return words.join(' ');
        })
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async city( place = '' ) {
        try {
            // HTTP petition
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            return resp.data.features.map( place => ({
                id: place.id,
                name: place.place_name_es,
                lng: place.center[0],
                lat: place.center[1]
            }));

        } catch ( error ) {
            return [];
        }
    }

    async cityWeather( lat = 0 , lon = 0 ) {
        try {
            // HTTP petition
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.paramsOpenWeather,
                    lat,
                    lon
                }
            });

            const resp = await instance.get();

            // Destructuring data response
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                max: main.temp_max,
                min: main.temp_min,
                temp: main.temp
            }
        } catch ( error ) {
            console.log(error);
        }
    }

    addHistory( place = '') {

        if ( this.history.includes(place.toLocaleLowerCase()) ) {
            return;
        }

        // Limits history to 5 places
        this.history = this.history.splice(0, 4)

        this.history.unshift(place.toLocaleLowerCase());

        // Record in DB
        this.saveDB();
    }

    saveDB() {

        const payload = {
            history: this.history
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    readDB() {
        if ( !fs.existsSync(this.dbPath) ) return;


        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);
        console.log(data);
        const {history} = data;
        console.log(history);

        this.history = history
    }
}

module.exports = Searches;