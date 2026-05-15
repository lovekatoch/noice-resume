import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { config } from "./config.js";
import { data as inviteData, execute as inviteExecute, getPendingReferrals } from "./commands/invite.js";
import { data as leaderboardData, execute as leaderboardExecute, recordReferral } from "./commands/leaderboard.js";

const commands = [
  { data: inviteData, execute: inviteExecute },
  { data: leaderboardData, execute: leaderboardExecute },
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

client.once(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(config.botToken);
  try {
    await rest.put(Routes.applicationGuildCommands(client.user.id, config.guildId), {
      body: commands.map((c) => c.data.toJSON()),
    });
    console.log("Slash commands registered.");
  } catch (err) {
    console.error("Failed to register commands:", err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.find((c) => c.data.name === interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error executing ${interaction.commandName}:`, err);
    const reply = interaction.replied
      ? interaction.followUp.bind(interaction)
      : interaction.reply.bind(interaction);
    await reply({
      content: "Something went wrong. Please try again.",
      ephemeral: true,
    });
  }
});

async function grantReward(discordUserId, durationDays) {
  try {
    const guild = await client.guilds.fetch(config.guildId);
    const member = await guild.members.fetch(discordUserId);
    await member.roles.add(config.resumeReviewerRoleId);
    console.log(`Granted @Resume-Reviewer to ${discordUserId} for ${durationDays} days`);

    const expiryMs = durationDays * 24 * 60 * 60 * 1000;
    setTimeout(async () => {
      try {
        await member.roles.remove(config.resumeReviewerRoleId);
        console.log(`Removed @Resume-Reviewer from ${discordUserId} after ${durationDays} days`);
      } catch (err) {
        console.error(`Failed to remove role from ${discordUserId}:`, err);
      }
    }, expiryMs);
  } catch (err) {
    console.error(`Failed to grant reward to ${discordUserId}:`, err);
  }
}

async function handleWebhookEvent(event) {
  const { token, friendDiscordId } = event;
  const pending = getPendingReferrals();
  const referral = pending.get(token);

  if (!referral || referral.completed) {
    console.warn(`Invalid or already-used token: ${token}`);
    return false;
  }

  referral.completed = true;

  await grantReward(referral.referrerDiscordId, config.rewardDays);
  recordReferral(referral.referrerDiscordId, referral.referrerTag);

  if (friendDiscordId) {
    await grantReward(friendDiscordId, config.rewardDays);
  }

  console.log(`Referral completed: ${referral.referrerTag} → ${referral.friendEmail}`);
  return true;
}

const http = await import("node:http");
const server = http.createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/webhook") {
    res.writeHead(405);
    res.end();
    return;
  }

  const auth = req.headers["authorization"];
  if (auth !== `Bearer ${config.webhookSecret}`) {
    res.writeHead(401);
    res.end("Unauthorized");
    return;
  }

  let body = "";
  for await (const chunk of req) body += chunk;

  try {
    const event = JSON.parse(body);
    const ok = await handleWebhookEvent(event);
    res.writeHead(ok ? 200 : 400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok }));
  } catch (err) {
    console.error("Webhook error:", err);
    res.writeHead(500);
    res.end("Internal error");
  }
});

const PORT = parseInt(process.env.WEBHOOK_PORT || "3456", 10);
server.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}`);
});

client.login(config.botToken);
