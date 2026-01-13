import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { categories } from '../../types';
import './BooksList.css';

// Use relative URL in development (will use proxy), full URL in production
const API_BASE_URL = "http://skunkworks.ignitesol.com:8000/";

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

interface BooksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url, config.params);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const BooksList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const topic = searchParams.get('topic') || '';
  const search = searchParams.get('search') || '';

  // Debounce search query (wait 300ms after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearchQuery.trim()) params.set('search', debouncedSearchQuery.trim());
    if (topic) params.set('topic', topic);
    
    const newUrl = `/books?${params.toString()}`;
    if (newUrl !== window.location.pathname + window.location.search) {
      navigate(newUrl, { replace: true });
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery, topic, navigate]);

  useEffect(() => {
    setSearchQuery(search);
  }, [search]);

  useEffect(() => {
    fetchBooks();
  }, [topic, search, currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage,
      };
      
      if (topic) params.topic = topic;
      if (search) params.search = search;
      
      const response = await api.get('/books', { params });
      const data: BooksResponse = response.data;
      setBooks(data.results);
      setTotalCount(data.count);
      setHasNext(!!data.next);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is now handled by the debounced effect
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleBookClick = (bookId: number) => {
    navigate(`/book/${bookId}`);
  };

  const getCategoryTitle = () => {
    if (topic) {
      return topic.charAt(0).toUpperCase() + topic.slice(1);
    }
    if (search) {
      return 'Search Results';
    }
    return 'All Books';
  };

  const getCategoryIcon = () => {
    const category = categories.find(cat => cat.topic === topic);
    return category ? `/img/${category.id.charAt(0).toUpperCase() + category.id.slice(1)}.svg` : undefined;
  };

  const getBookCover = (book: Book) => {
    return book.formats['image/jpeg'] || book.formats['image/png'] || '/placeholder-book.png';
  };

  if (loading && books.length === 0) {
    return (
      <div className="books-list-container">
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="books-list-container">
      <div className="books-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <img src="/img/Back.svg"></img>
        </button>
    
        <h1 className="books-title">{getCategoryTitle()}</h1>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-container">
          <img src="/img/Search.svg" alt="Search" className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search books and authors..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-button"
              onClick={() => {
                setSearchQuery('');
                const params = new URLSearchParams();
                if (topic) params.set('topic', topic);
                navigate(`/books?${params.toString()}`);
              }}
            >
              ×
            </button>
          )}
        </div>
      </form>

      <div className="books-grid">
        {books.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => handleBookClick(book.id)}
          >
            <div className="book-cover-container">
              <img
                src={getBookCover(book)}
                alt={book.title}
                className="book-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-book.png';
                }}
              />
            </div>
            <div className="book-info">
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">
                {book.authors.length > 0
                  ? book.authors.map(author => author.name).join(', ')
                  : 'Unknown Author'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && !loading && (
        <div className="no-books">No books found</div>
      )}

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage} • {totalCount} books total
        </span>
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!hasNext}
        >
          Next
        </button>
      </div>

      {loading && books.length > 0 && (
        <div className="loading-overlay">Loading...</div>
      )}
    </div>
  );
};

export default BooksList;
