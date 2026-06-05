import requests
import time

# =========================
# CONFIGURAÇÃO
# =========================

BUNNY_LIBRARY_ID = "665190"
BUNNY_API_KEY = "7f302752-3b51-403f-b79dd8362ac6-ff4f-4424"

YOUTUBE_URL = (
    "https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
)

# =========================
# CRIAR VÍDEO VAZIO
# =========================

create_url = (
    f"https://video.bunnycdn.com/library/"
    f"{BUNNY_LIBRARY_ID}/videos"
)

headers = {
    "AccessKey": BUNNY_API_KEY,
    "Content-Type": "application/json"
}

payload = {
    "title": "Teste Importacao YouTube"
}

response = requests.post(
    create_url,
    headers=headers,
    json=payload
)

print("CREATE:", response.status_code)
print(response.text)

response.raise_for_status()

video_id = response.json()["guid"]

print(f"\nVIDEO ID: {video_id}")

# =========================
# IMPORTAR DO YOUTUBE
# =========================

fetch_url = (
    f"https://video.bunnycdn.com/library/"
    f"{BUNNY_LIBRARY_ID}/videos/"
    f"{video_id}/fetch"
)

payload = {
    "url": YOUTUBE_URL
}

response = requests.post(
    fetch_url,
    headers=headers,
    json=payload
)

print("\nFETCH:")
print(response.status_code)
print(response.text)

# =========================
# CONSULTAR STATUS
# =========================

status_url = (
    f"https://video.bunnycdn.com/library/"
    f"{BUNNY_LIBRARY_ID}/videos/"
    f"{video_id}"
)

print("\nAguardando processamento...\n")

for i in range(20):

    response = requests.get(
        status_url,
        headers=headers
    )

    data = response.json()

    print(
        f"Processado: "
        f"{data.get('encodeProgress', 0)}%"
    )

    print(
        f"Status: "
        f"{data.get('status')}"
    )

    if data.get("status") == 4:
        print("\nVIDEO PRONTO!")
        break

    time.sleep(10)