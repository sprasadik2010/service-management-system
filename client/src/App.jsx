import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ServiceRequestList from './components/ServiceRequestList.jsx';
import ServiceRequestListCard from './components/ServiceRequestListCard.jsx';
import CreateServiceRequest from './components/CreateServiceRequest.jsx';
import ServiceRequestDetail from './components/ServiceRequestDetail.jsx';
import Navbar from './components/Navbar.jsx'; // Add .jsx extension

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            {/* <Route path="/" element={<ServiceRequestList />} /> */}
            <Route path="/" element={<ServiceRequestListCard />} />
            <Route path="/create" element={<CreateServiceRequest />} />
            <Route path="/request/:id" element={<ServiceRequestDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;