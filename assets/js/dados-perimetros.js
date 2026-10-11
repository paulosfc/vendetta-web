/* =========================================================
   DADOS DA ABA "PERÍMETROS"   <<< ESTE É O ARQUIVO QUE VOCÊ EDITA

   No site esta aba é somente para escolher e visualizar.
========================================================= */

const PERIMETROS = [
  
  {
    nome: "Banco Central",
    imagem: "assets/perimetros/banco-central.avif",
    descricao: "Categoria: Ação Grande \nArmamento: Armamento Pesado \nBandidos: Min. 10 | Máx. 14 \nPoliciais: Min. 16 | Máx. 19",
  },
  
  {
    nome: "Banco de Paleto",
    imagem: "assets/perimetros/banco-paleto.webp",
    descricao: "Categoria: Ação Grande \nArmamento: Armamento Pesado \nBandidos: Min. 6 | Máx. 8 \nPoliciais: Min. 9 | Máx. 11",
  },
  
  {
    nome: "Açougue",
    imagem: "assets/perimetros/acougue.webp",
    descricao: "Categoria: Ação Média \nArmamento: Pistolas ou 12 (doze) \nBandidos: Min. 7 | Máx. 7 \nPoliciais: Min. 10 | Máx. 10",
  },

  {
    nome: "Aeroporto do Norte",
    imagem: "assets/perimetros/aeroporto-norte.png",
    descricao: "Categoria: Ação Média \nArmamento: Pistolas e Tec - 9 \nBandidos: Min. 8 | Máx. 8 \nPoliciais: Min. 10 | Máx. 10",
  },

  {
    nome: "Ferro Velho do Norte",
    imagem: "assets/perimetros/ferro-norte.webp",
    descricao: "Categoria: Ação Média \nArmamento: Pistolas e SMGs \nBandidos: Min. 5 | Máx. 5 \nPoliciais: Min. 7 | Máx. 7",
  },
  
  {
    nome: "Ferro Velho do Sul",
    imagem: "assets/perimetros/ferro-sul.webp",
    descricao: "Categoria: Ação Média \nArmamento: Pistolas e SMGs \nBandidos: Min. 5 | Máx. 5 \nPoliciais: Min. 7 | Máx. 7",
  },
  
  {
    nome: "Galinheiro",
    imagem: "assets/perimetros/galinheiro.webp",
    descricao: "Categoria: Ação Média \nArmamento: Pistolas \nBandidos: Min. 8 | Máx. 8 \nPoliciais: Min. 10 | Máx. 10"
  },
  
  {
    nome: "Joalheria",
    imagem: "assets/perimetros/joalheria.avif",
    descricao: "Categoria: Ação Média \nArmamento: Armamento Pesado \nBandidos: Min. 6 | Máx. 8 \nPoliciais: Min. 9 | Máx. 11",
  },

  {
    nome: "Madeireira",
    imagem: "assets/perimetros/madeireira.webp",
    descricao: "Categoria: Ação Média \nArmamento: Pistolas ou Tec - 9 \nBandidos: Min. 8 | Máx. 8 \nPoliciais: Min. 10 | Máx. 10",
  },
  
  {
    nome: "Zancudo",
    imagem: "assets/perimetros/zancudo.webp",
    descricao: "Categoria: Ação Média \nArmamento: Tec - 9 \nBandidos: Min. 8 | Máx. 8 \nPoliciais: Min. 10 | Máx. 10",
  },

  {
    nome: "Loja de Departamento - Ark",
    imagem: "assets/perimetros/loja-ark.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - Ballas / MegaMall",
    imagem: "assets/perimetros/loja-ballas.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - BC",
    imagem: "assets/perimetros/loja-bc.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - China",
    imagem: "assets/perimetros/loja-china.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - GrapeSeed",
    imagem: "assets/perimetros/loja-grape.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - MegaMall Norte",
    imagem: "assets/perimetros/loja-megamall-norte.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - Mirror Park",
    imagem: "assets/perimetros/loja-mirror.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - Naturalli",
    imagem: "assets/perimetros/loja-naturalli.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - Praia",
    imagem: "assets/perimetros/loja-praia.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

  {
    nome: "Loja de Departamento - Vanilla",
    imagem: "assets/perimetros/loja-vanilla.webp",
    descricao: "Categoria: Ação Pequena \nArmamento: Pistolas \nBandidos: Min. 3 | Máx. 4 \nPoliciais: Min. 4 | Máx. 5",
  },

];
