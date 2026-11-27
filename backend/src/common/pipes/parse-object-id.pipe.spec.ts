import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from './parse-object-id.pipe';

describe('ParseObjectIdPipe', () => {
  let pipe: ParseObjectIdPipe;

  beforeEach(() => {
    pipe = new ParseObjectIdPipe();
  });

  it('deve retornar o ID quando for um ObjectId válido do MongoDB', () => {
    const validId = new Types.ObjectId().toString();
    expect(pipe.transform(validId)).toBe(validId);
  });

  it('deve lançar BadRequestException quando o ID for inválido', () => {
    expect(() => pipe.transform('123-nao-e-objectid')).toThrow(BadRequestException);
  });
});
