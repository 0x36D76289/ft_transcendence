export function logMessage(message, level) {
  const timestamp = new Date().toISOString();
  let colorCode;

  switch (level.toUpperCase()) {
    case "INFO":
      colorCode = "\x1b[32m";
      break;
    case "WARNING":
      colorCode = "\x1b[33m";
      break;
    case "ERROR":
      colorCode = "\x1b[31m";
      break;
    default:
      colorCode = "\x1b[0m";
  }

  console.log(
    `[${timestamp}] ${colorCode}[${level.toUpperCase()}] ${message}\x1b[0m`
  );
}
