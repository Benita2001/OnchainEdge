const SOLANA_ADDRESS_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

async function sendTelegramMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN!;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
    }),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    message?: {
      chat?: {
        id?: number;
      };
      text?: string;
    };
  };

  const chatId = body.message?.chat?.id;
  const text = body.message?.text?.trim() ?? "";

  if (!chatId) {
    return Response.json({ ok: true });
  }

  if (!SOLANA_ADDRESS_REGEX.test(text)) {
    await sendTelegramMessage(
      chatId,
      "Send me any Solana token address to get the holder intelligence signal.",
    );

    return Response.json({ ok: true });
  }

  const origin = new URL(request.url).origin;
  const analyzeResponse = await fetch(`${origin}/api/analyze/${text}`, {
    cache: "no-store",
  });

  if (!analyzeResponse.ok) {
    await sendTelegramMessage(
      chatId,
      "Token not found or data unavailable. Try another address.",
    );

    return Response.json({ ok: true });
  }

  const analysis = (await analyzeResponse.json()) as {
    overview?: Record<string, unknown> | null;
    signal?: {
      signal: string;
      confidence: number;
      narrative: string;
    } | null;
  };

  const cardResponse = await fetch(`${origin}/api/card/${text}`, {
    cache: "no-store",
  });

  if (!cardResponse.ok) {
    await sendTelegramMessage(
      chatId,
      "Card generation failed. Try again in a moment.",
    );

    return Response.json({ ok: true });
  }

  const imageBuffer = await cardResponse.arrayBuffer();
  const formData = new FormData();

  formData.append("chat_id", String(chatId));
  formData.append(
    "caption",
    `⬡ ${analysis.overview?.name ?? "Unknown"} (${analysis.overview?.symbol ?? "UNKNOWN"}) — ${analysis.signal?.signal?.replaceAll("_", " ") ?? "NO SIGNAL"} ${analysis.signal?.confidence ?? 0}%
${analysis.signal?.narrative ?? "No narrative available."}
Full analysis: onchainedge.vercel.app/analyze/${text}`,
  );
  formData.append(
    "photo",
    new Blob([imageBuffer], { type: "image/png" }),
    "onchainedge-card.png",
  );

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN!}/sendPhoto`, {
    method: "POST",
    body: formData,
  });

  return Response.json({ ok: true });
}
