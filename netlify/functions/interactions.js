const { InteractionType, InteractionResponseType, verifyKey } = require("discord-interactions");
const { generatePrompt } = require("../../words");

const categoryEmoji = {
  pictionary: "🎨",
  charades: "🎭",
  catchphrase: "💬",
  holidays: "🎄",
  animals: "🐾",
  food: "🍜",
  places: "🌍",
  all: "🎲"
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
  const signature = event.headers["x-signature-ed25519"];
  const timestamp = event.headers["x-signature-timestamp"];
  const rawBody = event.body;

  const isValid = await verifyKey(Buffer.from(rawBody), signature, timestamp, PUBLIC_KEY);
  if (!isValid) return { statusCode: 401, body: "Bad request signature" };

  const body = JSON.parse(rawBody);

  if (body.type === InteractionType.PING) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: InteractionResponseType.PONG }),
    };
  }

  if (body.type === InteractionType.APPLICATION_COMMAND && body.data.name === "prompt") {
    const options = body.data.options || [];
    const categoryOpt = options.find(o => o.name === "category")?.value || "all";
    const difficultyOpt = options.find(o => o.name === "difficulty")?.value || null;

    const category = categoryOpt === "all" ? null : categoryOpt;
    const prompt = generatePrompt(category, difficultyOpt);

    const emoji = categoryEmoji[categoryOpt] || "🎲";
    const label = categoryOpt === "all" ? "Random" : categoryOpt.charAt(0).toUpperCase() + categoryOpt.slice(1);
    const diffLabel = difficultyOpt ? ` · ${difficultyOpt}` : "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `${emoji} **[${label}${diffLabel}] Your prompt:** \`${prompt}\``,
        },
      }),
    };
  }

  return { statusCode: 400, body: "Unknown interaction type" };
};