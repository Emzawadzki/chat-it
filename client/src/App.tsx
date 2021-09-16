import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { Header } from "./components/Header";
import { RouteManager } from "./RouteManager";

import "./normalize.css";
import './App.css';

const queryClient = new QueryClient()

const App: React.FC = () => {

  return <Router>
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="main">
        <RouteManager />
      </main>
    </QueryClientProvider>
  </Router>

}


export default App;
