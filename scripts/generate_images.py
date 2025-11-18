import math
import struct
import zlib
from pathlib import Path

# Simple 5x7 font patterns
FONT = {
    "A": [
        "01110",
        "10001",
        "10001",
        "11111",
        "10001",
        "10001",
        "10001",
    ],
    "B": [
        "11110",
        "10001",
        "10001",
        "11110",
        "10001",
        "10001",
        "11110",
    ],
    "C": [
        "01110",
        "10001",
        "10000",
        "10000",
        "10000",
        "10001",
        "01110",
    ],
    "D": [
        "11100",
        "10010",
        "10001",
        "10001",
        "10001",
        "10010",
        "11100",
    ],
    "E": [
        "11111",
        "10000",
        "10000",
        "11110",
        "10000",
        "10000",
        "11111",
    ],
    "F": [
        "11111",
        "10000",
        "10000",
        "11110",
        "10000",
        "10000",
        "10000",
    ],
    "G": [
        "01110",
        "10001",
        "10000",
        "10111",
        "10001",
        "10001",
        "01110",
    ],
    "H": [
        "10001",
        "10001",
        "10001",
        "11111",
        "10001",
        "10001",
        "10001",
    ],
    "I": [
        "01110",
        "00100",
        "00100",
        "00100",
        "00100",
        "00100",
        "01110",
    ],
    "J": [
        "00111",
        "00010",
        "00010",
        "00010",
        "10010",
        "10010",
        "01100",
    ],
    "K": [
        "10001",
        "10010",
        "10100",
        "11000",
        "10100",
        "10010",
        "10001",
    ],
    "L": [
        "10000",
        "10000",
        "10000",
        "10000",
        "10000",
        "10000",
        "11111",
    ],
    "M": [
        "10001",
        "11011",
        "10101",
        "10101",
        "10001",
        "10001",
        "10001",
    ],
    "N": [
        "10001",
        "11001",
        "10101",
        "10011",
        "10001",
        "10001",
        "10001",
    ],
    "O": [
        "01110",
        "10001",
        "10001",
        "10001",
        "10001",
        "10001",
        "01110",
    ],
    "P": [
        "11110",
        "10001",
        "10001",
        "11110",
        "10000",
        "10000",
        "10000",
    ],
    "Q": [
        "01110",
        "10001",
        "10001",
        "10001",
        "10101",
        "10010",
        "01101",
    ],
    "R": [
        "11110",
        "10001",
        "10001",
        "11110",
        "10100",
        "10010",
        "10001",
    ],
    "S": [
        "01110",
        "10001",
        "10000",
        "01110",
        "00001",
        "10001",
        "01110",
    ],
    "T": [
        "11111",
        "00100",
        "00100",
        "00100",
        "00100",
        "00100",
        "00100",
    ],
    "U": [
        "10001",
        "10001",
        "10001",
        "10001",
        "10001",
        "10001",
        "01110",
    ],
    "V": [
        "10001",
        "10001",
        "10001",
        "10001",
        "10001",
        "01010",
        "00100",
    ],
    "W": [
        "10001",
        "10001",
        "10001",
        "10101",
        "10101",
        "10101",
        "01010",
    ],
    "X": [
        "10001",
        "10001",
        "01010",
        "00100",
        "01010",
        "10001",
        "10001",
    ],
    "Y": [
        "10001",
        "10001",
        "01010",
        "00100",
        "00100",
        "00100",
        "00100",
    ],
    "Z": [
        "11111",
        "00001",
        "00010",
        "00100",
        "01000",
        "10000",
        "11111",
    ],
    "0": [
        "01110",
        "10001",
        "10011",
        "10101",
        "11001",
        "10001",
        "01110",
    ],
    "1": [
        "00100",
        "01100",
        "00100",
        "00100",
        "00100",
        "00100",
        "01110",
    ],
    "2": [
        "01110",
        "10001",
        "00001",
        "00010",
        "00100",
        "01000",
        "11111",
    ],
    "3": [
        "11110",
        "00001",
        "00001",
        "00110",
        "00001",
        "00001",
        "11110",
    ],
    "4": [
        "10001",
        "10001",
        "10001",
        "11111",
        "00001",
        "00001",
        "00001",
    ],
    "5": [
        "11111",
        "10000",
        "11110",
        "00001",
        "00001",
        "10001",
        "01110",
    ],
    "6": [
        "01110",
        "10000",
        "11110",
        "10001",
        "10001",
        "10001",
        "01110",
    ],
    "7": [
        "11111",
        "00001",
        "00010",
        "00100",
        "01000",
        "01000",
        "01000",
    ],
    "8": [
        "01110",
        "10001",
        "10001",
        "01110",
        "10001",
        "10001",
        "01110",
    ],
    "9": [
        "01110",
        "10001",
        "10001",
        "01111",
        "00001",
        "00001",
        "01110",
    ],
    " ": [
        "00000",
        "00000",
        "00000",
        "00000",
        "00000",
        "00000",
        "00000",
    ],
    "-": [
        "00000",
        "00000",
        "00000",
        "01110",
        "00000",
        "00000",
        "00000",
    ],
}


def clamp(value: float) -> int:
    return max(0, min(255, int(round(value))))


def blend_pixel(data, width, x, y, color):
    if x < 0 or y < 0 or x >= width:
        return
    idx = (y * width + x) * 4
    sr, sg, sb, sa = color
    sa /= 255.0
    dr, dg, db, da = data[idx:idx+4]
    da /= 255.0
    out_a = sa + da * (1 - sa)
    if out_a == 0:
        data[idx:idx+4] = [0, 0, 0, 0]
        return
    out_r = (sr * sa + dr * da * (1 - sa)) / out_a
    out_g = (sg * sa + dg * da * (1 - sa)) / out_a
    out_b = (sb * sa + db * da * (1 - sa)) / out_a
    data[idx:idx+4] = [out_r, out_g, out_b, out_a * 255]


def fill_background(width, height, top_color, bottom_color):
    data = [0.0] * (width * height * 4)
    for y in range(height):
        t = y / (height - 1)
        r = top_color[0] * (1 - t) + bottom_color[0] * t
        g = top_color[1] * (1 - t) + bottom_color[1] * t
        b = top_color[2] * (1 - t) + bottom_color[2] * t
        for x in range(width):
            idx = (y * width + x) * 4
            data[idx:idx+4] = [r, g, b, 255]
    return data


def add_glow(data, width, height, cx, cy, radius, color, intensity=1.0):
    x_start = max(int(cx - radius - 1), 0)
    x_end = min(int(cx + radius + 1), width - 1)
    y_start = max(int(cy - radius - 1), 0)
    y_end = min(int(cy + radius + 1), height - 1)
    for y in range(y_start, y_end + 1):
        for x in range(x_start, x_end + 1):
            dist = math.hypot(x - cx, y - cy)
            if dist <= radius:
                falloff = (1 - dist / radius) ** 2
                a = color[3] * falloff * intensity
                blend_pixel(data, width, x, y, (color[0], color[1], color[2], a))


def draw_rounded_rect(data, width, height, x1, y1, x2, y2, radius, color):
    for y in range(max(int(y1), 0), min(int(y2), height)):
        for x in range(max(int(x1), 0), min(int(x2), width)):
            dx = min(x - x1, x2 - x - 1)
            dy = min(y - y1, y2 - y - 1)
            if dx >= radius or dy >= radius:
                inside = True
            else:
                corner_dx = radius - dx
                corner_dy = radius - dy
                inside = corner_dx * corner_dx + corner_dy * corner_dy <= radius * radius
            if inside:
                blend_pixel(data, width, x, y, color)


def draw_text(data, width, text, x, y, color, scale=4, letter_spacing=1):
    cursor_x = x
    for char in text:
        glyph = FONT.get(char.upper(), FONT[" "])
        for gy, row in enumerate(glyph):
            for gx, px in enumerate(row):
                if px == "1":
                    for sy in range(scale):
                        for sx in range(scale):
                            blend_pixel(
                                data,
                                width,
                                cursor_x + gx * scale + sx,
                                y + gy * scale + sy,
                                color,
                            )
        cursor_x += (len(glyph[0]) * scale) + letter_spacing * scale


def save_png(path: Path, data, width, height):
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        start = y * width * 4
        for x in range(width):
            idx = start + x * 4
            raw.extend(
                [
                    clamp(data[idx]),
                    clamp(data[idx + 1]),
                    clamp(data[idx + 2]),
                    clamp(data[idx + 3]),
                ]
            )
    compressor = zlib.compressobj()
    compressed = compressor.compress(bytes(raw)) + compressor.flush()

    def chunk(chunk_type: bytes, payload: bytes) -> bytes:
        return (
            struct.pack(">I", len(payload))
            + chunk_type
            + payload
            + struct.pack(">I", zlib.crc32(chunk_type + payload) & 0xFFFFFFFF)
        )

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(
            chunk(
                b"IHDR",
                struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0),
            )
        )
        f.write(chunk(b"IDAT", compressed))
        f.write(chunk(b"IEND", b""))


# --- Logo PNG (local-only helper) ---
logo_w, logo_h = 512, 512
logo_bg_top = (52, 232, 255)
logo_bg_bottom = (10, 46, 128)
logo_data = fill_background(logo_w, logo_h, logo_bg_top, logo_bg_bottom)

add_glow(logo_data, logo_w, logo_h, 120, 120, 140, (255, 255, 255, 82), 1.2)
add_glow(logo_data, logo_w, logo_h, 400, 160, 160, (0, 198, 255, 120), 1.0)
add_glow(logo_data, logo_w, logo_h, 220, 400, 180, (4, 22, 72, 170), 1.0)

draw_rounded_rect(logo_data, logo_w, logo_h, 92, 92, 420, 420, 70, (255, 255, 255, 54))
draw_rounded_rect(logo_data, logo_w, logo_h, 120, 120, 392, 392, 58, (255, 255, 255, 92))

for offset in range(5):
    draw_rounded_rect(
        logo_data,
        logo_w,
        logo_h,
        142 + offset * 6,
        176 + offset * 8,
        382 + offset * 6,
        188 + offset * 8,
        18,
        (255, 255, 255, 44 - offset * 6),
    )

add_glow(logo_data, logo_w, logo_h, 256, 210, 94, (255, 255, 255, 88), 1.0)
draw_text(logo_data, logo_w, "WOLT", 150, 170, (255, 255, 255, 255), scale=6)
draw_text(logo_data, logo_w, "GUESS", 148, 242, (255, 255, 255, 230), scale=5)
draw_text(logo_data, logo_w, "FOOD MAP", 154, 310, (0, 31, 63, 220), scale=4)

token_colors = [
    (255, 255, 255, 150),
    (255, 255, 255, 88),
]
for i, cx in enumerate([190, 256, 322]):
    add_glow(logo_data, logo_w, logo_h, cx, 110, 36, token_colors[i % 2], 1.0)

save_png(Path("attached_assets/logo-game.png"), logo_data, logo_w, logo_h)

# --- Social card PNG (local-only helper) ---
card_w, card_h = 1200, 630
card_data = fill_background(card_w, card_h, (52, 232, 255), (8, 43, 114))

add_glow(card_data, card_w, card_h, 180, 140, 220, (255, 255, 255, 96), 1.0)
add_glow(card_data, card_w, card_h, 980, 180, 200, (0, 198, 255, 130), 0.9)
add_glow(card_data, card_w, card_h, 520, 560, 280, (4, 20, 70, 200), 1.0)

card_margin = 110
draw_rounded_rect(card_data, card_w, card_h, card_margin, 150, card_w - card_margin, 520, 44, (255, 255, 255, 60))
draw_rounded_rect(card_data, card_w, card_h, card_margin + 14, 166, card_w - card_margin - 14, 504, 38, (255, 255, 255, 86))

draw_rounded_rect(card_data, card_w, card_h, card_margin + 40, 214, card_w - card_margin - 40, 234, 16, (0, 0, 0, 40))
draw_rounded_rect(card_data, card_w, card_h, card_margin + 40, 420, card_w - card_margin - 40, 440, 16, (0, 0, 0, 30))

add_glow(card_data, card_w, card_h, 220, 170, 130, (255, 255, 255, 130), 1.0)
draw_text(card_data, card_w, "WOLT GUESS", 190, 186, (255, 255, 255, 255), scale=6)
draw_text(card_data, card_w, "MAP THE RESTAURANT", 190, 254, (255, 255, 255, 230), scale=5)
draw_text(card_data, card_w, "10 DISHES • TEL AVIV EDITION", 190, 316, (0, 31, 63, 220), scale=4)

chip_centers = [(270 + i * 180, 392) for i in range(4)]
chip_colors = [
    (255, 255, 255, 210),
    (0, 194, 232, 210),
    (0, 90, 180, 210),
    (255, 173, 94, 220),
]
for (cx, cy), col in zip(chip_centers, chip_colors):
    add_glow(card_data, card_w, card_h, cx, cy, 70, (col[0], col[1], col[2], 120), 1.0)
    draw_rounded_rect(card_data, card_w, card_h, cx - 60, cy - 20, cx + 60, cy + 20, 18, (255, 255, 255, 200))
    add_glow(card_data, card_w, card_h, cx - 20, cy - 4, 24, col, 1.0)
    add_glow(card_data, card_w, card_h, cx + 22, cy + 6, 18, (0, 0, 0, 70), 1.0)

draw_text(card_data, card_w, "GLASSY QUIZ", 200, 468, (255, 255, 255, 230), scale=3)
draw_text(card_data, card_w, "TEL AVIV FLAVORS", 200, 508, (255, 255, 255, 190), scale=3)
draw_text(card_data, card_w, "GUESS & SHARE", 520, 488, (255, 255, 255, 220), scale=3)

save_png(Path("attached_assets/social-card.png"), card_data, card_w, card_h)
