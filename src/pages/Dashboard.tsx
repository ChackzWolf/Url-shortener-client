import React, { useState, useEffect } from 'react';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import api from '../services/api';
import { UrlModel } from '../types';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const [urls, setUrls] = useState<UrlModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);



  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await api.get('/url/my-urls');
    
      // const reversedList = response.data
      setUrls(response.data);
    } catch (error) {
      toast.error('Failed to fetch your URLs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <UrlForm onUrlCreated={fetchUrls} />
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <UrlList urls={urls} onUrlDeleted={fetchUrls} />
      )}
    </div>
  );
};

export default Dashboard;