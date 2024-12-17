package com.example.springboot_api;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TodoService {

    private List<Todo> todos = new ArrayList<>();


    public List<Todo> listTodos(int page, int size, boolean done, String name, Todo.Priority priority) {
        return todos.stream()
                .filter(todo -> !todo.isDel())
                .filter(todo -> (name == null || todo.getText().toLowerCase().contains(name.toLowerCase())))
                .filter(todo -> (priority == null || todo.getPriority() == priority))
                .sorted((t1, t2) -> {
                    int priorityComparison = t1.getPriority().compareTo(t2.getPriority());
                    return priorityComparison != 0 ? priorityComparison : t1.getDueDate() != null && t2.getDueDate() != null
                            ? t1.getDueDate().compareTo(t2.getDueDate()) : 0;
                })
                .skip(page * size)
                .limit(size)
                .collect(Collectors.toList());
    }


    public Todo createTodo(Todo todo) {
        todo.setId(UUID.randomUUID().toString());
        todo.setCreationDate(LocalDate.now());
        todos.add(todo);
        return todo;
    }


    public Optional<Todo> updateTodo(String id, Todo updatedTodo) {
        return todos.stream()
                .filter(todo -> todo.getId().equals(id))
                .findFirst()
                .map(todo -> {
                    todo.setText(updatedTodo.getText());
                    todo.setDueDate(updatedTodo.getDueDate());
                    todo.setPriority(updatedTodo.getPriority());
                    return todo;
                });
    }


    public Optional<Todo> markAsDone(String id) {
        return todos.stream()
                .filter(todo -> todo.getId().equals(id))
                .findFirst()
                .map(todo -> {
                    if (!todo.isDone()) {
                        todo.setDone(true);
                        todo.setDoneDate(LocalDate.now());
                    }
                    return todo;
                });
    }


    public Optional<Todo> markAsUndone(String id) {
        return todos.stream()
                .filter(todo -> todo.getId().equals(id))
                .findFirst()
                .map(todo -> {
                    if (todo.isDone()) {
                        todo.setDone(false);
                        todo.setDoneDate(null);
                    }
                    return todo;
                });
    }

    public Optional<Todo> deleteTodo(String id){

        return todos.stream()
                .filter(todo -> todo.getId().equals(id))
                .findFirst()
                .map(todo -> {
                    todo.setDel(true);
                    return todo;
                });
    }
}


