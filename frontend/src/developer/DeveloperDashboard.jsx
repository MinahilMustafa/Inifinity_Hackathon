import React from 'react';

export default function DeveloperDashboard({ currentUserId }) {
  return (
    <div className="developer-dashboard">
      <h1>Developer Agent Workspace (My Tasks)</h1>
      <p>Filtered view showing only tasks assigned to this developer agent across projects.</p>
      {/* My Tasks table showing title, description, project, deadline, and estimated hours */}
    </div>
  );
}
