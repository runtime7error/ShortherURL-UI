import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "./App.css";

export default function UrlShortener() {
  const [url, setUrl] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const shortenUrl = async (): Promise<void> => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/links/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Falha ao encurtar a URL");

      const data = await res.json();
      setShortUrl(data.shortUrl);
    } catch (error) {
      console.error("Erro ao encurtar a URL", error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <input
        type="url"
        placeholder="Cole sua URL aqui"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        className="input"
      />
      <button onClick={shortenUrl} disabled={loading} className="button">
        {loading ? "Encurtando..." : "Encurtar"}
      </button>
      {shortUrl && (
        <>
          <div className="result">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="short-link"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="copy-button"
            >
              📋
            </button>
          </div>
          <div style={{ marginTop: "16px" }}>
            <QRCodeCanvas value={shortUrl} size={128} />
          </div>
        </>
      )}
    </div>
  );
}
