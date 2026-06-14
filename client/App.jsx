import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Pages/Home';
import Room from './Pages/Room';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}
