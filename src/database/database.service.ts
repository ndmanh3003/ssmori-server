import { readdirSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

import { Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'

interface IParamWithTypes {
  [key: string]: string | number | boolean
  useQuote?: boolean
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private ConfigService: ConfigService
  ) {}

  dir = join(process.cwd(), 'src', 'database', `${this.ConfigService.get('DB_NAME')}-migrations`)
  pre = ['init.sql', 'schemas\\tables.sql']
  sufix = ['data\\manual.sql']
  ignore = Array.from({ length: 4 }, (_, i) => `data\\invoice\\sample\\${i + 1}.sql`)

  async onModuleInit() {
    if (+this.ConfigService.get('DB_MIGRATE') === 1) {
      const sqlFiles = this.getAllSqlFiles(this.dir)

      sqlFiles.unshift(...this.pre.map((file) => join(this.dir, file)))
      sqlFiles.push(...this.sufix.map((file) => join(this.dir, file)))

      for (const sqlFile of sqlFiles) {
        await this.executeSqlScript(sqlFile)
      }
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
      } else if (
        stat.isFile() &&
        entry.endsWith('.sql') &&
        ![...this.pre, ...this.sufix, ...this.ignore].some((suffix) => fullPath.endsWith(suffix))
      ) {
        files.push(fullPath)
      }
    }

    return files
  }

  public async exeProc(procName: string, params: IParamWithTypes[], output?: string) {
    const formattedParams = params
      .map((param) => {
        const { useQuote, ...rest } = param

        if (useQuote) {
          return Object.entries(rest)
            .filter(([_key, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `@${key} = N'${value}'`)
            .join(', ')
        } else {
          return Object.entries(rest)
            .filter(([_key, value]) => value !== null && value !== undefined)
            .map(([key, value]) => `@${key} = ${value}`)
            .join(', ')
        }
      })
      .filter((param) => param.trim() !== '')
      .join(', ')

    const formattedOutput = output ? `, @${output} = @${output} OUTPUT;\nSELECT @${output};` : ';'
    const declareOutput = output ? `DECLARE @${output} NVARCHAR(255);\n` : ''

    const query = `${declareOutput}EXEC ${procName} ${formattedParams}${formattedOutput}`

    try {
      if (output) {
        return Object.values((await this.dataSource.query(query))[0])[0]
      }

      await this.dataSource.query(query)

      return { message: 'OK' }
    } catch (err) {
      const errorMessage = err.originalError?.message || 'Unknown database error'

      throw new ServiceUnavailableException(errorMessage)
    }
  }

  public async exeFunc(tableNameWParam: string) {
    return this.dataSource.query(`SELECT * FROM ${tableNameWParam}`)
  }

  public async exeSelect(tableName: string, where?: string[]) {
    const formattedWhere = where
      ? where.filter((w) => w && w.trim() !== '' && !w.toLowerCase().includes('undefined') && !w.toLowerCase().includes('null')).join(' AND ')
      : '1 = 1'
    const query = `SELECT * FROM ${tableName} WHERE ${formattedWhere}`

    try {
      return await this.dataSource.query(query)
    } catch (err) {
      const errorMessage = err.originalError?.message || 'Unknown database error'

      throw new ServiceUnavailableException(errorMessage)
    }
  }
}
