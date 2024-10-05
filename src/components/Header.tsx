import React from 'react'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Zap size={24} />
          <span>Электро-Конструктор</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-blue-200">Главная</Link></li>
            <li><Link to="/editor" className="hover:text-blue-200">Редактор</Link></li>
            <li><Link to="/projects" className="hover:text-blue-200">Проекты</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header