import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function useTodos() {
  const [todos, setTodos] = useState([])

  useEffect(
    () => {
      axios.get("https://sum-server.100xdevs.com/todos")
      .then(res => {
        setTodos(res.data.todos);
      })
    }, [])
    return todos;
}

function App() {
  const todos = useTodos();

  return (
    <>
      {todos.map(todo => <Track todo={todo}/>)}
    </>
  )
}

function Track({ todo }){
  return <div>
    {todo.title}
    <br/>
    {todo.description}
  </div>
}
export default App
