import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import ComparisonPage from "./pages/ComparisonPage";

function App() {
  return (
    <div className="no-scrollbar">
      <Router>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
