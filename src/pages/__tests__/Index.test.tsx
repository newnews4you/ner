import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Index from '../Index';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter basename="/ner">{component}</BrowserRouter>);
};

describe('Index Page', () => {
  it('should render welcome message', () => {
    renderWithRouter(<Index />);
    expect(screen.getByText(/Sveiki sugrįžę/i)).toBeInTheDocument();
  });

  it('should render search input', () => {
    renderWithRouter(<Index />);
    const searchInput = screen.getByPlaceholderText(/Ieškoti kursų/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('should render all subject cards', () => {
    renderWithRouter(<Index />);
    expect(screen.getByText('Matematika')).toBeInTheDocument();
    expect(screen.getByText('IT Technologijos')).toBeInTheDocument();
    expect(screen.getByText('Fizika')).toBeInTheDocument();
    expect(screen.getByText('Lietuvių kalba')).toBeInTheDocument();
    expect(screen.getByText('Dailė')).toBeInTheDocument();
    expect(screen.getByText('Anglų kalba')).toBeInTheDocument();
  });

  it('should render deadlines panel', () => {
    renderWithRouter(<Index />);
    expect(screen.getByText(/Artėjantys atsiskaitymai/i)).toBeInTheDocument();
  });

  it('should filter subjects when searching', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Index />);
    const searchInput = screen.getByPlaceholderText(/Ieškoti kursų/i);
    
    await user.type(searchInput, 'Matematika');
    
    expect(screen.getByText('Matematika')).toBeInTheDocument();
    expect(screen.queryByText('Fizika')).not.toBeInTheDocument();
  });
});

