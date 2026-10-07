import React from 'react';

export default function ManagerDashboard({ currentUserId }) {
  return (
    <div className="manager-dashboard">
      <h1>Manager Workspace</h1>
      <p>Filtered view showing only projects managed by this manager and their associated tasks.</p>
      {/* Project details & task rows for this manager */}
    </div>
  );
}
