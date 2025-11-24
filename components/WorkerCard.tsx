import React from 'react';
import { WorkerProfile } from '../types';

interface WorkerCardProps {
  worker: WorkerProfile;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ worker }) => {
  const handleContact = () => {
    alert(`Calling ${worker.name} at ${worker.phone}...`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
      {/* Card Header / Image */}
      <div className="relative h-48 overflow-hidden bg-gray-200 group">
        <img 
          src={worker.imageUrl} 
          alt={worker.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700 shadow-sm">
          ${worker.hourlyRate}/hr
        </div>
        {worker.isVerified && (
           <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
             <i className="fas fa-check-circle"></i> Verified
           </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{worker.name}</h3>
          <div className="flex items-center text-yellow-500 text-sm">
             <i className="fas fa-star mr-1"></i>
             <span className="font-semibold">{worker.rating}</span>
             <span className="text-gray-400 ml-1 text-xs">({worker.reviews})</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-3 uppercase tracking-wide font-semibold text-xs text-orange-600">
          {worker.category}
        </p>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {worker.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {worker.services.slice(0, 3).map((service, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
              {service}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button 
          onClick={handleContact}
          className="w-full mt-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <i className="fas fa-phone-alt"></i> Contact
        </button>
      </div>
    </div>
  );
};

export default WorkerCard;
