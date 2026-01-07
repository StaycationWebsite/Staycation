"use client";

interface SpinnerProps {
    label: string;
}

const Spinner = ({ label }:SpinnerProps) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 rounded-2xl animate-fade-in">
        <div className="bg-white rounded-lg p-8 text-center animate-scale-in">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">
            {label}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Spinner;
