import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const base = "http://localhost:3000";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          position: "relative",
          display: "flex",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Background dashboard */}
        <img
          src={`${base}/dashboard2.jpeg`}
          width="1200"
          height="630"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "cover",
            filter: "blur(6px)",
          }}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.85))",
          }}
        />

        {/* Foreground content */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: "80px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          {/* Logo + name */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img src={`${base}/T_logo.png`} width="70" height="70" />

            <div
              style={{
                fontSize: 56,
                fontWeight: 700,
              }}
            >
              Trendsta
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 800,
            }}
          >
            AI Social Growth Intelligence
          </div>

          {/* Subtext */}
          <div
            style={{
              fontSize: 32,
              opacity: 0.85,
            }}
          >
            Discover trends • Generate viral ideas • Grow faster
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}