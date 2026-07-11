import { AlertTriangle, CheckCircle2, HelpCircle, Recycle, Trash2 } from "lucide-react"
import { type ClassificationResult, getStatus } from "@/lib/types"

const CATEGORY_ICON: Record<string, typeof Recycle> = {
  "No reciclable": Trash2,
}

const statusConfig = {
  high: {
    label: "Confianza alta",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
    dot: "bg-success",
  },
  low: {
    label: "Confianza baja",
    icon: AlertTriangle,
    className: "bg-warning/10 text-[color:var(--warning)] border-warning/30",
    dot: "bg-warning",
  },
  unknown: {
    label: "No reconocido",
    icon: HelpCircle,
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
} as const

export function ClassificationResultCard({ result }: { result: ClassificationResult }) {
  const status = getStatus(result)
  const cfg = statusConfig[status]
  const StatusIcon = cfg.icon
  const CategoryIcon = CATEGORY_ICON[result.category] ?? Recycle
  const confidence = Math.round(result.confidence)

  return (
    <section
      aria-label="Resultado de la clasificación"
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <h2 className="text-sm font-semibold text-foreground">Resultado de clasificación</h2>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${cfg.className}`}
        >
          <StatusIcon className="size-3.5" aria-hidden="true" />
          {cfg.label}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CategoryIcon className="size-7" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Categoría detectada
            </p>
            <p className="truncate text-xl font-bold text-foreground">{result.category}</p>
            <p className="truncate text-sm text-muted-foreground">{result.itemName}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="text-xs font-medium text-muted-foreground">Confianza</span>
            <span className="font-mono text-2xl font-bold text-foreground">{confidence}%</span>
          </div>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={confidence}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                status === "high"
                  ? "bg-success"
                  : status === "low"
                    ? "bg-warning"
                    : "bg-muted-foreground"
              }`}
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Contenedor</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">{result.binColor}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/40 p-3">
            <p className="text-xs text-muted-foreground">Estado</p>
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <span className={`size-2 rounded-full ${cfg.dot}`} aria-hidden="true" />
              {cfg.label}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
