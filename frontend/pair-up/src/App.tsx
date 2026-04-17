import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/home';
import Initiator from './pages/InitiatingPage';
import Dashboard from './pages/Dashboard';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/init' element={<Initiator/>}/>
        <Route path='/chat' element={<Dashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
