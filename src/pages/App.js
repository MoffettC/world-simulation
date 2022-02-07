import logo from '../img/logo.svg';
import styles from './App.module.css';
import Simulation from './sim-visuals/Simulation.jsx';
import * as React from 'react';

function App() {
  return (
    <div className={styles.app} >
      
      <header className={styles.header}>
        <div>
          <img src={logo} className={styles.logo} alt="logo" />
        </div>
        <p>
          Edit <code>src/App.js</code> and save to reload. &nbsp;
        </p>
        <a
          className={styles.link}
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <Simulation></Simulation>

    </div>
  );
}

export default App;
