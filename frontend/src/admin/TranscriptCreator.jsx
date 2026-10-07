import React, { useState } from 'react';

export default function TranscriptCreator({ onCreated }) {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Call AI endpoint to convert transcript into projects & tasks
    } catch (err) {
      setError(err.message || 'Failed to process transcript');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transcript-creator">
      <h2>Create Projects & Tasks from Meeting Transcript</h2>
      <textarea
        rows={10}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Paste meeting transcript here..."
      />
      {error && <div className="error-banner">{error}</div>}
      <button onClick={handleCreate} disabled={loading || !transcript.trim()}>
        {loading ? 'AI Processing & Saving Records...' : 'Create from Transcript'}
      </button>
    </div>
  );
}
