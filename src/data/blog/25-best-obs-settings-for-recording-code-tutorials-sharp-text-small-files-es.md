---
title: "Mejores ajustes de OBS para grabar tutoriales de codigo"
author: "Francisco Gonzalez"
description: "Configuracion recomendada de OBS para texto nitido y archivos pequenos en grabaciones tecnicas."
pubDate: 2026-02-10
image:
  url: "https://assets.francgs.dev/25-best-obs-settings-for-recording-code-tutorials-sharp-text-small-files.png"
  alt: "Screen recording setup for programming tutorials with code editor"
tags: ["developer-tools", "productivity"]
category: tools
translationKey: post-25
lang: es
---

Si grabaste un tutorial de programacion y el texto se ve borroso, o el archivo termina siendo gigante, no estas solo. OBS viene optimizado para gaming, no para texto estatico y nitido.

La clave es usar control de tasa basado en calidad (**CQP/CRF**) y mantener resolucion correcta.

## Por que falla la configuracion por defecto de OBS

OBS usa **CBR** por defecto (bitrate constante). Eso funciona en escenas con mucho movimiento, pero en tutoriales de codigo desperdicia bits en frames casi estaticos.

Para codigo conviene **CQP** o **CRF**: asignan mas bits donde se necesita y menos donde no.

---

## Paso 1: Configurar salida (Output)

Ve a **Settings > Output**, cambia **Output Mode** a `Advanced` y abre la pestaña **Recording**.

### Recording Format

Usa **Fragmented MP4 (.mp4)** o **MKV**.

:::tip
Fragmented MP4 protege la grabacion si OBS se cierra inesperadamente. En MP4 normal puedes perder todo el archivo.
:::

### Video Encoder

| GPU/Sistema | Encoder recomendado | Notas |
| :--- | :--- | :--- |
| **NVIDIA GPU** | NVIDIA NVENC H.264 (o HEVC) | Acelerado por hardware, bajo impacto CPU |
| **macOS** | Apple VT H.264 Hardware Encoder | Encoder nativo por hardware |
| **Solo CPU** | x264 | Mayor uso de CPU |

### Rate Control (lo mas importante)

No uses CBR.

- **Windows / NVIDIA:** **CQP**.
- **x264 (CPU):** **CRF**.

### CQ / CRF recomendado

Usa valores entre **20 y 23**.

| Rango | Calidad | Tamano | Uso |
| :--- | :--- | :--- | :--- |
| **16-18** | Casi sin perdida | Grande | Archivo maestro/edicion |
| **20-23** | Excelente | Moderado | Tutoriales y screencasts |
| **25+** | Degradacion visible | Pequeno | Evitar para codigo |

:::important
Para codigo, no subas de 23. El texto es muy sensible a artefactos de compresion.
:::

### Ajustes adicionales del encoder

- **Keyframe Interval:** `2` segundos.
- **Profile:** `high`.

---

## Paso 2: Configurar video

Ve a **Settings > Video**.

### Base (Canvas) Resolution

Pon la resolucion nativa de tu monitor (1920x1080, 2560x1440, 3840x2160, etc.).

### Output (Scaled) Resolution

Para tutoriales de codigo, usa el mismo valor que el Base.

:::warning
El downscale (por ejemplo 4K -> 1080p) hace que letras pequenas parpadeen o se vean borrosas.
:::

Si necesitas escalar, usa **Lanczos (36 samples)**.

### FPS

Configura `30` FPS.

En tutoriales de codigo no necesitas 60 FPS:
- Cursor y scroll se ven fluidos.
- El tamano de archivo baja aprox. 50%.
- Menor carga de CPU/GPU.

:::tip
Deja 60 FPS para gaming o contenido con mucho movimiento.
:::

---

## Paso 3: Configurar color

Ve a **Settings > Advanced**.

| Ajuste | Valor recomendado | Motivo |
| :--- | :--- | :--- |
| **Color Format** | NV12 | Mayor compatibilidad |
| **Color Space** | 709 | Estandar HD/web |
| **Color Range** | Limited | Evita negros lavados o aplastados |

:::note
Aunque "Full" parezca mejor, muchos reproductores web lo interpretan mal. "Limited" es la opcion segura.
:::

---

## Bonus: texto aun mas nitido

### 1. Sube el tamano de fuente del editor

Incrementa 10-20%:

```
// VS Code: Add to settings.json
{
  "editor.fontSize": 16,       // up from default 14
  "terminal.integrated.fontSize": 15
}
```

### 2. Usa temas de alto contraste

Temas recomendados para grabar:
- **Night Owl**
- **Dracula**
- **Tokyo Night**
- **One Dark Pro**

### 3. Desactivar anti-aliasing (caso puntual)

Si grabas a baja resolucion (720p o menos), puede ayudar:

```
// VS Code: Disable anti-aliasing
{
  "editor.fontLigatures": false,
  "workbench.fontAliasing": "none"
}
```

:::caution
Solo en resoluciones bajas. En 1080p+ normalmente se ve mejor con anti-aliasing.
:::

---

## Referencia rapida (cheat sheet)

| Categoria | Ajuste | Valor |
| :--- | :--- | :--- |
| **Output** | Output Mode | Advanced |
| | Recording Format | Fragmented MP4 |
| | Encoder | NVENC H.264 / Apple VT / x264 |
| | Rate Control | CQP (GPU) o CRF (CPU) |
| | CQ/CRF Level | 20-23 |
| | Keyframe Interval | 2s |
| | Profile | High |
| **Video** | Base Resolution | Resolucion nativa del monitor |
| | Output Resolution | Igual a base |
| | Downscale Filter | Lanczos (si escalas) |
| | FPS | 30 |
| **Advanced** | Color Format | NV12 |
| | Color Space | 709 |
| | Color Range | Limited |

---

## Conclusion

Para que tu codigo se vea profesional en video, toma estas tres decisiones: `CQP/CRF` en lugar de CBR, resolucion nativa sin downscale y 30 FPS. Con eso logras texto nitido y archivos manejables.
