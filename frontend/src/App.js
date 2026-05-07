import React from "react";
import InternshipList from "./pages/InternshipList";
import IssueForm from './pages/IssueForm';

function App() {
  return (
    <div className="App">
      <h1>ILES Internship System</h1>

      {/* Module 2: Internship Placement Module */}
      <InternshipList />

      <hr />

      {/* Module  3: Weekly Log/IssueModule */}
      <IssueForm />
    </div>
  );
}

export default App;
