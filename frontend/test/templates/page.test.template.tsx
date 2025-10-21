import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SWRConfig } from 'swr';
// Import the page component being tested
// import YourPage from '@/app/your-page/page';

/**
 * NextJS Page Component Test Template
 *
 * Replace placeholders:
 * - YourPage: Name of the page component being tested
 * - /your-endpoint: API endpoint used by the page
 *
 * Test Structure:
 * 1. Page Rendering: Test initial render and layout
 * 2. Data Loading: Test SWR data fetching
 * 3. User Flows: Test complete user workflows
 * 4. Navigation: Test routing and redirects
 * 5. Error Handling: Test error states
 */

// Mock next/navigation
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  back: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/your-page',
}));

// Mock API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    upload: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api-client';

// Mock SWR config
const mockSwrConfig = {
  dedupingInterval: 0,
  provider: () => new Map(),
  fetcher: jest.fn(),
};

// Mock data
const mockPageData = {
  items: [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ],
};

describe('YourPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock: successful data fetch
    (apiClient.get as jest.Mock).mockResolvedValue(mockPageData);
    mockSwrConfig.fetcher.mockResolvedValue(mockPageData);
  });

  describe('Initial Rendering', () => {
    it('should render page title', async () => {
      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      expect(screen.getByRole('heading', { name: /page title/i })).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      mockSwrConfig.fetcher.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Data Loading', () => {
    it('should fetch and display data', async () => {
      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 2')).toBeInTheDocument();
      });
    });

    it('should handle empty data', async () => {
      mockSwrConfig.fetcher.mockResolvedValue([]);

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText(/no items/i)).toBeInTheDocument();
      });
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to load data';
      mockSwrConfig.fetcher.mockRejectedValue(new Error(errorMessage));

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Workflows', () => {
    it('should complete create workflow', async () => {
      const user = userEvent.setup();
      const newItem = { id: '3', name: 'New Item' };

      (apiClient.post as jest.Mock).mockResolvedValue(newItem);

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      // Fill form
      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'New Item');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /submit|create/i });
      await user.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith(
          '/your-endpoint',
          expect.objectContaining({ name: 'New Item' })
        );
      });
    });

    it('should complete update workflow', async () => {
      const user = userEvent.setup();
      const updatedItem = { id: '1', name: 'Updated Item' };

      (apiClient.put as jest.Mock).mockResolvedValue(updatedItem);

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      // Click edit button
      const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
      await user.click(editButton);

      // Update form
      const nameInput = screen.getByDisplayValue('Item 1');
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Item');

      // Submit
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(apiClient.put).toHaveBeenCalledWith(
          '/your-endpoint/1',
          expect.objectContaining({ name: 'Updated Item' })
        );
      });
    });

    it('should complete delete workflow', async () => {
      const user = userEvent.setup();

      (apiClient.delete as jest.Mock).mockResolvedValue({ success: true });

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
      await user.click(deleteButton);

      // Confirm deletion (if there's a confirmation dialog)
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(apiClient.delete).toHaveBeenCalledWith('/your-endpoint/1');
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to detail page on item click', async () => {
      const user = userEvent.setup();

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      const item = screen.getByText('Item 1');
      await user.click(item);

      expect(mockPush).toHaveBeenCalledWith('/your-page/1');
    });

    it('should redirect after successful creation', async () => {
      const user = userEvent.setup();

      (apiClient.post as jest.Mock).mockResolvedValue({ id: '3', name: 'New' });

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'New');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/success-page');
      });
    });
  });

  describe('Form Validation', () => {
    it('should prevent submission with invalid data', async () => {
      const user = userEvent.setup();

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading')).toBeInTheDocument();
      });

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Should show validation errors
      expect(screen.getByText(/required/i)).toBeInTheDocument();

      // API should not be called
      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it('should show inline validation errors', async () => {
      const user = userEvent.setup();

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab(); // Blur to trigger validation

      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Failed to create item';

      (apiClient.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading')).toBeInTheDocument();
      });

      // Fill and submit form
      await user.type(screen.getByLabelText(/name/i), 'Test');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('should allow retry after error', async () => {
      const user = userEvent.setup();

      // First call fails
      (apiClient.post as jest.Mock)
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce({ id: '3', name: 'Success' });

      render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByRole('heading')).toBeInTheDocument();
      });

      // First attempt
      await user.type(screen.getByLabelText(/name/i), 'Test');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/failed/i)).toBeInTheDocument();
      });

      // Retry
      const retryButton = screen.getByRole('button', { name: /retry|submit/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.queryByText(/failed/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('should update UI when data changes', async () => {
      const { rerender } = render(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText('Item 1')).toBeInTheDocument();
      });

      // Simulate data update
      const updatedData = {
        items: [
          { id: '1', name: 'Updated Item 1' },
          { id: '2', name: 'Item 2' },
        ],
      };
      mockSwrConfig.fetcher.mockResolvedValue(updatedData);

      rerender(
        <SWRConfig value={mockSwrConfig}>
          <YourPage />
        </SWRConfig>
      );

      await waitFor(() => {
        expect(screen.getByText('Updated Item 1')).toBeInTheDocument();
      });
    });
  });
});
