---
title: "Best OBS Settings for Recording Code Tutorials: Sharp Text, Small Files"
author: "Francisco Gonzalez"
description: "Learn the optimal OBS Studio settings to record crystal-clear code tutorials with sharp text and small file sizes using CQP/CRF rate control, proper resolution, and color settings."
pubDate: 2026-02-10
image:
  url: "https://francgs.dev/25-best-obs-settings-for-recording-code-tutorials-sharp-text-small-files.png"
  alt: "Screen recording setup for programming tutorials with code editor"
tags: ["OBS Studio", "Screen Recording", "Video Production", "Developer Tools", "Content Creation"]
layout: ./../../layouts/MarkdownPostLayout.astro
---

# Best OBS Settings for Recording Code Tutorials: Sharp Text, Small Files

If you've ever recorded a coding tutorial and the final video turned your beautiful syntax highlighting into a blurry mess, or if the file ended up being a 50GB monster for a 30-minute screencast, you're not alone. The default OBS settings are optimized for gaming, not for sharp, static text.

The secret lies in choosing the right **Rate Control method** and prioritizing **resolution accuracy** over raw bitrate. In this guide, you'll configure OBS Studio step by step to achieve **crystal-clear text** in recordings while keeping file sizes reasonable.

## Why Default OBS Settings Fail for Code Recordings

OBS ships with **CBR (Constant Bitrate)** as the default rate control. CBR allocates the same amount of data per second regardless of scene complexity. This works well for fast-paced gaming footage where every frame changes dramatically, but it's wasteful for code tutorials where most of the screen is static text.

What you need instead is a **quality-based** rate control method like **CQP** or **CRF**, which dynamically allocates bits only where they're needed. Static frames get fewer bits (small file), and complex transitions get more (sharp quality).

---

## Step 1: Configure Output Settings

Navigate to **Settings > Output**. Change the **Output Mode** to `Advanced` and click the **Recording** tab.

### Recording Format

Set this to **Fragmented MP4 (.mp4)** or **MKV**.

:::tip
Fragmented MP4 protects your recording if OBS crashes or closes unexpectedly. With standard MP4, a crash means the entire file is corrupted and unrecoverable. Fragmented MP4 saves the data in chunks, so you only lose the last few seconds at worst.
:::

### Video Encoder

Choose the best encoder available on your system:

| GPU/System | Recommended Encoder | Notes |
| :--- | :--- | :--- |
| **NVIDIA GPU** | NVIDIA NVENC H.264 (or HEVC) | Hardware-accelerated, minimal CPU impact |
| **macOS** | Apple VT H.264 Hardware Encoder | Native hardware encoding via VideoToolbox |
| **CPU only** | x264 | Software encoding, higher CPU usage (last resort) |

### Rate Control (The Key Setting)

This is the most important setting for code recordings. **Do NOT use CBR**. Instead:

- **Windows / NVIDIA GPU:** Use **CQP** (Constant Quantization Parameter).
- **x264 (CPU encoding):** Use **CRF** (Constant Rate Factor).

Both methods work on the same principle: you set a quality target, and the encoder dynamically adjusts the bitrate to maintain that quality level.

### CQ Level / CRF Value

Set this between **20 and 23** for the optimal balance:

| Value Range | Quality | File Size | Use Case |
| :--- | :--- | :--- | :--- |
| **16–18** | Near-lossless | Heavy | Archival quality, post-production editing |
| **20–23** | Excellent (sweet spot) | Moderate | Tutorials, screencasts, YouTube uploads |
| **25+** | Noticeable degradation | Small | Text starts looking blurry, avoid for code |

:::important
For code recordings, **never go above 23**. Text rendering is extremely sensitive to compression artifacts. What looks acceptable for gameplay footage will turn your code into an unreadable blur at higher values.
:::

### Additional Encoder Settings

- **Keyframe Interval:** `2` seconds.
- **Profile:** `high`.

---

## Step 2: Configure Video Settings

Navigate to **Settings > Video**.

### Base (Canvas) Resolution

Set this to your **monitor's native resolution** (e.g., 1920x1080, 2560x1440, or 3840x2160).

### Output (Scaled) Resolution

For code tutorials, set this to the **same value as your Base Resolution**. This is critical.

:::warning
Downscaling (e.g., from 4K to 1080p) causes small text characters to "dance" or appear blurry between frames. The scaling algorithm cannot perfectly map every thin font stroke to fewer pixels, which creates a shimmering effect that makes code nearly impossible to read.
:::

If you absolutely must downscale (e.g., for upload size constraints), use **Lanczos (36 samples)** as the Downscale Filter. It produces the sharpest results among all available filters.

### Frame Rate (FPS)

Set **Common FPS Values** to `30`.

For programming tutorials and screencasts, 60 FPS is unnecessary. Your screen content is mostly static text with occasional mouse movement and scrolling. At 30 FPS:

- Mouse movement remains perfectly smooth.
- File size is reduced by approximately **50%** compared to 60 FPS.
- Encoding overhead is halved, freeing CPU/GPU resources.

:::tip
Save 60 FPS for content with fast motion (gaming, animations, live UI interactions). For code walkthroughs, 30 FPS is the professional standard used by most top programming channels.
:::

---

## Step 3: Configure Color Settings

Getting color settings right ensures your editor theme (VS Code, IntelliJ, Vim, etc.) looks exactly as intended in the final recording.

Navigate to **Settings > Advanced**.

| Setting | Recommended Value | Why |
| :--- | :--- | :--- |
| **Color Format** | NV12 | Most compatible format across encoders and players |
| **Color Space** | 709 | Standard for HD/web content (BT.709) |
| **Color Range** | Limited | Prevents blacks from looking washed out or crushed |

:::note
Setting Color Range to "Full" might seem like the better option, but many web players (YouTube, browsers) incorrectly interpret Full range, causing dark theme backgrounds to appear either washed out (gray instead of black) or overly crushed (losing shadow detail). **Limited** range is the safe, compatible choice.
:::

---

## Bonus Tips: Make Your Text Even Sharper

Beyond OBS settings, how you set up your screen before recording has a massive impact on text readability.

### 1. Increase Your Editor Font Size

Bump your code editor zoom by **10–20%** beyond your normal working size. What looks perfectly readable on your monitor at arm's length will appear small in a YouTube embed or a Teams call window.

```
// VS Code: Add to settings.json
{
  "editor.fontSize": 16,       // up from default 14
  "terminal.integrated.fontSize": 15
}
```

### 2. Use High-Contrast Themes

Dark themes with vibrant, saturated colors record significantly better than pastel or low-contrast themes. The compression algorithm preserves sharp color boundaries better when there's strong contrast between the text and background.

**Recommended themes for recording:**

- **Night Owl** — Rich blues with high-contrast syntax colors.
- **Dracula** — Deep purple background with vivid neon accents.
- **Tokyo Night** — Balanced dark theme with excellent color separation.
- **One Dark Pro** — High contrast with well-differentiated token colors.

### 3. Disable Font Anti-Aliasing (Edge Case)

If you're recording at a very low output resolution (720p or below), font anti-aliasing (font smoothing) can actually make text appear blurrier by adding semi-transparent pixels around character edges. In these cases, consider disabling it in your editor settings.

```
// VS Code: Disable anti-aliasing
{
  "editor.fontLigatures": false,
  "workbench.fontAliasing": "none"
}
```

:::caution
Only disable anti-aliasing at low resolutions. At 1080p and above, anti-aliasing makes text look *better*, not worse.
:::

---

## Quick Reference: Complete OBS Settings Cheat Sheet

| Category | Setting | Value |
| :--- | :--- | :--- |
| **Output** | Output Mode | Advanced |
| | Recording Format | Fragmented MP4 |
| | Encoder | NVENC H.264 / Apple VT / x264 |
| | Rate Control | CQP (GPU) or CRF (CPU) |
| | CQ/CRF Level | 20–23 |
| | Keyframe Interval | 2s |
| | Profile | High |
| **Video** | Base Resolution | Native monitor resolution |
| | Output Resolution | Same as base (no scaling) |
| | Downscale Filter | Lanczos (if scaling) |
| | FPS | 30 |
| **Advanced** | Color Format | NV12 |
| | Color Space | 709 |
| | Color Range | Limited |

---

## Conclusion

The difference between a blurry code recording and a razor-sharp one comes down to **three decisions**: using quality-based rate control (CQP/CRF) instead of constant bitrate, keeping your output resolution at native without downscaling, and recording at 30 FPS instead of 60.

These settings ensure every character in your code editor is perfectly legible while keeping file sizes manageable. Combined with a high-contrast theme and slightly larger font size, your recordings will look professional and be easy to follow for your audience.
