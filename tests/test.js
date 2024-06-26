"use strict"

import { logger, Logger, LoggerLevels } from "../"

test("make logs", (done) => {
  const logger = new Logger({
    renders: {
      [LoggerLevels.ERROR]: () => {},
      [LoggerLevels.INFO]: () => {},
      [LoggerLevels.SUCCESS]: () => {},
      [LoggerLevels.WARN]: () => {}
    }
  })

  logger.log("info log")
  logger.warn("warn log")
  logger.error("error log")
  logger.error(new Error("real error log"))
  logger.success("success log")

  done()
})

test("listen logs", (done) => {
  const logger = new Logger({
    renders: {
      [LoggerLevels.ERROR]: (output) => {
        expect(output).toContain("error log")
      },
      [LoggerLevels.INFO]: (output) => {
        expect(output).toContain("info log")
      },
      [LoggerLevels.SUCCESS]: (output) => {
        expect(output).toContain("success log")
      },
      [LoggerLevels.WARN]: (output) => {
        expect(output).toContain("warn log")
      }
    }
  })

  logger.log("info log")
  logger.warn("warn log")
  logger.error("error log")
  logger.error(new Error("real error log"))
  logger.success("success log")

  done()
})

test("section logs", (done) => {
  const logger = new Logger({
    section: "bonjour",
    renders: {
      [LoggerLevels.ERROR]: (output) => {
        expect(output).toContain("bonjour")
      },
      [LoggerLevels.INFO]: (output) => {
        expect(output).toContain("bonjour")
      },
      [LoggerLevels.SUCCESS]: (output) => {
        expect(output).toContain("bonjour")
      },
      [LoggerLevels.WARN]: (output) => {
        expect(output).toContain("bonjour")
      }
    }
  })

  logger.log("info log")
  logger.warn("warn log")
  logger.error("error log")
  logger.error(new Error("real error log"))
  logger.success("success log")

  done()
})

test("custom logs", (done) => {
  const logger = new Logger({
    pattern: () => "",
    renders: {
      [LoggerLevels.ERROR]: (output) => {
        expect(output).toBe("")
      },
      [LoggerLevels.INFO]: (output) => {
        expect(output).toBe("")
      },
      [LoggerLevels.SUCCESS]: (output) => {
        expect(output).toBe("")
      },
      [LoggerLevels.WARN]: (output) => {
        expect(output).toBe("")
      }
    }
  })

  logger.log("info log")
  logger.warn("warn log")
  logger.error("error log")
  logger.error(new Error("real error log"))
  logger.success("success log")

  done()
})
