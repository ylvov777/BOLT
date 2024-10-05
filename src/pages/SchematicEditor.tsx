import React, { useState, useEffect } from 'react'
import VisioUploader from '../components/VisioUploader'
import SchematicCanvas from '../components/SchematicCanvas'
import ComponentPalette from '../components/ComponentPalette'
import { VisioComponent, DroppedComponent, Wire } from '../types'
import { saveSchematic, loadSchematic, Schematic } from '../services/schematicService'

const SchematicEditor: React.FC = () => {
  const [components, setComponents] = useState<VisioComponent[]>([])
  const [droppedComponents, setDroppedComponents] = useState<DroppedComponent[]>([])
  const [wires, setWires] = useState<Wire[]>([])

  const handleComponentsImported = (importedComponents: VisioComponent[]) => {
    setComponents(importedComponents)
  }

  const handleComponentDropped = (component: DroppedComponent) => {
    setDroppedComponents((prev) => [...prev, component])
  }

  const handleWireCreated = (wire: Wire) => {
    setWires((prev) => [...prev, wire])
  }

  const handleSaveSchematic = () => {
    const schematic: Schematic = {
      components: droppedComponents,
      wires: wires,
    }
    saveSchematic(schematic)
    alert('Схема сохранена')
  }

  const handleLoadSchematic = () => {
    const loadedSchematic = loadSchematic()
    if (loadedSchematic) {
      setDroppedComponents(loadedSchematic.components)
      setWires(loadedSchematic.wires)
      alert('Схема загружена')
    } else {
      alert('Нет сохраненной схемы')
    }
  }

  useEffect(() => {
    // Автоматическая загрузка схемы при открытии страницы
    const loadedSchematic = loadSchematic()
    if (loadedSchematic) {
      setDroppedComponents(loadedSchematic.components)
      setWires(loadedSchematic.wires)
    }
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Редактор схем</h1>
      <div className="flex space-x-4">
        <div className="w-1/4">
          <VisioUploader onComponentsImported={handleComponentsImported} />
          <div className="mt-4">
            <ComponentPalette components={components} />
          </div>
          <div className="mt-4">
            <button
              onClick={handleSaveSchematic}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2"
            >
              Сохранить схему
            </button>
            <button
              onClick={handleLoadSchematic}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Загрузить схему
            </button>
          </div>
        </div>
        <div className="w-3/4">
          <SchematicCanvas
            width={800}
            height={600}
            droppedComponents={droppedComponents}
            wires={wires}
            onComponentDropped={handleComponentDropped}
            onWireCreated={handleWireCreated}
          />
        </div>
      </div>
    </div>
  )
}

export default SchematicEditor