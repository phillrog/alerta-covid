const axios = require('axios');

const tracker = axios.create({
    baseURL: 'http://www.trackcorona.live/api'
});

export default tracker;

// const tracker = axios.create({
//     baseUrl: "http://www.trackcorona.live/api"
// });

// cities = axios.create({
//     baseUrl: "http://servicodados.ibge.gov.br/api/v1/localidades"
// });


// module.exports = {
//     api : {
//         tracker,
//         cities
//     }
// }