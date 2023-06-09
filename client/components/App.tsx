import { Routes, Route } from 'react-router-dom'
import  Notebook  from './Notebook'
import {EditUpload } from './EditUpload'
import NotFound from './NotFound'

function App() {
  return (
    <>
      {/* <Nav /> */}
      <Routes>
        <Route path='/' element={<Notebook />} />
        <Route path='/edit/:id' element={<EditUpload />} />
        <Route path='/edit/' element={<NotFound />} />
        <Route path='/*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
