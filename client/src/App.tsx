import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { UserContextProvider } from "./providers/UserProvider";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GuestRoute } from "./components/GuestRoute";

import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Users } from "./pages/Users";
import { Chat } from "./pages/Chat";

import "./normalize.css";
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchInterval: false
    },
    mutations: {
      retry: false,
    }
  }
})

const AppProviders: React.FC = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <UserContextProvider>{children}</UserContextProvider>
  </QueryClientProvider>
)

const App: React.FC = () => (
  <Router>
    <AppProviders>
      <Header />
      <main className="main">
        <Switch>
          <Route exact path="/" component={Home} />
          <GuestRoute exact path="/register" component={Register} />
          <GuestRoute exact path="/login" component={Login} />
          <ProtectedRoute exact path="/users" component={Users} />
          <ProtectedRoute exact path="/chat/:id" component={Chat} />
          <Route><Redirect to="/" /></Route>
        </Switch>
      </main>
    </AppProviders>
  </Router>
)


export default App;
