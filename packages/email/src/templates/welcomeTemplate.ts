export function welcomeTemplate(name: string) {
    return `
        <h1>Welcome to Zapix</h1>

        <p>Hi ${name},</p>

        <p>
            Welcome to Zapix! Your account has been created successfully.
        </p>

        <p>
            Start building workflows and automate your favorite apps.
        </p>

        <p>Happy Automating!</p>
    `;
}