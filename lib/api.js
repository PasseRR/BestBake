var config = require('../config.js');

module.exports = {
    getUrl(route) {
        return `https://${config.host}${config.basePath}${route}`;
    },
    productsUrl(){
        return `https://${config.host}/1/list/${config.productsListId}/cards`
    },
};