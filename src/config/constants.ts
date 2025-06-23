export const EMAILCONSTANT = Object.freeze({
    FORGOT_PASSWORD: { template: "forgot_password", subject: "Forgot password" },
    SEND_OTP: { template: "send_otp", subject: "Send OTP" },
    LOGIN_PASSWORD: { template: "login_password", subject: "Login password" },

});

export const roleTableMap: Record<string, string> = {
  Admin: "admins",
  Teacher: "teachers",
  Student: "students",
  Parent: "parents",
};
