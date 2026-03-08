import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import AkashicRecord from "@/pages/AkashicRecord";
import Rules from "@/pages/Rules";
import AnimeRules from "@/pages/AnimeRules";
import History from "@/pages/History";
import Timeline from "@/pages/Timeline";
import Login from "@/pages/Login";
import Knowledge from "@/pages/Knowledge";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Galaxy from "./components/Galaxy";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/akashic"} component={AkashicRecord} />
      <Route path={"/rules"} component={Rules} />
      <Route path={"/anime-rules"} component={AnimeRules} />
      <Route path={"/history"} component={History} />
      <Route path={"/timeline"} component={Timeline} />
      <Route path={"/login"} component={Login} />
      <Route path={"/knowledge"} component={Knowledge} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <div className="dark">
          <Galaxy />
          <TooltipProvider>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Toaster />
              <Router />
            </div>
          </TooltipProvider>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
