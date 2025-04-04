import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Host_HomePage from './pages/Host_HomePage.jsx';
import Player_HomePage from './pages/Player_HomePage.jsx';
import GameBoard from './pages/GameBoard.jsx';
import ChooseCardPage from './pages/ChooseCard.jsx';
import ChoosePlayerPage from './pages/ChoosePlayer.jsx';
import ChooseStatementPage from './pages/ChooseStatement.jsx';
import DummyPlayerPage from './pages/DummyPlayer.jsx';
import DummyHostPage from './pages/DummyHost.jsx';
import DummyPlayerJoinPage from './pages/DummyPlayerJoin.jsx';
import ChooseAvatarPage from './pages/old_pages/ChooseAvatar.jsx';
import ChooseUName from './pages/old_pages/ChooseUName.jsx';
import JoinRoom from './pages/old_pages/JoinRoom.jsx';
import DummyJoinPage from './pages/DummyJoin.jsx';
import DummyPlayPage from './pages/DummyPlay.jsx';
import PlayerInit from './pages/PlayerJoinPageUnified.jsx';
import DummySetupPage from './pages/DummySetup.jsx';
import DummyJoinSetupPage from './pages/DummyJoinSetup.jsx';
import RejoinPage from './pages/RejoinPage.jsx';
function App() {
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path='/' element={<h1>Welcome! Select a page.</h1>} />
        <Route path='/host' element={<Host_HomePage />} />
        <Route path='/player' element={<Player_HomePage />} />
        <Route path='/gameboard' element={<GameBoard />} />
        <Route path='/choosecard' element={<ChooseCardPage />} />
        <Route path='/chooseplayer' element={<ChoosePlayerPage />} />
        <Route path='/choosestatement' element={<ChooseStatementPage />} />
        <Route path='/dummyplayer' element={<DummyPlayerPage />} />
        <Route path='/dummyhost' element={<DummyHostPage />} />
        <Route path='/dummyplayerjoin' element={<DummyPlayerJoinPage />} />
        <Route path='/dummyjoin' element={<DummyJoinPage />} />
        <Route path='/dummyplay' element={<DummyPlayPage />} />
        <Route path='/chooseavatar' element={<ChooseAvatarPage />} />
        <Route path='/chooseuname' element={<ChooseUName />} />
        <Route path='/joinroom' element={<JoinRoom />} />
        <Route path='/playerinit' element={<PlayerInit />} />
        <Route path='/dummysetup' element={<DummySetupPage />} />
        <Route path='/dummyjoinsetup' element={<DummyJoinSetupPage />} />
        <Route path='/rejoin' element={<RejoinPage />} />
      </Routes>
    </Box>
  );
}

export default App;
