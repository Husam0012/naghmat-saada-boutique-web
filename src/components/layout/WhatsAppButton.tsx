
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
    <div
      className={`fixed left-6 bottom-6 z-50 transition-all duration-300 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <Button
        className="rounded-full bg-[#25D366] hover:bg-[#20BA5C] w-14 h-14 flex items-center justify-center shadow-lg button-hover"
        size="icon"
        onClick={() => window.open("https://wa.me/966123456789", "_blank")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="28"
          height="28"
          fill="white"
          className="text-white"
        >
          <path d="M16.003 2.67c-7.206 0-13.05 5.843-13.05 13.05 0 2.29.6 4.53 1.743 6.5L2.6 29.4l7.4-2.43c1.9 1.03 4.05 1.57 6.003 1.57 7.206 0 13.05-5.843 13.05-13.05s-5.843-13.05-13.05-13.05zM16 26.533c-1.742 0-3.45-.465-4.95-1.343l-.35-.2-4.4 1.45 1.45-4.3-.2-.35a10.6 10.6 0 01-1.55-5.6c0-5.867 4.783-10.65 10.65-10.65 5.867 0 10.65 4.783 10.65 10.65 0 5.867-4.783 10.65-10.65 10.65zM22.15 19.25c-.3-.15-1.767-.867-2.05-.967-.283-.1-.483-.15-.683.15-.2.3-.783.967-.95 1.167-.167.2-.35.217-.65.067-.3-.15-1.267-.467-2.417-1.483-.893-.797-1.5-1.783-1.683-2.083-.183-.3-.02-.45.13-.6.134-.134.3-.35.45-.517.15-.167.2-.283.3-.467.1-.183.05-.35-.017-.5-.067-.15-.65-1.567-.9-2.167-.237-.567-.48-.483-.65-.483-.167 0-.35-.017-.533-.017s-.5.067-.767.35c-.267.283-1.017 1-1.017 2.433 0 1.433 1.042 2.817 1.183 3.017.15.2 2.05 3.133 4.967 4.4.693.3 1.233.483 1.65.617.692.217 1.317.183 1.817.117.55-.083 1.767-.717 2.017-1.4.25-.683.25-1.267.183-1.4-.066-.133-.25-.2-.533-.35z" />
        </svg>
      </Button>
    </div>
  );
};

export default WhatsAppButton;
