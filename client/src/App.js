import React from "react";
import { useForm } from "react-hook-form";
import './App.css';

function App() {

  const [data, setData] = React.useState('');
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
    console.log(json)
    var dataCopy = data;
    dataCopy = json.url;
    setData( dataCopy );
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
        <a href={data}>{data}</a>
      </header>
    </div>
    

  );
}

export default App;
