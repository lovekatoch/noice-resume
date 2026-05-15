function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

export const config = {
  botToken: requireEnv("DISCORD_BOT_TOKEN"),
  guildId: requireEnv("DISCORD_GUILD_ID"),
  resumeReviewerRoleId: requireEnv("RESUME_REVIEWER_ROLE_ID"),
  leaderboardChannelId: requireEnv("LEADERBOARD_CHANNEL_ID"),
  baseUrl: requireEnv("NOICERESUME_BASE_URL"),
  webhookSecret: requireEnv("REFERRAL_WEBHOOK_SECRET"),
  webhookUrl: requireEnv("REFERRAL_WEBHOOK_URL"),
  rewardDays: 7,
};
