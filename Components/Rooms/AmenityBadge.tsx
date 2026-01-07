'use client';

import { Wifi, Wind } from "lucide-react";

interface AmenityBadgeProps {
    amenity: string;
}

const AmenityBadge = ({amenity}:AmenityBadgeProps) => {
    
    const getIcon = (name: string) => {
        switch(name.toLowerCase()) {
            case 'wifi': 
                return <Wifi className="w-4 h-4" />
            case 'ac': 
                return <Wind className="w-4 h-4" />
            default: return null
        }
    }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm">{getIcon(amenity)}
    <span>{amenity}</span>
    </div>
  )
}

export default AmenityBadge