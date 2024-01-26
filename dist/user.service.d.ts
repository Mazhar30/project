import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { RequestBody, ResponseBody } from './user.interfaces';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<Users>);
    addUser(requestBody: RequestBody): Promise<ResponseBody>;
}
