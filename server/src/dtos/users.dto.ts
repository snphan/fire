import { IsEmail, IsString } from 'class-validator';
import { InputType, Field } from 'type-graphql';
import { User } from '@entities/users.entity';

@InputType()
export class CreateUserDto implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  last_name: string;

  @Field()
  @IsString()
  first_name: string;

  @Field()
  @IsString()
  password: string;
}

@InputType()
export class UserLoginDto implements Partial<User> {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}