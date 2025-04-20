import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import GamePage from '../pages/GamePage';
import { vi } from 'vitest';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn((event, callback) => {
      if (event === 'returnGameRoom') {
        // Simulating a response when 'returnGameRoom' is triggered
        callback({
          players: [
            { uuid: '1', nickname: 'Player 1', playerIcon: 'bmo' },
            { uuid: '2', nickname: 'Player 2', playerIcon: 'finn' },
          ],
          currentAction: {
            turnPlayer: '1',
            conspiracy: [],
          },
        });
      }
    }),
    off: vi.fn(),
    emit: vi.fn(),
    connected: true,
    id: 'mock-socket-id',
  })),
}));

describe('GamePage component', () => {
  test('renders with valid roomCode', async () => {
    const roomCode = '123B';

    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={[`/game`]}>
          <Routes>
            <Route path='/game' element={<GamePage />} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    );

    const title = screen.getByText(/🔗cockroach.poker/);
    expect(title).to.exist;
  });

  test('renders players images with names bmo and finn', async () => {
    const roomCode = '123B';

    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={[`/game`]}>
          <Routes>
            <Route path='/game' element={<GamePage />} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    );

    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
    });

    expect(screen.getByAltText(/Player 1/i)).toHaveAttribute(
      'src',
      '/avatars/bmo.png'
    );
    expect(screen.getByAltText(/Player 2/i)).toHaveAttribute(
      'src',
      '/avatars/finn.png'
    );
  });

  test('renders players images if roomCode is valid', async () => {
    const roomCode = '123B';

    render(
      <ChakraProvider>
        <MemoryRouter initialEntries={[`/game`]}>
          <Routes>
            <Route path='/game' element={<GamePage />} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    );

    // Wait for player images to be rendered
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0); // Check if images are rendered
    });
  });
});
