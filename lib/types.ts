export type Prediction = {
  category: string
  confidence: number
}

export type ClassificationResult = {
  recognized: boolean
  itemName: string
  category: string
  confidence: number
  binColor: string
  recommendation: string
  environmentalImpact: string
  topPredictions: Prediction[]
}

export type ConfidenceStatus = "high" | "low" | "unknown"

export function getStatus(result: ClassificationResult): ConfidenceStatus {
  if (!result.recognized) return "unknown"
  if (result.confidence >= 75) return "high"
  return "low"
}
