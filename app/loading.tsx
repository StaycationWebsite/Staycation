const Loading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with pulse animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <img
            src="/Images/shlogo.png"
            alt="Staycation Logo"
            className="w-20 h-20 object-contain relative z-10 animate-bounce"
          />
        </div>

        {/* Brand name with gradient */}
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 animate-pulse">
          Staycation
        </h2>

        {/* Loading spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>

        {/* Loading text */}
        <p className="text-sm font-medium text-gray-600 tracking-wider animate-pulse">
          Preparing your perfect stay...
        </p>
      </div>
    </div>
  );
};

export default Loading;
