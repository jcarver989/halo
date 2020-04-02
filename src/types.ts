/** API to express "internal" types that can later be used to code-gen TypeScript/GraphQL types
 *
 */
export const t = {
  int(): IntType {
    return {
      tag: TypeTag.Int
    }
  },

  float(): FloatType {
    return {
      tag: TypeTag.Float
    }
  },

  string(): StringType {
    return {
      tag: TypeTag.String
    }
  },

  boolean(): BooleanType {
    return {
      tag: TypeTag.Boolean
    }
  },

  array<T extends TaggedType>(itemType: T): ArrayType<T> {
    return {
      tag: TypeTag.Array,
      itemType
    }
  },

  bytes(): ByteType {
    return {
      tag: TypeTag.Byte
    }
  },

  object<K extends string, V extends TaggedType>(
    name: string,
    properties: Properties<K, V>
  ): ObjectType<K, V> {
    return {
      tag: TypeTag.Object,
      name,
      properties
    }
  }
}

export function getProperties<K extends string, V extends TaggedType>(
  obj: ObjectType<K, V>
): [K, V][] {
  return Object.entries(obj.properties) as [K, V][]
}

export enum TypeTag {
  Int = "int",
  Float = "float",
  String = "string",
  Boolean = "boolean",
  Array = "array",
  Byte = "byte",
  Object = "object"
}

export type Properties<K extends string, V extends TaggedType> = { [P in K]: V }

export type ObjectType<K extends string, V extends TaggedType> = {
  tag: TypeTag.Object
  name: string
  properties: Properties<K, V>
}

export type IntType = {
  tag: TypeTag.Int
}

export type FloatType = {
  tag: TypeTag.Float
}

export type StringType = {
  tag: TypeTag.String
}

export type BooleanType = {
  tag: TypeTag.Boolean
}

export type ArrayType<T> = {
  tag: TypeTag.Array
  itemType: T
}

export type ByteType = {
  tag: TypeTag.Byte
}

type ScalarType = IntType | FloatType | StringType | BooleanType | ByteType
export type TaggedType = ScalarType | ArrayType<any> | ObjectType<string, any>
