"use client"

import { useCallback, useRef, useState } from "react"
import { ImagePlus, Loader2, ScanLine, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type ImageUploaderProps = {
  preview: string | null
  loading: boolean
  onSelect: (dataUrl: string) => void
  onClear: () => void
  onAnalyze: () => void
  hasResult: boolean
}

export function ImageUploader({
  preview,
  loading,
  onSelect,
  onClear,
  onAnalyze,
  hasResult,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith("image/")) return
      const reader = new FileReader()
      reader.onload = () => onSelect(reader.result as string)
      reader.readAsDataURL(file)
    },
    [onSelect],
  )

  return (
    <section
      aria-label="Cargar imagen del residuo"
      className="rounded-2xl border border-border bg-card p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Sube una imagen</h2>
          <p className="text-xs text-muted-foreground">
            Formatos JPG, PNG o WEBP · hasta 10 MB
          </p>
        </div>
        <ScanLine className="size-5 text-primary" aria-hidden="true" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {!preview ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
          className={`flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors ${
            dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/40 hover:border-primary/60 hover:bg-muted"
          }`}
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ImagePlus className="size-7" aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Arrastra una imagen o haz clic para subir
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              El objeto debe verse claro y centrado
            </p>
          </div>
        </button>
      ) : (
        <div className="relative overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview || "/placeholder.svg"}
            alt="Vista previa del residuo cargado"
            className="aspect-video w-full object-cover"
          />
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-sm">
              <div className="relative">
                <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground">Analizando imagen…</p>
              <p className="text-xs text-muted-foreground">Procesando con IA de visión</p>
            </div>
          )}
          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            aria-label="Quitar imagen"
            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm transition hover:bg-background disabled:opacity-50"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={onAnalyze}
          disabled={!preview || loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Analizando…
            </>
          ) : (
            <>
              <ScanLine className="size-4" aria-hidden="true" />
              {hasResult ? "Analizar de nuevo" : "Clasificar residuo"}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
        >
          <Upload className="size-4" aria-hidden="true" />
          Otra imagen
        </Button>
      </div>
    </section>
  )
}
