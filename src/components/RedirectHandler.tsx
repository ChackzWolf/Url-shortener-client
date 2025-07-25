import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../services/api';

const RedirectHandler: React.FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      try {
        const res = await api.get(`/url/${code}`);
        const originalUrl = res.data.url;
        window.location.href = originalUrl;
      } catch (err) {
        console.error(err);
        navigate('/notfound'); 
      }
    };

    redirect();
  }, [code, navigate]);

  return <p>Redirecting...</p>;
};

export default RedirectHandler;
