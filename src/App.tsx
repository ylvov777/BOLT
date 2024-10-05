import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SchematicEditor from './pages/SchematicEditor'
import ProjectList from './pages/ProjectList'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-100">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/editor" element={<SchematicEditor />} />
              <Route path="/projects" element={<ProjectList />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </DndProvider>
  )
}

export default App