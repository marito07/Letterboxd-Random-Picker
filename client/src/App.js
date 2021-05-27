import React from "react";
import { useForm } from "react-hook-form";
//import logo from "../public/logo.svg"
import './App.css';
import './bootstrap.css'

function App() {

  const [data, setData] = React.useState({
    year: '',
    poster: '',
    url: '',
    title: '',
    duration: '',
    genres: []
  });

  const [checkedDoc, setCheckedDoc] = React.useState(false);
  const [checkedShort, setCheckedShort] = React.useState(false);

  const handleClickDoc = () => setCheckedDoc(!checkedDoc)
  const handleClickShort = () => setCheckedShort(!checkedShort)

  const {register,handleSubmit, errors} = useForm();


  const getRandomMovie = async (movieURL) => {
    console.log(movieURL);
    const response = await fetch('/list', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
       "url": movieURL.url
      })
    });
    const json = await response.json();
    var item = await json[Math.floor(Math.random() * json.length)];

    const response2 = await fetch('/getMovie', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "url": item
      })
    });

    var json2 = await response2.json();
    if(checkedShort && checkedDoc){
      console.log(json2.duration)
      console.log(json2.duration)
      while(json2.duration < 60 || json2.genres.includes('documentary')){
        var item2 = await json[Math.floor(Math.random() * json.length)];
        console.log("NUEVO",item2)
        const response3 = await fetch('/getMovie', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "url": item2
          })
        });
        console.log("sale de la llamada");

        json2 = await response3.json();
        console.log("Double Check",json2)
      }
    }
    else if(checkedShort){
      console.log('Cortos');
      while(json2.duration < 60){
        console.log(json2.duration)
        var item2 = await json[Math.floor(Math.random() * json.length)];
        console.log("NUEVO",item2)
        const response3 = await fetch('/getMovie', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "url": item2
          })
        });
        console.log("sale de la llamada");

        json2 = await response3.json();
        console.log("Duration",json2)
      }
    }
    else if(checkedDoc){
      console.log('documentales');
      while(json2.genres.includes('documentary')){
        console.log(json2.genres);
        var item2 = await json[Math.floor(Math.random() * json.length)];
        console.log("NUEVO",item2)
        const response3 = await fetch('/getMovie', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "url": item2
          })
        });
        console.log("sale de la llamada");
        json2 = await response3.json();
        console.log("Doc",json2)
      }
      
    }

    
    var dataCopy = data;
    dataCopy = json2;
    setData( dataCopy );
    console.log(data)


  };


  return (
    
    <div className="App">

      <header className="App-header">
        <h1>Letterboxd Random List Movie Picker</h1>
        <form onSubmit={handleSubmit(getRandomMovie)}> 
          <label class="mr-3" for="fname">List URL:</label>
          <input type="text" id="fname" name="fname" {...register("url", {required: "Required"})}></input>



          <input class="ml-2 btn btn-primary" type="submit" value="SEND"></input>
          <div class="d-flex flex-row align-items-center">
            <label class="smol m-0 ml-5 mr-2">Exclude documentaries</label>
            <input type="checkbox" onClick={handleClickDoc} onChange={handleClickDoc} checked={checkedDoc}></input>
          </div>
          <div class="d-flex flex-row align-items-center">
            <label class="smol m-0 ml-5 mr-2">Exclude short films</label>
            <input type="checkbox" onClick={handleClickShort} onChange={handleClickShort} checked={checkedShort}></input>
          </div>

        </form> 
        <div>
          <br></br>
          {data.poster ? <a href={data.url}><img src={data.poster} ></img></a>:null}
          <br></br>
          {data.url ? <a href={data.url}>{data.title}</a>: null}
          {data.year ? <p>({data.year})</p>: null}
          {data.duration ? <p>Duration: {data.duration}m</p>: null}
          {data.genres.length > 0 ? <p>Genres: 
            
            {data.genres.map(i => <label class="ml-2 mr-2">{i}</label>)}
            </p>: null}

        </div>
      </header>
     </div>
    

  );
}

export default App;
