import { resolve } from 'node:path'
import { Client } from '../base/Client'
import { Event } from '../structures/Event'

type Structures = Event;

export async function resolveFile<T>(file: string, client: Client): Promise<T | null> {
  const resolvedPath = resolve(file)

  const File = await (await import(resolvedPath)).default

  if (!File?.constructor) {
    return null
  }

  return new File(client) as T
}

export async function validateFile(file: string, item: Structures) {
  const type = getType(item)

  if (!item.name) {
    throw new TypeError(`[ERROR][${type}]: name is required for ${type}! (${file})`)
  }

  if (!item.execute) {
    throw new TypeError(`[ERROR][${type}]: execute function is required for ${type}! (${file})`)
  }
}

function getType(item: Structures) {
  if (item instanceof Event) {
    return 'EVENT'
  }
}
