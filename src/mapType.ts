import { ObjectType, Properties, t, TaggedType } from "./types"

/** DSL-like API to create new types dervived from an existing type.
 *  For example, to map a DB type to a graphQL type you might want to
 *  drop a few fields, or add a new (computed) one
 */
export function mapType<K extends string, V extends TaggedType>(
  obj: ObjectType<K, V>
): TypeMapper<K, V> {
  return new TypeMapper(obj)
}

class TypeMapper<K extends string, V extends TaggedType> {
  constructor(private readonly obj: ObjectType<K, V>) {}

  rename(name: string): TypeMapper<K, V> {
    const { obj } = this
    return new TypeMapper(t.object(name, obj.properties))
  }

  take<P extends K>(...propertyNames: P[]): TypeMapper<P, V> {
    const properties = {} as Properties<P, V>
    propertyNames.forEach(p => (properties[p] = this.obj.properties[p]))

    return new TypeMapper(t.object(this.obj.name, properties))
  }

  drop<P extends K>(...propertyNames: P[]): TypeMapper<Exclude<K, P>, V> {
    const properties = {} as Properties<Exclude<K, P>, V>

    const { obj } = this
    let p: keyof typeof obj.properties

    for (p in obj.properties) {
      if (!propertyNames.includes(p as any)) {
        properties[p as Exclude<K, P>] = obj.properties[p]
      }
    }

    return new TypeMapper(t.object(this.obj.name, properties))
  }

  add<P extends string, U extends TaggedType>(
    propertyName: P,
    type: U
  ): TypeMapper<P | K, V | U> {
    const properties = {
      ...this.obj.properties,
      [propertyName]: type
    } as Properties<P | K, V | U>
    return new TypeMapper(t.object(this.obj.name, properties))
  }

  get(): ObjectType<K, V> {
    return this.obj
  }
}
