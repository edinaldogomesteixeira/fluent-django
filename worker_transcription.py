import time
import requests
import subprocess
from pathlib import Path
from faster_whisper import WhisperModel

# BASE_URL = "http://2.24.104.26"
BASE_URL = "http://127.0.0.1:8000"


BASE_DIR = Path(__file__).resolve().parent
TEMP_DIR = BASE_DIR / "temp"
TEMP_DIR.mkdir(exist_ok=True)

model = WhisperModel("base", device="cpu", compute_type="int8")


def get_next_transcription():

    response = requests.get(f"{BASE_URL}/api/worker/transcriptions/next/")

    response.raise_for_status()

    data = response.json()

    if not data:
        return None

    return data


def update_status(video_id, status):

    requests.post(
        f"{BASE_URL}/api/worker/videos/{video_id}/status/", json={"status": status}
    )


def extract_audio(video_id, hls_url):

    output_file = TEMP_DIR / f"{video_id}.wav"

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        hls_url,
        "-vn",
        "-acodec",
        "pcm_s16le",
        "-ar",
        "16000",
        "-ac",
        "1",
        str(output_file),
    ]

    subprocess.run(cmd, check=True)

    return str(output_file)


def transcribe_audio(wav_file):

    segments, info = model.transcribe(wav_file, beam_size=5)

    results = []

    for segment in segments:

        results.append(
            {
                "start": float(segment.start),
                "end": float(segment.end),
                "text": segment.text.strip(),
            }
        )

    return {
        "segments": results,
        "language": info.language,
    }


def save_segments(video_id, segments, language_code):

    response = requests.post(
        f"{BASE_URL}/api/worker/videos/{video_id}/segments/",
        json={
            "segments": segments,
            "language_code": language_code,
        },
    )

    response.raise_for_status()


while True:

    try:

        job = get_next_transcription()

        if not job:

            time.sleep(5)

            continue

        video_id = job["id"]

        print(f"Processando vídeo {video_id}")

        update_status(video_id, "transcribing")

        wav_file = extract_audio(video_id, job["hls"])

        print(f"WAV gerado: {wav_file}")

        transcription = transcribe_audio(wav_file)

        segments = transcription["segments"]

        language_code = transcription["language"]

        print(f"Idioma detectado: {language_code}")

        print(f"Segmentos encontrados: {len(segments)}")

        save_segments(video_id, segments, language_code)

        update_status(video_id, "ready")

        print(f"Vídeo {video_id} concluído")

    except Exception as ex:

        print(f"ERRO: {str(ex)}")

        try:

            update_status(video_id, "error")

        except Exception as status_error:

            print(f"Erro ao atualizar status: {status_error}")

    time.sleep(2)
