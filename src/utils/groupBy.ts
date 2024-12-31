export type GroupedResult = {
  [key: string]: unknown[] | string | number
  total: number
}

export const groupBy = <T extends Record<string, string | number>>(
  data: T[],
  parentKey: keyof T,
  parentAttributes: (keyof T)[],
  childrenKey: string
): GroupedResult[] => {
  const excludeFromChildren = new Set([parentKey, ...parentAttributes])

  const grouped = data.reduce((acc: { [key: string]: GroupedResult }, item) => {
    const parentKeyValue = String(item[parentKey])

    if (!acc[parentKeyValue]) {
      acc[parentKeyValue] = {
        [parentKey]: item[parentKey],
        ...Object.fromEntries(parentAttributes.map((attr) => [attr, item[attr]])),
        [childrenKey]: [],
        total: 0
      }
    }

    const childObject = Object.entries(item)
      .filter(([key]) => !excludeFromChildren.has(key))
      .reduce(
        (obj, [key, value]) => ({
          ...obj,
          [key]: value
        }),
        {} as Partial<T>
      ) as T

    ;(acc[parentKeyValue][childrenKey] as T[]).push(childObject)
    acc[parentKeyValue].total = (acc[parentKeyValue][childrenKey] as T[]).length

    return acc
  }, {})

  return Object.values(grouped)
}
