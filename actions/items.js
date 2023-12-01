const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });
const api = require('../api/index.js');

const ask = (ask) => {
    return new Promise((resolve) => {
        rl.question(ask, (answer) => {
            resolve(answer);
        });
    });
}

const get = async () => {
    // Escolher orgão
    const chooseOrgan = await ask(`Escolha o órgão desejado: \n ${await api.getSetors()} \n\n`);
    
    //Escolher departamento
    const chooseDept = await ask(`\nEscolha o departamento desejado: \n ${await api.getSetor(chooseOrgan)}\n\n`);

    //Retornar itens
    const items = await api.getItensByCostCenter(chooseDept)
    
    rl.close();
    
    return { items: items, deptId: chooseDept };

};

const byPage = async (deptId, page) => {
   
    const items = await api.getItensByCostCenter(deptId, page)
    
    return items;
};

const notify = async (message) => {
    return await api.notify(message);
};

module.exports = { get, byPage, notify };