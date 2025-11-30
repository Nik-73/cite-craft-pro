import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config/wagmi'
import Layout from './components/common/Layout'
import Dashboard from './pages/Dashboard'
import Governance from './pages/Governance'
import Treasury from './pages/Treasury'
import Members from './pages/Members'
import ProposalDetails from './pages/ProposalDetails'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/proposal/:id" element={<ProposalDetails />} />
              <Route path="/treasury" element={<Treasury />} />
              <Route path="/members" element={<Members />} />
            </Routes>
          </Layout>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
