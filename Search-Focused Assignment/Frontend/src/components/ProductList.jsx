import React from 'react';

const ProductList = ({ products, loading, error }) => {
  if (loading) return <div className="loading">Loading inventory...</div>;
  if (error) return <div className="error">{error}</div>;
  if (products.length === 0) return <div className="no-results">No results found.</div>;

  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <div className="product-info">
            <span className="category">{product.category}</span>
            <span className="price">${product.price}</span>
          </div>
          <div className="supplier">Supplier: {product.supplier}</div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
