"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserService = class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async addUser(requestBody) {
        try {
            const { type, cmd_chain } = requestBody;
            if (type !== 'my_login' || !cmd_chain || !Array.isArray(cmd_chain)) {
                return { status: 'error', statusCode: 400, dbState: [] };
            }
            const dbState = [];
            let existingUser = null;
            let existingUserByForeignKey = null;
            let isFriendPresent = false;
            for (const cmd of cmd_chain) {
                if (cmd.type === 'insert') {
                    const [Uid, Username, City, Friend] = cmd.cmd;
                    if (!existingUser)
                        existingUser = await this.userRepository.findOne({ where: { Uid } });
                    if (Friend) {
                        isFriendPresent = true;
                        if (existingUserByForeignKey)
                            existingUserByForeignKey = await this.userRepository.findOne({ where: { Friend } });
                    }
                }
            }
            for (const cmd of cmd_chain) {
                if (cmd.type === 'insert') {
                    const [Uid, Username, City, Friend] = cmd.cmd;
                    const currentExistingUser = await this.userRepository.findOne({ where: { Uid } });
                    if (existingUser) {
                        if (currentExistingUser) {
                            let currentFriend = currentExistingUser.Friend || null;
                            dbState.push(`(${currentExistingUser.Uid}, '${currentExistingUser.Username}', '${currentExistingUser.City}', ${currentFriend})`);
                        }
                    }
                    else {
                        if (isFriendPresent) {
                            console.log(existingUserByForeignKey);
                            if (!existingUserByForeignKey) {
                                const allUsers = await this.userRepository.find({ relations: ['Friend'] });
                                for (const user of allUsers) {
                                    console.log(user);
                                    const { Uid, Username, City, Friend } = user;
                                    let currentFriend = Friend?.Uid || null;
                                    dbState.push(`(${Uid}, '${Username}', '${City}', ${currentFriend || null})`);
                                }
                                return { status: 'error', statusCode: 400, dbState };
                            }
                        }
                        else {
                            const user = this.userRepository.create({ Uid, Username, City, Friend });
                            await this.userRepository.save(user);
                            dbState.push(`(${Uid}, '${Username}', '${City}', ${Friend})`);
                        }
                    }
                }
            }
            return existingUser
                ? { status: 'error', statusCode: 400, dbState }
                : { status: 'ok', statusCode: 200, dbState };
        }
        catch (error) {
            console.log(error);
            return { status: 'error', statusCode: 400, dbState: [] };
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.Users)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map