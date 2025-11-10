import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader } from "@/components/Loader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Menu from "@/pages/Menu";
import Modo from "@/pages/Modo";
import NeuroJogo from "@/pages/NeuroJogo";
import Sons from "@/pages/Sons";
import Musicas from "@/pages/Musicas";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <ProtectedRoute>
          <Menu />
        </ProtectedRoute>
      </Route>
      <Route path="/modo/:modo">
        <ProtectedRoute>
          <Modo />
        </ProtectedRoute>
      </Route>
      <Route path="/neurojogo">
        <ProtectedRoute>
          <NeuroJogo />
        </ProtectedRoute>
      </Route>
      <Route path="/sons">
        <ProtectedRoute>
          <Sons />
        </ProtectedRoute>
      </Route>
      <Route path="/musicas">
        <ProtectedRoute>
          <Musicas />
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
        <div className={isLoading ? "opacity-0" : "opacity-100 transition-opacity duration-700"}>
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
