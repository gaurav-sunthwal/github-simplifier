import { useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GitHubCard from "./Pages/GitHubCard";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<GitHubCard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
