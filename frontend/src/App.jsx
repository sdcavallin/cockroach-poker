import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';

import HostPage from './pages/HostPage.jsx';
import HomePage from './pages/HomePage.jsx';
import GamePage from './pages/GamePage.jsx';
import JoinPage from './pages/JoinPage.jsx';
import PlayPage from './pages/PlayPage.jsx';

import DummyPlayerPage from './pages/DummyPlayer.jsx';
import DummyHostPage from './pages/DummyHost.jsx';
import DummyPlayerJoinPage from './pages/DummyPlayerJoin.jsx';
import JoinRoom from './pages/old_pages/JoinRoom.jsx';
import DummyJoinPage from './pages/DummyJoin.jsx';
import DummyPlayPage from './pages/DummyPlay.jsx';

import DummySetupPage from './pages/DummySetup.jsx';
import DummyJoinSetupPage from './pages/DummyJoinSetup.jsx';
import RejoinPage from './pages/RejoinPage.jsx';

function App() {
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/host' element={<HostPage />} />
        <Route path='/game' element={<GamePage />} />
        <Route path='/join' element={<JoinPage />} />
        <Route path='/play' element={<PlayPage />} />
        <Route path='/rejoin' element={<RejoinPage />} />
        <Route path='/dummyplayer' element={<DummyPlayerPage />} />
        <Route path='/dummyhost' element={<DummyHostPage />} />
        <Route path='/dummyplayerjoin' element={<DummyPlayerJoinPage />} />
        <Route path='/dummyjoin' element={<DummyJoinPage />} />
        <Route path='/dummyplay' element={<DummyPlayPage />} />
        <Route path='/joinroom' element={<JoinRoom />} />
        <Route path='/dummysetup' element={<DummySetupPage />} />
        <Route path='/dummyjoinsetup' element={<DummyJoinSetupPage />} />
      </Routes>
    </Box>
  );
}

export default App;
