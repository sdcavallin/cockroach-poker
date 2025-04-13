import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Host_HomePage from './pages/Host_HomePage.jsx';
import Player_HomePage from './pages/Player_HomePage.jsx';
import GameBoard from './pages/GameBoard.jsx';
import DummyPlayerPage from './pages/DummyPlayer.jsx';
import DummyHostPage from './pages/DummyHost.jsx';
import DummyPlayerJoinPage from './pages/DummyPlayerJoin.jsx';
import JoinRoom from './pages/old_pages/JoinRoom.jsx';
import DummyJoinPage from './pages/DummyJoin.jsx';
import DummyPlayPage from './pages/DummyPlay.jsx';
import PlayerInit from './pages/PlayerJoinPageUnified.jsx';
import DummySetupPage from './pages/DummySetup.jsx';
import DummyJoinSetupPage from './pages/DummyJoinSetup.jsx';
import RejoinPage from './pages/RejoinPage.jsx';
import PlayerPlay from './pages/PlayerPlay.jsx';
function App() {
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path='/' element={<h1>Welcome! Select a page.</h1>} />
        <Route path='/host' element={<Host_HomePage />} />
        <Route path='/player' element={<Player_HomePage />} />
        <Route path='/gameboard' element={<GameBoard />} />
        <Route path='/dummyplayer' element={<DummyPlayerPage />} />
        <Route path='/dummyhost' element={<DummyHostPage />} />
        <Route path='/dummyplayerjoin' element={<DummyPlayerJoinPage />} />
        <Route path='/dummyjoin' element={<DummyJoinPage />} />
        <Route path='/dummyplay' element={<DummyPlayPage />} />
        <Route path='/joinroom' element={<JoinRoom />} />
        <Route path='/playerinit' element={<PlayerInit />} />
        <Route path='/dummysetup' element={<DummySetupPage />} />
        <Route path='/dummyjoinsetup' element={<DummyJoinSetupPage />} />
        <Route path='/rejoin' element={<RejoinPage />} />
        <Route path='/playerplay' element={<PlayerPlay/>} />
      </Routes>
    </Box>
  );
}

export default App;
