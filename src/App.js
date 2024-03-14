import YouTubeIcon from '@mui/icons-material/YouTube';
import MicIcon from '@mui/icons-material/Mic';
import PendingIcon from '@mui/icons-material/Pending';
import React, { useState, useEffect, useRef } from 'react';
import { usePageVisibility } from './usePageVisibility';
import axios from 'axios';
import './App.css';

function App() {
  const isPageVisible = usePageVisibility();
  const [data, setData] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const timerIdRef = useRef(null);

  const get_song_list = () => {
    axios.get("https://us-central1-lam-presentation.cloudfunctions.net/get_song_list")
        .then(response => {
          var songs = Object.values(response.data);
          songs = songs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          console.log(songs);
          setData(songs);
        })
        .catch(error => {
          console.log(error)
        })
  };

  useEffect(() => {
    const pollingCallback = () => {
      get_song_list();
    }
    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallback, 10000);
      console.log(timerIdRef.current);
    }
    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    }
    if (isPageVisible) {
      stopPolling();
      startPolling();
    } else {
      stopPolling();
    }
  }, [isPageVisible]);

  useEffect(() => {
    get_song_list();
  }, [])

  const handleYoutubeUrlChange = (event) => {
    const { value } = event.target;
    setYoutubeUrl(value);
  };

  const handleYoutubeUrlSubmit = (event) => {
    event.preventDefault();
    console.log(youtubeUrl);
    axios.post(
      "https://submit-song-request-lfc4i6czha-uc.a.run.app",
      {"YoutubeURL": youtubeUrl},
      {'Access-Control-Allow-Origin': '*'}
    ).then(response => {
      setYoutubeUrl("");
      window.location.reload(false);
    }).catch(error => {
      console.log(error);
    })
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

          {
            (data.length > 0) ?
            (
              <div> 
                
                {data.map(song => (
                  <div>
                    <a href={song.youtubeUrl}>
                      <YouTubeIcon/>
                    </a>
                    <a href={song.song_link}>
                      <MicIcon/>
                    </a>
                    {song.title}
                    {((song.status !== "complete") && (<PendingIcon/>))}
                  </div>
                ))} 
              </div>
            )
            :(<div>loading...</div>)

          }
        </div>
      </header>
    </div>
  );
}

export default App;
