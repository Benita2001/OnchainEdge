export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const webhookUrl = "https://onchainedge.vercel.app/api/telegram";
  const response = await fetch(
    `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}`,
    {
      cache: "no-store",
    },
  );

  const data = await response.json();

  return Response.json(data);
}
