
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div className={`fixed left-6 bottom-6 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <Button
        className="rounded-full bg-[#25D366] hover:bg-[#20BA5C] w-14 h-14 flex items-center justify-center shadow-lg button-hover"
        size="icon"
        onClick={() => window.open("https://wa.me/966123456789", "_blank")}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="white" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white"
        >
          <path d="M21.27 15.18c.08-.56.15-1.15.15-1.81 0-5.9-4.98-10.69-11.12-10.69S0 7.47 0 13.37c0 2.94 1.21 5.61 3.18 7.57L2.4 24l5.7-1.91c1.46.6 3.1.97 4.84.97 6.15 0 11.13-4.79 11.13-10.69 0-.97-.15-1.89-.41-2.78"/>
          <path d="M17.01 14.04c-.28-.14-1.65-.81-1.9-.91-.26-.09-.45-.14-.64.14-.19.27-.72.91-.88 1.1-.16.18-.32.2-.6.07-.81-.41-1.34-.73-1.87-1.66-.14-.24.14-.22.41-.73.05-.09.03-.18-.01-.27-.04-.09-.64-1.55-.88-2.13-.23-.56-.47-.46-.64-.47h-.56c-.19 0-.51.07-.78.37-.27.29-1.01.99-1.01 2.42 0 1.43 1.04 2.81 1.19 3.01.14.2 2.04 3.11 4.94 4.36 2.9 1.24 2.9.83 3.42.78.53-.05 1.7-.7 1.94-1.37.24-.67.24-1.25.16-1.37-.06-.08-.26-.14-.55-.27z"/>
        </svg>
      </Button>
    </div>
  );
};

export default WhatsAppButton;
