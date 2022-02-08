import logo from '../img/logo.svg';
import styles from './App.module.css';
import SimulationViewer from './simulation/SimulationViewer.jsx';
import * as React from 'react';

function App() {
  return (
    <div className={styles.app} >
      
      <header className={styles.header}>
        <div>
          <img src={logo} className={styles.logo} alt="logo" />
        </div>
        <p>
          Beginning of something cool?&nbsp;
        </p>

      </header>

      <SimulationViewer></SimulationViewer>

    </div>
  );
}

export default App;
