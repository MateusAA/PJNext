import 'server-only';

type Decision = 'approved' | 'rejected';

function escapeHtml(value: string) {
    return value.replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    })[character] ?? character);
}

export async function sendCustomerDecisionEmail({
    to,
    customerName,
    decision,
}: {
    to: string;
    customerName: string;
    decision: Decision;
}): Promise<'sent' | 'not_configured' | 'failed'> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) return 'not_configured';

    const approved = decision === 'approved';
    const subject = approved ? 'Seu cadastro foi aprovado' : 'Atualização sobre seu cadastro';
    const message = approved
        ? 'Seu cadastro foi aprovado. Nossa equipe seguirá com o atendimento.'
        : 'Neste momento, não foi possível aprovar seu cadastro. Para mais informações, entre em contato com nossa equipe.';
    const safeName = escapeHtml(customerName);

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from,
                to: [to],
                subject,
                html: `<p>Olá, ${safeName}.</p><p>${message}</p><p>Atenciosamente,<br/>Equipe de atendimento</p>`,
                text: `Olá, ${customerName}.\n\n${message}\n\nAtenciosamente,\nEquipe de atendimento`,
            }),
            signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
            console.error('Resend rejected the customer decision email:', response.status);
            return 'failed';
        }
        return 'sent';
    } catch (error) {
        console.error('Failed to send customer decision email:', error);
        return 'failed';
    }
}
