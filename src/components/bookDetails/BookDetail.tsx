import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookDetail.css';

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

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBook(parseInt(id));
    }
  }, [id]);

  const fetchBook = async (bookId: number) => {
    try {
      setLoading(true);
      const response = await api.get(`/books/${bookId}`);
      const bookData: Book = response.data;
      setBook(bookData);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBookCover = (book: Book) => {
    return book.formats['image/jpeg'] || book.formats['image/png'] || '/placeholder-book.png';
  };

  const getDownloadFormats = (book: Book) => {
    const formats = [];
    if (book.formats['application/epub+zip']) {
      formats.push({ type: 'EPUB', url: book.formats['application/epub+zip'] });
    }
    if (book.formats['application/pdf']) {
      formats.push({ type: 'PDF', url: book.formats['application/pdf'] });
    }
    if (book.formats['text/plain; charset=utf-8']) {
      formats.push({ type: 'Plain Text', url: book.formats['text/plain; charset=utf-8'] });
    }
    if (book.formats['text/html']) {
      formats.push({ type: 'HTML', url: book.formats['text/html'] });
    }
    return formats;
  };

  if (loading) {
    return (
      <div className="book-detail-container">
        <div className="loading">Loading book details...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-detail-container">
        <div className="error">Book not found</div>
      </div>
    );
  }

  const downloadFormats = getDownloadFormats(book);

  return (
    <div className="book-detail-container">

      <div className="books-header">
        <button className="back-button" onClick={() => navigate(-1)}>
         <img src="/img/Back.svg"></img>
        </button>
        <h1 className="books-title">Back</h1>
      </div>

      <div className="book-detail-content">
        <div className="book-cover-section">
          <img
            src={getBookCover(book)}
            alt={book.title}
            className="book-cover-large"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-book.png';
            }}
          />
        </div>

        <div className="book-info-section">
          <h1 className="book-title-large">{book.title}</h1>
          
          {book.authors.length > 0 && (
            <div className="book-authors">
              {book.authors.map((author, index) => (
                <p key={index} className="author-name">
                  {author.name}
                  {author.birth_year && author.death_year && (
                    <span className="author-years">
                      ({author.birth_year} - {author.death_year})
                    </span>
                  )}
                </p>
              ))}
            </div>
          )}

          <div className="book-metadata">
            <div className="metadata-item" data-label="Downloads:" data-value={book.download_count.toLocaleString()}></div>
            
            {book.languages.length > 0 && (
              <div className="metadata-item" data-label="Languages:" data-value={book.languages.join(', ').toUpperCase()}></div>
            )}

            {book.media_type && (
              <div className="metadata-item" data-label="Media Type:" data-value={book.media_type}></div>
            )}
          </div>

          {downloadFormats.length > 0 && (
            <div className="download-section">
              <div className="download-buttons">
                {downloadFormats.map((format, index) => (
                  <a
                    key={index}
                    href={format.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-button"
                  >
                    {format.type}
                  </a>
                ))}
              </div>
            </div>
          )}

    
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
