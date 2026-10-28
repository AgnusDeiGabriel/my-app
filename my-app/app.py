"""Aplikasyon Lis Travay la ak Flask."""
import json
import os

from flask import Flask, jsonify, render_template, request

BASE = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE, "travay.json")

app = Flask(__name__)


def load_tasks():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, encoding="utf-8") as f:
        return json.load(f)


def save_tasks(tasks):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=2)


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/api/tasks")
def list_tasks():
    return jsonify(load_tasks())


@app.post("/api/tasks")
def add_task():
    text = str((request.get_json(silent=True) or {}).get("text", "")).strip()
    if not text:
        return jsonify({"erè": "tèks la vid"}), 400
    tasks = load_tasks()
    task = {"id": max((t["id"] for t in tasks), default=0) + 1,
            "text": text, "done": False}
    tasks.append(task)
    save_tasks(tasks)
    return jsonify(task), 201


@app.put("/api/tasks/<int:tid>")
def update_task(tid):
    tasks = load_tasks()
    for t in tasks:
        if t["id"] == tid:
            data = request.get_json(silent=True) or {}
            t["done"] = bool(data.get("done", not t["done"]))
            save_tasks(tasks)
            return jsonify(t)
    return jsonify({"erè": "pa jwenn"}), 404


@app.delete("/api/tasks/<int:tid>")
def delete_task(tid):
    tasks = load_tasks()
    remaining = [t for t in tasks if t["id"] != tid]
    if len(remaining) == len(tasks):
        return jsonify({"erè": "pa jwenn"}), 404
    save_tasks(remaining)
    return jsonify({"ok": True})


if __name__ == "__main__":
    app.run(debug=True, port=8000)
