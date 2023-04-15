import { logger, Logger } from "../"

test("make logs", (done) => {
  logger.log("info log")
  logger.warn("warn log")
  logger.error("error log")
  logger.error(new Error("real error log"))
  logger.success("success log")

  done()
})

test("listen logs", (done) => {
  const logger = new Logger({
    onFailure: (err) => {
      done(err)
    },
  })

  logger.on("log", (level, text, pattern) => {
    expect(typeof text === "string").toBeTruthy()
    expect(typeof level === "string").toBeTruthy()
    expect(typeof pattern === "string").toBeTruthy()
    expect(["info", "warn", "error", "success"]).toContain(level.toLowerCase())
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
    section: "bonjour"
  })

  logger.on("log", (level, text, pattern) => {
    expect(typeof text === "string").toBeTruthy()
    expect(typeof level === "string").toBeTruthy()
    expect(typeof pattern === "string").toBeTruthy()
    expect(["info", "warn", "error", "success"]).toContain(level.toLowerCase())
    expect(pattern.includes("bonjour")).toBeTruthy()
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
    pattern: () => ""
  })

  logger.on("log", (level, text, pattern) => {
    expect(typeof text === "string").toBeTruthy()
    expect(typeof level === "string").toBeTruthy()
    expect(typeof pattern === "string").toBeTruthy()
    expect(["info", "warn", "error", "success"]).toContain(level.toLowerCase())
    expect(pattern).toBe("")
  })

  logger.log("info log")
  logger.warn("warn log")
  logger.error("error log")
  logger.error(new Error("real error log"))
  logger.success("success log")

  done()
})
