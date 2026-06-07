from faster_whisper import WhisperModel

AUDIO_FILE = "temp/50.wav"
VTT_FILE = "temp/50.vtt"

model = WhisperModel("base", device="cpu", compute_type="int8")

segments, info = model.transcribe(AUDIO_FILE, beam_size=5)


def format_time(seconds):

    hours = int(seconds // 3600)

    minutes = int((seconds % 3600) // 60)

    secs = seconds % 60

    return f"{hours:02}:{minutes:02}:{secs:06.3f}".replace(".", ",")


with open(VTT_FILE, "w", encoding="utf-8") as f:

    f.write("WEBVTT\n\n")

    for segment in segments:

        f.write(f"{format_time(segment.start)} --> " f"{format_time(segment.end)}\n")

        f.write(segment.text.strip())

        f.write("\n\n")

print(f"Arquivo criado: {VTT_FILE}")
