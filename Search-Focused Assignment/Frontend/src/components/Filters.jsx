import React from 'react';

const Filters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filters">
      <select name="category" value={filters.category} onChange={handleChange} className="filter-select">
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Construction">Construction</option>
        <option value="Machinery">Machinery</option>
        <option value="Safety">Safety</option>
        <option value="Hardware">Hardware</option>
      </select>
      
      <div className="price-inputs">
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="filter-input"
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="filter-input"
        />
      </div>
    </div>
  );
};

export default Filters;
