import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { generateReferralToken, buildReferralLink, validateEmail } from "../utils/referral.js";
import { config } from "../config.js";

const pendingReferrals = new Map();

export const data = new SlashCommandBuilder()
  .setName("invite")
  .setDescription("Invite a friend to NoiceResume and earn rewards")
  .addStringOption((option) =>
    option
      .setName("email")
      .setDescription("Your friend's email address")
      .setRequired(true)
  );

export async function execute(interaction) {
  const email = interaction.options.getString("email").trim().toLowerCase();

  if (!validateEmail(email)) {
    await interaction.reply({
      content: "Please provide a valid email address.",
      ephemeral: true,
    });
    return;
  }

  const token = generateReferralToken();
  const link = buildReferralLink(token);

  pendingReferrals.set(token, {
    referrerDiscordId: interaction.user.id,
    referrerTag: interaction.user.tag,
    friendEmail: email,
    createdAt: Date.now(),
    completed: false,
  });

  const embed = new EmbedBuilder()
    .setColor(0x1ed760)
    .setTitle("Referral Link Created")
    .setDescription(
      `Share this link with **${email}**:\n${link}\n\n` +
      `When they build their resume and export a PDF, both of you get **@Resume-Reviewer** ` +
      `role for **${config.rewardDays} days**!`
    )
    .setFooter({ text: "NoiceResume Referral" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

export function getPendingReferrals() {
  return pendingReferrals;
}
