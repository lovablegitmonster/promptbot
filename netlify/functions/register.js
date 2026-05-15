const fetch = require("node-fetch");
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

const command = {
  name: "prompt",
  description: "Get a random 1–3 word/phrase prompt",
  type: 1,
  options: [
    {
      name: "category",
      description: "Source to pull from",
      type: 3,
      required: false,
      choices: [
        { name: "🎲 Random (everything)", value: "all" },
        { name: "📖 Real Dictionary", value: "dictionary" },
        { name: "🎬 Movies (all genres)", value: "movies" },
        { name: "🎨 Pictionary", value: "pictionary" },
        { name: "🎭 Charades", value: "charades" },
        { name: "💬 Catchphrase", value: "catchphrase" },
        { name: "🐾 Animals", value: "animals" },
        { name: "🍜 Food", value: "food" },
        { name: "🌍 Places", value: "places" },
        { name: "🎄 Holidays", value: "holidays" },
      ]
    },
    {
      name: "difficulty",
      description: "Difficulty or movie genre (where applicable)",
      type: 3,
      required: false,
      choices: [
        // Difficulty
        { name: "Easy", value: "easy" },
        { name: "Medium", value: "medium" },
        { name: "Hard", value: "hard" },
        // Movie genres (doubles as difficulty param)
        { name: "🎬 Action", value: "action" },
        { name: "😱 Horror", value: "horror" },
        { name: "😂 Comedy", value: "comedy" },
        { name: "🎭 Drama", value: "drama" },
        { name: "🚀 Sci-Fi", value: "scifi" },
        { name: "💕 Romance", value: "romance" },
        { name: "🗡️ Thriller", value: "thriller" },
        { name: "✨ Animated", value: "animated" },
        { name: "🏆 Classic", value: "classic" },
      ]
    }
  ]
};

async function register() {
  const res = await fetch(`https://discord.com/api/v10/applications/${CLIENT_ID}/commands`, {
    method: "POST",
    headers: { Authorization: `Bot ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
  console.log("Registered:", await res.json());
}
register();