import React, { useEffect, useState } from 'react';
import { UrlModel } from '../types';
import { toast } from 'react-toastify';
import api from '../services/api';


interface UrlListProps {
  urls: UrlModel[];
  onUrlDeleted: () => void;
}

const UrlList: React.FC<UrlListProps> = ({ urls, onUrlDeleted }) => {

  const [urlList, setUrlList] = useState<UrlModel[]>(urls);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard!');
      },
      () => {
        toast.error('Failed to copy to clipboard');
      }
    );
  };

  useEffect(() => {
    setUrlList(urls);
  }, [urls]);

  const increase = (id: string) => {
    const updatedUrls = urlList.map((url) => {
      if (url._doc._id === id) {
        return {
          ...url,
          _doc: {
            ...url._doc,
            visitCount: url._doc.visitCount + 1,
          },
        };
      }
      return url;
    });
  
    setUrlList(updatedUrls);
  };

  const deleteUrl = async (id: string) => {
    try {
      await api.delete(`/url/${id}`);
      toast.success('URL deleted successfully');
      onUrlDeleted();
    } catch (error) {
      toast.error('Failed to delete URL');
      console.error(error);
    }
  };

  if (urlList.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">You haven't created any shortened URLs yet.</p>
      </div>
    );
  }

  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Original URL
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short URL
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Visits
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {urlList.map((url) => (
            <tr key={url._doc._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                <a href={url._doc.originalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  {url._doc.originalUrl}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" onClick={()=>increase(url._doc._id)}>
                  {url.shortUrl}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {url._doc.visitCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(url._doc.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                <button
                  onClick={() => copyToClipboard(url.shortUrl)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Copy
                </button>
                <button
                  onClick={() => deleteUrl(url._doc._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UrlList;