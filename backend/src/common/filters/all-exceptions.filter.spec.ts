import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';
import { AllExceptionsFilter } from './all-exceptions.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockStatus: jest.Mock;
  let mockJson: jest.Mock;
  let mockHost: ArgumentsHost;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });

    mockHost = {
      switchToHttp: () => ({
        getResponse: () => ({ status: mockStatus }),
        getRequest: () => ({
          originalUrl: '/api/v1/livros',
          url: '/api/v1/livros',
          method: 'POST',
          headers: { 'x-request-id': 'req-123' },
        }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('deve tratar HttpException com status code correto', () => {
    const exception = new HttpException(
      { message: 'Livro não encontrado', error: 'Not Found' },
      HttpStatus.NOT_FOUND,
    );

    filter.catch(exception, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        error: 'Not Found',
        message: 'Livro não encontrado',
        path: '/api/v1/livros',
        method: 'POST',
        requestId: 'req-123',
      }),
    );
  });

  it('deve tratar Mongoose CastError retornando 400 Bad Request', () => {
    const castError = new MongooseError.CastError('ObjectId', 'id-invalido', '_id');

    filter.catch(castError, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        error: 'Bad Request',
      }),
    );
  });

  it('deve tratar Mongoose ValidationError retornando 422 Unprocessable Entity', () => {
    const validationError = new MongooseError.ValidationError();
    validationError.addError(
      'titulo',
      new MongooseError.ValidatorError({ message: 'Título obrigatório', path: 'titulo' }),
    );

    filter.catch(validationError, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: ['Título obrigatório'],
      }),
    );
  });

  it('deve tratar erro de chave duplicada do MongoDB (código 11000) retornando 409 Conflict', () => {
    const duplicateError = {
      code: 11000,
      keyValue: { email: 'ana@universoliterario.com' },
    };

    filter.catch(duplicateError, mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 409,
        error: 'Conflict',
        message: expect.stringContaining('email'),
      }),
    );
  });

  it('deve tratar erro genérico retornando 500 Internal Server Error', () => {
    filter.catch(new Error('Falha inesperada'), mockHost);

    expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 500,
        error: 'Internal Server Error',
      }),
    );
  });
});
