import React from "react";
import { useForm } from "react-hook-form";
//import logo from "../public/logo.svg"
import './App.css';
import * as ReactBootstrap from 'react-bootstrap'

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
  const [loading, setLoading] = React.useState(false);

  const handleClickDoc = () => setCheckedDoc(!checkedDoc)
  const handleClickShort = () => setCheckedShort(!checkedShort)

  const {register,handleSubmit, errors} = useForm();


  const getRandomMovie = async (movieURL) => {
    setLoading(true);
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
      while(json2.duration < 60 || json2.genres.includes('documentary')){
        var item2 = await json[Math.floor(Math.random() * json.length)];
        const response3 = await fetch('/getMovie', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "url": item2
          })
        });

        json2 = await response3.json();
      }
    }
    else if(checkedShort){
      while(json2.duration < 60){
        var item2 = await json[Math.floor(Math.random() * json.length)];
        const response3 = await fetch('/getMovie', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "url": item2
          })
        });

        json2 = await response3.json();
      }
    }
    else if(checkedDoc){
      while(json2.genres.includes('documentary')){
        var item2 = await json[Math.floor(Math.random() * json.length)];
        const response3 = await fetch('/getMovie', {
          method: 'post',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            "url": item2
          })
        });
        json2 = await response3.json();
      }
      
    }

    
    var dataCopy = data;
    dataCopy = json2;
    setData( dataCopy );
    console.log(data)
    setLoading(false);


  };


  return (
    
    <div className="App">

      <header className="App-header">
        <h1>Letterboxd Random List Movie Picker</h1>
        <form onSubmit={handleSubmit(getRandomMovie)}> 
          <label class="mr-3" for="fname">List URL:</label>
          <input disabled={loading} type="text" id="fname" name="fname" {...register("url", {required: "Required"})}></input>



          <input disabled={loading} class="ml-2 btn btn-primary" type="submit" value="SEND"></input>
          <div class="d-flex flex-row align-items-center">
            <label class="smol m-0 ml-5 mr-2">Exclude documentaries</label>
            <input disabled={loading} type="checkbox" onClick={handleClickDoc} onChange={handleClickDoc} checked={checkedDoc}></input>
          </div>
          <div class="d-flex flex-row align-items-center">
            <label class="smol m-0 ml-5 mr-2">Exclude short films</label>
            <input disabled={loading} type="checkbox" onClick={handleClickShort} onChange={handleClickShort} checked={checkedShort}></input>
          </div>

        </form> 
        {!loading ? <div>
          <br></br>
          {data.poster ? <a href={data.url}><img src={data.poster} ></img></a>:null}
          <br></br>
          {data.url ? <a href={data.url} target="_blank">{data.title}</a>: null}
          {data.year ? <p>({data.year})</p>: null}
          {data.duration ? <p>Duration: {data.duration}m</p>: null}
          {data.genres.length > 0 ? <p> <span class="font-weight-bold">Genres: </span>
            {data.genres.map(i => <label class="border border-light m-1 p-1">{i}</label>)}
            </p>: null}

        </div> : <div class="mt-5"><ReactBootstrap.Spinner animation="border" variant="light" /></div>}


      </header>
     </div>
    

  );
}

export default App;
