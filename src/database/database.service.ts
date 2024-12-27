import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

import { Injectable, OnModuleInit } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private ConfigService: ConfigService
  ) {}

  dir = join(process.cwd(), 'src', 'database', `${this.ConfigService.get('DB_NAME')}-migrations`)
  pre = ['init.sql', 'schemas\\tables.sql']
  sufix = ['data\\manual.sql']

  async onModuleInit() {
    const sqlFiles = this.getAllSqlFiles(this.dir)

    sqlFiles.unshift(...this.pre.map((file) => join(this.dir, file)))
    sqlFiles.push(...this.sufix.map((file) => join(this.dir, file)))

    for (const sqlFile of sqlFiles) {
      await this.executeSqlScript(sqlFile)
    }
  }

  private async executeSqlScript(sqlFile: string): Promise<void> {
    const sql = readFileSync(sqlFile, 'utf8')

    const commands = sql.split(/\bGO\b/)

    for (const command of commands) {
      const trimmedCommand = command.trim()

      if (trimmedCommand) {
        await this.dataSource.query(trimmedCommand)
      }
    }
  }

  private getAllSqlFiles(directory: string): string[] {
    const files: string[] = []
    const entries = readdirSync(directory)

    for (const entry of entries) {
      const fullPath = join(directory, entry)
      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...this.getAllSqlFiles(fullPath))
      } else if (stat.isFile() && entry.endsWith('.sql') && ![...this.pre, ...this.sufix].some((suffix) => fullPath.endsWith(suffix))) {
        files.push(fullPath)
      }
    }

    return files
  }
}
