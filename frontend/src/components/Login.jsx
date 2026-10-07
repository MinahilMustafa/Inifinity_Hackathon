import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple demo login flow
  };

  return (
    <div className="login-container">
      <h2>NovaWorks CRM Login</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Demo Email (e.g. admin@novaworks.example)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password (Demo123!)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
