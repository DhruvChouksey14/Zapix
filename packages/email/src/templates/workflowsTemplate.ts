export function workflowTemplate(body: string) {
    return `
        <h2>Workflow Executed</h2>

        <p>${body}</p>

        <hr/>

        <p>Sent automatically by Zapix.</p>
    `;
}
