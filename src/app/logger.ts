import chalk from "chalk"
import dayjs from "dayjs"

import { BaseEventNames, EventEmitter } from "@ghom/event-emitter"

export enum LoggerLevels {
  WARN = "#ffa600",
  ERROR = "#ff0000",
  INFO = "#00ffff",
  SUCCESS = "#00ff00",
}

export type LoggerLevel = keyof typeof LoggerLevels

export function loggerLevelName(level: LoggerLevels): LoggerLevel {
  return Object.keys(LoggerLevels).find(
    (key) => LoggerLevels[key as LoggerLevel] === level
  ) as LoggerLevel
}

export const defaultLoggerPattern = (
  text: string,
  level: LoggerLevels,
  secondaryText?: string
) => {
  return `${chalk.grey(dayjs().format("DD/MM/YY HH:mm"))} ${chalk.hex(level)(
    loggerLevelName(level)
  )}${
    secondaryText ? " " + chalk.magentaBright(`${secondaryText}`) : ""
  } ${text}`
}

export interface LoggerOptions {
  section?: string
  pattern?: (
    text: string,
    level: LoggerLevels,
    secondaryText?: string
  ) => string
  onFailure?: (error: Error) => void
}

export interface LoggerEventNames extends BaseEventNames {
  log: [level: LoggerLevel, text: string, withPattern: string]
}

export class Logger extends EventEmitter<LoggerEventNames> {
  private readonly section?: string
  private readonly pattern: (
    text: string,
    level: LoggerLevels,
    secondaryText?: string
  ) => string
  private readonly onFailure: (error: Error) => void

  constructor(options?: LoggerOptions) {
    super()

    this.section = options?.section
    this.pattern = options?.pattern ?? defaultLoggerPattern
    this.onFailure = options?.onFailure ?? console.error
  }

  public log(this: this, text: string) {
    const pattern = this.pattern(text, LoggerLevels.INFO, this.section)

    try {
      this.emit("log", "INFO", text, pattern)
    } catch (error: any) {
      this.onFailure(error)
    }

    console.log(pattern)
  }

  public error(
    this: this,
    text: string | Error,
    _path?: string,
    full?: boolean
  ) {
    const pattern = this.pattern(
      text instanceof Error ? text.message.split("\n")[0] : text,
      LoggerLevels.ERROR,
      _path ?? this.section
    )

    try {
      this.emit(
        "log",
        "ERROR",
        text instanceof Error ? text.message : text,
        pattern
      )
    } catch (error: any) {
      this.onFailure(error)
    }

    console.error(pattern)
    if (full && text instanceof Error) console.error(text)
  }

  public warn(this: this, text: string) {
    const pattern = this.pattern(text, LoggerLevels.WARN, this.section)

    try {
      this.emit("log", "WARN", text, pattern)
    } catch (error: any) {
      this.onFailure(error)
    }

    console.warn(pattern)
  }

  public success(this: this, text: string) {
    const pattern = this.pattern(text, LoggerLevels.SUCCESS, this.section)

    try {
      this.emit("log", "SUCCESS", text, pattern)
    } catch (error: any) {
      this.onFailure(error)
    }

    console.log(pattern)
  }
}
