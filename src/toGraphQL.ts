import { getProperties, ObjectType, TaggedType, TypeTag as tag } from "./types"
import { transformer } from "./TypeTransformer"

/** Prototype example of how to "transform" an internal type to a graphQL type */

const types = transformer({
  [tag.String]: t => "String",
  [tag.Float]: t => "Float",
  [tag.Int]: t => "Int",
  [tag.Boolean]: t => "Boolean",
  [tag.Byte]: t => "String", // base 64
  [tag.Array]: t => `[${t.itemType}]!`,
  [tag.Object]: t => t.name
})

export function toGraphQL<K extends string, V extends TaggedType>(
  obj: ObjectType<K, V>
): string {
  const fields = getProperties(obj).map(
    ([name, t]) => `${name}: ${types.transform(t)}`
  )

  return `
    type ${obj.name} {
      ${fields.join("\n")}
    }
  `
}
