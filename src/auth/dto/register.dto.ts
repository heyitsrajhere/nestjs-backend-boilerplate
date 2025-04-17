import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages } from 'src/messages';

export class RegisterDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsNotEmpty({ message: ErrorMessages.nameRequired })
  @MinLength(3, { message: ErrorMessages.nameMinLength })
  name: string;

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
