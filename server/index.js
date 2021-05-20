const express = require('express')
const path = require('path');
var bodyParser = require('body-parser');
const app = express()
const port = 3001

const callURL = require('./callURL');


var callU = new callURL();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.get('/', (req, res) => res.send('Hello World!'))


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));
// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

app.get("/list/:url", function (request, response) {
    var salida = callU.call('https://letterboxd.com/johncassavetes/list/old-films-for-people-who-want-to-watch-more/');
    response.statusCode = 200;
    response.send(salida);
});

app.post("/list", function (request, response) {
    var url = request.body.url;
    console.log(url);
    callU.call(url, function(err, cb){
        response.json({url: cb.res})
    });
    
});
app.listen(port, () => console.log(`Example app listening on port port!`))