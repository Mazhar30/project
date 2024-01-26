import { UserService } from './user.service';
import { RequestBody, ResponseBody } from './user.interfaces';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    addUser(requestBody: RequestBody): Promise<ResponseBody>;
}
