import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";

import "./normalize.css";
import './App.css';

const queryClient = new QueryClient()

const App: React.FC = () => {

  return <Router>
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="main">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </main>
    </QueryClientProvider>
  </Router>

}


export default App;
