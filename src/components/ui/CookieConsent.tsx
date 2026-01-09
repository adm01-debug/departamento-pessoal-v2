import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";

interface CookieConsentProps {
  message?: string;
  acceptText?: string;
  declineText?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
}

export function CookieConsent({ message = "Utilizamos cookies para melhorar sua experiência.", acceptText = "Aceitar", declineText = "Recusar", onAccept, onDecline, className }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setIsVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
    onDecline?.();
  };

  if (!isVisible) return null;

  return (
    <Card className={cn("fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 shadow-lg", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm">{message}</p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={handleAccept}>{acceptText}</Button>
              <Button size="sm" variant="outline" onClick={handleDecline}>{declineText}</Button>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1" onClick={handleDecline}><X className="h-4 w-4" /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
export default CookieConsent;
