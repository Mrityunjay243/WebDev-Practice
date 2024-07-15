import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

const useMousePointer = () => {
  const [position, setPosition] = useState({x: 0, y: 0});

  const handleMouseMove = (e) => {
    setPosition({x: e.clientX, y: e.clientY});
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    };
  }, [])

  return position
}

function useIsOnline() {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine)

  useEffect(() => {
    window.addEventListener("online", () => {
      setIsOnline(true);
    })
    window.addEventListener("offline", () => {
      setIsOnline(false);
    })
  }, [])

  return isOnline;
}

function useTodos(n) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const value = setInterval(() => {
      axios.get("https://sum-server.100xdevs.com/todos")
      .then(res => {
        setTodos(res.data.todos)
        setLoading(false)
      })
    }, n*1000)

    axios.get("https://sum-server.100xdevs.com/todos")
    .then(res => {
      setTodos(res.data.todos)
      setLoading(false)
    })

    return () => {
      clearInterval(value)
    }
  }, [n])

  return [todos, loading];
}

function App() {
  const [todos, loading] = useTodos(5);
  const online = useIsOnline();
  const mousePointer = useMousePointer()

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      <div>
        {todos.map(todo => <Track todo={todo}/>)}
      </div>
      <OnlineCard online = {online}></OnlineCard>
      <MousePositionCard mousePointer={mousePointer}></MousePositionCard>
    </>
  )
}

function MousePositionCard ({mousePointer}) {
  return <div>
    Your mouse position is {mousePointer.x}, {mousePointer.y}
  </div>
}

function OnlineCard ({ online }){
  return <div>
    { online ? "You're Online" : "You are offline"}
  </div>
}
function Track({ todo }){
  return <div>
    {todo.title}
    <br/>
    {todo.description}
  </div>
}
export default App
