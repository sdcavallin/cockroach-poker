import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import PlayPage from '../pages/PlayPage';

vi.mock('socket.io-client', () => ({
  io: () => ({
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
  }),
}));

const mockLocation = {
  state: {
    uuid: 'test-uuid',
    roomCode: 'ABCD',
  },
};

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useLocation: () => mockLocation,
  };
});

const renderWithProviders = (ui) => {
  return render(
    <ChakraProvider>
      <BrowserRouter>{ui}</BrowserRouter>
    </ChakraProvider>
  );
};

describe('<PlayPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders(<PlayPage />);
    expect(screen.getByText(/room code/i)).toBeInTheDocument();
  });

  it('displays the room code from location state', () => {
    renderWithProviders(<PlayPage />);
    expect(screen.getByText(/Room Code: ABCD/i)).toBeInTheDocument();
  });

  it('shows loading spinner before player data is received', () => {
    renderWithProviders(<PlayPage />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it("renders the turn modal when it becomes the player's turn", async () => {
    renderWithProviders(<PlayPage />);
    const mockSocket = require('socket.io-client').io();
    const turnCallback = mockSocket.on.mock.calls.find(
      (call) => call[0] === 'turnPlayerUpdated'
    )?.[1];

    if (turnCallback) {
      turnCallback('test-uuid');
    }

    await waitFor(() => {
      expect(screen.getByText(/it's your turn/i)).toBeInTheDocument();
    });
  });
});
