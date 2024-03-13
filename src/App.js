import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios.get("https://us-central1-lam-presentation.cloudfunctions.net/get_song_list")
        .then(response => {
            setData(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.log(error)
        })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <ol>
            {Object.entries(data).map(([key, value]) => (
              <li>{key}
                <ul>
                  <li>status: {value.status}</li>
                  <li><a href={value.song_link}>Karaoke Version song link</a></li>
                  <li><a href={value.YoutubeURL}>Original YoutubeLink</a></li>
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
