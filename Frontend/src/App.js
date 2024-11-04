import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Home from './Home';
import Logout from './Logout';
import TokenCreationForm from './TokenCreationForm';

function App() {
  return (
        <Router>
          <div className="App">
            {/* <nav>
              <ul>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </nav> */}
           
            <Routes>

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
               <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Home/>} />
              <Route path="/logout" element={<Logout/>} />
              <Route path="/createtoken" element={<TokenCreationForm/>} />
            </Routes>
          </div>
        </Router>
    
    
  );
}

export default App;
