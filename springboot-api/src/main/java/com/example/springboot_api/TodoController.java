package com.example.springboot_api;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = "*")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @GetMapping
    public List<Todo> getTodos(@RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "10") int size,
                               @RequestParam(defaultValue = "false") boolean done,
                               @RequestParam(required = false) String name,
                               @RequestParam(required = false) Todo.Priority priority) {
        return todoService.listTodos(page, size, done, name, priority);
    }

    @PostMapping
    public Todo createTodo(@Valid @RequestBody Todo todo) {
        return todoService.createTodo(todo);
    }

    @PutMapping("/{id}")
    public Optional<Todo> updateTodo(@PathVariable String id, @Valid @RequestBody Todo todo) {
        return todoService.updateTodo(id, todo);
    }

    @PostMapping("/{id}/done")
    public Optional<Todo> markTodoAsDone(@PathVariable String id) {
        return todoService.markAsDone(id);
    }

    @PutMapping("/{id}/undone")
    public Optional<Todo> markTodoAsUndone(@PathVariable String id) {
        return todoService.markAsUndone(id);
    }

    @PutMapping("/{id}/delete")
    public Optional<Todo> delTodo(@PathVariable String id) {
        return todoService.deleteTodo(id);
    }
}

