/* =========================================================
   BANCO DE RECEITAS
========================================================= */
// Receitas vêm só do código (antes ficavam presas no localStorage e JSON inválido quebrava tudo)
try { localStorage.removeItem("receitasCraft"); } catch { /* ignora */ }
let receitas = {};

/* =========================================================
   VALORES DOS PRODUTOS

   IMPORTANTE:

   Os valores NÃO são cadastrados pelo formulário.

   Você coloca somente aqui os produtos que possuem
   valores.

   Produtos que não estiverem nesta lista não terão
   valores exibidos.
========================================================= */
const valoresPorProduto = {
    "Five": {
        CNPJ: 45000,
        CPF: 45000,
        Parceria: 35000,
        Aliado: 35000
    },
    "M1911": {
        CNPJ: 30000,
        CPF: 30000,
        Parceria: 26000,
        Aliado: 23000
    },
    "MuniFuzil": {
        CNPJ: 165,
        CPF: 165,
        Parceria: 143,
        Aliado: 143,
    },
    "MuniSub": {
        CNPJ: 120,
        CPF: 120,
        Parceria: 108,
        Aliado: 108,
    },
    "MuniPistola": {
        CNPJ: 90,
        CPF: 90,
        Parceria: 78,
        Aliado: 78,
    },
};

/* =========================================================
   RECEITAS INICIAIS
========================================================= */
if (Object.keys(receitas).length === 0) {
    receitas = {
        "Five": {
            nome: "FN Five Seven",
            produz: 1,
            materiais: {
                "M1911": 1,
                "Real Sujo": 1000,
                "Parafusos Pequenos": 1,
                "Caixa de Aperfeiçoamento: Pistola": 2
            }
        },
        "M1911": {
            nome: "M1911",
            produz: 1,
            materiais: {
                "Real Sujo": 1000,
                "Peças de Arma Leve": 2
            }
        },
        "MuniFuzil": {
            nome: "Munição de Fuzil",
            produz: 250,
            materiais: {
                "Estojo de Munição: Fuzil": 250,
                "Real Sujo": 500,
                "Frasco de Pólvora": 48
            }
        },
        "MuniSub": {
            nome: "Munição de Sub",
            produz: 250,
            materiais: {
                "Estojo de Munição: SUB": 250,
                "Real Sujo": 400,
                "Frasco de Pólvora": 30
            }
        },
        "MuniPistola": {
            nome: "Munição de Pistola",
            produz: 250,
            materiais: {
                "Estojo de Munição: Pistola": 250,
                "Real Sujo": 250,
                "Frasco de Pólvora": 24
            }
        },
        "EstojoFuzil": {
            nome: "Estojo de Munição: Fuzil",
            produz: 250,
            materiais: {
                "Alumínio": 150,
                "Cobre": 160,
                "Real Sujo": 500,
            }
        },
        "EstojoSub": {
            nome: "Estojo de Munição: SUB",
            produz: 250,
            materiais: {
                "Alumínio": 105,
                "Cobre": 120,
                "Real Sujo": 350,
            }
        },
        "EstojoPistola": {
            nome: "Estojo de Munição: Pistola",
            produz: 250,
            materiais: {
                "Alumínio": 75,
                "Cobre": 80,
                "Real Sujo": 250,
            }
        },
        "PeçasLeve": {
            nome: "Peças de Arma Leve",
            produz: 1,
            materiais: {
                "Alumínio": 25,
                "Cobre": 25,
                "Vidro": 25,
                "Borracha": 25,
                "Real Sujo": 1000,
                "Corpo de Pistola": 1,
                "Peças de Armas": 2,
            }
        },
        // "CaixaPistola": {
        //     nome: "Caixa de Aperfeiçoamento: Pistola",
        //     produz: 1,
        //     materiais: {
        //         "Real Sujo": 1000,
        //         "Peças de Arma Leve": 2,
        //         "Mola de Metal": 8,
        //     }
        // },
    };
    salvarLocalStorage();
}

/* =========================================================
   LOCAL STORAGE
========================================================= */
function salvarLocalStorage() {
    // não grava mais: a fonte de verdade é este arquivo
}
