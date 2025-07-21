import "./app.css";
import {BrowserRouter as Router, Routes, Route, Link, useLocation} from "react-router-dom";
import {type ReactElement} from "react";
import {Player} from "./player/Player.tsx";
import {Curator} from "./curator/Curator.tsx";

function Navigation() {
    const location = useLocation();
    return (
        <nav>
            <Link className={`play link ${location.pathname === "/" ? "selected" : ""}`} to="/">Play</Link>
            <Link className={`curate link ${location.pathname === "/curate" ? "selected" : ""}`}
                  to="/curate">Curate</Link>
        </nav>
    );
}

export function App(): ReactElement {
    return (
        <Router basename="/respire">
            <Navigation/>
            <Routes>
                <Route path="/" element={< Player />}/>
                <Route path="/curate" element={< Curator />}/>
            </Routes>
        </Router>
    );
}