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

export const defaultLoggerPattern = (
  text: string,
  level: LoggerLevels,
  secondaryText?: string
) => {
  return `${chalk.grey(dayjs().format("DD/MM/YY HH:mm"))} ${chalk.hex(level)(
    level.toUpperCase()
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
  log: [text: string, level?: LoggerLevel]
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

  public log(text: string) {
    this.emit("log", text, "INFO").catch(this.onFailure)

    console.log(this.pattern(text, LoggerLevels.INFO, this.section))
  }

  public error(text: string | Error, _path?: string, full?: boolean) {
    this.emit(
      "log",
      text instanceof Error ? text.message : text,
      "ERROR"
    ).catch(this.onFailure)

    console.error(
      this.pattern(
        text instanceof Error ? text.message.split("\n")[0] : text,
        LoggerLevels.ERROR,
        _path ?? this.section
      )
    )
    if (full && text instanceof Error) console.error(text)
  }

  public warn(text: string) {
    this.emit("log", text, "WARN").catch(this.onFailure)

    console.warn(this.pattern(text, LoggerLevels.WARN, this.section))
  }

  public success(text: string) {
    this.emit("log", text, "SUCCESS").catch(this.onFailure)

    console.log(this.pattern(text, LoggerLevels.SUCCESS, this.section))
  }
}
