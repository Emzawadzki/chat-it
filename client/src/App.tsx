import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { UserContextProvider } from "./providers/UserProvider";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";

import "./normalize.css";
import './App.css';

const queryClient = new QueryClient()

const App: React.FC = () => {

  return <Router>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <Header />
        <main className="main">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </main>
      </UserContextProvider>
    </QueryClientProvider>
  </Router>

}


export default App;
