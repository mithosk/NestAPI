import { UserEntity } from '../entities/user.entity'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{
    public async findByUuid(uuid: string): Promise<UserEntity> {
        return await this.createQueryBuilder('use')
            .where('use.uuid=:uuid', { uuid: uuid })
            .getOne()
    }

    public async findByEmail(email: string): Promise<UserEntity> {
        return await this.createQueryBuilder('use')
            .where('use.email=:email', { email: email })
            .getOne()
    }
}