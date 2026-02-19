import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('q', searchQuery);
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);

        const response = await fetch(`http://localhost:5000/api/search?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid too many requests
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters]);

  return (
    <div className="app-container">
      <header>
        <h1>ZeeroStock Inventory Search</h1>
      </header>
      
      <main>
        <div className="search-section">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <Filters filters={filters} setFilters={setFilters} />
        </div>
        
        <ProductList products={products} loading={loading} error={error} />
      </main>
    </div>
  );
}

export default App;
