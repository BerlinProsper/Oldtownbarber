import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ServiceProvider } from './Context/MyContext';
import Header from './Components/Header';
import Container from './Components/Container';

import History from './Pages/History';
import MyCart from './Pages/Cart';
import AddServices from './Pages/AddService';

import Records from './Pages/FetchHistory/history';

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
          <Route path="/records" element={<Records />} />
          <Route path='/MyCart' element={<MyCart/>}/>
                    <Route path='/password' element={<PasswordProtectedPage/>}/>

        </Routes>
      </div>
    </ServiceProvider>
        </div>

  );
}

export default App;

