import {useEffect, useState} from "react";
import "../assets/styles/FloatingTodo.css";
import { Card, Form, ListGroup } from "react-bootstrap";

function FloatingToDo() {
    const [todos, setTodos] =  useState(() => {
        const stored = localStorage.getItem("todos");
        return stored ? JSON.parse(stored) : [];
    });
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        setTodos((prev) => [...prev, newTodo.trim()]);
        setNewTodo("");
    };

    const removeTodo = (index) => {
        setTodos((prev) => prev.filter((_, i) => i !== index));
    };

    return(
        <Card
            bg="dark"
            text="light"
            data-testid="todo-card"
            className="floating-todo-card shadow-lg border-0"
        >
            <Card.Header
                data-testid="todo-header"
                className="floating-todo-header text-center fw-semibold border-0"
            >
                To-Do
            </Card.Header>

            <Card.Body className="floating-todo-body flex-grow-1 py-2 gap-2">
                <ListGroup data-testid="todo-list">
                    {todos.map((task, index) => (
                        <ListGroup.Item
                            key={index}
                            className="floating-todo-item rounded-3 d-flex justify-content-between align-items-center text-light"
                        >
                            <span>{task}</span>
                            <span
                                role="button"
                                className="floating-todo-remove"
                                onClick={() => removeTodo(index)}
                            >
                                ✕
                            </span>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>

            <div className="floating-todo-input p-2">
                <Form onSubmit={addTodo}>
                    <Form.Control
                        data-testid="todo-form"
                        size="sm"
                        type="text"
                        placeholder="Add task and press Enter"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        className="bg-dark text-light border-secondary"
                    />
                </Form>
            </div>
        </Card>
    );
}

export default FloatingToDo;
