const cheerio = require('cheerio');
const axios = require('axios');
const readline = require('readline');
const { attr } = require('cheerio/lib/api/attributes');



class callURL {

    constructor() {
        //callUrl('https://letterboxd.com/johncassavetes/list/old-films-for-people-who-want-to-watch-more/');
    }

    getMovie(url, callback){
        axios.get(url).then((response) => {
            const $ = cheerio.load(response.data);

            var poster = $('.film-poster img').attr('src');
            console.log(poster)
            var year = $('#featured-film-header p .number').text();
            //var director = $('#featured-film-header p .number').text();
            var title = $('#featured-film-header h1').text();

            callback(null, {
                poster: poster,
                year: year,
                title: title,
                url: url
            });
        });
    }
    
    call(answer, callback){
        if (answer == '0') //we need some base case, for recursion
                return rl.close(); //closing RL and returning from function.
            if(answer.startsWith('https://letterboxd.com/')){
                axios.get(answer).then((response) => {
                    const $ = cheerio.load(response.data);
    
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
                    Promise.all(promises).then( (results) => {
                        results.forEach( (resp2) => {
                            const $2 = cheerio.load(resp2.data);
                            $2('.poster-list li div').each((i, movie)=>{
                                allFilms.push('https://letterboxd.com' + $(movie).attr('data-film-slug'));
                            });
                        });
    
                        //console.clear();
                        var item = allFilms[Math.floor(Math.random() * allFilms.length)];
                        console.log('Your random movie is: ' + item);
                        this.getMovie(item, function(da, res){
                            //recursiveAsyncReadLine();
                            callback(null, {
                                res: res
                            });
                        });
                    });
                });
            }
            else{
    
                callback(null, {
                    res: 'Wrong URL type, please try again!'
                });
    
                //recursiveAsyncReadLine(); //Calling this function again to ask new question
            }
    }


}
module.exports = callURL;

