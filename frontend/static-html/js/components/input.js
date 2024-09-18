export function createInput(id, type, placeholder, className) {
  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  input.placeholder = placeholder;
  input.className = className;
  return input;
}
