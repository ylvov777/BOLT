import { DroppedComponent, Wire } from '../types'

export interface Schematic {
  components: DroppedComponent[]
  wires: Wire[]
}

export const saveSchematic = (schematic: Schematic): void => {
  localStorage.setItem('savedSchematic', JSON.stringify(schematic))
}

export const loadSchematic = (): Schematic | null => {
  const savedSchematic = localStorage.getItem('savedSchematic')
  return savedSchematic ? JSON.parse(savedSchematic) : null
}