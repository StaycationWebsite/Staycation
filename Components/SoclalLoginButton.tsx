'use client'; 

interface SocialLoginOption {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    hoverColor: string;
}

interface SocialLoginButtonProps {
    option: SocialLoginOption;
    onClick: () => void;
}

const SocialLoginButton = ({option, onClick}:SocialLoginButtonProps) => {
  return (
   <button
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-3 py-3 px-6 rounded-lg ${option.color} hover:${option.hoverColor} transition-all duration-300 transform hover:scale-105 active:scale-95 text-white font-semibold`}
   >
    {option.icon}
    <span>Continue wit {option.name}</span>
    </button>
  )
}

export default SocialLoginButton