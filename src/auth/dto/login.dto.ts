import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages } from 'src/messages';

export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user',
  })
  @IsNotEmpty({ message: ErrorMessages.emailRequired })
  @IsEmail({}, { message: ErrorMessages.invalidEmailFormat })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  @IsNotEmpty({ message: ErrorMessages.passwordRequired })
  @MinLength(6, { message: ErrorMessages.passwordMinLength })
  password: string;
}
