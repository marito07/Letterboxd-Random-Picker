import React from "react";
import { useForm } from "react-hook-form";
//import logo from "../public/logo.svg"
import './App.css';

function App() {

  const [data, setData] = React.useState({
    year: '',
    poster: '',
    url: '',
    title: ''
  });
  const {register,handleSubmit, errors} = useForm();


  var value = '';

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
    var dataCopy = data;
    dataCopy = json;
    setData( dataCopy );
    console.log(data)
  };


  return (
    
    <div className="App">
      <header className="App-header">
        <h2>Letterboxd Random List Movie Picker</h2>
        <form onSubmit={handleSubmit(getRandomMovie)}> 
          <label for="fname">List URL:</label>
          <input type="text" id="fname" name="fname" {...register("url", {required: "Required"})}></input>
          <input type="submit" value="SEND"></input>

        </form> 
        <div>
          <br></br>
          {data.poster ? <a href={data.url}><img src={data.poster} ></img></a>:null}
          <br></br>
          {data.url ? <a href={data.url}>{data.title}</a>: null}
          {data.year ? <p>({data.year})</p>: null}


        </div>
      </header>

    </div>
    

  );
}

export default App;
