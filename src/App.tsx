import { BrowserRouter } from "react-router-dom";
import MainRouter from "./modules/core/router/mainRouter";

function App() {
    return (
        <BrowserRouter>
            <MainRouter />
        </BrowserRouter>
    );
}

export default App;