const colors = require("colors");
require("dotenv").config();

const {
    inquirerMenu,
    leerInput,
    pausa,
    listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    const busquedas = new Busquedas();
    let opt;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //mostrar mensaje
                const termino = await leerInput("Ciudad: ");

                //buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                //Selecionar el lugar
                const id = await listarLugares(lugares);

                if (id === 0) continue;

                const { lat, lng, nombre } = lugares.find((l) => l.id === id);

                //guardar en DB
                busquedas.agregarHistorial(nombre);

                //datos del clima
                const { desc, temp, temp_min, temp_max } =
                    await busquedas.climaLugar(lat, lng);

                // Mostrar resultados
                console.clear();
                console.log("\n Informacion de la ciudad\n".green);
                console.log("Ciudad:", nombre.green);
                console.log("Lat:", lat);
                console.log("Lng:", lng);
                console.log("Temperatura:", temp, "°C".yellow);
                console.log("Minima:", temp_min, "°C".yellow);
                console.log("Maxima:", temp_max, "°C".yellow);
                console.log("Tiempo:", desc.green);

                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1 + "."}`.green;
                    console.log(`${idx} ${lugar}`);
                });
                break;
        }

        if (opt !== 0) await pausa();
    } while (opt !== 0);
};

main();
