import JSZip from 'jszip'
import { parseString } from 'xml2js'
import { VisioComponent } from '../types'

export async function parseVisioFile(file: File): Promise<VisioComponent[]> {
  try {
    const zip = new JSZip()
    const contents = await zip.loadAsync(file)

    const components: VisioComponent[] = []

    // Парсинг document.xml для получения информации о компонентах
    const documentXml = await contents.file('visio/document.xml')?.async('text')
    if (!documentXml) {
      throw new Error('Файл document.xml не найден в VSSX архиве')
    }

    const result: any = await new Promise((resolve, reject) => {
      parseString(documentXml, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    // Извлечение информации о компонентах
    const shapes = result.VisioDocument?.Pages?.[0]?.Page?.[0]?.Shapes?.[0]?.Shape || []
    for (const shape of shapes) {
      const component: VisioComponent = {
        id: shape.$.ID,
        name: shape.$.Name || 'Неизвестный компонент',
        type: shape.$.Type || 'Неизвестный тип',
        svgContent: ''
      }

      // Извлечение SVG контента
      const svgFile = contents.file(`visio/media/${component.id}.svg`)
      if (svgFile) {
        component.svgContent = await svgFile.async('text')
      } else {
        console.warn(`SVG файл для компонента ${component.id} не найден`)
      }

      components.push(component)
    }

    return components
  } catch (error) {
    console.error('Ошибка при обработке VSSX файла:', error)
    throw new Error('Не удалось обработать VSSX файл. Пожалуйста, убедитесь, что файл имеет правильный формат.')
  }
}