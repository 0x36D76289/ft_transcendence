export function logMessage(message, level) {
  const timestamp = new Date().toISOString();
  let colorStyle;

  switch (level.toUpperCase()) {
    case "INFO":
      colorStyle = "color: green";
      break;
    case "WARNING":
      colorStyle = "color: orange";
      break;
    case "ERROR":
      colorStyle = "color: red";
      break;
    default:
      colorStyle = "color: black";
  }

  console.log(
    `%c[${timestamp}] [${level.toUpperCase()}] ${message}`,
    colorStyle
  );
}
