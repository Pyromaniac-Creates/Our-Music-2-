import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { subscription, title, body, url } = req.body;
  try {
    await webpush.sendNotification(
      JSON.parse(subscription),
      JSON.stringify({ title, body, url })
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Push error:", err);
    res.status(500).json({ error: err.message });
  }
}
