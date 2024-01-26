import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { RequestBody, ResponseBody } from './user.interfaces';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async addUser(requestBody: RequestBody): Promise<ResponseBody> {
    try {
      const { type, cmd_chain } = requestBody;
      if (type !== 'my_login' || !cmd_chain || !Array.isArray(cmd_chain)) {
        return { status: 'error', statusCode: 400, dbState: []};
      }

      const dbState: string[] = [];
      let existingUser: Users | null = null;
      let existingUserByForeignKey: Users | null = null;
      let isFriendPresent : boolean = false;

      for (const cmd of cmd_chain) {
        if (cmd.type === 'insert') {
          const [Uid, Username, City, Friend] = cmd.cmd;

          if(!existingUser) existingUser = await this.userRepository.findOne({ where: { Uid } });
          if(Friend) {
            isFriendPresent = true;
            if(existingUserByForeignKey)
            existingUserByForeignKey = await this.userRepository.findOne({ where: { Friend } });
          }
        }
      }

      for (const cmd of cmd_chain) {
        if (cmd.type === 'insert') {
          const [Uid, Username, City, Friend] = cmd.cmd;

          const currentExistingUser = await this.userRepository.findOne({ where: { Uid } });
          if (existingUser) {
            if(currentExistingUser) {
                let currentFriend = currentExistingUser.Friend || null;
                dbState.push(`(${currentExistingUser.Uid}, '${currentExistingUser.Username}', '${currentExistingUser.City}', ${currentFriend})`);
            }
          }else{
            if(isFriendPresent) {
                console.log(existingUserByForeignKey);
                if(!existingUserByForeignKey) {
                    const allUsers = await this.userRepository.find({ relations: ['Friend'] });
                    
                    for (const user of allUsers) {
                        console.log(user);
                        const { Uid, Username, City, Friend } = user;
                        let currentFriend = Friend?.Uid || null;
                        dbState.push(`(${Uid}, '${Username}', '${City}', ${currentFriend || null})`);
                    }
                    return { status: 'error', statusCode: 400, dbState };
                }
            }else {
                const user = this.userRepository.create({ Uid, Username, City, Friend });
                await this.userRepository.save(user);
                dbState.push(`(${Uid}, '${Username}', '${City}', ${Friend})`);
            }
          }
        }
      }
      return existingUser
        ? { status: 'error', statusCode: 400, dbState }
        : { status: 'ok', statusCode: 200, dbState};

    } catch (error) {
      // Handle errors and revert changes if necessary
      console.log(error);
      return { status: 'error', statusCode: 400, dbState: []};
    }
  }
}
