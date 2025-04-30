import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface UrlFormProps {
  onUrlCreated: () => void;
}

const UrlForm: React.FC<UrlFormProps> = ({ onUrlCreated }) => {
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      await api.post('/url', { originalUrl: url });
      toast.success('URL shortened successfully!');
      setUrl('');
      onUrlCreated();
    } catch (error) {
      toast.error('Failed to shorten URL. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Shorten a URL</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a long URL"
            required
            className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UrlForm;