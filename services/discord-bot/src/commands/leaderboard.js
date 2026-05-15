import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

const leaderboard = new Map();

export function recordReferral(referrerDiscordId, referrerTag) {
  const entry = leaderboard.get(referrerDiscordId) || {
    tag: referrerTag,
    count: 0,
  };
  entry.count += 1;
  leaderboard.set(referrerDiscordId, entry);
}

export function getLeaderboard() {
  return [...leaderboard.entries()]
    .map(([id, entry]) => ({ id, ...entry }))
    .sort((a, b) => b.count - a.count);
}

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Show the top referrers this month");

export async function execute(interaction) {
  const entries = getLeaderboard();

  if (entries.length === 0) {
    await interaction.reply({
      content: "No referrals yet. Use `/invite` to refer a friend and be the first!",
      ephemeral: true,
    });
    return;
  }

  const lines = entries.map((e, i) => {
    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
    return `${medal} **${e.tag}** — ${e.count} referral${e.count === 1 ? "" : "s"}`;
  });

  const embed = new EmbedBuilder()
    .setColor(0x1ed760)
    .setTitle("Top Referrers")
    .setDescription(lines.slice(0, 10).join("\n"))
    .setFooter({ text: "NoiceResume Referral Leaderboard" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
