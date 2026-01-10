import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from "lucide-react";

interface FollowButtonProps { following?: boolean; onToggle?: (following: boolean) => void; className?: string; }

export function FollowButton({ following: initialFollowing = false, onToggle, className }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);

  const handleClick = () => {
    const newFollowing = !following;
    setFollowing(newFollowing);
    onToggle?.(newFollowing);
  };

  return (
    <Button variant={following ? "secondary" : "default"} size="sm" className={className} onClick={handleClick}>
      {following ? <><UserCheck className="h-4 w-4 mr-2" />Seguindo</> : <><UserPlus className="h-4 w-4 mr-2" />Seguir</>}
    </Button>
  );
}
export default FollowButton;
