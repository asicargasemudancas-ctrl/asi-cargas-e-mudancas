export type Review = {
  readonly name: string;
  readonly initials: string;
  readonly color: "r" | "b" | "y" | "g";
  readonly rating: 5;
  readonly when: string;
  readonly type: "residencial" | "comercial";
  readonly tag: string;
  readonly text: string;
  readonly avatar?: string;
};

// Ordem: mais recentes primeiro. Textos copiados do perfil público do Google
// (conferido em 18/10/2026), sem emojis; "[…]" marca trechos omitidos.
export const reviews = [
  { name: "Matheus Belo", avatar: "/assets/reviews/matheus-belo.webp", initials: "M", color: "b", rating: 5, when: "Out 2026", type: "residencial", tag: "INTERESTADUAL · EMBALAGEM", text: "Muito obg, pelo serviço prestado Alex, vocês da ASI transportadora exercem um trabalho de valorização e respeito, qualidade e cuidado são os princípios que vcs carregam e entregam em cada detalhe. Minha primeira experiência com frete para outro estado e foi sensacional!!! Sem contar que o empacotamento vc faz é melhor que o da magazine Luíza […] nunca vir tanto papel filme e bolha enrolado num móvel." },
  { name: "Colégio Pequenos Criadores", avatar: "/assets/reviews/colegio-pequenos-criadores.webp", initials: "C", color: "y", rating: 5, when: "Out 2026", type: "comercial", tag: "COMERCIAL · SÃO PAULO → PETROLINA", text: "O atendimento foi maravilhoso! Eles transportaram a mobília da minha loja de São Paulo a Petrolina-PE com zelo e responsabilidade. Eu fiquei muito satisfeita com a entrega. Super indico! Já virei cliente VIP." },
  { name: "Eder Silva", avatar: "/assets/reviews/eder-silva.webp", initials: "E", color: "g", rating: 5, when: "Set 2026", type: "residencial", tag: "PRAZO CUMPRIDO · SEM AVARIA", text: "A empresa é uma das mais sérias e competentes que conheço no ramo. O Responsável, Alexandre cumpriu todos os prazos e fez um excelente serviço. Meu móveis chegaram no prazo e sem nenhuma avaria. Recomendo muito a todos que queiram um serviço sério e competente." },
  { name: "Caio Graco Ferreira", avatar: "/assets/reviews/caio-graco-ferreira.webp", initials: "C", color: "r", rating: 5, when: "Set 2026", type: "residencial", tag: "INTERESTADUAL · PONTUALIDADE", text: "Excelente! Empresa profissional e eficiente. Super indico. Preços acessíveis, confiança e pontualidade" },
  { name: "Flora Rocha Cardoso", avatar: "/assets/reviews/flora-rocha-cardoso.webp", initials: "F", color: "b", rating: 5, when: "Set 2026", type: "residencial", tag: "INTERESTADUAL · COMUNICAÇÃO", text: "Profissional cuidadoso e de fácil comunicação. Recomendo." },
  { name: "Marcelo", avatar: "/assets/reviews/marcelo.webp", initials: "M", color: "y", rating: 5, when: "Jul 2026", type: "residencial", tag: "EMBALADOS E MONTADOS", text: "Empresa muito séria. Minha mudança saiu e chegou no horário combinado. Pessoal treinado e gentil. Todos os móveis foram embalados e montados perfeitamente. O sr. Alexandre é um profissional excelente. Cumpriu à risca o contrato e sempre pronto para ajudar no que foi necessário. […]" },
  { name: "Nestor Souza", avatar: "/assets/reviews/nestor-souza.webp", initials: "N", color: "g", rating: 5, when: "Jul 2026", type: "residencial", tag: "PETROLINA → JOÃO PESSOA", text: "Excelente prestação de serviço pela transportadora, na pessoa do senhor Alexandre(motorista) e proprietário. Gostei muito do trabalho de embalagem, empacotamento e carregamento dos meus móveis que foram transportados de Petrolina-PE para João Pessoa-PB sem nenhuma intercorrência. […]" },
  { name: "Simone Almeida", initials: "S", color: "r", rating: 5, when: "Jun 2026", type: "residencial", tag: "EQUIPE · CARGA E DESCARGA", text: "Empresa muito organizada, Seu Alexandre muito atencioso, e cuidadoso em cada detalhe com a mudança. equipe que fizeram embalagem carga e descarga dos móveis, tudo com muito cuidado e zelo. Obrigada, superou nossas expectativas. Recomendo" },
  { name: "RB Clothing", initials: "R", color: "b", rating: 5, when: "2026", type: "comercial", tag: "COMERCIAL · TUDO CERTINHO", text: "Alexandre está de parabéns! Fez todo o combinado na nossa mudança, a todo momento envolvido no processo, informando e explicando tudo. Chegou tudo certinho! Recomendamos demais!" },
  { name: "Adeisa Guimarães Carvalho", initials: "A", color: "y", rating: 5, when: "2026", type: "residencial", tag: "TERCEIRA MUDANÇA COM A ASI", text: "A equipe liderada por Alexandre é de um profisionalismo enorme. Cuidaram muito bem de meus móveis, aqueles mais delicados receberam atenção redobrada, com envelopamento para evitar danos. Já estamos na nossa terceira mudança com Alexandre e recomendamos enormemente seu serviço." },
  { name: "GSHOP - Cosméticos Veganos", initials: "G", color: "r", rating: 5, when: "2026", type: "comercial", tag: "COMERCIAL · NOTA MIL", text: "Seu Alexandre super pontual, solicito, educado e profissional. Nota MIL!" },
  { name: "Caio Peixoto", initials: "C", color: "g", rating: 5, when: "2025", type: "comercial", tag: "EDIFÍCIO · EFICIÊNCIA E CUIDADO", text: "Gostaria de destacar o excelente serviço de frete, o entusiasmo e o profissionalismo da equipe durante a minha mudança para um edifício. Além de serem extremamente cuidadosos com cada móvel, demonstraram um grande compromisso com a qualidade, realizando o trabalho com rapidez sem abrir mão do cuidado necessário. […]" },
] as const satisfies readonly Review[];

export const featuredReview = reviews[0];

// Fotos que o próprio cliente anexou à avaliação no Google (entrega em São Paulo).
export const featuredReviewPhotos = [1, 2, 3, 4, 5].map((index) => `/assets/reviews/matheus-belo-foto-${index}.webp`);
