import React, { useRef, useEffect, useState } from 'react'
import { useDrop } from 'react-dnd'

interface SchematicCanvasProps {
  width: number
  height: number
}

interface DroppedComponent {
  id: string
  name: string
  x: number
  y: number
  type: string
  svgContent: string
}

interface Wire {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  color: string
}

const SchematicCanvas: React.FC<SchematicCanvasProps> = ({ width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [components, setComponents] = useState<DroppedComponent[]>([])
  const [wires, setWires] = useState<Wire[]>([])
  const [isDrawingWire, setIsDrawingWire] = useState(false)
  const [currentWire, setCurrentWire] = useState<Wire | null>(null)

  const [, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: { id: string; name: string; type: string; svgContent: string }, monitor) => {
      const offset = monitor.getClientOffset()
      if (offset) {
        const canvasRect = canvasRef.current?.getBoundingClientRect()
        if (canvasRect) {
          const x = Math.round((offset.x - canvasRect.left) / 20) * 20
          const y = Math.round((offset.y - canvasRect.top) / 20) * 20
          setComponents((prev) => [...prev, { ...item, x, y }])
        }
      }
    },
  }))

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (canvasRect) {
      const x = Math.round((event.clientX - canvasRect.left) / 20) * 20
      const y = Math.round((event.clientY - canvasRect.top) / 20) * 20

      if (isDrawingWire) {
        if (currentWire) {
          setWires((prev) => [...prev, { ...currentWire, endX: x, endY: y, id: `wire-${Date.now()}` }])
          setCurrentWire(null)
          setIsDrawingWire(false)
        }
      } else {
        setCurrentWire({ id: `wire-${Date.now()}`, startX: x, startY: y, endX: x, endY: y, color: getWireColor() })
        setIsDrawingWire(true)
      }
    }
  }

  const getWireColor = (): string => {
    const colors = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawingWire && currentWire) {
      const canvasRect = canvasRef.current?.getBoundingClientRect()
      if (canvasRect) {
        const x = Math.round((event.clientX - canvasRect.left) / 20) * 20
        const y = Math.round((event.clientY - canvasRect.top) / 20) * 20
        setCurrentWire((prev) => prev ? { ...prev, endX: x, endY: y } : null)
      }
    }
  }

  const drawSVGComponent = (ctx: CanvasRenderingContext2D, component: DroppedComponent) => {
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, component.x, component.y, 40, 40)
      ctx.fillStyle = 'black'
      ctx.font = '10px Arial'
      ctx.fillText(component.name, component.x, component.y - 5)
    }
    img.src = `data:image/svg+xml;base64,${btoa(component.svgContent)}`
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    // Рисование сетки
    ctx.strokeStyle = '#e0e0e0'
    ctx.lineWidth = 0.5

    for (let x = 0; x <= width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let y = 0; y <= height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Отрисовка компонентов
    components.forEach((component) => {
      drawSVGComponent(ctx, component)
    })

    // Отрисовка проводов
    wires.forEach((wire) => {
      ctx.strokeStyle = wire.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(wire.startX, wire.startY)
      ctx.lineTo(wire.endX, wire.endY)
      ctx.stroke()
    })

    // Отрисовка текущего провода
    if (isDrawingWire && currentWire) {
      ctx.strokeStyle = currentWire.color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(currentWire.startX, currentWire.startY)
      ctx.lineTo(currentWire.endX, currentWire.endY)
      ctx.stroke()
    }
  }, [width, height, components, wires, isDrawingWire, currentWire])

  return (
    <canvas
      ref={(node) => {
        canvasRef.current = node
        drop(node)
      }}
      width={width}
      height={height}
      className="border border-gray-300"
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
    />
  )
}

export default SchematicCanvas