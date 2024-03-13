import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(() => {
    axios.get("https://us-central1-lam-presentation.cloudfunctions.net/get_song_list")
        .then(response => {
            setData(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.log(error)
        })
  }, []);

  const handleYoutubeUrlChange = (event) => {
    const { value } = event.target;
    setYoutubeUrl(value);
  };

  const handleYoutubeUrlSubmit = (event) => {
    event.preventDefault();
    console.log(youtubeUrl);
  };


  return (
    <div className="App">
      <header className="App-header">
        <div>
          <form>
            <label>Song Request YouTube URL: </label>
            <input type="text" name="YoutubeURL" onChange={handleYoutubeUrlChange}/>
            <input type="submit" value="Submit" onClick={handleYoutubeUrlSubmit}/>
          </form>
          <ol>
            {Object.entries(data).map(([key, value]) => (
              <li>{key}
                <ul>
                  <li>status: {value.status}</li>
                  <li><a href={value.song_link} target="_blank" rel="noreferrer">Karaoke Version song link</a></li>
                  <li><a href={value.YoutubeURL} target="_blank" rel="noreferrer">Original YoutubeLink</a></li>
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </header>
    </div>
  );
}

export default App;
