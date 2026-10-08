/* =========================================================
   DADOS DA ABA "INVESTIGATIVA"   <<< ESTE É O ARQUIVO QUE VOCÊ EDITA

   A aba mostra um aviso explicando que a pessoa vai sair do
   Vendetta WEB e um botão que abre o site externo.

   COMO CONFIGURAR
     nome            nome que aparece nos textos e no botão
     url             endereço COMPLETO do site, começando por https://
                     Exemplo: "https://www.exemplo.com.br/"
     descricao       texto opcional que aparece antes do aviso ("" se não quiser)
     abrirEmNovaAba  true  = abre numa aba nova (o Vendetta WEB continua aberto)
                     false = abre nesta mesma aba (a pessoa sai do Vendetta WEB)

   Depois de editar, salve e publique de novo (GitHub -> Vercel).

   SEGURANÇA
   * Só endereços http:// e https:// são aceitos; qualquer outro tipo de
     endereço é ignorado e a aba mostra que a configuração está incompleta.
   * Prefira sempre https://.
========================================================= */

const INVESTIGATIVA = {
    nome: "Investigativa",
    url: "https://vdttinvestigativa.lovable.app",
    descricao: "",
    abrirEmNovaAba: true
};
