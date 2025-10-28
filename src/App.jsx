import './App.css'
import RepoDetails from './components/RepoDetails'
import RepoList from './components/RepoList'
import { Routes,Route } from 'react-router-dom'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'

const queryClient=new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <Routes>
      <Route path='/' element={<RepoList/>}/>
      <Route path='/repo/:repoName' element={<RepoDetails/>}/>
    </Routes>
    </QueryClientProvider>
  )
}

export default App
