export function createButton(className, textContent, onClick) {
  const button = document.createElement("button");
  button.className = className;
  button.textContent = textContent;
  button.onclick = onClick;
  return button;
}
