import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Host_HomePage from './pages/Host_HomePage.jsx';
import Player_HomePage from './pages/Player_HomePage.jsx';
import GameBoard from './pages/GameBoard.jsx';
import ChooseCardPage from './pages/ChooseCard.jsx';
import ChoosePlayerPage from './pages/ChoosePlayer.jsx';
import ChooseStatementPage from './pages/ChooseStatement.jsx';


function App() {
  console.log("App is rendering"); 
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Welcome! Select a page.</h1>} />
        <Route path="/host" element={<Host_HomePage />} />
        <Route path="/player" element={<Player_HomePage />} />
        <Route path="/gameboard" element={<GameBoard/>} />
        <Route path="/choosecard" element={<ChooseCardPage/>} />
        <Route path="/chooseplayer" element={<ChoosePlayerPage/>} />
        <Route path="/choosestatement" element={<ChooseStatementPage/>} />

      </Routes>
    </Box>
  );
}

export default App;
