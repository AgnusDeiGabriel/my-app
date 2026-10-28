const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const count = document.getElementById("count");

const STORAGE_KEY = "lis-travay";

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  const tasks = loadTasks();
  list.innerHTML = "";

  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;

    check.onchange = () => {
      const updated = loadTasks().map(t =>
        t.id === task.id ? { ...t, done: check.checked } : t
      );
      saveTasks(updated);
      render();
    };

    const text = document.createElement("span");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.title = "Efase";
    del.textContent = "✕";

    del.onclick = () => {
      saveTasks(loadTasks().filter(t => t.id !== task.id));
      render();
    };

    li.append(check, text, del);
    list.append(li);
  }

  const left = tasks.filter(t => !t.done).length;

  count.textContent = tasks.length
    ? `${left} travay ki rete sou ${tasks.length}`
    : "Pa gen travay ankò. Ajoute youn!";
}

form.onsubmit = (e) => {
  e.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  const tasks = loadTasks();

  tasks.push({
    id: Date.now(),
    text,
    done: false
  });

  saveTasks(tasks);
  input.value = "";
  render();
};

render();