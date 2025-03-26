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
import ChooseAvatarPage from './pages/ChooseAvatar.jsx';
import ChooseUName from './pages/ChooseUName.jsx';
import JoinRoom from './pages/JoinRoom.jsx';

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
        <Route path='/chooseavatar' element={<ChooseAvatarPage />} />
        <Route path='/chooseuname' element={<ChooseUName />} />
        <Route path='/joinroom' element={<JoinRoom/>} /> 
      </Routes>
    </Box>
  );
}

export default App;
