import React, { useState } from 'react';

const services = [
  { id: 1, name: "Haircut", price: 250, time: "30 mins", image: "/icons/haircut.png" },
  { id: 2, name: "Facial", price: 800, time: "60 mins", image: "/icons/facial.png" },
  { id: 3, name: "Waxing", price: 500, time: "45 mins", image: "/icons/waxing.png" },
  { id: 4, name: "Threading", price: 150, time: "15 mins", image: "/icons/threading.png" }
];

const SalonService = () => {
  const [selected, setSelected] = useState([]);

  const toggleService = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectedItems = services.filter(s => selected.includes(s.id));
  const total = selectedItems.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Salon for Men & Women</h1>
        <p className="text-gray-600">Top-rated beauticians at your home</p>
      </div>

      {/* Services */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <img src={service.image} alt={service.name} className="w-16 h-16 mb-3" />
            <h3 className="text-lg font-medium">{service.name}</h3>
            <p className="text-sm text-gray-500">{service.time}</p>
            <p className="text-blue-600 font-semibold mt-1">₹{service.price}</p>
            <button
              onClick={() => toggleService(service.id)}
              className={`mt-3 px-4 py-2 rounded-md text-white ${
                selected.includes(service.id) ? 'bg-red-500' : 'bg-blue-500'
              }`}
            >
              {selected.includes(service.id) ? 'Remove' : 'Add'}
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      {selected.length > 0 && (
        <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-xl p-4 w-72">
          <h3 className="font-bold text-lg mb-2">Your Selection</h3>
          <ul className="space-y-1">
            {selectedItems.map(item => (
              <li key={item.id} className="text-sm flex justify-between">
                <span>{item.name}</span>
                <span>₹{item.price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 font-semibold">Total: ₹{total}</div>
          <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
            Continue to Schedule
          </button>
        </div>
      )}
    </div>
  );
};

export default SalonService;
