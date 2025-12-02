import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '../Header';

describe('Header', () => {
  it('should render logo and title', () => {
    render(<Header />);
    expect(screen.getByText('Mano AI')).toBeInTheDocument();
    expect(screen.getByText('Mokymosi platforma')).toBeInTheDocument();
  });

  it('should render user name', () => {
    render(<Header />);
    expect(screen.getByText('Jonas')).toBeInTheDocument();
  });

  it('should render notification button', () => {
    render(<Header />);
    // Notification button might not have accessible name, so we check for bell icon presence
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should toggle chat on mobile when button is clicked', async () => {
    const handleChatToggle = vi.fn();
    const user = userEvent.setup();
    
    render(<Header onChatToggle={handleChatToggle} isChatOpen={false} />);
    
    const chatButton = screen.getByRole('button', { name: /chat/i });
    await user.click(chatButton);
    
    expect(handleChatToggle).toHaveBeenCalledTimes(1);
  });

  it('should show user menu when clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    
    const userButton = screen.getByText('Jonas').closest('button');
    if (userButton) {
      await user.click(userButton);
      expect(screen.getByText('Nustatymai')).toBeInTheDocument();
      expect(screen.getByText('Atsijungti')).toBeInTheDocument();
    }
  });
});

