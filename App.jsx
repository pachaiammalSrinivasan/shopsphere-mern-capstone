import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Header() {
  return (
    <header className="header">
      <Link className="brand" to="/">
        <span className="brand-mark">S</span>
        <span>ShopSphere</span>
      </Link>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}

function ProductCard({ product }) {
  return (
    <Link className="card" to={`/products/${product.id}`}>
      <div className="product-art" aria-hidden="true">{product.emoji}</div>
      <div className="card-body">
        <span className="tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="card-bottom">
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          <span>★ {product.rating}</span>
        </div>
      </div>
    </Link>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ search, category });
    fetch(`${API}/products?${params}`)
      .then(r => r.json())
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category]);

  return (
    <main className="page">
      <section className="section-head">
        <div>
          <span className="eyebrow">CATALOG</span>
          <h1>Find your next favorite tech.</h1>
          <p>Search, filter and explore a curated product catalog.</p>
        </div>
        <div className="search-wrap">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>
      </section>

      <div className="filters">
        {categories.map(c => (
          <button
            key={c}
            className={category === c ? "filter active" : "filter"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="status">Loading products...</div>
      ) : products.length ? (
        <div className="grid">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
      ) : (
        <div className="status">No products found.</div>
      )}
    </main>
  );
}

function Home() {
  const navigate = useNavigate();
  const featured = useMemo(() => [
    ["🎧", "Audio", "Immersive sound"],
    ["⌚", "Wearables", "Smart everyday tech"],
    ["💻", "Accessories", "Better desk setup"]
  ], []);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">MODERN MERN E-COMMERCE</span>
          <h1>Simple shopping.<br /><span>Smart choices.</span></h1>
          <p>Explore a clean, responsive product catalog built with React, Node.js, Express and MongoDB-ready APIs.</p>
          <button className="primary" onClick={() => navigate("/products")}>Explore Products →</button>
        </div>
        <div className="hero-panel">
          <div className="floating-card card-a">⚡ Fast Vite build</div>
          <div className="device">🛍️</div>
          <div className="floating-card card-b">✓ Responsive design</div>
        </div>
      </section>

      <section className="feature-row">
        {featured.map(([icon, title, text]) => (
          <div className="feature" key={title}>
            <div className="feature-icon">{icon}</div>
            <div><strong>{title}</strong><p>{text}</p></div>
          </div>
        ))}
      </section>
    </main>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API}/products/${id}`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setProduct)
      .catch(() => setError(true));
  }, [id]);

  if (error) return <main className="page status">Product not found.</main>;
  if (!product) return <main className="page status">Loading product...</main>;

  return (
    <main className="page">
      <Link className="back" to="/products">← Back to products</Link>
      <section className="detail">
        <div className="detail-art">{product.emoji}</div>
        <div>
          <span className="tag">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="detail-text">{product.description}</p>
          <div className="detail-rating">★ {product.rating} / 5</div>
          <div className="detail-price">₹{product.price.toLocaleString("en-IN")}</div>
          <button className="primary" onClick={() => alert("Demo: product added to cart!")}>Add to Cart</button>
        </div>
      </section>
    </main>
  );
}

function About() {
  return (
    <main className="page narrow">
      <span className="eyebrow">ABOUT</span>
      <h1>Built as a full-stack capstone.</h1>
      <p>ShopSphere demonstrates modular frontend architecture, client-side routing, a REST API, responsive UI, production builds and deployment-ready configuration.</p>
      <div className="tech-list">
        <span>React</span><span>React Router</span><span>Node.js</span><span>Express</span><span>MongoDB</span><span>Vite</span>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <footer>© 2026 ShopSphere · Full-Stack Deployment Capstone</footer>
    </>
  );
}
