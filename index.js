function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);
  if (callbacks) {
    Object.keys(callbacks).forEach((name) => {
      element.addEventListener(name, callbacks[name]);
    });
  }

  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      if (key === "checked") {
        element.checked = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
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
        {title: "Сделать домашку", completed: false },
        {title: "Сделать практику", completed: false },
        {title: "Пойти домой", completed: false },
      ],
      input: "",
    };
    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
    this.onCompleteTask = this.onCompleteTask.bind(this);
    this.onDeleteTask = this.onDeleteTask.bind(this);
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
        }, null,
            { input: this.onAddInputChange },
            ),
        createElement("button", { id: "add-btn" }, "+", { click: this.onAddTask}),
      ]),
      createElement(
          "ul",
          { id: "todos" },
          this.state.todos.map((todo, index) =>
            createElement("li", {}, [
              createElement("input", { type: "checkbox" , checked: todo.completed}, null, {change: (e) => this.onCompleteTask(index, e)}),
              createElement("label", {style: todo.completed ? "color: gray;" : "",}, todo.title),
              createElement(
                  "button",
                  {},
                  "🗑️",
                  {
                    click: () => this.onDeleteTask(index),
                  }
              ),
            ])
          )
      ),
    ])
  }


  onAddTask() {
    this.state.todos = [...this.state.todos, {title: this.state.input, completed: false}];
    this.update()
  }

  onAddInputChange(e) {
    this.state.input = e.target.value;
  }

  onCompleteTask(index, e) {
    this.state.todos[index].completed = e.target.checked;
    this.update();
  }

  onDeleteTask(index) {
    this.state.todos = this.state.todos.filter((_, i) => i !== index);
    this.update();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
