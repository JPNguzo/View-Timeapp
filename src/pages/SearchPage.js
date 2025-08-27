import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';


  const fetchData = useCallback(async () => {
    if (!query) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/search/multi`, {
        params: {
          query: query,
          page: page
        }
      });
      
      setData(prev => page === 1 
        ? response.data.results 
        : [...prev, ...response.data.results]
      );
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    if (query) {
      setPage(1);
      setData([]);
      setInputValue(query);
    }
  }, [query]);

 
  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleScroll = useCallback(() => {
    if (loading || !query) return;
    
    const { scrollY, innerHeight } = window;
    const { offsetHeight } = document.body;
    const bottomThreshold = offsetHeight - 500;
    
    if (scrollY + innerHeight >= bottomThreshold) {
      setPage(prev => prev + 1);
    }
  }, [loading, query]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

 
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim() === '') {
      navigate('/search');
    } else {
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className='py-16'>
   
      <div className='lg:hidden my-2 mx-1 sticky top-[70px] z-30'>
        <input 
          type='text'
          placeholder='Search here...'
          onChange={handleSearchChange}
          value={inputValue}
          className='px-4 py-1 text-lg w-full bg-white rounded-full text-neutral'
        />
      </div>

    
      <div className='container mx-auto'>
        <h3 className='capitalize text-lg lg:text-xl font-semibold my-3'>
          {query ? `Search Results for "${query}"` : 'Enter a search term'}
        </h3>

      
        {error && (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg mb-4">
            Error: {error}
          </div>
        )}

        {loading && page === 1 && (
          <div className="text-center p-8">Loading results...</div>
        )}


        <div className='grid grid-cols-[repeat(auto-fit,230px)] gap-6 justify-center lg:justify-start'>
          {data.map((searchData) => (
            <Card 
              data={searchData} 
              key={`${searchData.media_type}-${searchData.id}`}
              media_type={searchData.media_type}
            />
          ))}
        </div>

        
        {data.length === 0 && !loading && query && (
          <div className="text-center p-8 text-gray-500">
            No results found for "{query}"
          </div>
        )}

        {loading && page > 1 && (
          <div className="text-center p-4">Loading more results...</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;