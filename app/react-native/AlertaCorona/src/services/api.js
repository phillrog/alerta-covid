const axios = require('axios');

tracker = axios.create({
    baseUrl: "https://www.trackcorona.live/api"
});

cities = axios.create({
    baseUrl: "https://servicodados.ibge.gov.br/api/v1/localidades"
});

module.exports = {
    api : {
        tracker,
        cities
    }
}