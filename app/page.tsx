import pool from '../backend/config/db';
import { Metadata } from 'next';
import Link from 'next/link';
import HeroSectionMain from '@/Components/HeroSection/HeroSectionMain';
import Footer from '@/Components/Footer';

export const metadata: Metadata = {
  title: "Staycation Haven | Premium Staycation Experiences",
  description: "Staycation Haven - Find your perfect premium rooms and havens for an unforgettable stay",
};

export default async function Home() {
  // Test database connection
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected! Current time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <HeroSectionMain />
      <Footer />
    </div>
  );
}