import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GamePage from '../pages/GamePage';
import { vi } from 'vitest';

vi.mock('socket.io-client', () => ({
  io: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    connected: true,
    id: 'mock-socket-id',
  })),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/game',
      state: { roomCode: '123T' },
    }),
  };
});

describe('GamePage', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter initialEntries={['/game']}>
        <Routes>
          <Route path='/game' element={<GamePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Room Code:/i)).toBeInTheDocument();
  });

  it('renders room code if provided', () => {
    render(
      <MemoryRouter initialEntries={['/game']}>
        <Routes>
          <Route path='/game' element={<GamePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Room Code: 123T/i)).toBeInTheDocument();
  });

  it('listens to socket events', async () => {
    const socket = require('socket.io-client').io();
    render(
      <MemoryRouter initialEntries={['/game']}>
        <Routes>
          <Route path='/game' element={<GamePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      socket.on.mock.calls.forEach(([event, callback]) => {
        if (event === 'turnPlayerUpdated') {
          callback('new-turn-id');
        }
      });
    });

    expect(socket.on).toHaveBeenCalledWith(
      'turnPlayerUpdated',
      expect.any(Function)
    );
  });
});
