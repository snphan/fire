import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import UserRepository from '@repositories/users.repository';
import { User } from '@entities/users.entity';

@Resolver()
export class PlaidResolver {


}