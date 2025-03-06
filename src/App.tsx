import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ComparisonPage from "./pages/ComparisonPage";
import Home from "./pages/Home";

function App() {
  return (
    <div className="no-scrollbar">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
