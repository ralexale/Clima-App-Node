const colors = require("colors");
const { input, confirm, select } = require("@inquirer/prompts");

const inquirerMenu = async () => {
    console.clear();
    console.log("========================".green);
    console.log("  Selecione una opción".yellow);
    console.log("========================\n".green);

    const options = await select({
        message: "¿ Que desea hacer ?",
        choices: [
            {
                name: `${"1.".green} Buscar ciudad`,
                value: 1,
                description: "Busca un ciudad para ver el clima",
            },
            {
                name: `${"2.".green} Historial`,
                value: 2,
                description:
                    "muestra el historial de las ciudades que has buscado",
            },
            {
                name: `${"0.".green} salir`,
                value: 0,
                description: "muestra la lista de tareas completadas",
            },
        ],
    });

    return options;
};

const leerInput = async (message) => {
    const res = await await input({
        message,
        validate: (value) => (value ? true : "Por favor ingresa un valor"),
    });

    return res;
};

const listarLugares = async (lugares = []) => {
    const opt = lugares.map((lugar, i) => {
        const idx = `${colors.green(i + 1 + ".")}`;
        return {
            name: `${idx} ${lugar.nombre}`,
            value: lugar.id,
        };
    });

    opt.unshift({
        value: 0,
        name: "0.".green + " Cancelar",
    });

    const id = await select({
        message: "elija la Ciudad",
        choices: opt,
    });

    return id;
};

const confirmar = async (mensaje) => {
    const res = await confirm({
        message: mensaje,
    });
    return res;
};

const pausa = async () => {
    console.log("\n");
    await input({
        message: `Presiona ${"Enter".yellow} para continuar`,
    });
};

module.exports = {
    leerInput,
    pausa,
    inquirerMenu,
    listarLugares,
    confirmar,
};
