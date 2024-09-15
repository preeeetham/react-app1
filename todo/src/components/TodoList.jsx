import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

function Component() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(response.data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const addTodo = async (newTodo) => {
    try {
      const response = await axios.post('/api/todos', newTodo, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      await axios.put(`/api/todos/${id}`, updatedTodo, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, ...updatedTodo } : todo)));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>
      <AddTodo addTodo={addTodo} />
      <div className="mt-8">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default Component;