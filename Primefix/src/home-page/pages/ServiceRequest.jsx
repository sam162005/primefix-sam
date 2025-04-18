import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SalonService from '../components/services/SalonService';
import ACService from '../components/services/ACService';
import PlumbingService from '../components/services/PlumbingService';

const ServiceRequest = () => {
  const location = useLocation();
  const { image, title } = location.state || {};

  const getServiceComponent = () => {
    switch (title) {
      case "Salon for Men and Women":
        return <SalonService />;
      case "AC & Appliance Repair":
        return <ACService />;
      case "Plumbing":
        return <PlumbingService />;
      // ... handle other categories
      default:
        return <p className="text-center text-gray-500">Service not found</p>;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">{title || "Service Request"}</h2>
        {image && <img src={image} alt={title} className="w-32 h-32 mx-auto my-4 rounded-lg shadow-md" />}
      </div>

      {getServiceComponent()}
    </div>
  );
};

export default ServiceRequest;
