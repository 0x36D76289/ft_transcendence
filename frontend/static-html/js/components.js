export function createButton(text, onClick, classNames = "") {
  const button = document.createElement("button");

  button.innerText = text;
  button.className = classNames;
  button.onclick = onClick;

  return button;
}

export function createDiv(classNames = "") {
  const div = document.createElement("div");

  div.className = classNames;

  return div;
}

export function createHeading(level, text, classNames = "") {
  const heading = document.createElement(`h${level}`);

  heading.innerText = text;
  heading.className = classNames;

  return heading;
}

export function createImage(src = "", alt = "", classNames = "") {
  const image = document.createElement("img");

  image.src = src;
  image.alt = alt;
  image.className = classNames;

  return image;
}

export function createInput(placeholder = "", type = "text", classNames = "") {
  const input = document.createElement("input");

  input.type = type;
  input.placeholder = placeholder;
  input.className = classNames;

  return input;
}

export function createLink(text = "", href = "#", classNames = "") {
  const link = document.createElement("a");

  link.innerText = text;
  link.href = href;
  link.className = classNames;

  return link;
}

export function createList(items = [], ordered = false, classNames = "") {
  const list = document.createElement(ordered ? "ol" : "ul");

  list.className = classNames;

  // Ajouter les items à la liste
  items.forEach(itemText => {
    const listItem = document.createElement("li");

    listItem.innerText = itemText;
    list.appendChild(listItem);
  });

  return list;
}

export function createParagraph(text = "", classNames = "") {
  const paragraph = document.createElement("p");

  paragraph.innerText = text;
  paragraph.className = classNames;

  return paragraph;
}

export function createSection(classNames = "") {
  const section = document.createElement("section");

  section.className = classNames;

  return section;
}

export function createTitle(level = 1, text = "", classNames = "") {
  const title = document.createElement(`h${level}`);

  title.innerText = text;
  title.className = classNames;

  return title;
}

export function createForm(onSubmit, classNames = "") {
  const form = document.createElement("form");

  form.className = classNames;
  form.onsubmit = onSubmit;

  return form;
}
