/* =========================================================
   DADOS DA ABA "SITES EXTERNOS"   <<< ESTE É O ARQUIVO QUE VOCÊ EDITA

   Cada item da lista vira um local com botão e link visível
   que leva direto ao site. Para trocar um endereço, mude só o
   campo url (com https:// no começo). Para adicionar outro
   site, copie um bloco inteiro { ... } e preencha.

   Campos:
     nome       nome exibido no local e no botão
     url        endereço completo do site (https://...)
     descricao  frase curta que aparece abaixo do nome
     icone      símbolo pequeno exibido ao lado do nome
========================================================= */

const SITES_EXTERNOS_NOVA_ABA = true; // true = abre em nova aba; false = abre nesta mesma aba

const SITES_EXTERNOS = [
  {
    nome: "Encomendas",
    url: "https://vendasvendettaa.lovable.app/",
    descricao: "Site externo das Encomendas.",
    icone: "▣"
  },

  {
    nome: "Investigativa",
    url: "https://vdttinvestigativa.lovable.app/",
    descricao: "Site externo da Investigativa.",
    icone: "◈"
  }
];
