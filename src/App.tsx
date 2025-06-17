import { BrowserRouter } from "react-router-dom";
import MainRouter from "./modules/core/router/mainRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./modules/core/components/providers/ThemeProvider";
import { ThemeToggle } from "./modules/core/components/ui/ThemeToggle";

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <BrowserRouter>
                    <div className="fixed top-4 right-4 z-50">
                        <ThemeToggle />
                    </div>
                    <MainRouter />
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;