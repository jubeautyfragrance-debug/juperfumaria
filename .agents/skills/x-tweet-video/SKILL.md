---
name: x-tweet-video
description: Download and transcribe videos from X/Twitter tweets. Use when the user shares an x.com or twitter.com link (with or without video), asks what a tweet video says, or wants a tweet's video content explained/translated. Triggers: "link do x", "tweet", "x.com/", "twitter.com/", "vê o vídeo", "me explica o vídeo", "transcreve". Requires the project venv at ferramentas/MoneyPrinterTurbo/.venv (has yt-dlp + faster-whisper). Always deliver the summary in Portuguese (pt-BR).
---

# X/Twitter Video Transcription

Process any X/Twitter link the user shares: download the video audio, transcribe it locally, and summarize the content in **Portuguese (pt-BR)**.

## When to use

- User pastes an `x.com/...` or `twitter.com/...` link
- User asks what a tweet's video says ("me diga como ele fez", "está em inglês", "me explica")
- User wants the tweet/video content summarized or translated

## Environment (this machine)

- Venv Python (has yt-dlp, faster-whisper, playwright): `C:/Users/leozi/Desktop/free/ferramentas/MoneyPrinterTurbo/.venv/Scripts/python.exe`
- All tools already installed. ffmpeg is NOT installed — yt-dlp must download formats separately (audio-only is enough for transcription).
- Work happens in the Windows temp dir (`%LOCALAPPDATA%\Temp`), then files can be cleaned up.

## Workflow

1. **Extract the tweet URL** from the user's message (strip tracking params like `?s=20`).
2. **Run the helper script**:
   ```bash
   "C:/Users/leozi/Desktop/free/ferramentas/MoneyPrinterTurbo/.venv/Scripts/python.exe" \
     .agents/skills/x-tweet-video/scripts/process_x_video.py "<tweet-url>"
   ```
   The script downloads the best audio stream, transcribes with faster-whisper (small model, CPU), and prints the transcript start + the saved transcript path.
3. **Read the full transcript** from the printed path (it is UTF-8).
4. **Summarize in Portuguese**, honestly:
   - What the video is about and the step-by-step method it teaches (when it teaches one)
   - Flag hype: numbers shown are usually cherry-picked best cases; check whether the video is an ad/affiliate for a tool
   - Relate it to the user's context when relevant (their vault ideas, MoneyPrinterTurbo, etc.)

## Notes / troubleshooting

- **No video in the tweet** → script prints `SEM_VIDEO` / an error. Fall back to reading the tweet text and any linked pages; still answer in Portuguese.
- **Long videos (>~30 min)**: transcription on CPU is slow. Consider `--model base` for speed (lower accuracy) and warn the user it will take a while.
- **X blocks or asks login**: the script uses yt-dlp guest tokens, which normally work for public tweets. If it fails, mention that the video may require login.
- **The tweet has a YouTube link instead of an X video**: tell the user and use the `baoyu-youtube-transcript` skill to fetch that transcript instead.
- Always clean up temporary media files after summarizing (keep the transcript if the user might want it).

## Example output shape (in Portuguese)

- **O que é:** resumo de 1-2 frases
- **Método passo a passo:** passos principais do vídeo
- **Números citados:** com aviso de que são melhores casos
- **⚠️ Atenção:** se for anúncio/afiliado
- **Relação com o seu caso:** se fizer sentido
