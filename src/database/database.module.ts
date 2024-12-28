import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as mssql from 'mssql'

import { DatabaseService } from './database.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connection = await mssql.connect({
          server: configService.get('DB_HOST'),
          user: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: 'master',
          options: {
            encrypt: true,
            trustServerCertificate: true
          }
        })

        await connection.query(
          `IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'${configService.get('DB_NAME')}') 
            CREATE DATABASE ${configService.get('DB_NAME')} 
          `
        )
        await connection.close()

        return {
          type: 'mssql',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          options: {
            encrypt: true,
            trustServerCertificate: true
          }
        }
      }
    })
  ],
  providers: [DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
