/* =========================================================
   DADOS DA ABA "ROTAS"   <<< ESTE É O ARQUIVO QUE VOCÊ EDITA

   No site esta aba é somente para escolher e visualizar.

   COMO ADICIONAR UMA ROTA
   1) Coloque a imagem dentro da pasta  assets/rotas/
      (png, jpg, jpeg, webp ou svg). Evite espaços e acentos
      no nome do arquivo. Exemplo: rota-norte.png
   2) Copie um bloco { ... } abaixo, cole depois da vírgula do
      bloco anterior e troque os valores:

        nome       texto que aparece na lista de seleção
        imagem     caminho do arquivo, começando por assets/rotas/
        descricao  texto opcional abaixo do nome ("" se não quiser)

   3) Salve e publique de novo (GitHub -> Vercel).

   ATENÇÃO
   * Na Vercel, maiúsculas e minúsculas IMPORTAM:
     "Rota-Norte.png" é diferente de "rota-norte.png".
     No seu computador pode funcionar e online não.
   * As imagens desta pasta ficam no próprio site: quem souber o
     endereço do arquivo consegue abri-lo mesmo sem fazer login.
     Para imagens sigilosas, use a aba Perímetros (fotos privadas).
   * A lista aparece na ordem em que você escrever aqui.
========================================================= */

const ROTAS = [
    {
        nome: "Rota de exemplo",
        imagem: "assets/rotas/exemplo.svg",
        descricao: "Imagem de exemplo. Apague este bloco quando colocar as suas rotas."
    },
];
