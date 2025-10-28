import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, describe, expect,test, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RepoDetails from '../src/components/RepoDetails';

const mockNavigate=vi.fn();

vi.mock('react-router-dom',async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
});

globalThis.window.open = vi.fn();
globalThis.fetch = vi.fn();

const renderWithProviders=(repoName='test-repo')=>{
    const queryClient=new QueryClient({
        defaultOptions:{
            queries:{
                retry:false,
            }
        }
    });

    return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/repo/${repoName}`]}>
        <Routes>
          <Route path="/repo/:repoName" element={<RepoDetails />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('RepoDetails Component',()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
    })
    afterEach(()=>{
        vi.resetAllMocks();
    })

    describe('Loading State',()=>{
        test('should display skeleton loaders while fetching repository details',()=>{
            fetch.mockImplementation(()=>new Promise(()=>{}));
            renderWithProviders('test-repo');
            const skeletons=screen.getAllByTestId(/MuiSkeleton-root/i);
            expect(skeletons.length).toBeGreaterThan(0);
        })
    })

    describe('Success State',()=>{
        const mockRepoData = {
      name: 'test-repo',
      description: 'A test repository',
      html_url: 'https://github.com/godaddy/test-repo',
      languages_url: 'https://api.github.com/repos/godaddy/test-repo/languages',
      forks_count: 42,
      open_issues_count: 5,
      watchers_count: 100,
    };

    const mockLanguages={
        JavaScript: 50000,
        TypeScript: 30000,
        CSS: 10000,
    };


    beforeEach(()=>{
        fetch.mockResolvedValueOnce({
            ok:true,
            json:async()=>mockRepoData
        })
        .mockResolvedValueOnce({
            ok:true,
            json:async()=>mockLanguages
        })
    })

    test('should render repository name and description',async()=>{
        renderWithProviders('test-repo');
        await waitFor(()=>{
            expect(screen.getByText('test-repo')).toBeInTheDocument();
        })
        expect(screen.getByText('A test repository')).toBeInTheDocument();
    })

    test('should render repository statistics',async()=>{
        renderWithProviders('test-repo');
        await waitFor(()=>{
            expect(screen.getByText(/Forks Count:/i)).toBeInTheDocument();
        })
        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText(/Open Issues Count:/i)).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText(/Watchers Count:/i)).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
    })

    test('shold render languages list', async()=>{
    renderWithProviders('test-repo');
    await waitFor(()=>{
        expect(screen.getByText('test-repo')).toBeInTheDocument();
    })
    await waitFor(()=>{
        expect(screen.getByText(/JavaScript,TypeScript,CSS/i)).toBeInTheDocument();
    }, { timeout: 3000 })
    })

    test('should display fallback text when no languages are available',async()=>{
        fetch.mockResolvedValueOnce({
            ok:true,
            json:async()=>mockRepoData
        })
        .mockResolvedValueOnce({
            ok:true,
            json:async()=>({}) 
        })
        renderWithProviders('test-repo');
        await waitFor(()=>{
            expect(screen.getByText(/No languages listed/i)).toBeInTheDocument();
        })
    })

    test('should render "Back" button',async()=>{
        renderWithProviders('test-repo');
        await waitFor(()=>{
            expect(screen.getByRole('button',{
                name:/back/i
            })).toBeInTheDocument();
        })
    })

     test('should render "View on Github" button',async()=>{
        renderWithProviders('test-repo');
        await waitFor(()=>{
            expect(screen.getByRole('button',{
                name:/view on github/i
            })).toBeInTheDocument();
        })
    })

    test('should navigate back when "Back" button is clicked',async ()=>{
        const user=userEvent.setup();
        renderWithProviders('test-repo');

        await waitFor(()=>{
            expect(screen.getByRole('button',{
                name:/back/i
            })).toBeInTheDocument();
        })

        const backbutton=screen.getByRole('button',{name:/back/i});
        await user.click(backbutton);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    })

     test('should open GitHub URL in new tab when "View on Github" is clicked',async ()=>{
        const user=userEvent.setup();
        renderWithProviders('test-repo');

        await waitFor(()=>{
            expect(screen.getByRole('button',{
                name:/view on github/i 
            })).toBeInTheDocument();
        })

        const githubButton =screen.getByRole('button',{name:/view on github/i });
        await user.click(githubButton );
        expect(window.open).toHaveBeenCalledWith( 
            'https://github.com/godaddy/test-repo',
        '_blank');
    })
    })

    describe('Error State',()=>{
        test('should display error message when fetching repository fails',async()=>{
            fetch.mockRejectedValueOnce(new Error('Failed to fetch'));
            renderWithProviders('test-repo');
            await waitFor(()=>{
                expect(screen.getByText(/Error loading repositories/i)).toBeInTheDocument();
            })
        })
        test('should handle API error response',async()=>{
            fetch.mockResolvedValueOnce({
                ok:false,
                status:404,
                json:async()=>({message:'Not Found'})
            })
            renderWithProviders('test-repo');
            await waitFor(()=>{
                expect(screen.getByText(/Error loading repositories/i)).toBeInTheDocument();
            })
        })
    })

    describe('Empty State',()=>{
        test('should display "Repository not found" when data is null',async()=>{
            fetch.mockResolvedValueOnce({
                ok:true,
                json:async()=>null
            })
            renderWithProviders('test-repo');
            await waitFor(()=>{
                expect(screen.getByText(/repository not found./i)).toBeInTheDocument();
            })
        })
    })

    describe('API Integration',()=>{
        test('should call correct API endpoints',async()=>{
             const mockRepoData = {
                name: 'test-repo',
                description: 'Test',
                html_url: 'https://github.com/godaddy/test-repo',
                languages_url: 'https://api.github.com/repos/godaddy/test-repo/languages',
                forks_count: 0,
                open_issues_count: 0,
                watchers_count: 0,
            };
            fetch.mockResolvedValueOnce({
                ok:true,
                json:async()=>mockRepoData
            }).mockResolvedValueOnce({
                ok:true,
                json:async()=>({})
            })
            renderWithProviders('test-repo');
            await waitFor(()=>{
                expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/godaddy/test-repo');
            })
             await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/godaddy/test-repo/languages');
            });
    })

    test('should not fetch languages if languages_url is not provided',async()=>{
            const mockRepoData = {
                name: 'test-repo',
                description: 'Test',
                html_url: 'https://github.com/godaddy/test-repo',
                languages_url: null,
                forks_count: 0,
                open_issues_count: 0,
                watchers_count: 0,
            }; 
            fetch.mockResolvedValueOnce({
                ok:true,
                json:async()=>mockRepoData
            });
            renderWithProviders('test-repo');
            await waitFor(()=>{
                expect(screen.getByText('test-repo')).toBeInTheDocument();
            });

            expect(fetch).toHaveBeenCalledTimes(1);
    })

})

})
