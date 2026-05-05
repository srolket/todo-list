function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);
  if (callbacks) {
    Object.keys(callbacks).forEach((name) => {
      element.addEventListener(name, callbacks[name]);
    });
  }

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      element.setAttribute(key, attributes[key]);
    });
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  return element;
}

class Component {
  constructor() {
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newNode = this.render();
    this._domNode.replaceWith(newNode);
    this._domNode = newNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todos: [
        "Сделать домашку",
        "Сделать практику",
        "Пойти домой",
      ],
      input: "",
    };
    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      new AddTask(this.onAddTask, this.onAddInputChange).render(),
      createElement(
          "ul",
          { id: "todos" },
          this.state.todos.map((todo) =>
            createElement("li", {}, [
              createElement("input", { type: "checkbox" }),
              createElement("label", {}, todo),
              createElement("button", {}, "🗑️")
            ])
          )
      ),
    ])
  }


  onAddTask() {
    this.state.todos = [...this.state.todos, this.state.input];
    this.update()
  }

  onAddInputChange(e) {
    this.state.input = e.target.value;
  }
}

class AddTask extends Component {
  constructor(onAddTask, onAddInputChange) {
    super();
    this.onAddTask = onAddTask;
    this.onAddInputChange = onAddInputChange;
  }
  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement("input", {
            id: "new-todo",
            type: "text",
            placeholder: "Задание",
          }, null,
          { input: this.onAddInputChange },
      ),
      createElement("button", { id: "add-btn" }, "+", { click: this.onAddTask}),
    ]);
  }
}

class Task extends Component {
  constructor(onDeleteTask, onCompleteTask) {
    super();
    this.onDeleteTask = onDeleteTask;
    this.onCompleteTask = onCompleteTask;
  }

  render() {
    return
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
