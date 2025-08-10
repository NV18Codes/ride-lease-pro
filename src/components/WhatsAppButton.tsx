import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber: string; // Include country code, e.g. "919999999999"
  message?: string;
}

const WhatsAppButton = ({ phoneNumber, message = "Hi! I need help with my bike booking." }: WhatsAppButtonProps) => {
  const href = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
};

export default WhatsAppButton;
