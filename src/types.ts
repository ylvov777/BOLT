export interface DroppedComponent {
  id: string
  name: string
  x: number
  y: number
  type: string
  svgContent: string
}

export interface Wire {
  id: string
  startX: number
  startY: number
  endX: number
  endY: number
  color: string
}

export interface VisioComponent {
  id: string
  name: string
  type: string
  svgContent: string
}