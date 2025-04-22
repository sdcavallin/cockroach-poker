import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';

import HostPage from './pages/HostPage.jsx';
import HomePage from './pages/HomePage.jsx';
import GamePage from './pages/GamePage.jsx';
import JoinPage from './pages/JoinPage.jsx';
import PlayPage from './pages/PlayPage.jsx';
import RejoinPage from './pages/RejoinPlayer.jsx';
import RejoinHost from './pages/RejoinHost.jsx';
import Credits from './pages/Credits.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';

function App() {
  return (
    <Box>
      <Navbar />
      <AudioPlayer filePath={'music/FunkInTheTrunk.mp3'} />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/host' element={<HostPage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/join' element={<JoinPage />} />
        <Route path='/play' element={<PlayPage />} />
        <Route path='/credits' element={<Credits />} />
        <Route path='/rejoin' element={<RejoinPage />} />
        <Route path='/rejoinhost' element={<RejoinHost />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Box>
  );
}

export default App;
