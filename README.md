# Sky Energy — Remodelação Angular (V1)

Primeiro protótipo independente, desenvolvido em Angular, para remodelação do website [skyenergy.pt](https://skyenergy.pt/).

## Estado e limites

- A comunicação baseia-se na informação indexada publicamente do website: análise de faturas, consumos, preços e condições, para particulares e empresas; eletricidade e gás.
- Não se presumem instalações fotovoltaicas, marcas parceiras, descontos, poupanças garantidas nem dados de contacto não verificados.
- **O símbolo desenhado em CSS/SVG e a assinatura verbal não são um ficheiro oficial de marca**: substituir após receber o logótipo original.
- O original devolveu erros de rede durante a análise; é indispensável uma revisão de conteúdo com o responsável antes de substituir o website atual.
- **Protótipo com `noindex`**: rever `src/index.html` e `public/robots.txt` apenas após validação do domínio e da publicação.
- Os textos de privacidade são uma nota informativa provisória, não uma política de privacidade completa. Confirmar responsável pelo tratamento, conservação, contactos e bases legais antes de publicar.
- O formulário está preparado para Netlify Forms, com registo estático em `public/netlify-forms.html`; a submissão efetiva depende da publicação na Netlify, deteção do formulário e testes reais na plataforma. Não são carregados anexos/faturas no formulário nesta versão.

## Desenvolvimento

Requer Node.js `22.22.3+`, `24.15.0+` ou `26+`.

```bash
npm ci
npm start
npm run check
npm test
npm run build
```

## Organização

- `src/app/data/content.ts` — serviços e FAQs editáveis
- `src/app/app.component.html` — página e estrutura
- `src/app/app.component.ts` — navegação, serviços, FAQ e formulário
- `src/app/services/contact.ts` — serialização e envio do pedido
- `src/styles.css` — identidade visual responsiva
- `public/netlify-forms.html` — deteção estática do formulário
- `netlify.toml` — configuração de alojamento

## Pontos de validação com o cliente

1. Logótipo, cores oficiais e manual de marca.
2. Serviços exatos, abrangência geográfica e linguagem comercial.
3. Email, telefone e dados institucionais para rodapé.
4. Política de privacidade e responsável pelos pedidos enviados.
5. Destino de emails/notificações Netlify e eventual ligação a CRM.
6. Testes reais do formulário e confirmação do domínio antes de retirar `noindex`.

## Conteúdo original consultado

- Página inicial: `https://skyenergy.pt/`
- Particulares: `https://skyenergy.pt/particulares/`
- Empresas: `https://skyenergy.pt/empresas/`
- Pedido de análise: `https://skyenergy.pt/pedir-analise/`

Esta versão tem navegação em página única. A eventual manutenção dos URLs históricos e respetivos redirecionamentos deve ser avaliada quando o mapa completo do website atual estiver disponível.
