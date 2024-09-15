import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/todos', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTodos(response.data);
      setError(null); 
    } catch (error) {
      console.error('Fetching todos failed', error);
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/todos', { title: newTodo }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNewTodo('');
      fetchTodos(); 
    } catch (error) {
      console.error('Adding todo failed', error);
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id) => {
    try {
      await axios.put(`/api/todos/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
      ));
    } catch (error) {
      console.error('Toggling todo failed', error);
      setError('Failed to update todo status');
    }
  };

  if (loading) {
    return <p>Loading todos...</p>;
  }

  return (
    <div>
      <form onSubmit={addTodo}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="New todo"
          required
        />
        <button type="submit">Add Todo</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {todos.map((todo) => (
          <li 
            key={todo.id} 
            onClick={() => toggleTodo(todo.id)}
            style={{ cursor: 'pointer', textDecoration: todo.isDone ? 'line-through' : 'none' }}
          >
            {todo.title} - {todo.isDone ? 'Done' : 'Not Done'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
