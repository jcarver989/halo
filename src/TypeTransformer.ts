import { ArrayType, TaggedType, TypeTag } from "./types"

/** Used to express transformations from an "internal" type to an output type - e.g. TypeScript, graphQL etc */
export function transformer(transformers: Transformers): Transformer {
  return new Transformer(transformers)
}

class Transformer {
  constructor(private transformers: Transformers) {}

  transform<T extends TaggedType>(input: T): string {
    const transformer = this.transformers[input.tag] as TransformerFunc<T>
    if (input.tag === TypeTag.Array) {
      // Bad hack that substitutes the string representation of
      // the type of the elements contained within this array
      // so that the transformer doesn't output [Object object][]
      const { itemType } = input as ArrayType<any>
      const stringType = this.transform(itemType)
      return transformer({ itemType: stringType } as any)
    } else {
      return transformer(input)
    }
  }
}

export type TransformerFunc<T> = (input: T) => string

export type TransformerFuncOrNever<
  T extends TaggedType,
  U extends TypeTag
> = T extends Record<"tag", U> ? TransformerFunc<T> : never

export type Transformers = {
  [P in TypeTag]: TransformerFuncOrNever<TaggedType, P>
}
