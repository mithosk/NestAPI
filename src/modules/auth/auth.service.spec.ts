import { sha512 } from 'sha512-crypt-ts'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoginResponse } from './auth.interface'
import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getConnection, getRepository } from 'typeorm'
import { UserEntity } from '../../data/entities/user.entity'
import { UserRepository } from '../../data/repositories/user.repository'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [
        TypeOrmModule.forFeature([
          UserRepository
        ]),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'sqlite/c7670b0f-cf3b-48f9-9ef3-b9df5e631914',
          entities: [
            UserEntity
          ],
          synchronize: true,
          dropSchema: true
        })
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  afterEach(async () => {
    await getConnection().close()
  })

  describe('validateCredentials', () => {

    it('throws an exception for bad email', async () => {
      await getRepository(UserEntity).insert({
        uuid: '593fef95-d3d1-474f-9a84-c99ed2c14be3',
        email: 'email@email.com',
        passwordHash: sha512.hex('password'),
        name: 'name',
        surname: 'surname',
        registrationDate: new Date()
      })

      const validateCredentialsPromise = async (): Promise<LoginResponse> => await service.validateCredentials({
        email: 'email2@email.com',
        password: 'password'
      })

      await expect(validateCredentialsPromise()).rejects.toThrow(ForbiddenException)
    })

    it('throws an exception for bad password', async () => {
      await getRepository(UserEntity).insert({
        uuid: '7988a15f-ef46-4a48-bab9-296d5a6becf4',
        email: 'email@email.com',
        passwordHash: 'hash',
        name: 'name',
        surname: 'surname',
        registrationDate: new Date()
      })

      const validateCredentialsPromise = async (): Promise<LoginResponse> => await service.validateCredentials({
        email: 'email@email.com',
        password: 'password'
      })

      await expect(validateCredentialsPromise()).rejects.toThrow(ForbiddenException)
    })

    it('checks valid credentials', async () => {
      let uuid = '569f0bf6-d061-4123-a10a-2e70ccac4177'

      await getRepository(UserEntity).insert({
        uuid: uuid,
        email: 'email@email.com',
        passwordHash: sha512.hex('password'),
        name: 'name',
        surname: 'surname',
        registrationDate: new Date()
      })

      let validationResult = await service.validateCredentials({
        email: 'email@email.com',
        password: 'password'
      })

      expect(validationResult.token).toBeUndefined()
      expect(validationResult.refreshToken).toBeDefined()
      expect(validationResult.refreshToken.length).toBeGreaterThan(0)
      expect(validationResult.userId).toEqual(uuid)

      let user = await getRepository(UserEntity)
        .createQueryBuilder('use')
        .where('use.uuid=:uuid', { uuid: uuid })
        .getOne()

      expect(user.accessKey).toEqual(validationResult.refreshToken)
    })

  })

  describe('validateAccessKey', () => {

    it('returns false for bad access key', async () => {
      let uuid = 'b6b3b90c-768d-498e-9ed4-e1fd9208ee97'

      await getRepository(UserEntity).insert({
        uuid: uuid,
        email: 'email@email.com',
        passwordHash: 'hash',
        accessKey: 'key',
        name: 'name',
        surname: 'surname',
        registrationDate: new Date()
      })

      let valid = await service.validateAccessKey('key2', uuid)

      expect(valid).toEqual(false)
    })

    it('returns false for bad user id', async () => {
      await getRepository(UserEntity).insert({
        uuid: '51f9c0da-dc98-48dd-80b6-7f5d4ec4fd34',
        email: 'email@email.com',
        passwordHash: 'hash',
        accessKey: 'key',
        name: 'name',
        surname: 'surname',
        registrationDate: new Date()
      })

      let valid = await service.validateAccessKey('key', '37673559-7d57-4eb5-a05a-c4cfea682021')

      expect(valid).toEqual(false)
    })

    it('returns true with a valid access key', async () => {
      let uuid = '3128a6b9-5f02-4141-813c-11827846bdf0'

      await getRepository(UserEntity).insert({
        uuid: uuid,
        email: 'email@email.com',
        passwordHash: 'hash',
        accessKey: 'key',
        name: 'name',
        surname: 'surname',
        registrationDate: new Date()
      })

      let valid = await service.validateAccessKey('key', uuid)

      expect(valid).toEqual(true)
    })

  })

  describe('resetAccessKey', () => {

    it('cleans the access key', async () => {
      let uuid = 'de98759c-ebfc-4609-b3a1-c8af68b93754'

      await getRepository(UserEntity).insert({
        uuid: uuid,
        email: 'email@email.com',
        passwordHash: 'hash',
        accessKey: 'key',
        name: 'name',
        surname: 'surname',
        registrationDate: new Date()
      })

      await service.resetAccessKey(uuid)

      let user = await getRepository(UserEntity)
        .createQueryBuilder('use')
        .where('use.uuid=:uuid', { uuid: uuid })
        .getOne()

      expect(user.accessKey).toBeNull()
    })

  })
})