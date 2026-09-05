import { definitionSchema, resultSchema } from "./schema"
const resultModules = import.meta.glob(
  "../../public/evaluations/**/result.json",
  { eager: true, import: "default" },
)
const definitionModules = import.meta.glob(
  "../../benchmarks/*/v*/benchmark.json",
  { eager: true, import: "default" },
)
export const evaluationResults = Object.values(resultModules)
  .map((result) => resultSchema.parse(result))
  .sort((first, second) => first.createdAt.localeCompare(second.createdAt))
export const definitions = Object.values(definitionModules).map((definition) =>
  definitionSchema.parse(definition),
)
