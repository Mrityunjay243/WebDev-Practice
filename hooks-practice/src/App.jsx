import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [render, setRender] = useState(true);

  useEffect(() => {
    setInterval(() => {
      setRender(r => !r);
    }, 5000)
  }, []);

  return (
    <>
      {render ? <MyComponent /> : <div>2nd Div - Post Screen</div>}
    </>
  )
}

function MyComponent(){
  useEffect ( () => {
    console.error("Component mounted");

    return () => {
      console.log("Component Unmounted");
    };
  }, []);
  return <div>
    From inside the componenent
  </div>
}
export default App
