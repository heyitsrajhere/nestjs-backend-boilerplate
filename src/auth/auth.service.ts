import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/Database/Repository';
import { LoginDto, LoginResponseDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ResponseInterface } from 'src/interface';
import { User } from 'src/Database/Entity';
import { ErrorMessages, SuccessMessages } from 'src/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user in the system.
   * @param dto - The registration data transfer object containing name, email, and password.
   * @returns A response object containing the success status, message, and the created user.
   * @throws ConflictException if the email is already registered.
   * @throws InternalServerErrorException for unexpected errors during registration.
   */
  async register(dto: RegisterDto): Promise<ResponseInterface<User>> {
    try {
      const { email, name, password } = dto;
      const existingUser = await this.userRepository.findUserByEmail(email);
      if (existingUser) {
        throw new ConflictException(ErrorMessages.emailAlreadyExists);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.userRepository.createUser(name, email, hashedPassword);
      return {
        success: true,
        message: SuccessMessages.registerSuccessfully,
      };
    } catch (error) {
      console.error(ErrorMessages.errorWhileRegister, error);

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new InternalServerErrorException(ErrorMessages.internalServerError);
    }
  }

  /**
   * Authenticates a user and generates a JWT access token.
   * @param dto - The login data transfer object containing email and password.
   * @returns A response object containing the success status, message, and the JWT access token.
   * @throws UnauthorizedException if the credentials are invalid.
   * @throws InternalServerErrorException for unexpected errors during login.
   */
  async login(dto: LoginDto): Promise<ResponseInterface<LoginResponseDto>> {
    try {
      const { email, password } = dto;

      const user = await this.userRepository.findUserByEmail(email);
      if (!user) {
        throw new UnauthorizedException(ErrorMessages.invalidCredentials);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException(ErrorMessages.invalidCredentials);
      }

      const payload = { id: user.id, email: user.email, role: user.role };

      const accessToken = this.jwtService.sign(payload);
      return {
        success: true,
        message: SuccessMessages.loginSuccessfully,
        data: { accessToken },
      };
    } catch (error) {
      console.error(ErrorMessages.errorWhileLogin, error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException(ErrorMessages.internalServerError);
    }
  }
}
