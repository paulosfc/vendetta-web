/* =========================================================
   DADOS DA ABA "CRAFTS"   <<< ESTE É O ARQUIVO QUE VOCÊ EDITA

   No site esta aba é somente para consulta. Para mudar algo,
   edite aqui, salve e publique de novo (GitHub -> Vercel).

   COMO ADICIONAR UM CRAFT
   Copie um bloco { ... } inteiro, cole logo abaixo (depois da
   vírgula do bloco anterior) e troque os valores:

     nome        nome que aparece no card
     categoria   agrupa e filtra (use o mesmo texto para agrupar)
     produz      quantas unidades saem de 1 craft
     materiais   "Nome do material": quantidade,   (um por linha)
     observacao  texto opcional (deixe "" se não quiser)

   COMO REMOVER: apague o bloco { ... } inteiro, com a vírgula.
   Cuidado com aspas e vírgulas: toda linha termina com vírgula.
========================================================= */

const CRAFTS = [
    // {
    //     nome: "FN Five Seven",
    //     categoria: "Armas",
    //     produz: 1,
    //     materiais: {
    //         "M1911": 1,
    //         "Real Sujo": 1000,
    //         "Parafusos Pequenos": 1,
    //         "Caixa de Aperfeiçoamento: Pistola": 2,
    //     },
    //     observacao: ""
    // },
    // {
    //     nome: "M1911",
    //     categoria: "Armas",
    //     produz: 1,
    //     materiais: {
    //         "Real Sujo": 1000,
    //         "Peças de Arma Leve": 2,
    //     },
    //     observacao: ""
    // },

    {
        nome: "M4A1",
        categoria: "Armas",
        produz: 1,
        materiais: {
            "Real Sujo": 5000,
            "Engrenagem": 10,
            "Peças de Arma Pesada": 4,
            "Tubo de Plástico": 10,
            "Sucata de Metal": 7375,
            "Parafusos Pequenos": 10,
        },
        observacao: "",
    },



    // {
    //     nome: "Munição de Fuzil",
    //     categoria: "Munições",
    //     produz: 250,
    //     materiais: {
    //         "Estojo de Munição: Fuzil": 250,
    //         "Real Sujo": 500,
    //         "Frasco de Pólvora": 48,
    //     },
    //     observacao: ""
    // },
    // {
    //     nome: "Munição de Sub",
    //     categoria: "Munições",
    //     produz: 250,
    //     materiais: {
    //         "Estojo de Munição: SUB": 250,
    //         "Real Sujo": 400,
    //         "Frasco de Pólvora": 30,
    //     },
    //     observacao: ""
    // },
    // {
    //     nome: "Munição de Pistola",
    //     categoria: "Munições",
    //     produz: 250,
    //     materiais: {
    //         "Estojo de Munição: Pistola": 250,
    //         "Real Sujo": 250,
    //         "Frasco de Pólvora": 24,
    //     },
    //     observacao: ""
    // },



    // {
    //     nome: "Estojo de Munição: Fuzil",
    //     categoria: "Estojos",
    //     produz: 250,
    //     materiais: {
    //         "Alumínio": 150,
    //         "Cobre": 160,
    //         "Real Sujo": 500,
    //     },
    //     observacao: ""
    // },
    // {
    //     nome: "Estojo de Munição: SUB",
    //     categoria: "Estojos",
    //     produz: 250,
    //     materiais: {
    //         "Alumínio": 105,
    //         "Cobre": 120,
    //         "Real Sujo": 350,
    //     },
    //     observacao: ""
    // },
    // {
    //     nome: "Estojo de Munição: Pistola",
    //     categoria: "Estojos",
    //     produz: 250,
    //     materiais: {
    //         "Alumínio": 75,
    //         "Cobre": 80,
    //         "Real Sujo": 250,
    //     },
    //     observacao: ""
    // },



    // {
    //     nome: "Peças de Arma Leve",
    //     categoria: "Peças e componentes",
    //     produz: 1,
    //     materiais: {
    //         "Alumínio": 25,
    //         "Cobre": 25,
    //         "Vidro": 25,
    //         "Borracha": 25,
    //         "Real Sujo": 1000,
    //         "Corpo de Pistola": 1,
    //         "Peças de Armas": 2,
    //     },
    //     observacao: ""
    // },

    {
        nome: "Peças de Arma Pesada",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Alumínio": 75,
            "Cobre": 75,
            "Real Sujo": 1000,
            "Plástico": 125,
            "Corpo de Rifle": 1,
            "Borracha": 125,
            "Peças de Armas": 2,
        },
        observacao: "",
    },

    {
        nome: "Corpo de Rifle",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 1000,
            "Peças de Armas": 6,
        },
        observacao: "",
    },

    {
        nome: "Tubo de Plástico",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Plástico": 10,
        },
        observacao: "",
    },

    {
        nome: "Porcas de Parafuso",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: "",
    },

    {
        nome: "Porcas de Parafusos Pequenos",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: "",
    },

    {
        nome: "Cabo de Alimentação",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Cobre": 3,
            "Real Sujo": 300,
            "Borracha": 2,
        },
        observacao: "",
    },

    {
        nome: "Parafusos",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: "",
    },

    {
        nome: "Fios de Cobre",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Cobre": 10,
            "Real Sujo": 300,
        },
        observacao: "",
    },

    {
        nome: "Pregos Pequenos",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: "",
    },

    {
        nome: "Parafusos Pequenos",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: "",
    },

    {
        nome: "Tablet de Roubo Avançado",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Alumínio": 50,
            "Celular Seguro": 1,
            "Cobre": 50,
            "Componentes Eletrônicos": 4,
            "Cabo de Alimentação": 2,
        },
        observacao: "",
    },

    {
        nome: "Celular Seguro",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Vidro": 5,
            "Plástico": 5,
            "Fita Adesiva": 1,
            "Lixo Eletrônico": 1,
        },
        observacao: "",
    },

    {
        nome: "Circuito Eletrônico",
        categoria: "Peças e componentes",
        produz: 1,
        materiais: {
            "Alumínio": 20,
            "Celular Seguro": 1,
            "Cobre": 20,
            "Componentes Eletrônicos": 2,
            "Cabo de Alimentação": 1,
        },
        observacao: "",
    },
];
