/* =========================================================
   DADOS DA ABA "PERÍMETROS"   <<< ESTE É O ARQUIVO QUE VOCÊ EDITA

   No site esta aba é somente para escolher e visualizar.

   COMO ADICIONAR UM PERÍMETRO
   1) Coloque a imagem dentro da pasta  assets/perimetros/
      (png, jpg, jpeg, webp ou svg). Evite espaços e acentos
      no nome do arquivo. Exemplo: perimetro-norte.png
   2) Copie um bloco { ... } abaixo, cole depois da vírgula do
      bloco anterior e troque os valores:

        nome       texto que aparece na lista de seleção
        imagem     caminho do arquivo, começando por assets/perimetros/
        descricao  texto opcional abaixo do nome ("" se não quiser)

   3) Salve e publique de novo (GitHub -> Vercel).

   COMO REMOVER: apague o bloco { ... } inteiro, com a vírgula
   (e, se quiser, o arquivo da pasta).

   ATENÇÃO
   * Na Vercel, maiúsculas e minúsculas IMPORTAM:
     "Perimetro-Norte.png" é diferente de "perimetro-norte.png".
     No seu computador pode funcionar e online não.
   * As imagens desta pasta ficam no próprio site: quem souber o
     endereço do arquivo consegue abri-lo mesmo sem fazer login.
   * A lista aparece na ordem em que você escrever aqui.
========================================================= */

const PERIMETROS = [
    {
        nome: "Perímetro de exemplo",
        imagem: "assets/perimetros/exemplo.svg",
        descricao: "Imagem de exemplo. Apague este bloco quando colocar os seus perímetros."
    },
];
