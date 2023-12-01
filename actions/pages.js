const items = require('./items.js');
const saveItem = require('./saveItem.js');

const execute = async (assets, page) => {
    let pagesNumber = assets.items.last_page;
    for(let curPage = 1; curPage <= pagesNumber; curPage++) {
        //Notificar qual página está efetuando o cadastro de itens
        await items.notify(`Página ${curPage} de ${assets.items.last_page}`)
        
        //Buscar itens por pagina
        let itemsByPage = await items.byPage(assets.deptId, curPage);
        await saveItem.execute(itemsByPage, page);
        pagesNumber = await itemsByPage.last_page;
    }
}

module.exports = { execute };