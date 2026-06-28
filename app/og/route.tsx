import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "Eddie Marketing Solutions";
  const desc =
    searchParams.get("desc") ??
    "Full-service digital marketing agency";

  const titleSize = title.length > 60 ? 44 : title.length > 40 ? 52 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#3b82f6",
              marginRight: 12,
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "#60a5fa",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            Eddie Marketing Solutions
          </span>
        </div>

        <div
          style={{
            fontSize: titleSize,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: 24,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {desc && (
          <div
            style={{
              fontSize: 22,
              color: "#94a3b8",
              maxWidth: 780,
              lineHeight: 1.5,
            }}
          >
            {desc.length > 120 ? desc.slice(0, 120) + "…" : desc}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 320,
            height: "100%",
            background:
              "linear-gradient(to left, rgba(59,130,246,0.12) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
