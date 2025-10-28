import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RepoList from '../src/components/RepoList';
import { vi, describe, expect,test } from 'vitest';
import { beforeEach,afterEach } from 'vitest';

const mockNavigate=vi.fn();
vi.mock('react-router-dom',async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

globalThis.window.open = vi.fn();

globalThis.fetch = vi.fn();

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        retry:false,
        cacheTime:0,
        staleTime:0,
      }
    }
  });

return render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      {component}
    </BrowserRouter>
  </QueryClientProvider>
)
}

describe('RepoList Component',()=>{
  beforeEach(() => {
    vi.clearAllMocks();
  });
   afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Loading State",()=>{
    test("should display skeletons while fetching data",()=>{
      fetch.mockImplementation(()=>new Promise(()=>{}));
      renderWithProviders(<RepoList />);
      const skeletons = screen.getAllByTestId('MuiSkeleton-root');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  })


  describe("Success State",()=>{
  const mockRepos = [
      {
        name: 'test-repo-1',
        description: 'Test description 1',
      },
      {
        name: 'test-repo-2',
        description: 'Test description 2',
      },
      {
        name: 'test-repo-3',
        description: null,
      },
    ];

    beforeEach(()=>{
      fetch.mockResolvedValue({
        ok:true,
        json: async () => mockRepos,
      })
    })

    test("should render repository list when data is successfully fetched",async ()=>{
      renderWithProviders(<RepoList />);

      await waitFor(()=>{
        expect(screen.getByText(/test-repo-1:/i)).toBeInTheDocument();
      })
       expect(screen.getByText(/test-repo-2:/i)).toBeInTheDocument();
      expect(screen.getByText(/test-repo-3:/i)).toBeInTheDocument();
    });

    test('should display descriptions or fallback text', async () => {
      renderWithProviders(<RepoList />);
      
      await waitFor(() => {
        expect(screen.getByText('Test description 1')).toBeInTheDocument();
      });

      expect(screen.getByText('Test description 2')).toBeInTheDocument();
      expect(screen.getByText('No description available')).toBeInTheDocument();
    });

     test('should render "View Details" buttons for each repository', async () => {
      renderWithProviders(<RepoList />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /view details/i });
        expect(buttons).toHaveLength(3);
      });
    });

    test('should navigate to repository details when "View Details" is clicked',async()=>{
      renderWithProviders(<RepoList />);

      await waitFor(()=>{
        expect(screen.getByText(/test-repo-1:/i)).toBeInTheDocument();
      });
      const buttons=screen.getAllByRole('button',{
        name:/view details/i
      })
      await userEvent.click(buttons[0]);
      expect(mockNavigate).toHaveBeenCalledWith('/repo/test-repo-1');
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    })
})

describe("Error State",()=>{
  test("should display error message when fetch details",async()=>{
    fetch.mockResolvedValue({
      ok:false,
      status:500,
    });
    renderWithProviders(<RepoList />);
    await waitFor(()=>{
      expect(screen.getByText(/Error loading repositories:/i)).toBeInTheDocument();
    });
  })

  test('should display error message when network error occurs',async()=>{
    fetch.mockRejectedValue(new Error('Network Error'));
    renderWithProviders(<RepoList />);
    await waitFor(()=>{
      expect(screen.getByText(/error loading repositories:/i)).toBeInTheDocument();
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    })
  })
})

describe("Empty State",()=>{
  test('should display "No repositories found" when data array is empty',async()=>{
    fetch.mockResolvedValue({
      ok:true,
      json:async()=>[],
    })
    renderWithProviders(<RepoList />);
    await waitFor(()=>{
      expect(screen.getByText(/no repositories found./i)).toBeInTheDocument();
    })
  })
})

describe('API Integration',()=>{
  test('should cal the correct api endpoint',async()=>{
    fetch.mockResolvedValue({
      ok:true,
      json:async()=>[],
    })
    renderWithProviders(<RepoList />);
    await waitFor(()=>{
      expect(fetch).toHaveBeenCalledWith('https://api.github.com/orgs/godaddy/repos');
    })
  })
})

})
