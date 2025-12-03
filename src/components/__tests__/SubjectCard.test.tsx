import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Calculator } from 'lucide-react';
import SubjectCard from '../SubjectCard';

describe('SubjectCard', () => {
  const mockProps = {
    subject: 'Matematika',
    teacher: 'AI Mokytojas • Matematika',
    progress: 72,
    gradient: 'gradient-purple-pink',
    icon: Calculator,
    onClick: vi.fn(),
  };

  it('should render subject name', () => {
    render(<SubjectCard {...mockProps} />);
    expect(screen.getByText('Matematika')).toBeInTheDocument();
  });

  it('should render teacher name', () => {
    render(<SubjectCard {...mockProps} />);
    expect(screen.getByText('AI Mokytojas • Matematika')).toBeInTheDocument();
  });

  it('should render progress percentage', () => {
    render(<SubjectCard {...mockProps} />);
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<SubjectCard {...mockProps} onClick={handleClick} />);
    
    const card = screen.getByText('Matematika').closest('div');
    card?.click();
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display correct progress label for high progress', () => {
    render(<SubjectCard {...mockProps} progress={85} />);
    expect(screen.getByText('Puikiai!')).toBeInTheDocument();
  });

  it('should display correct progress label for medium progress', () => {
    render(<SubjectCard {...mockProps} progress={65} />);
    expect(screen.getByText('Gerai')).toBeInTheDocument();
  });

  it('should display correct progress label for low progress', () => {
    render(<SubjectCard {...mockProps} progress={35} />);
    expect(screen.getByText('Vidutiniškai')).toBeInTheDocument();
  });
});

