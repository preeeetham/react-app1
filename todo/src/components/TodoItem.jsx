import React, { useState } from 'react';

const TodoItem = ({ todo, updateTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);

  const handleUpdate = () => {
    updateTodo(todo.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={() => updateTodo(todo.id, { isDone: !todo.isDone })}
          />
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => deleteTodo(todo.id)}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TodoItem;