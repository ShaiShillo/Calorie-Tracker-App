//Shai Shillo ID: 204684914, Roman Agbyev ID: 322002098, Ofek Daida ID 315143958
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
