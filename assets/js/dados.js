/* =========================================================
   GERADO AUTOMATICAMENTE a partir de dados-crafts.js  -  NÃO EDITE AQUI

   Mantém o formato antigo (receitas e valoresPorProduto) usado pelas
   Encomendas. Para mudar receitas, nomes ou valores, edite dados-crafts.js.
   Precisa ser carregado DEPOIS de dados-crafts.js.
========================================================= */
try { localStorage.removeItem("receitasCraft"); } catch { /* ignora */ }

const receitas = {};
const valoresPorProduto = {};

(function montarProdutos() {
    const semAcento = t => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    CRAFTS.forEach(craft => {
        let chave = craft.chave || semAcento(craft.nome).replace(/[^A-Za-z0-9]+/g, "");

        if (receitas[chave]) {
            console.warn(`Chave repetida em dados-crafts.js: "${chave}" (${craft.nome}). Use "chave" para diferenciar.`);
            let n = 2;
            while (receitas[chave + n]) n++;
            chave += n;
        }

        receitas[chave] = { nome: craft.nome, produz: craft.produz, materiais: craft.materiais };
        if (craft.valores) valoresPorProduto[chave] = craft.valores;
    });
})();
