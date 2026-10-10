/* =========================================================
   DADOS DE CRAFTS E PRODUTOS   <<< ÚNICO ARQUIVO QUE VOCÊ EDITA

   Aqui ficam as receitas, as categorias e os valores. A aba Crafts e
   a aba Encomendas leem tudo daqui (o dados.js é gerado a partir deste).

   Campos de cada craft:
     nome       nome exibido
     categoria  agrupa nos filtros da aba Crafts
     produz     quantas unidades cada craft rende
     materiais  { "Material": quantidade }
     valores    (opcional) { CNPJ, CPF, Parceria, Aliado }; sem isso não
                mostra valores
     chave      (opcional) código usado nas encomendas já salvas no banco.
                NÃO mude a chave de um craft existente. Em crafts novos
                pode deixar sem: é criada sozinha a partir do nome.
========================================================= */

const CRAFTS = [
    {
        nome: "FN Five Seven",
        chave: "Five",
        valores: { CNPJ: 45000, CPF: 45000, Parceria: 35000, Aliado: 35000 },
        categoria: "Armas",
        produz: 1,
        materiais: {
            "M1911": 1,
            "Real Sujo": 1000,
            // "Parafusos Pequenos": 1,
            // "Caixa de Aperfeiçoamento: Pistola": 2,
        },
        observacao: ""
    },
    
    {
        nome: "M1911",
        chave: "M1911",
        valores: { CNPJ: 30000, CPF: 30000, Parceria: 26000, Aliado: 23000 },
        categoria: "Armas",
        produz: 1,
        materiais: {
            "Real Sujo": 1000,
            "Peças de Arma Leve": 2,
        },
        observacao: ""
    },
    
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
        observacao: ""
    },
    
    {
        nome: "Tec - 9",
        categoria: "Armas",
        produz: 1,
        materiais: {
            "Real Sujo": 2000,
            "Peças de Arma Média": 4,
            "Tubo de Plástico": 8,
            "Sucata de Metal": 375,
        },
        observacao: ""
    },



    {
        nome: "Munição de Fuzil",
        chave: "MuniFuzil",
        valores: { CNPJ: 165, CPF: 165, Parceria: 143, Aliado: 143 },
        categoria: "Munições",
        produz: 250,
        materiais: {
            "Estojo de Munição: Fuzil": 250,
            "Real Sujo": 500,
            "Frasco de Pólvora": 48,
        },
        observacao: ""
    },

    {
        nome: "Munição de Sub",
        chave: "MuniSub",
        valores: { CNPJ: 120, CPF: 120, Parceria: 108, Aliado: 108 },
        categoria: "Munições",
        produz: 250,
        materiais: {
            "Estojo de Munição: SUB": 250,
            "Real Sujo": 400,
            "Frasco de Pólvora": 30,
        },
        observacao: ""
    },

    {
        nome: "Munição de Pistola",
        chave: "MuniPistola",
        valores: { CNPJ: 90, CPF: 90, Parceria: 78, Aliado: 78 },
        categoria: "Munições",
        produz: 250,
        materiais: {
            "Estojo de Munição: Pistola": 250,
            "Real Sujo": 250,
            "Frasco de Pólvora": 24,
        },
        observacao: ""
    },



    {
        nome: "Estojo de Munição: Fuzil",
        chave: "EstojoFuzil",
        categoria: "Estojos",
        produz: 250,
        materiais: {
            "Alumínio": 150,
            "Cobre": 160,
            "Real Sujo": 500,
        },
        observacao: ""
    },

    {
        nome: "Estojo de Munição: SUB",
        chave: "EstojoSub",
        categoria: "Estojos",
        produz: 250,
        materiais: {
            "Alumínio": 105,
            "Cobre": 120,
            "Real Sujo": 350,
        },
        observacao: ""
    },

    {
        nome: "Estojo de Munição: Pistola",
        chave: "EstojoPistola",
        categoria: "Estojos",
        produz: 250,
        materiais: {
            "Alumínio": 75,
            "Cobre": 80,
            "Real Sujo": 250,
        },
        observacao: ""
    },



    {
        nome: "Peças de Arma Leve",
        chave: "PeçasLeve",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Alumínio": 25,
            "Cobre": 25,
            "Vidro": 25,
            "Borracha": 25,
            "Real Sujo": 1000,
            "Corpo de Pistola": 1,
            "Peças de Armas": 2,
        },
        observacao: ""
    },
    
    {
        nome: "Peças de Arma Média",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Alumínio": 30,
            "Cobre": 30,
            "Real Sujo": 1000,
            "Vidro": 30,
            "Borracha": 30,
            "Corpo de Sub": 1,
            "Peças de Armas": 1,
        },
        observacao: ""
    },
    
    {
        nome: "Peças de Arma Pesada",
        categoria: "Peças e Componentes",
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
        observacao: ""
    },
    
    {
        nome: "Corpo de Rifle",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 1000,
            "Peças de Armas": 6,
        },
        observacao: ""
    },


    
    {
        nome: "Colete Balístico",
        categoria: "Outros",
        produz: 1,
        materiais: {
            "Real Sujo": 500,
            "Placa Blindada": 2,
            "Lona": 6,
        },
        observacao: ""
    },

    {
        nome: "Placa Blindada",
        categoria: "Outros",
        produz: 1,
        materiais: {
            "Alumínio": 40,
            "Cobre": 40,
            "Real Sujo": 500,
            "Vidro": 60,
            "Plástico": 60,
            "Placas de Trânsito": 1,
            "Borracha": 65,
            "Chapa de Metal": 2,
        },
        observacao: ""
    },
];
