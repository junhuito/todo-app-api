import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { User } from './user/entities/user.entity';

type DBConnect = (
  | Type<any>
  | DynamicModule
  | Promise<DynamicModule>
  | ForwardReference<any>
)[];

const useEnvironment = (extension: string): string => {
  if (extension === 'test') return 'dev';
  return extension;
};

export const CONFIG_MODULE_ROOT: ConfigModule = ConfigModule.forRoot({
  envFilePath: `${process.cwd()}/.env.${useEnvironment(process.env.NODE_ENV)}`,
  isGlobal: true,
});

export const TYPE_ORM_MODULE_ROOT: TypeOrmModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: config.get<string>('DB_HOST'),
    port: Number(config.get<number>('DB_PORT')),
    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_NAME'),
    entities: [User],
    synchronize: true,
  }),
  inject: [ConfigService],
});

export const createRootConnection = (): DBConnect => {
  return [CONFIG_MODULE_ROOT, TYPE_ORM_MODULE_ROOT] as DBConnect;
};

export const createDBConnection = (...modules: Type<any>[]): DBConnect => {
  const modulesFlat = modules.flat();
  return [...createRootConnection(), ...modulesFlat];
};

export const createTestingConnection = (
  ...entities: EntityClassOrSchema[]
): DBConnect => {
  const entitiesFlat = entities.flat();
  return [...createRootConnection(), TypeOrmModule.forFeature(entitiesFlat)];
};
