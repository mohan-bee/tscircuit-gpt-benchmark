import { resultSchema } from "./schema"
const resultModules = import.meta.glob(
  "../../public/evaluations/**/result.json",
  { eager: true, import: "default" },
)
export const evaluationResults = Object.values(resultModules)
  .map((result) => resultSchema.parse(result))
  .sort((first, second) => first.createdAt.localeCompare(second.createdAt))
