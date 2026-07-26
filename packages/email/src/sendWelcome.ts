import { transporter } from "./transporter.js";
import { welcomeTemplate } from "./templates/welcomeTemplate.js";

export async function sendWelcomeEmail(
    to: string,
    name: string
) {
    await transporter.sendMail({
        from: `"Zapix" <${process.env.MAIL_USER}>`,
        to,
        subject: "Welcome to Zapix",
        html: welcomeTemplate(name),
    });
}
