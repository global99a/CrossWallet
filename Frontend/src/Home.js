import { useNavigate } from 'react-router-dom';
import './Home.css';
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage-container">
      <div className="overlay">
        <h1 className="title">CrossFunctional Wallet</h1>
        <p className="description">
          Seamless transactions and smart management of your digital assets.
        </p>
        <button className="get-started-btn" onClick={() => navigate('/register')}>
          Get Started
        </button>
      </div>
    </div>
  );
};
export default Home;
