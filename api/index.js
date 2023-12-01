const axios = require('axios');

const baseUrl = 'http://localhost/api';

//Listar orgãos
const getSetors = () => {
    return axios.get(`${baseUrl}/setores`).then((setores) => {
        return setores.data.map((setor) => "\n"+setor.id+" - "+setor.nome);
    }).catch((error) => {
        console.log(error);
    });
};

//Retornar órgão especifico e repotornar seus departamentos
const getSetor = (setorId) => {
    return axios.get(`${baseUrl}/setor/${setorId}`).then((centers) => {
        return centers.data.departamentos.map((center) => "\n"+center.id+" - "+center.nome);
    }).catch((error) => {
        console.log(error);
    })
};

//Retornar itens de um centro de custos especifico
const getItensByCostCenter = (departamentoId, page=1) => {
    return axios.get(`${baseUrl}/departamento/${departamentoId}/itens?page=${page}`).then((items) => {
        return items.data;
        // return items.data.data;
    }).catch((error) => {
        console.log(error);
    })
};

const markAsConcluded = (itemId) => {
    return axios.post(`${baseUrl}/itens/${itemId}`).then((items) => {
        return items;
        // return items.data.data;
    }).catch((error) => {
        console.log(error);
    })   
};

const notify = async (message) => {
    return await axios.post(`${baseUrl}/notify`, {
        message: message
    }).then((items) => {
        return items;
        // return items.data.data;
    }).catch((error) => {
        console.log(error);
    })   
};


module.exports = { getSetors, getSetor, getItensByCostCenter, markAsConcluded, notify };