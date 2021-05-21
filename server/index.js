const express = require('express')
const path = require('path');
var bodyParser = require('body-parser');
const app = express()
const port = 3001

const callURL = require('./callURL');


var callU = new callURL();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.set('port', (process.env.PORT || 5000));

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));
// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });

app.post("/list", function (request, response) {
    var url = request.body.url;
    console.log(url);
    callU.call(url, function(err, cb){
        response.json(cb.res)
    });
    
});
app.listen(app.get('port'), () => console.log(`Example app listening on port port!`))