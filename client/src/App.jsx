import { Routes, Route, Navigate } from 'react-router-dom'
import Canvas from './components/Canvas';
import SettingBar from './components/SettingBar';
import Toolbar from './components/Toolbar';
import './styles/app.scss'

const App = () => {
  return (
  
  <div className="app">
    <Routes>
      <Route path="/:id" element={<><Toolbar /><SettingBar /><Canvas /></>} />
      <Route path="*" element={<Navigate to={`f${(+ new Date()).toString(16)}`} replace />} />
    </Routes>
  </div>
  
  );
}

export default App;
