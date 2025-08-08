"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Logout() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);

      await authClient.signOut();
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="submit"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Logout"}
    </Button>
  );
}
