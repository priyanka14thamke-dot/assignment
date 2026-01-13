import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/Home';
import BooksList from './components/BooksDisplay/BooksList';
import BookDetail from './components/bookDetails/BookDetail';
import BooksDisplay from './components/BooksDisplay/BooksDisplay';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/display" element={<BooksDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
