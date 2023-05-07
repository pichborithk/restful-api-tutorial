import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Book from '../models/Book';

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { author, title } = req.body;

  const book = new Book({
    _id: new mongoose.Types.ObjectId(),
    author,
    title,
  });

  return book
    .save()
    .then(book => res.status(201).json({ book }))
    .catch(error => res.status(500).json({ error }));
};

const readBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  return Book.findById(bookId)
    .populate('author')
    .select('-__v')
    .populate('author')
    .then(book =>
      book
        ? res.status(200).json({ book })
        : res.status(404).json({ message: 'not found' })
    )
    .catch(error => res.status(500).json({ error }));
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
  return Book.find()
    .populate('author')
    .select('-__v')
    .then(books => res.status(200).json({ books }))
    .catch(error => res.status(500).json({ error }));
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  return Book.findById(bookId)
    .select('-__v')
    .then(book => {
      if (book) {
        book.set(req.body);

        return book
          .save()
          .then(book => res.status(201).json({ book }))
          .catch(error => res.status(500).json({ error }));
      } else {
        return res.status(404).json({ message: 'not found' });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;

  return Book.findByIdAndDelete(bookId)
    .then(book =>
      book
        ? res.status(201).json({ book, message: 'Deleted' })
        : res.status(404).json({ message: 'not found' })
    )
    .catch(error => res.status(500).json({ error }));
};

export default { createBook, readBook, readAll, updateBook, deleteBook };
