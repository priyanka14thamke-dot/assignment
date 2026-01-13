import React, { Component } from 'react';

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

interface BooksState {
  books: Book[];
}

class BooksDisplay extends Component<{}, BooksState> {
  state = {
    books: []
  };

  async componentDidMount() {
    try {
      const objectFromUrl = await fetch('http://skunkworks.ignitesol.com:8000/books/');
      const data = await objectFromUrl.json();
      this.setState({
        books: data.results
      });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  }

  render() {
    const { books } = this.state;

    return (
      <div style={{ padding: '20px' }}>
        <h1>Books</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {books.map(({ id, title, formats }) => (
            <div key={id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' }}>
              {/* Cover Image */}
              {formats['image/jpeg'] && (
                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                  <img 
                    src={formats['image/jpeg']} 
                    alt={`Cover of ${title || `Book ${id}`}`}
                    style={{ 
                      maxWidth: '100%', 
                      height: '200px', 
                      objectFit: 'cover',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                </div>
              )}
              
              {/* Book Info */}
              <h3 style={{ margin: '10px 0', color: '#333' }}>
                📚 {title || `Book ${id}`}
              </h3>
              <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
                ID: {id}
              </p>
              
              {/* Download Links */}
              <div style={{ marginTop: '10px' }}>
                {formats['application/pdf'] && (
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ marginRight: '5px' }}>📄</span>
                    <a 
                      href={formats['application/pdf']} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                      Download PDF
                    </a>
                  </div>
                )}
                
                {formats['application/epub+zip'] && (
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ marginRight: '5px' }}>📖</span>
                    <a 
                      href={formats['application/epub+zip']} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                      Download EPUB
                    </a>
                  </div>
                )}
                
                {formats['text/html'] && (
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ marginRight: '5px' }}>🌐</span>
                    <a 
                      href={formats['text/html']} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                      Read Online
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default BooksDisplay;
