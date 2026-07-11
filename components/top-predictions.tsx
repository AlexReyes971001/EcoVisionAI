import { BarChart3 } from "lucide-react"
import type { Prediction } from "@/lib/types"

export function TopPredictions({ predictions }: { predictions: Prediction[] }) {
  const sorted = [...predictions].sort((a, b) => b.confidence - a.confidence).slice(0, 5)

  return (
    <section
      aria-label="Cinco predicciones principales"
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="size-4 text-primary" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-foreground">Top 5 predicciones</h2>
      </div>

      <ul className="flex flex-col gap-3">
        {sorted.map((p, i) => {
          const value = Math.round(p.confidence)
          return (
            <li key={`${p.category}-${i}`}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span className="flex size-5 items-center justify-center rounded-md bg-muted font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                  {p.category}
                </span>
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  {value}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    i === 0 ? "bg-primary" : "bg-primary/40"
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
