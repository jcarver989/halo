import { ObjectType, TaggedType, TypeTag as tag, getProperties } from "./types"
import { transformer } from "./TypeTransformer"

/** Prototype example of how to "transform" an internal type to a TypeScript interface */

const types = transformer({
  [tag.String]: t => "string",
  [tag.Float]: t => "number",
  [tag.Int]: t => "int",
  [tag.Boolean]: t => "boolean",
  [tag.Byte]: t => "Uint8Array",
  [tag.Array]: t => `${t.itemType}[]`,
  [tag.Object]: t => t.name
})

export function toTypeScript<K extends string, V extends TaggedType>(
  obj: ObjectType<K, V>
): string {
  const fields = getProperties(obj).map(
    ([name, t]) => `${name}: ${types.transform(t)}`
  )

  return `
    interface ${obj.name} {
      ${fields.join("\n")}
    }
  `
}
