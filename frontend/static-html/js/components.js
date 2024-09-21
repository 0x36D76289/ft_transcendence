export function createButton(text, onClick, classNames = "", parentElement = document.body) {
  const button = document.createElement("button");

  button.innerText = text;
  button.className = classNames;
  button.onclick = onClick;

  parentElement.appendChild(button);

  return button;
}

export function createDiv(classNames = "", parentElement = document.body) {
  const div = document.createElement("div");

  div.className = classNames;

  parentElement.appendChild(div);

  return div;
}

export function createHeading(level, text, classNames = "", parentElement = document.body) {
  const heading = document.createElement(`h${level}`);

  heading.innerText = text;
  heading.className = classNames;

  parentElement.appendChild(heading);

  return heading;
}

export function createImage(src = "", alt = "", classNames = "", parentElement = document.body) {
  const image = document.createElement("img");

  image.src = src;
  image.alt = alt;
  image.className = classNames;

  parentElement.appendChild(image);

  return image;
}

export function createInput(placeholder = "", type = "text", classNames = "", parentElement = document.body) {
  const input = document.createElement("input");

  input.type = type;
  input.placeholder = placeholder;
  input.className = classNames;

  parentElement.appendChild(input);

  return input;
}

export function createLink(text = "", href = "#", classNames = "", parentElement = document.body) {
  const link = document.createElement("a");

  link.innerText = text;
  link.href = href;
  link.className = classNames;

  parentElement.appendChild(link);

  return link;
}

export function createList(items = [], ordered = false, classNames = "", parentElement = document.body) {
  const list = document.createElement(ordered ? "ol" : "ul");

  list.className = classNames;

  // Ajouter les items à la liste
  items.forEach(itemText => {
    const listItem = document.createElement("li");

    listItem.innerText = itemText;
    list.appendChild(listItem);
  });

  parentElement.appendChild(list);

  return list;
}

export function createParagraph(text = "", classNames = "", parentElement = document.body) {
  const paragraph = document.createElement("p");

  paragraph.innerText = text;
  paragraph.className = classNames;

  parentElement.appendChild(paragraph);

  return paragraph;
}

export function createSection(classNames = "", parentElement = document.body) {
  const section = document.createElement("section");

  section.className = classNames;

  parentElement.appendChild(section);

  return section;
}

export function createTitle(level = 1, text = "", classNames = "", parentElement = document.body) {
  const title = document.createElement(`h${level}`);

  title.innerText = text;
  title.className = classNames;

  parentElement.appendChild(title);

  return title;
}

export function createForm(onSubmit, classNames = "", parentElement = document.body) {
  const form = document.createElement("form");

  form.className = classNames;
  form.onsubmit = onSubmit;

  parentElement.appendChild(form);

  return form;
}

export function createSelect(options, className, parentElement = document.body) {
  const select = document.createElement("select");
  select.className = className;

  options.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.text;
    select.appendChild(opt);
  });

  parentElement.appendChild(select);

  return select;
}
