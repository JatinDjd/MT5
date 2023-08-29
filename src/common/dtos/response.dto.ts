// src/common/dtos/response.dto.ts

export class ResponseDto<T> {
    status: number; 
    message: string;
    data: T;
  }
  