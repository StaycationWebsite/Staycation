import Location from "@/Components/Location"
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Staycation Haven | Location",
  description: "Find our location in Quezon City, Metro Manila. Get directions and contact information for Staycation Haven.",
};

const LocationPage = () => {
  return <Location />
}

export default LocationPage