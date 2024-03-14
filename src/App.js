import YouTubeIcon from '@mui/icons-material/YouTube';
import MicIcon from '@mui/icons-material/Mic';
import PendingIcon from '@mui/icons-material/Pending';
import React, { useState, useEffect, useRef } from 'react';
import { usePageVisibility } from './usePageVisibility';
import axios from 'axios';
import './App.css';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';



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
    <div>
      <CssBaseline/>
      <Box sx={{ m: 3 }} component="form">
        <AppBar position="fixed">
          <Toolbar>
            <Typography variant="h5">
              Song Request YouTube URL: 
            </Typography>
            <TextField 
              sx={{ml: 3, width: '50%', color: "white"}}
              variant="outlined" 
              label="[Youtube URL]"
              onChange={handleYoutubeUrlChange} />
            <Button variant="contained"
              onClick={handleYoutubeUrlSubmit}>
                Submit
            </Button>
          </Toolbar>
        </AppBar>
      </Box> 
      <Box sx={{ pt: 10}}>


        {
          (data.length > 0) ?
          (
            <List> 
              
              {data.map(song => (
                <ListItem>
                  <a href={song.YoutubeURL}>
                    <YouTubeIcon/>
                  </a>
                  <a href={song.song_link}>
                    <MicIcon/>
                  </a>
                  {song.title}
                  {((song.status !== "complete") && (<PendingIcon/>))}
                </ListItem>
              ))} 
            </List>
          )
          :(<div>loading...</div>)

        }
      </Box>
    </div>
  );
}

export default App;
