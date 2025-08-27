import { useEffect, useState } from "react";
import axios from "axios";
import { API_CONFIG } from '../config/api';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'e493e62afadc92e18b6a8f80ba4f64e1'; 

const useFetchDetails = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null); 
            
           
            const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=en-US`;
            console.log('Fetching from:', url); // Debug log
            
            const response = await axios.get(url);
            setData(response.data);
            
        } catch (error) {
            console.log('API Error:', error);
            setError(error.response?.data?.message || error.message); // Store error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    return { data, loading, error }; // RETURN ERROR STATE
}

export default useFetchDetails;