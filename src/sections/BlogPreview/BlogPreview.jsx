import { Link } from 'react-router-dom';
import './BlogPreview.css';
import { blogPosts } from '../../data/index.js';

export default function BlogPreview() {
  // Show latest 3 posts
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="blog-prev section section--white">
      <div className="container">
        <div className="blog-prev__header">
          <div>
            <p className="section-label">From the Blog</p>
            <h2 className="display-md blog-prev__title">
              Insights & strategies<br />for digital growth
            </h2>
          </div>
          <Link to="/blog" className="btn btn-outline-dark blog-prev__all">
            All Articles
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="blog-prev__grid">
          {posts.map((post, i) => (
            <BlogCard key={post.id} post={post} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogCard({ post, featured }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`blog-card ${featured ? 'blog-card--featured' : ''}`}
    >
      {/* Image placeholder */}
      <div className="blog-card__img">
        {post.image
          ? <img src={post.image} alt={post.title} />
          : <div className="blog-card__img-placeholder">
              <span className="blog-card__img-icon">📝</span>
            </div>
        }
        <span className="tag tag-gold blog-card__cat">{post.category}</span>
      </div>

      {/* Body */}
      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span className="blog-card__author">{post.author}</span>
          <span className="blog-card__sep">·</span>
          <span className="blog-card__date">
            {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          <span className="blog-card__sep">·</span>
          <span className="blog-card__read">{post.readTime}</span>
        </div>

        <h3 className="blog-card__title">{post.title}</h3>
        <p className="blog-card__excerpt">{post.excerpt}</p>

        <div className="blog-card__tags">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag tag-navy">{tag}</span>
          ))}
        </div>

        <span className="blog-card__cta btn-ghost">
          Read article
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
