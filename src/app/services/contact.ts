export const CONTACT_FORM_NAME = 'skyenergy-analise';
export const CONTACT_FORM_ENDPOINT = '/netlify-forms.html';

export interface AnalysisRequest {
  name: string;
  email: string;
  phone: string;
  customerType: string;
  energyType: string;
  contactPreference: string;
  message: string;
  consent: boolean;
  'bot-field': string;
}

export function encodeAnalysisRequest(payload: AnalysisRequest): URLSearchParams {
  const form = new URLSearchParams();
  form.set('form-name', CONTACT_FORM_NAME);
  for (const [key, value] of Object.entries(payload)) {
    form.set(key, typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value.trim());
  }
  return form;
}

export async function sendAnalysisRequest(body: URLSearchParams, sender: typeof fetch = fetch): Promise<void> {
  const response = await sender(CONTACT_FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error('O pedido não foi aceite pelo servidor.');
}
