const bodyParser = require('body-parser');
const testeRout = require('./testeRout');
const instagramRoutes = require('./instagramRoutes');
const userRoutes = require('./UserRoutes');


module.exports = app => {
    //habilitando o body-parser para leitura de json
    app.use(bodyParser.json());

    //definindo as rotas
    app.use(
        testeRout,
        instagramRoutes,
        userRoutes
    );
}