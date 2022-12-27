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
  password: string;
}
