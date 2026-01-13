import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, Category } from '../../types';
import './Home.css';

interface Book {
  id: number;
  title: string;
  authors: Array<{
    name: string;
    birth_year: number;
    death_year: number;
  }>;
  translators: Array<{
    name: string;
    birth_year: number;
    death_year: number;
  }>;
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  download_count: number;
  formats: {
    [key: string]: string;
  };
  media_type: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBooks();
  }, []);

  const fetchFeaturedBooks = async () => {
    try {
      const objectFromUrl = await fetch('http://skunkworks.ignitesol.com:8000/books/');
      const data = await objectFromUrl.json();
      setFeaturedBooks(data.results.slice(0, 6)); // Show first 6 books
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  const getBookCover = (book: Book) => {
    return book.formats['image/jpeg'] || book.formats['image/png'] || '/placeholder-book.png';
  };

  const getCategoryIcon = (categoryId: string) => {
    return `/img/${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}.svg`;
  };

  const handleCategoryClick = (category: Category) => {
    navigate(`/books?topic=${category.topic}`);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">Gutenberg Project</h1>
        <p className="home-description">
          A social cataloging website that allows you to freely search its database of books, annotations, and reviews.
        </p>
      </div>
      
    
      
      <div className="categories-list">
        {categories.map((category) => (
          <div
            key={category.id}
            className="category-item"
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category-content">
              <img 
                src={getCategoryIcon(category.id)} 
                alt={category.name}
                className="category-icon"
              />
              <span className="category-name">{category.name}</span>
            </div>
            <span className="category-arrow"><img src="/img/Next.svg"></img></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
