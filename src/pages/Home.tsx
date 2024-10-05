import React from 'react'
import { Link } from 'react-router-dom'
import { FileSpreadsheet, List } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Добро пожаловать в Электро-Конструктор</h1>
      <p className="text-xl mb-8">Создавайте и редактируйте схемы электрических щитков с легкостью</p>
      <div className="flex justify-center space-x-4">
        <Link to="/editor" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <FileSpreadsheet className="mr-2" />
          Новый проект
        </Link>
        <Link to="/projects" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <List className="mr-2" />
          Мои проекты
        </Link>
      </div>
    </div>
  )
}

export default Home