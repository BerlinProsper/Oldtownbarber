import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ServiceProvider } from './Context/MyContext';
import Header from './Components/Header';
import Container from './Components/Container';

import History from './Pages/History';
import Target from './Pages/Target';
import Account from './Pages/Account';
import MyCart from './Pages/Cart';
import AddServices from './Pages/AddService';

function App() {
  return (
    <div className='App'>

    <ServiceProvider>
      <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Routes>
          <Route path="/" element={<Container />} />
          <Route path="/history" element={<History />} />
          <Route path="/addservices" element={<AddServices />} />
          <Route path="/account" element={<Account />} />
          <Route path='/MyCart' element={<MyCart/>}/>
        </Routes>
      </div>
    </ServiceProvider>
        </div>

  );
}

export default App;

