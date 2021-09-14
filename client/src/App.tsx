import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";

import "./normalize.css";
import './App.css';

const App: React.FC = () => (
  <Router>
    <Header />
    <main className="main">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
      </Switch>
    </main>
  </Router>
);


export default App;
