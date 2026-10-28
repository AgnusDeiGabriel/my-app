const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const count = document.getElementById("count");

async function api(method, url, body) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

function render(tasks) {
  list.innerHTML = "";
  for (const task of tasks) {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = task.done;
    check.onchange = async () => {
      await api("PUT", `/api/tasks/${task.id}`, { done: check.checked });
      load();
    };

    const text = document.createElement("span");
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.title = "Efase";
    del.textContent = "✕";
    del.onclick = async () => {
      await api("DELETE", `/api/tasks/${task.id}`);
      load();
    };

    li.append(check, text, del);
    list.append(li);
  }
  const left = tasks.filter((t) => !t.done).length;
  count.textContent = tasks.length
    ? `${left} travay ki rete sou ${tasks.length}`
    : "Pa gen travay ankò. Ajoute youn!";
}

async function load() {
  render(await api("GET", "/api/tasks"));
}

form.onsubmit = async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  await api("POST", "/api/tasks", { text });
  input.value = "";
  load();
};

load();
