import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import PlayPage from '../pages/PlayPage';
import { vi } from 'vitest';

vi.mock('socket.io-client', () => ({
  io: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn((event, callback) => {
      if (event === 'startTurn') {
        callback({ turnPlayer: '12345', conspiracy: [] });
      }
    }),
    off: vi.fn(),
    emit: vi.fn(),
    connected: true,
    id: '12345',
  })),
}));

describe('PlayPage', () => {
  test('renders correctly with roomCode and uuid in location.state', async () => {
    render(
      <ChakraProvider>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/play',
              state: {
                roomCode: '123B',
                uuid: '12345',
              },
            },
          ]}
        >
          <Routes>
            <Route path='/play' element={<PlayPage />} />
          </Routes>
        </MemoryRouter>
      </ChakraProvider>
    );

    // Wait for the component to react to the socket or just render
    const title = screen.getByText(/GameRoom/);
    expect(title).to.exist;
    const title2 = screen.getByText(/123B/);
    expect(title2).to.exist;
  });
});
