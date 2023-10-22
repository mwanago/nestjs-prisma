import { Transform } from 'class-transformer';

class RegistrationRequestLoggingDto {
  email: string;
  name: string;

  @Transform(({ obj }) => {
    return `[${typeof obj.password}]`;
  })
  password: string;
}

export default RegistrationRequestLoggingDto;
