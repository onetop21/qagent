import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
// Import the component being tested
// import YourComponent from '@/components/YourComponent';

/**
 * React Component Unit Test Template
 *
 * Replace placeholders:
 * - YourComponent: Name of the component being tested
 * - YourProps: Component props interface
 *
 * Test Structure:
 * 1. Rendering: Test component renders correctly
 * 2. User Interaction: Test user events (clicks, typing, etc.)
 * 3. State Changes: Test component state updates
 * 4. Props: Test different prop combinations
 * 5. Error States: Test error handling
 */

// Mock SWR to avoid API calls in tests
const mockSwrConfig = {
  dedupingInterval: 0,
  provider: () => new Map(),
};

// Wrapper for components that use SWR
const SwrWrapper = ({ children }: { children: React.ReactNode }) => (
  <SWRConfig value={mockSwrConfig}>{children}</SWRConfig>
);

// Mock data
const mockData = {
  // ... add mock data
};

// Mock handlers
const mockHandlers = {
  onSubmit: jest.fn(),
  onClick: jest.fn(),
  onChange: jest.fn(),
};

describe('YourComponent', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<YourComponent />, { wrapper: SwrWrapper });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render with default props', () => {
      render(<YourComponent />, { wrapper: SwrWrapper });

      // Check for expected elements
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      const props = {
        title: 'Custom Title',
        // ... add other props
      };

      render(<YourComponent {...props} />, { wrapper: SwrWrapper });

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should handle button click', async () => {
      const user = userEvent.setup();

      render(
        <YourComponent onClick={mockHandlers.onClick} />,
        { wrapper: SwrWrapper }
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(mockHandlers.onClick).toHaveBeenCalledTimes(1);
    });

    it('should handle form input', async () => {
      const user = userEvent.setup();

      render(
        <YourComponent onChange={mockHandlers.onChange} />,
        { wrapper: SwrWrapper }
      );

      const input = screen.getByRole('textbox');
      await user.type(input, 'Test input');

      expect(input).toHaveValue('Test input');
      expect(mockHandlers.onChange).toHaveBeenCalled();
    });

    it('should handle form submission', async () => {
      const user = userEvent.setup();

      render(
        <YourComponent onSubmit={mockHandlers.onSubmit} />,
        { wrapper: SwrWrapper }
      );

      // Fill form fields
      await user.type(screen.getByLabelText('Name'), 'John Doe');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockHandlers.onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({ name: 'John Doe' })
        );
      });
    });

    it('should handle checkbox toggle', async () => {
      const user = userEvent.setup();

      render(<YourComponent />, { wrapper: SwrWrapper });

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('Validation', () => {
    it('should show validation error for empty required field', async () => {
      const user = userEvent.setup();

      render(
        <YourComponent onSubmit={mockHandlers.onSubmit} />,
        { wrapper: SwrWrapper }
      );

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Error message should appear
      expect(screen.getByText(/required/i)).toBeInTheDocument();

      // Submit should not be called
      expect(mockHandlers.onSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for invalid input', async () => {
      const user = userEvent.setup();

      render(<YourComponent />, { wrapper: SwrWrapper });

      const input = screen.getByLabelText('Email');
      await user.type(input, 'invalid-email');

      // Blur to trigger validation
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('should clear validation error when user corrects input', async () => {
      const user = userEvent.setup();

      render(<YourComponent />, { wrapper: SwrWrapper });

      const input = screen.getByLabelText('Email');

      // Type invalid email
      await user.type(input, 'invalid');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });

      // Clear and type valid email
      await user.clear(input);
      await user.type(input, 'valid@email.com');

      await waitFor(() => {
        expect(screen.queryByText(/invalid email/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state', () => {
      render(<YourComponent isLoading={true} />, { wrapper: SwrWrapper });

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should disable submit button while loading', () => {
      render(<YourComponent isLoading={true} />, { wrapper: SwrWrapper });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Error States', () => {
    it('should display error message', () => {
      const errorMessage = 'Something went wrong';

      render(
        <YourComponent error={errorMessage} />,
        { wrapper: SwrWrapper }
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('should handle API error', async () => {
      // Mock failed API call
      global.fetch = jest.fn(() =>
        Promise.reject(new Error('API Error'))
      );

      render(<YourComponent />, { wrapper: SwrWrapper });

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Conditional Rendering', () => {
    it('should render different content based on prop', () => {
      const { rerender } = render(
        <YourComponent status="pending" />,
        { wrapper: SwrWrapper }
      );

      expect(screen.getByText(/pending/i)).toBeInTheDocument();

      rerender(
        <SwrWrapper>
          <YourComponent status="completed" />
        </SwrWrapper>
      );

      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    it('should not render when condition is false', () => {
      render(
        <YourComponent show={false} />,
        { wrapper: SwrWrapper }
      );

      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<YourComponent />, { wrapper: SwrWrapper });

      expect(screen.getByLabelText('Field Label')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();

      render(<YourComponent />, { wrapper: SwrWrapper });

      const input = screen.getByRole('textbox');

      // Tab to input
      await user.tab();
      expect(input).toHaveFocus();

      // Tab to button
      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });

  describe('Data Fetching (SWR)', () => {
    it('should render data from SWR', async () => {
      // Mock SWR fetcher
      const mockFetcher = jest.fn().mockResolvedValue(mockData);

      render(
        <SWRConfig value={{ ...mockSwrConfig, fetcher: mockFetcher }}>
          <YourComponent />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText(mockData.name)).toBeInTheDocument();
      });
    });

    it('should handle empty data', async () => {
      const mockFetcher = jest.fn().mockResolvedValue([]);

      render(
        <SWRConfig value={{ ...mockSwrConfig, fetcher: mockFetcher }}>
          <YourComponent />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText(/no data/i)).toBeInTheDocument();
      });
    });
  });
});
