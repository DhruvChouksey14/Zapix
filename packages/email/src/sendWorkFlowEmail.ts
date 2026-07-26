import { transporter } from "./transporter.js";
import { workflowTemplate } from "./templates/workflowsTemplate.js";

export async function sendWorkflowEmail(
    to: string,
    subject: string,
    body: string
) {
    await transporter.sendMail({
        from: `"Zapix" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html: workflowTemplate(body),
    });
}
