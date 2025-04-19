import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GamePage from '../pages/GamePage';
import { describe, test, expect, vi } from 'vitest';

vi.mock('socket.io-client', () => {
  return {
    io: () => ({
      connect: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      connected: false,
    }),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/game',
      state: { roomCode: 'COCKROACH' },
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

    // Checks if some key part of the component rendered
    const roomCode = screen.getByText(/Room Code:/i);
    expect(roomCode).toBeInTheDocument();
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
});
