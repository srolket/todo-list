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
        if (!this._domNode) {
            this._domNode = this.render();
        }
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
        {title: "Сделать домашку", completed: false},
        {title: "Сделать практику", completed: false},
        {title: "Пойти домой", completed: false},
      ],
      input: "",
    };
    this.onAddTask = this.onAddTask.bind(this);
    this.onAddInputChange = this.onAddInputChange.bind(this);
    this.onCompleteTask = this.onCompleteTask.bind(this);
    this.onDeleteTask = this.onDeleteTask.bind(this);
    this.taskComponents = [];
  }

    render() {
        this.state.todos.forEach((todo, index) => {
            if (!this.taskComponents[index]) {
                this.taskComponents[index] = new Task(
                    todo,
                    index,
                    this.onDeleteTask,
                    this.onCompleteTask
                );
            }

            const comp = this.taskComponents[index];
            comp.todo = todo;
            comp.index = index;
        });

        return createElement("div", {class: "todo-list"}, [
            createElement("h1", {}, "TODO List"),
            new AddTask(this.onAddTask, this.onAddInputChange).getDomNode(),
            createElement(
                "ul",
                { id: "todos" },
                this.taskComponents.map((comp) => comp.getDomNode())
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
        this.taskComponents.splice(index, 1);
        this.update();
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
  constructor(todo, index, onDeleteTask, onCompleteTask) {
    super();
    this.state = {
      confirmDelete: false
    }
    this.todo = todo;
    this.index = index;
    this.onDeleteTask = onDeleteTask;
    this.onCompleteTask = onCompleteTask;
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  render() {
    return createElement("li", {}, [
      createElement("input", {
        type: "checkbox",
        checked: this.todo.completed
      }, null, {change: (e) => this.onCompleteTask(this.index, e)}),
      createElement("label", {style: this.todo.completed ? "color: gray;" : "",}, this.todo.title),
      createElement("button", {style: this.state.confirmDelete ? "background: red;" : ""}, "🗑️", {click: this.onDeleteClick}),
    ]);
  }

    onDeleteClick() {
        if (!this.state.confirmDelete) {
            this.state.confirmDelete = true;
            this.update();
        } else {
            this.onDeleteTask(this.index);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});
