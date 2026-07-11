import { Leaf, Sparkles } from "lucide-react"

export function EcoHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Leaf className="size-5" aria-hidden="true" />
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight text-foreground">
              EcoVision<span className="text-primary">AI</span>
            </p>
            <p className="text-xs text-muted-foreground">Clasificación inteligente de residuos</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 sm:flex">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          <span className="text-xs font-medium text-muted-foreground">
            Modelo de visión IA · v2.4
          </span>
        </div>
      </div>
    </header>
  )
}
