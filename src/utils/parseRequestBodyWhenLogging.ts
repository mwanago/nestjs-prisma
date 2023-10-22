import { SetMetadata } from '@nestjs/common';
import { Class } from 'type-fest';

export const PARSE_REQUEST_BODY_WHEN_LOGGING_KEY = 'request_body_logging';
export const ParseRequestBodyWhenLogging = (dtoClass: Class<unknown>) => {
  return SetMetadata(PARSE_REQUEST_BODY_WHEN_LOGGING_KEY, dtoClass);
};
