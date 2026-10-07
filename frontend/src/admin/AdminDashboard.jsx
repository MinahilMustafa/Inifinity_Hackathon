import React from 'react';
import TranscriptCreator from './TranscriptCreator';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Administrator Workspace</h1>
      <p>Overview of all company projects, team directory, and transcript conversion engine.</p>
      <TranscriptCreator />
      {/* Project Cards & Team Directory will render here */}
    </div>
  );
}
