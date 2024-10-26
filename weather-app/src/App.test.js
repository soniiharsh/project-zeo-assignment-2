import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mocking the fetch API to avoid making actual API calls
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      main: { temp: 30, humidity: 50 },
      wind: { speed: 5 },
      weather: [{ main: 'Clear', description: 'clear sky' }],
      name: 'Test City'
    }),
  })
);

afterEach(() => {
  jest.clearAllMocks(); // Clear mocks to ensure clean slate for each test
});

test('renders weather app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Weather App/i);
  expect(titleElement).toBeInTheDocument();
});

test('displays weather information after searching for a city', async () => {
  render(<App />);
  
  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText(/Enter city\/town.../i), {
    target: { value: 'Test City' },
  });

  fireEvent.click(screen.getByText(/Search/i));

  // Wait for the weather information to appear
  await waitFor(() => {
    expect(screen.getByText(/Temperature: 30/i)).toBeInTheDocument();
    expect(screen.getByText(/Humidity: 50/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
  });
});

test('sets temperature threshold and triggers alert if exceeded', async () => {
  render(<App />);
  
  // Set threshold
  fireEvent.change(screen.getByLabelText(/Set Temperature Threshold/i), {
    target: { value: 25 },
  });

  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText(/Enter city\/town.../i), {
    target: { value: 'Test City' },
  });

  fireEvent.click(screen.getByText(/Search/i));

  // Wait for the alert message to appear
  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Alert! Temperature in Test City exceeds 25°C.'
    );
  });
});

test('temperature conversion to Fahrenheit', async () => {
  render(<App />);
  
  // Simulate user input
  fireEvent.change(screen.getByPlaceholderText(/Enter city\/town.../i), {
    target: { value: 'Test City' },
  });

  fireEvent.click(screen.getByText(/Search/i));

  // Switch to Fahrenheit
  fireEvent.click(screen.getByLabelText(/Fahrenheit/i));

  // Wait for the temperature in Fahrenheit to be displayed
  await waitFor(() => {
    expect(screen.getByText(/Temperature: 86/i)).toBeInTheDocument(); // 30°C = 86°F
  });
});
