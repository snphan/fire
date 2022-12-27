import { Authorized, Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateUserDto } from '@dtos/users.dto';
import AuthRepository from '@repositories/auth.repository';
import { User } from '@entities/users.entity';

@Resolver()
export class authResolver extends AuthRepository {
  @Mutation(() => User, {
    description: 'User signup',
  })
  async signup(@Arg('userData') userData: CreateUserDto): Promise<User> {
    const user: User = await this.userSignUp(userData);
    return user;
  }

  @Mutation(() => User, {
    description: 'User login',
  })
  async login(@Arg('userData') userData: CreateUserDto, @Ctx() ctx: any): Promise<User> {
    const { tokenData, findUser } = await this.userLogIn(userData);

    // On login set the cookie to some have some maxAge.
    ctx.res.cookie("Authorization", tokenData.token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60,
    });

    return findUser;
  }

  @Authorized()
  @Mutation(() => User, {
    description: 'User logout',
  })
  async logout(@Ctx('user') userData: any, @Ctx() ctx: any): Promise<User> {

    const token = ctx.res.req.headers.cookie.match(/(Authorization=)(.+)/)[2]

    // The cookie set on logout should have a maxAge of 0 (delete cookie).
    ctx.res.cookie("Authorization", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0,
    });

    const user = await this.userLogOut(userData["id"]);
    return user;
  }
}
