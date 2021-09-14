import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";

import "./normalize.css";
import './App.css';

const queryClient = new QueryClient()

const App: React.FC = () => (
  <Router>
    <Header />
    <main className="main">
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </QueryClientProvider>
    </main>
  </Router>
);


export default App;
