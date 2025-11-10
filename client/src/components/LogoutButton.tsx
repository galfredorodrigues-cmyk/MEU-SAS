import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function LogoutButton() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("brinle_auth");
    localStorage.removeItem("brinle_user");
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
    setLocation("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 right-4 z-50"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handleLogout}
        data-testid="button-logout"
        className="backdrop-blur-sm bg-card/80 border-primary/30 hover:border-primary/60"
        title="Sair"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}
