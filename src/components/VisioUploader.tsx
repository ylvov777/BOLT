import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { parseVisioFile } from '../services/visioParser'
import { VisioComponent } from '../types'

interface VisioUploaderProps {
  onComponentsImported: (components: VisioComponent[]) => void
}

const VisioUploader: React.FC<VisioUploaderProps> = ({ onComponentsImported }) => {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsLoading(true)
    setError(null)
    try {
      const components = await parseVisioFile(file)
      onComponentsImported(components)
      console.log('Компоненты успешно импортированы:', components)
    } catch (error) {
      console.error('Ошибка при обработке файла:', error)
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Загрузка VSSX файла</h2>
      <div className="flex items-center space-x-4">
        <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
          <Upload className="mr-2" size={20} />
          <span>Выберите файл</span>
          <input
            type="file"
            accept=".vssx"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <span className="text-gray-600">
          {file ? file.name : 'Файл не выбран'}
        </span>
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || isLoading}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Обработка...' : 'Загрузить'}
      </button>
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  )
}

export default VisioUploader