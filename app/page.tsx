"use client"

import { useState } from "react"
import { AlertCircle, Recycle, ScanSearch, Sparkles } from "lucide-react"
import { EcoHeader } from "@/components/eco-header"
import { ImageUploader } from "@/components/image-uploader"
import { ClassificationResultCard } from "@/components/classification-result"
import { RecommendationCard } from "@/components/recommendation-card"
import { TopPredictions } from "@/components/top-predictions"
import type { ClassificationResult } from "@/lib/types"

export default function Page() {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleSelect(dataUrl: string) {
    setPreview(dataUrl)
    setResult(null)
    setError(null)
  }

  function handleClear() {
    setPreview(null)
    setResult(null)
    setError(null)
  }

  async function handleAnalyze() {
    if (!preview) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("http://127.0.0.1:8000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: preview }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error al clasificar")
      setResult(data as ClassificationResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <EcoHeader />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Intro */}
        <div className="mb-8 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Impulsado por inteligencia artificial
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground text-balance sm:text-3xl">
            Clasifica tus residuos y aprende a reciclarlos correctamente
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            Sube una foto de cualquier objeto y EcoVisionAI identificará la categoría del residuo,
            su nivel de confianza y cómo desecharlo de forma responsable.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* Left column: uploader */}
          <div className="flex flex-col gap-6">
            <ImageUploader
              preview={preview}
              loading={loading}
              onSelect={handleSelect}
              onClear={handleClear}
              onAnalyze={handleAnalyze}
              hasResult={!!result}
            />

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ScanSearch, label: "Detección", value: "9 categorías" },
                { icon: Sparkles, label: "Precisión", value: "Modelo IA" },
                { icon: Recycle, label: "Consejos", value: "Ecológicos" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card p-3 text-center shadow-sm"
                >
                  <s.icon className="mx-auto size-4 text-primary" aria-hidden="true" />
                  <p className="mt-1.5 text-sm font-semibold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: results */}
          <div className="flex flex-col gap-6">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4"
              >
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">No se pudo clasificar</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}

            {result ? (
              <>
                <ClassificationResultCard result={result} />
                <RecommendationCard result={result} />
                <TopPredictions predictions={result.topPredictions} />
              </>
            ) : (
              !error && (
                <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <ScanSearch className="size-7" aria-hidden="true" />
                  </div>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Los resultados aparecerán aquí
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                    Sube una imagen y pulsa «Clasificar residuo» para ver la categoría, la confianza
                    y las recomendaciones.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border/60 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p className="flex items-center gap-1.5">
            <Recycle className="size-3.5 text-primary" aria-hidden="true" />
            EcoVisionAI — Reciclaje inteligente para un planeta más limpio
          </p>
          <p>Las clasificaciones son orientativas. Consulta las normas locales de reciclaje.</p>
        </div>
      </footer>
    </div>
  )
}
