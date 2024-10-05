import React from 'react'
import { Grid } from 'lucide-react'
import { useDrag } from 'react-dnd'

interface VisioComponent {
  id: string
  name: string
  type: string
  svgContent: string
}

interface ComponentPaletteProps {
  components: VisioComponent[]
}

const DraggableComponent: React.FC<{ component: VisioComponent }> = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: { id: component.id, name: component.name, type: component.type, svgContent: component.svgContent },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      className={`flex items-center p-2 border rounded cursor-move ${
        isDragging ? 'opacity-50' : 'hover:bg-gray-100'
      }`}
    >
      <div className="w-10 h-10 mr-2" dangerouslySetInnerHTML={{ __html: component.svgContent }} />
      <span>{component.name}</span>
    </div>
  )
}

const ComponentPalette: React.FC<ComponentPaletteProps> = ({ components }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Grid className="mr-2" />
        Палитра компонентов
      </h2>
      <div className="grid grid-cols-2 gap-2">
        {components.map((component) => (
          <DraggableComponent key={component.id} component={component} />
        ))}
      </div>
    </div>
  )
}

export default ComponentPalette