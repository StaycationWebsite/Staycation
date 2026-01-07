"use client";

import {
  Building2,
  Heart,
  Shield,
  Star,
  Users,
  Award,
  Clock,
  MapPin,
} from "lucide-react";
import Footer from "@/Components/Footer";

const AboutPage = () => {
  const stats = [
    {
      icon: <Building2 className="w-8 h-8" />,
      value: "10+",
      label: "Premium Havens",
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "5,000+",
      label: "Happy Guests",
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: "4.8",
      label: "Average Rating",
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "100%",
      label: "Satisfaction Rate",
    },
  ];

  const values = [
    {
      icon: <Heart className="w-12 h-12 text-orange-500" />,
      title: "Guest-Centered",
      description:
        "Your comfort and satisfaction are at the heart of everything we do. We strive to exceed expectations.",
    },
    {
      icon: <Shield className="w-12 h-12 text-orange-500" />,
      title: "Safety First",
      description:
        "We maintain the highest standards of cleanliness and security to ensure your peace of mind.",
    },
    {
      icon: <Clock className="w-12 h-12 text-orange-500" />,
      title: "Flexible Options",
      description:
        "From 6-hour stays to multi-day bookings, we offer flexible options to fit your schedule.",
    },
    {
      icon: <MapPin className="w-12 h-12 text-orange-500" />,
      title: "Prime Locations",
      description:
        "Strategically located in the heart of the city for easy access to everything you need.",
    },
  ];

  const team = [
    {
      name: "Maria Santos",
      role: "Founder & CEO",
      image: "/Images/shlogo.png",
      description:
        "Passionate about creating unique urban staycation experiences.",
    },
    {
      name: "Juan Dela Cruz",
      role: "Operations Manager",
      image: "/Images/shlogo.png",
      description: "Ensuring every guest has a seamless and memorable stay.",
    },
    {
      name: "Ana Reyes",
      role: "Guest Relations",
      image: "/Images/shlogo.png",
      description: "Dedicated to making every guest feel welcome and valued.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-in fade-in slide-in-from-bottom duration-700">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                About Staycation Haven
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Your premier destination for flexible, comfortable, and affordable
              urban staycations. We transform ordinary spaces into extraordinary
              experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-700 dark:to-gray-600 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4 text-orange-500 dark:text-orange-400">
                  {stat.icon}
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Founded in 2020, Staycation Haven was born from a simple idea:
                  not everyone needs a full 24-hour hotel stay. Whether
                  you&#39;re traveling through the city, need a comfortable
                  place to rest between meetings, or want a quick getaway
                  without breaking the bank, we&#39;re here for you.
                </p>
                <p>
                  We&#39;ve revolutionized urban accommodation by offering
                  flexible booking options – from 6-hour quick stays to
                  multi-day retreats. Our havens are designed with modern
                  travelers in mind, combining comfort, convenience, and
                  affordability.
                </p>
                <p>
                  Today, we&#39;re proud to serve thousands of guests across
                  multiple premium locations, maintaining our commitment to
                  quality, cleanliness, and exceptional service.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right duration-700">
              <img
                src="/Images/haven9_Living_Area_haven_7_1764217597_1817.jpg"
                alt="Staycation Haven Interior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide us in delivering exceptional staycation
              experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Dedicated professionals committed to making your stay exceptional
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-64 bg-gradient-to-br from-orange-200 to-yellow-200 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 object-contain"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 dark:text-orange-400 font-semibold mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-yellow-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg sm:text-xl leading-relaxed opacity-95">
            To redefine urban accommodation by providing flexible, high-quality
            staycation options that fit modern lifestyles. We believe everyone
            deserves a comfortable retreat, whether for a few hours or several
            days, without compromising on quality or breaking the bank.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
