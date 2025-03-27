import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import ChooseUName from '../pages/ChooseUName';
import { test, expect, describe } from 'vitest';

describe('ChooseUName component', () => {
  test('sanity check', () => {
    expect(true).toBe(true);
  });

  test('renders the username input', () => {
    render(
      <ChakraProvider>
        <BrowserRouter>
          <ChooseUName />
        </BrowserRouter>
      </ChakraProvider>
    );

    expect(
      screen.getByPlaceholderText(/type your username/i)
    ).toBeInTheDocument();
  });

  test('renders the next button', () => {
    render(
      <ChakraProvider>
        <BrowserRouter>
          <ChooseUName />
        </BrowserRouter>
      </ChakraProvider>
    );

    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  test('renders the title', () => {
    render(
      <ChakraProvider>
        <BrowserRouter>
          <ChooseUName />
        </BrowserRouter>
      </ChakraProvider>
    );

    expect(screen.getByText(/Type your username.../i)).toBeInTheDocument();
  });
});
