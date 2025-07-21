import {BrowserRouter as Router,Routes,Route,Link} from "react-router-dom";
import {type ReactElement} from "react";
import {Player} from "./player/Player.tsx";
import {Curator} from "./curator/Curator.tsx";

export function App():ReactElement{
    return (
        <Router basename="/respire">
            <nav>
                <Link to="/">Play</Link>
                <Link to="/curate">Curate</Link>
            </nav>

            <Routes>
                <Route path="/" element={< Player />}/>
                <Route path="/curate" element={< Curator />}/>
            </Routes>
        </Router>
    );
}