import { createBrowserRouter, RouterProvider } from 'react-router-dom'; 

// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import UploadSelfie from './pages/UploadSelfie';
import ImageShop from './pages/ImageShop';

const router = createBrowserRouter([
  // { path: '/', element: <Login />}, - route default con login
  // { path: '/personal' element: <Personal /> }, - route alla dashboard personale
  { path: '/event/:eventName', element: <UploadSelfie />},
  { path: '/processing-selfie', element: <ProcessingSelfie />},
  { path: '/image-shop', element: <ImageShop />},
  // { path: '/purchased', element: <Purchased /> } - route foto appena acquistate
  // { path: '/admin': element: <AdminPanel /> } - route alla dashboard admin

]);

function App() {
  return <RouterProvider router={router} />

  // const [count, setCount] = useState(0)

  // return (
  //   <>
  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
}

export default App
