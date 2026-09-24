"""Baixa o audio de um video de tweet do X e transcreve com faster-whisper.

Uso:
    python process_x_video.py "<tweet-url>" [--model small|base] [--out <arquivo>]

Saida: imprime o caminho da transcricao salva e o inicio dela (UTF-8).
Se o tweet nao tiver video, imprime SEM_VIDEO e sai.
"""
import argparse
import io
import os
import re
import sys
import tempfile


def clean_url(url: str) -> str:
    url = url.strip()
    url = re.sub(r"\?.*$", "", url)
    return url


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("url", help="URL do tweet (x.com ou twitter.com)")
    ap.add_argument("--model", default="small", choices=["tiny", "base", "small", "medium"])
    ap.add_argument("--out", default=None, help="caminho do arquivo de transcricao")
    args = ap.parse_args()

    url = clean_url(args.url)

    # Diretorio de trabalho
    workdir = tempfile.mkdtemp(prefix="x_video_")
    transcript_path = args.out or os.path.join(workdir, "transcript.txt")

    import yt_dlp  # instalado no venv

    # 1) Baixar apenas o audio (baixo custo, suficiente para transcrever)
    ydl_opts = {
        "format": "ba/b",
        "outtmpl": os.path.join(workdir, "audio.%(ext)s"),
        "quiet": True,
        "no_warnings": True,
        "noprogress": True,
        "noplaylist": True,
    }
    audio_path = None
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            if info and info.get("requested_downloads"):
                audio_path = info["requested_downloads"][0].get("filepath")
    except Exception as e:
        print("SEM_VIDEO:", type(e).__name__, str(e)[:200])
        return 0

    if not audio_path or not os.path.exists(audio_path):
        print("SEM_VIDEO: nenhum arquivo de audio foi baixado (tweet provavelmente sem video)")
        return 0

    # 2) Transcrever com faster-whisper
    from faster_whisper import WhisperModel  # instalado no venv

    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    segments, info_whisper = model.transcribe(audio_path, vad_filter=True)
    lines = []
    for seg in segments:
        lines.append(f"[{seg.start:07.1f}-{seg.end:07.1f}] {seg.text.strip()}")

    with io.open(transcript_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    # 3) Informacoes para o agente
    print("IDIOMA_DETECTADO:", info_whisper.language)
    print("TRANSCRICAO_SALVA:", transcript_path)
    print("SEGMENTOS:", len(lines))
    if lines:
        print("---INICIO DA TRANSCRICAO---")
        print("\n".join(lines[:8]))
        print("---...---")
    return 0


if __name__ == "__main__":
    sys.exit(main())
