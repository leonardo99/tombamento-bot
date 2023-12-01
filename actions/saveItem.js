const api = require('../api/index.js');
const execute = async (items, page) => {
    for(const item of items.data) {
        //Forma de aquisição
        console.log("cadastro do item id: ", item.id, "\ntombamento n: ", item.num_tom);
        await page.$(process.env.INPUT_1);
        await page.select(process.env.INPUT_1, item.nf_num !== '' ? '2' : '1');
        await page.waitForTimeout(700);
        
        let inputFormaAquisicao = await page.$eval(process.env.INPUT_1, input => input.value);
        
        //Tipo de identificação
        await page.$(process.env.INPUT_2);
        await page.waitForSelector(process.env.INPUT_2);
        await page.select(process.env.INPUT_2, item.categoria_id === 10 ? "3" : "1");
        let identificacao = await page.$eval(process.env.INPUT_2, input => input.value);
        await page.waitForTimeout(700);
        
        //Identificação do bem
        await page.$(process.env.INPUT_2);
        await page.waitForSelector(process.env.INPUT_2);
        await page.type(process.env.INPUT_2, item.num_tom.toString());
        await page.waitForTimeout(500);
        
        //Orgão da localização do bem
        await page.$(process.env.INPUT_4);
        await page.waitForSelector(process.env.INPUT_4);
        await page.select(process.env.INPUT_4, item.departamento.setor.siafc_id.toString());
        await page.waitForTimeout(5000);
        
        if(item.categoria_id === 10) {
            await page.$(process.env.INPUT_5);
            await page.waitForSelector(process.env.INPUT_5);
            await page.select(process.env.INPUT_5, item.departamento.siafc_unid_orc.toString());
            await page.waitForTimeout(700);
        }

        //Preencher os campos somente se o tipo de identificação for plaqueta
        if(identificacao === "1") {
            // Condição de uso do bem
            await page.$(process.env.INPUT_6);
            await page.waitForSelector(process.env.INPUT_6);
            await page.select(process.env.INPUT_6, item.tp_depreciacao);
            await page.waitForTimeout(700);
            
            //Localização do bem (Centro de custo)
            await page.$(process.env.INPUT_7);
            await page.waitForSelector(process.env.INPUT_7);
            await page.select(process.env.INPUT_7, item.departamento.siafc_dept_id.toString());
            await page.waitForTimeout(1000);
        }

        //Grupo do bem
        await page.waitForSelector(process.env.INPUT_8);
        await page.select(process.env.INPUT_8, item.siafc_grupo.toString());
        await page.waitForTimeout(1000);
        
        //Descrição do bem
        await page.$(process.env.INPUT_9);
        await page.waitForSelector(process.env.INPUT_9);
        await page.type(process.env.INPUT_9, item.num_bem);
        await page.waitForTimeout(500);

        // Responsável pelo bem
        inputFormaAquisicao === '2' ? await page.waitForSelector(process.env.INPUT_10) : await page.waitForSelector(process.env.INPUT_11);
        let responsavel = inputFormaAquisicao === '2' ? process.env.INPUT_10 : process.env.INPUT_11;
        await page.select(responsavel, item.funcionario.siafc_responsavel.toString());
        await page.waitForTimeout(500);
    
        // Data da aquisição
        inputFormaAquisicao === '2' ? await page.waitForSelector(`#${process.env.INPUT_12}`) : await page.waitForSelector(`#${process.env.INPUT_13}`);
        let dataAquisicao = inputFormaAquisicao === '2' ? process.env.INPUT_12 : process.env.INPUT_13;
        await page.evaluate((value, inputId) => {
            document.getElementById(inputId).value = value;
        }, item.data_tomb, dataAquisicao);
        await page.waitForTimeout(500);
        
        if(item.nf_num !== ''){
            // Fornecedor
            await page.waitForSelector(`#${process.env.INPUT_14}`);
            await page.evaluate((value) => {
                document.getElementById(process.env.INPUT_14).value = value;
            }, item.fornecedor.siafc_fornecedor_id.toString());
            await page.waitForTimeout(500);

            // Nota fiscal
            await page.waitForSelector(`#${process.env.INPUT_15}`);
            let nf = item.nf_num?.toString() ?? '000000';
            await page.evaluate((value) => {
                document.getElementById(process.env.INPUT_15).value = value;
            }, nf);
            await page.waitForTimeout(1000);

            // Garantia
            await page.$(process.env.INPUT_16);
            await page.waitForSelector(process.env.INPUT_16);
            await page.type(process.env.INPUT_16, '12');
            await page.waitForTimeout(500);
        }

        // Data da depreciação
        inputFormaAquisicao === '2' ? await page.waitForSelector(`#${process.env.INPUT_17}`) : await page.waitForSelector(`#${process.env.INPUT_18}`);
        let dataDepreciacao = inputFormaAquisicao === '2' ? process.env.INPUT_17 : process.env.INPUT_18;
        await page.evaluate((value, inputId) => {
            document.getElementById(inputId).value = value;
        }, item.data_tomb, dataDepreciacao);
        await page.waitForTimeout(1000);
 
        // Valor
        inputFormaAquisicao === '2' ? await page.waitForSelector(`#${process.env.INPUT_19}`) : await page.waitForSelector(`#${process.env.INPUT_20}`);
        let valorInput = inputFormaAquisicao === '2' ? process.env.INPUT_19 : process.env.INPUT_20;
        let vl_original = item.categoria_id === 10 ? item.vr_imovel : item.valor;
        await page.evaluate((value, inputId) => {
            document.getElementById(inputId).value = value;
        }, vl_original, valorInput);
        await page.waitForTimeout(500);
        
        // Salvar
        await page.click(process.env.BUTTON_1);

        await page.waitForNavigation({ timeout: 60000 });
        
        //Marcar item como cadastrado no siafc
        await api.markAsConcluded(item.id);
    }
}

module.exports = { execute };