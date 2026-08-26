"""Chunking teks dokumen jadi potongan kecil untuk embedding (Fase 2).

Strategi: fixed-size character chunking dengan overlap, tapi mencoba
memotong di batas paragraf/kalimat kalau memungkinkan agar konteks
tidak terpotong di tengah kalimat.
"""


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 150) -> list[str]:
    """
    Pecah teks panjang menjadi list chunk.

    chunk_size: target panjang tiap chunk (karakter)
    overlap: jumlah karakter yang tumpang tindih antar chunk berurutan,
             supaya konteks di batas chunk tidak hilang total.
    """
    text = text.strip()
    if not text:
        return []

    # Split dasar per paragraf dulu supaya lebih natural
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) + 1 <= chunk_size:
            current = f"{current}\n{para}" if current else para
        else:
            if current:
                chunks.append(current)
            # kalau satu paragraf saja sudah lebih besar dari chunk_size, potong paksa
            if len(para) > chunk_size:
                for i in range(0, len(para), chunk_size - overlap):
                    chunks.append(para[i:i + chunk_size])
                current = ""
            else:
                current = para

    if current:
        chunks.append(current)

    # Tambahkan overlap antar chunk berurutan
    if overlap > 0 and len(chunks) > 1:
        overlapped = [chunks[0]]
        for i in range(1, len(chunks)):
            prev_tail = chunks[i - 1][-overlap:]
            overlapped.append(prev_tail + "\n" + chunks[i])
        return overlapped

    return chunks
