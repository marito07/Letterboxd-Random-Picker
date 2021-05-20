const express = require('express')
var bodyParser = require('body-parser');
const app = express()
const port = 3000

const callURL = require('./callURL');


var callU = new callURL();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) => res.send('Hello World!'))



app.get("/list/:url", function (request, response) {
    var salida = callU.call('https://letterboxd.com/johncassavetes/list/old-films-for-people-who-want-to-watch-more/');
    response.statusCode = 200;
    response.send(salida);
});

app.post("/list", function (request, response) {
    var url = request.body.url;
    callU.call(url, function(err, cb){
        response.json({url: cb.res})
    });
    
});
app.listen(port, () => console.log(`Example app listening on port port!`))