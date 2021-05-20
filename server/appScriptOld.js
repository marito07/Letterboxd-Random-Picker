const cheerio = require('cheerio');
const axios = require('axios');
const readline = require('readline');
const { attr } = require('cheerio/lib/api/attributes');


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

var recursiveAsyncReadLine = function () {
    rl.question('List URL (write "0" to exit the program): ', function (answer) {
        if (answer == '0') //we need some base case, for recursion
            return rl.close(); //closing RL and returning from function.
        if(answer.startsWith('https://letterboxd.com/')){
            axios.get(answer).then((response) => {
                const $ = cheerio.load(response.data);

                console.clear();
                var twirlTimer = (function () { // Loading animation
                  var P = ["\\", "|", "/", "-"];
                  var x = 0;
                  return setInterval(function () {
                    process.stdout.write("\r" + P[x++]);
                    x &= 3;
                  }, 250);
                })();

                var allFilms = [];
                var promises = [];
                var aux = $('meta[name="description"]').attr('content').split(' ');
                var listLength = aux[3];
                $('.poster-list li div').each((i, movie)=>{
                    allFilms.push('https://letterboxd.com/' + $(movie).attr('data-film-slug'));
                });
                if($('.pagination').text() !== ''){
                    var lastPage = parseInt($('.paginate-pages ul li').last().text());
                    if(answer.substr(answer.length - 1) == '/'){
                        answer = answer.slice(0, -1);
                    }
                    for(let i = 2; i <= lastPage; i++){
                        promises.push(axios.get(answer + '/page/' + i + '/'));
                    }
                }
                // https://letterboxd.com/andreswo/list/movie-night/
                Promise.all(promises).then(function (results) {
                    results.forEach(function (resp2) {
                        const $2 = cheerio.load(resp2.data);
                        $2('.poster-list li div').each((i, movie)=>{
                            allFilms.push('https://letterboxd.com' + $(movie).attr('data-film-slug'));
                        });
                    });

                    clearInterval(twirlTimer);
                    console.clear();
                    var item = allFilms[Math.floor(Math.random() * allFilms.length)];
                    console.log('Your random movie is: ' + item);
                    recursiveAsyncReadLine();
                });
            });
        }
        else{

            console.log('Wrong URL type, please try again!');

            recursiveAsyncReadLine(); //Calling this function again to ask new question
        }
    });
};

recursiveAsyncReadLine();