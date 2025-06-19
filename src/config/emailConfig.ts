export const emailConfig = {
  IS_EMAIL_USE_SMTP: process.env.IS_EMAIL_USE_SMTP || "on",
  EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || "465"),
  FROM_EMAIL: process.env.FROM_EMAIL || "patel58307024@gmail.com",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "jhforunscewvgkkp",
};
