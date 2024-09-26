'use client'
import React, { useState } from 'react';

const ApiCredentialsForm = ({ onSubmit }: { onSubmit: (apiCredentials: { apiKey: string; privateKey: string }, keepSignedIn: boolean) => void }) => {
  const [apiKey, setApiKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ apiKey, privateKey }, keepSignedIn);
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // we need to replace /n with actual newlines
    const formattedValue = value.replace(/\\n/g, '\n');
    setPrivateKey(formattedValue);
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">API Key</label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 block w-full p-2 bg-gray-700 text-white rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300">Private Key</label>
        <textarea
          value={privateKey}
          onChange={handlePrivateKeyChange}
          className="mt-1 block w-full p-2 bg-gray-700 text-white rounded"
          required
          style={{ height: '250px', fontSize: '8px' }}
        />
      </div>
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
            className="form-checkbox"
          />
          <span className="ml-2 text-sm text-gray-300">Keep me signed in</span>
        </label>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ApiCredentialsForm;