const fs = require("node:fs");
const axios = require("axios");
const _ = require("lodash");

class Busquedas {
    historial = [];

    Dbpath = "./db/database.json";

    constructor() {
        // TODO: leer db si existe
        this.leerDB();
    }

    get historialCapitalizado() {
        return this.historial.map((lugar) => {
            let palabras = lugar.split(" ");
            palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));
            return palabras.join(" ");
        });
    }

    get paramsMapBOX() {
        return {
            access_token: process.env.MAPBOX_KEY,
            proximity: "ip",
            language: "es",
        };
    }

    get paramsWeather() {
        return {
            appid: process.env.OPEN_WEATHER_KEY,
            units: "metric",
            lang: "es",
        };
    }

    async ciudad(lugar = "") {
        try {
            // peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapBOX,
            });

            const {
                data: { features },
            } = await instance.get();

            return features.map((place, i) => ({
                id: place.id,
                nombre: place.place_name_es,
                lng: place.center[0],
                lat: place.center[1],
            }));
        } catch (error) {
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            const instace = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon },
            });

            const { data } = await instace.get();

            const { temp_min, temp_max, temp } = data.main;

            const desc = data.weather[0].description;

            return {
                desc,
                temp,
                temp_min,
                temp_max,
            };
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = "") {
        if (this.historial.includes(lugar.toLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0, 5);
        this.historial.unshift(lugar.toLowerCase());

        //grabar en DB
        this.guardarDB();
    }

    guardarDB() {
        const payload = {
            historial: this.historial,
        };

        fs.writeFileSync(this.Dbpath, JSON.stringify(payload));
    }

    leerDB() {
        if (!fs.existsSync(this.Dbpath)) {
            return null;
        }

        const info = fs.readFileSync(this.Dbpath, { encoding: "utf-8" });
        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}

module.exports = Busquedas;
