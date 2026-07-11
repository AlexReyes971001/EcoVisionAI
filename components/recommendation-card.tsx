import { Leaf, Sprout } from "lucide-react"
import type { ClassificationResult } from "@/lib/types"

export function RecommendationCard({ result }: { result: ClassificationResult }) {
  return (
    <section
      aria-label="Recomendación ecológica"
      className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="size-4" aria-hidden="true" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Recomendación ecológica</h2>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{result.recommendation}</p>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/20 bg-card/60 p-3">
        <Sprout className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          {result.environmentalImpact}
        </p>
      </div>
    </section>
  )
}
