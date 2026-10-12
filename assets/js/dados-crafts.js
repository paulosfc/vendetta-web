/* =========================================================
   DADOS DE CRAFTS E PRODUTOS   <<< ÚNICO ARQUIVO QUE VOCÊ EDITA

   Aqui ficam as receitas, as categorias e os valores. A aba Crafts
   lê tudo daqui (o dados.js é gerado a partir deste).

   Campos de cada craft:
     nome       nome exibido
     categoria  agrupa nos filtros da aba Crafts
     produz     quantas unidades cada craft rende
     materiais  { "Material": quantidade }
     valores    (opcional) { CNPJ, CPF, Parceria, Aliado }; sem isso não
                mostra valores
     chave      (opcional) código interno do craft (usado para ligar o craft ao seu valor).
                NÃO mude a chave de um craft existente. Em crafts novos
                pode deixar sem: é criada sozinha a partir do nome.
========================================================= */

const CRAFTS = [
    {
        nome: "FN Five Seven",
        chave: "Five",
        // valores: { CNPJ: 45000, CPF: 45000, Parceria: 39000, Aliado: 35000 },
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
        // valores: { CNPJ: 30000, CPF: 30000, Parceria: 26000, Aliado: 23000 },
        categoria: "Armas",
        produz: 1,
        materiais: {
            "Real Sujo": 1000,
            "Peças de Arma Leve": 2,
        },
        observacao: ""
    },
    
    {
        nome: "Ati FX45",
        categoria: "Armas",
        produz: 1,
        materiais: {
            "M1911": 1,
            "Real Sujo": 1000,
            "Peças de Arma Leve": 1,
            "Sucata de Metal": 450,
            "Parafusos Pequenos": 1,
            "Caixa de Aperfeiçoamento: Pistola": 3,
        },
        observacao: ""
    },
    
    {
        nome: "AMT 380",
        categoria: "Armas",
        produz: 1,
        materiais: {
            "Real Sujo": 500,
            "Peças de Arma Leve": 2,
            "Sucata de Metal": 150,
        },
        observacao: ""
    },
    
    {
        nome: "HK P7M10",
        categoria: "Armas",
        produz: 1,
        materiais: {
            "AMT 380": 1,
            "Real Sujo": 650,
            "Sucata de Metal": 50,
            "Parafusos Pequenos": 2,
            "Caixa de Aperfeiçoamento: Pistola": 1,
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
        nome: "Munição de Fuzil",
        chave: "MuniFuzil",
        // valores: { CNPJ: 165, CPF: 165, Parceria: 143, Aliado: 127 },
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
        // valores: { CNPJ: 120, CPF: 120, Parceria: 108, Aliado: 92 },
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
        // valores: { CNPJ: 90, CPF: 90, Parceria: 78, Aliado: 69 },
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
        nome: "Peças de Armas.",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 1000,
            "Engrenagem": 1,
            "Sucata de Metal": 175,
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
        nome: "Corpo de Pistola.",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 500,
            "Peças de Armas": 3,
        },
        observacao: ""
    },
    
    {
        nome: "Corpo de Sub",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 500,
            "Peças de Armas": 6,
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
        nome: "Caixa de Aperfeiçoamento: Pistola",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 1000,
            "Peças de Arma Leve": 2,
            "Mola de Metal": 8,
        },
        observacao: ""
    },
    
    {
        nome: "Tubo de Plástico",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Plástico": 10,
        },
        observacao: ""
    },
    
    {
        nome: "Porcas de Parafuso",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: ""
    },
    
    {
        nome: "Porcas de Parafusos Pequenos",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: ""
    },
    
    {
        nome: "Cabo de Alimentação",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Cobre": 3,
            "Real Sujo": 300,
            "Borracha": 2,
        },
        observacao: ""
    },
    
    {
        nome: "Fios de Cobre",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Cobre": 10,
            "Real Sujo": 300,
        },
        observacao: ""
    },
    
    {
        nome: "Parafusos",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: ""
    },
    
    {
        nome: "Pregos Pequenos",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
        },
        observacao: ""
    },
    
    {
        nome: "Parafusos Pequenos",
        categoria: "Peças e Componentes",
        produz: 1,
        materiais: {
            "Real Sujo": 300,
            "Barra de Ferro": 3,
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



    {
        nome: "Spray",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 20,
            "Cobre": 20,
            "Real Sujo": 10000,
        },
        observacao: ""
    },

    {
        nome: "USB Hacker",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 20,
            "Celular Seguro": 1,
            "Cobre": 20,
            "Componentes Eletrônicos": 2,
            "Cabo de Alimentação": 1,
        },
        observacao: ""
    },
    
    {
        nome: "Alicate Industrial - Nível 1",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 15,
            "Cobre": 15,
        },
        observacao: "Rouba Barbearia e Containers."
    },
    
    {
        nome: "Alicate Industrial - Nível 2",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 15,
            "Cobre": 15,
            "Núcleo de Corte Reforçado": 2,
            "Alicate Industrial - Nível 1": 1,
        },
        observacao: "Rouba Açougue, Galinheiro e Madeireira."
    },
    
    {
        nome: "Alicate Industrial - Nível 3",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 15,
            "Cobre": 15,
            "Núcleo de Corte Reforçado": 4,
            "Alicate Industrial - Nível 2": 1,
        },
        observacao: "Rouba Aeroporto do Norte, Ferro Velho e Joalheria."
    },
    
    {
        nome: "Componentes Eletrônicos",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 5,
            "Cobre": 5,
            "Fios de Cobre": 1,
            "Cabo de Alimentação": 1,
        },
        observacao: ""
    },
    
    {
        nome: "Gazua",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 30,
            "Cobre": 30,
            "Chapa de Metal": 2,
        },
        observacao: ""
    },
    
    {
        nome: "Capuz",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Borracha": 85,
            "Lona": 5,
        },
        observacao: ""
    },
    
    {
        nome: "Placa Veicular",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Placas de Trânstio": 1,
            "Fita Adesiva": 1,
            "Chapa de Metal": 2,
        },
        observacao: ""
    },
    
    {
        nome: "Algemas",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 65,
            "Cobre": 60,
        },
        observacao: ""
    },
    
    {
        nome: "Compasso",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Alumínio": 20,
            "Cobre": 20,
            "Componentes Eletrônicos": 1,
            "Cabo de Alimentação": 1,
        },
        observacao: ""
    },
    
    {
        nome: "C4",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Explosivos": 1,
        },
        observacao: ""
    },
    
    {
        nome: "Celular Seguro",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Vidro": 5,
            "Plástico": 5,
            "Fita Adesiva": 1,
            "Lixo Eletrônico": 1,
        },
        observacao: ""
    },
    
    {
        nome: "Explosivos",
        categoria: "Lester",
        produz: 1,
        materiais: {
            "Vidro": 35,
            "Frasco de Pólvora": 14,
            "Plástico": 50,
            "Fita Adesiva": 5,
            "Lixo Eletrônico": 5,
        },
        observacao: ""
    },


    
    {
        nome: "Picareta",
        categoria: "Picaretas",
        produz: 1,
        materiais: {
            "Real": 1000,
        },
        observacao: ""
    },

    {
        nome: "Picareta de Aço Temperado",
        categoria: "Picaretas",
        produz: 1,
        materiais: {
            "Barra de Ferro": 15,
        },
        observacao: ""
    },

    {
        nome: "Picareta de Liga Prateada",
        categoria: "Picaretas",
        produz: 1,
        materiais: {
            "Barra de Ferro": 20,
        },
        observacao: ""
    },

    {
        nome: "Picareta de Liga Dourada",
        categoria: "Picaretas",
        produz: 1,
        materiais: {
            "Alexandrita": 1,
            "Barra de Ouro": 8,
            "Pepita de Ouro Antigo": 2,
        },
        observacao: ""
    },
];
