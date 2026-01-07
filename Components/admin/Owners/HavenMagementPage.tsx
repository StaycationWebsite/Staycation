'use client'

import { useGetHavensQuery } from "@/redux/api/roomApi";



const HavenManagementPage = () => {

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h2 className="text-3xl font-bold">Haven Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Haven 1', location: 'Makati', units: 15, occupancy: '78%' },
          { name: 'Haven 2', location: 'Quezon City', units: 12, occupancy: '85%' },
          { name: 'Haven 3', location: 'Pasay', units: 18, occupancy: '72%' },
        ].map((h, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 hover:shadow-lg animate-in fade-in slide-in-from-bottom duration-500" style={{ animationDelay: `${i*100}ms` }}>
            <h3 className="text-lg font-bold mb-2">{h.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{h.location}</p>
            <div className="space-y-1 mb-4 text-sm">
              <p><span className="font-semibold">Units:</span> {h.units}</p>
              <p><span className="font-semibold">Occupancy:</span> <span className="text-green-600">{h.occupancy}</span></p>
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );
};