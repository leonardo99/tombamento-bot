const puppeteer = require('puppeteer');
const login = require('./actions/login.js');
const auth = require('./actions/verifyLogin.js');
const items = require('./actions/items.js');
const pages = require('./actions/pages.js');
require('dotenv').config();

(async() => {
    try {
        const browser = await puppeteer.launch({
        headless: false,
        });

        const page = await browser.newPage();
    
        //Fazer login
        await login.signIn(page);

        //Verificar se a autenticação do usuário foi realizada
        await auth.verify(page, login);

        //Acessar página para cadastro de itens
        await page.goto(`${process.env.URL}/gcap/bens/adicionar`);

        //Retornar itens com base em um centro de custos
        const assets = await items.get();

        //Verificar quantidade de paginas
        if(assets.items.data.length) {
            //Notifica sobre a situação do cadastro
            await items.notify(`Departamento nº: ${assets.deptId}\nSituação: Iniciando cadastro de itens`);
            //Percorre cada pagina em busca de itens para salvar no sistema
            await pages.execute(assets, page);
        }

        await items.notify(`Departamento nº: ${assets.deptId}\nSituação: Todos os itens foram cadastrados`);
        await browser.close();
     
    } catch (error) {
        await items.notify(`Ocorreu um erro\nSituação: ${error}`); 
    }

})();
