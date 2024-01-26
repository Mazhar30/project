
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestBody, ResponseBody } from './user.interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('addMultiple')
  addUser(@Body() requestBody: RequestBody): Promise<ResponseBody> {
    return this.userService.addUser(requestBody);
  }
}
