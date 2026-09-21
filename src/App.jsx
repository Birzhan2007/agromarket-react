import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) {
          throw new Error('Ошибка сервера: ' + response.status);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  function handleAddToCart() {
    setCartCount(cartCount + 1);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header>
        <h1>АгроМаркет</h1>
        <div>Корзина: {cartCount}</div>
      </header>
      <main>
        <input
          className="search"
          type="text"
          placeholder="Поиск товара..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <section className="catalog">
          <h2>Каталог</h2>
          {loading && <p>Загрузка...</p>}
          {error && <p className="error">{error}</p>}
          {!loading &&
            !error &&
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={handleAddToCart}
              />
            ))}
        </section>
      </main>
    </>
  );
}

export default App;
