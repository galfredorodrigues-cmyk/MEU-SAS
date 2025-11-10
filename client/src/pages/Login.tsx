import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, User, LogIn, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NeuralBackground } from "@/components/NeuralBackground";
import { NeuralParticles } from "@/components/NeuralParticles";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("brinle_auth") === "true";
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (username.trim() === "meuappbrinle" && password === "brinleaprende128") {
        localStorage.setItem("brinle_auth", "true");
        localStorage.setItem("brinle_user", username);
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao BrinLê Neuro",
        });
        setLocation("/");
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Usuário ou senha incorretos",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <NeuralBackground isActive={true} />
      <NeuralParticles isActive={true} />

      <motion.div
        className="relative z-10 w-full max-w-md px-4"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-primary via-accent to-primary"
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 229, 255, 0.3), 0 0 40px rgba(199, 125, 255, 0.2)",
                "0 0 30px rgba(0, 229, 255, 0.5), 0 0 60px rgba(199, 125, 255, 0.3)",
                "0 0 20px rgba(0, 229, 255, 0.3), 0 0 40px rgba(199, 125, 255, 0.2)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-12 h-12 text-background" />
          </motion.div>
          
          <h1 
            className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            style={{
              filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.3))',
              letterSpacing: '0.05em'
            }}
          >
            BrinLê Neuro
          </h1>
          <p className="text-muted-foreground text-lg">
            Acesso à plataforma neural
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="overflow-visible backdrop-blur-sm bg-card/95 border-primary/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Login
              </CardTitle>
              <CardDescription className="text-center">
                Entre com suas credenciais para acessar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="Usuário"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
                      required
                      data-testid="input-username"
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="password"
                      placeholder="Senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-background/50 border-border focus:border-primary transition-colors"
                      required
                      data-testid="input-password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full text-lg gap-2"
                  disabled={isLoading}
                  data-testid="button-login"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            Plataforma de aprendizado neural para crianças
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
