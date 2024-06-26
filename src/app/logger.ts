import chalk from "chalk"
import dayjs from "dayjs"

export enum LoggerLevels {
  WARN,
  ERROR,
  INFO,
  SUCCESS,
}

export type LoggerLevel = keyof typeof LoggerLevels
export type LoggerColors = Record<LoggerLevels, string> & {
  secondaryText: string
}
export type LoggerPattern = (
  text: string,
  config: {
    level: LoggerLevels
    colors: LoggerColors
  },
  secondaryText?: string
) => string
export type LoggerRender = (out: any) => any
export type LoggerRenders = Record<LoggerLevels, LoggerRender>

export function loggerLevelName(level: LoggerLevels): LoggerLevel {
  return Object.keys(LoggerLevels).find(
    (key) => LoggerLevels[key as LoggerLevel] === level
  ) as LoggerLevel
}

export const defaultLoggerPattern: LoggerPattern = (
  text,
  config,
  secondaryText
) => {
  return `${chalk.grey(dayjs().format("DD/MM/YY HH:mm"))} ${chalk.hex(
    config.colors[config.level]
  )(loggerLevelName(config.level))}${
    secondaryText
      ? " " + chalk.hex(config.colors.secondaryText)(`${secondaryText}`)
      : ""
  } ${text}`
}

export const defaultLoggerColors: LoggerColors = {
  [LoggerLevels.WARN]: "#ffa600",
  [LoggerLevels.ERROR]: "#ff0000",
  [LoggerLevels.INFO]: "#00ffff",
  [LoggerLevels.SUCCESS]: "#00ff00",
  secondaryText: "#ff3fa8",
}

export const defaultLoggerRenders: LoggerRenders = {
  [LoggerLevels.WARN]: console.warn,
  [LoggerLevels.ERROR]: console.error,
  [LoggerLevels.INFO]: console.log,
  [LoggerLevels.SUCCESS]: console.log,
}

export interface LoggerOptions {
  section?: string
  pattern?: LoggerPattern
  colors?: LoggerColors
  renders?: LoggerRenders
}

export class Logger {
  private readonly section?: string
  private readonly pattern: LoggerPattern
  private readonly colors: LoggerColors
  private readonly renders: LoggerRenders

  constructor(options?: LoggerOptions) {
    this.section = options?.section
    this.pattern = options?.pattern ?? defaultLoggerPattern
    this.colors = options?.colors ?? defaultLoggerColors
    this.renders = options?.renders ?? defaultLoggerRenders
  }

  public log(this: this, text: string) {
    this.renders[LoggerLevels.INFO](
      this.pattern(
        text,
        { level: LoggerLevels.INFO, colors: this.colors },
        this.section
      )
    )
  }

  public error(
    this: this,
    text: string | Error,
    _path?: string,
    full?: boolean
  ) {
    this.renders[LoggerLevels.ERROR](
      this.pattern(
        text instanceof Error ? text.message : text,
        { level: LoggerLevels.ERROR, colors: this.colors },
        _path ?? this.section
      )
    )

    if (full && text instanceof Error) this.renders[LoggerLevels.ERROR](text)
  }

  public warn(this: this, text: string) {
    this.renders[LoggerLevels.WARN](
      this.pattern(
        text,
        { level: LoggerLevels.WARN, colors: this.colors },
        this.section
      )
    )
  }

  public success(this: this, text: string) {
    this.renders[LoggerLevels.SUCCESS](
      this.pattern(
        text,
        { level: LoggerLevels.SUCCESS, colors: this.colors },
        this.section
      )
    )
  }
}
