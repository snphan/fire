import { Authorized, Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { CreateUserDto, UserLoginDto } from '@dtos/users.dto';
import AuthRepository from '@repositories/auth.repository';
import { User } from '@entities/users.entity';
import { NODE_ENV, SECRET_KEY } from '@/config';
import CryptoJS from 'crypto-js';

@Resolver()
export class authResolver extends AuthRepository {
  @Mutation(() => User, {
    description: 'User signup',
  })
  async signup(@Arg('userData') userData: CreateUserDto): Promise<User> {
    const user: User = await this.userSignUp({
      ...userData,
      password: CryptoJS.AES.decrypt(userData.password, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    });
    return user;
  }

  @Mutation(() => User, {
    description: 'User login',
  })
  async login(@Arg('userData') userData: UserLoginDto, @Ctx() ctx: any): Promise<User> {

    console.log(userData);
    const { tokenData, findUser } = await this.userLogIn({
      ...userData,
      password: CryptoJS.AES.decrypt(userData.password, SECRET_KEY).toString(CryptoJS.enc.Utf8)
    });

    /* On login set the cookie */
    ctx.res.cookie("Authorization", tokenData.token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 30 * 1000,
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
