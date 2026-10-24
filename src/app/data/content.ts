export type ServiceId = 'faturas' | 'contratos' | 'consumo' | 'comparacao';
export type CustomerType = 'Particular' | 'Empresa';

export interface EnergyService {
  id: ServiceId;
  index: string;
  title: string;
  short: string;
  points: readonly string[];
  icon: 'file' | 'swap' | 'activity' | 'scale';
}

export const services: readonly EnergyService[] = [
  { id: 'faturas', index: '01', title: 'Análise de faturas', short: 'Uma leitura mais simples dos valores e componentes da sua fatura de energia.', points: ['Consumos faturados', 'Preços e parcelas da fatura', 'Elementos a esclarecer'], icon: 'file' },
  { id: 'contratos', index: '02', title: 'Condições contratuais', short: 'Perceba melhor o enquadramento e as condições associadas ao fornecimento.', points: ['Condições e preços contratados', 'Potência e opções aplicáveis', 'Pontos de atenção no contrato'], icon: 'swap' },
  { id: 'consumo', index: '03', title: 'Leitura de consumos', short: 'O seu perfil de consumo ajuda a contextualizar os custos de energia.', points: ['Hábitos e padrões de utilização', 'Contexto de consumo', 'Questões a analisar em conjunto'], icon: 'activity' },
  { id: 'comparacao', index: '04', title: 'Comparação de condições', short: 'Organização da informação necessária para comparar diferentes condições de fornecimento.', points: ['Critérios relevantes', 'Diferenças entre condições', 'Apoio à decisão informada'], icon: 'scale' },
];

export const faqs: readonly { question: string; answer: string }[] = [
  { question: 'O que é necessário para pedir uma análise?', answer: 'Pode começar por enviar os seus dados de contacto e indicar se o pedido é particular ou empresarial. A equipa confirma posteriormente que informação é necessária, nomeadamente os dados relevantes da fatura ou do contrato.' },
  { question: 'A análise também se destina a empresas?', answer: 'Sim. A Sky Energy tem um percurso dedicado a empresas, com atenção às faturas, contratos e consumos associados à atividade.' },
  { question: 'Posso pedir apoio para eletricidade e gás?', answer: 'Sim. Ao preencher o formulário, pode indicar eletricidade, gás ou ambos, para contextualizar o pedido.' },
  { question: 'A análise garante uma redução da fatura?', answer: 'Não é possível garantir poupança sem avaliar o caso concreto. O objetivo é compreender melhor custos e condições, para apoiar uma decisão informada.' },
  { question: 'Como funciona o contacto inicial?', answer: 'Indique o seu nome, email e o assunto a analisar. A equipa pode depois solicitar informação adicional para estudar o seu pedido.' },
];
