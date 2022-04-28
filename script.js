let seuVotoPara = document.querySelector(".d-1-1 span");
let cargo = document.querySelector(".d-1-2 span");
let descricao = document.querySelector(".d-1-4");
let aviso = document.querySelector(".d-2");
let lateral = document.querySelector(".d-1-right");
let numeros = document.querySelector(".d-1-3");

 // variáveis de controle de ambiente:
 // para saber em que etapa atual está agora
let etapaAtual = 0;   //para ser usada de parâmetro do array etapas
let numero = "";      //números que ja foram preenchidos
let votoBranco = false;
let votos = [];   //array onde vai ficar guardado os votos no final, para serem enviados

//função que vai limpar a tela, pegar as informações da etapa atual e preencher a tela com elas
function comecarEtapa() {
    let etapa = etapas[etapaAtual];

    numero = ""; // pois sempre que executa essa função, o número que está na memória é zerado
    votoBranco = ""; // pois sempre que executa essa função, essa variável precisa ser zerada
    let numeroHtml = ""; // precisa montar essa variável de acordo com quantos números são para aquele cargo
    
    for(let i=0;i<etapa.numeros;i++){
        if (i === 0) {
            numeroHtml += '<div class="numero pisca"></div>';
        } else {
        numeroHtml += '<div class="numero"></div>';
        }
    }

    seuVotoPara.style.display = "none";
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = "";
    aviso.style.display = "none";
    lateral.innerHTML = "";
    numeros.innerHTML = numeroHtml;
}

// função que vai ser executada sempre que realizar uma ação (digitar um número)
function atualizaInterface() {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter( (item)=>{   //recebe cada um dos candidatos como parametro
        if (item.numero === numero) {     //se o numero do candidato é igual ao número digitado
            return true;
        } else {
            return false;
        }
    } );
    if (candidato.length > 0) {   // se conseguiu encontrar um candidato (pois se não encontra, retorna um array vazio, com 0)
        candidato = candidato[0];  // pois como usou um filter, vau retornar um array com um só ítem para candidato (então pega o primeiro e único item)
        //ou seja, candidato vai ser igual ao candidato de fato que foi encontrado
        //ENCONTRADO ESSE CANDIDATO, VAMOS PREENCHER AS INFORMAÇÕES NA TELA:
        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        descricao.innerHTML = `Nome: ${candidato.nome}<br/>Partido: ${candidato.partido}`;
        //montando a estrutura das fotos para colocar em lateral:
        let fotosHtml = ``;
        for (let i in candidato.fotos){   //percorrer o array fotos dentro de candidato (pois alguns tem mais de uma foto)
            if (candidato.fotos[i].small) {  //verificando se precisa colocar a class "small" na foto 
                fotosHtml += `<div class="d-1-image small"><img src="images/${candidato.fotos[i].src}" alt=""/>${candidato.fotos[i].legenda} </div>`
            } else{
                fotosHtml += `<div class="d-1-image"><img src="images/${candidato.fotos[i].src}" alt=""/>${candidato.fotos[i].legenda} </div>`
            }
        }

        lateral.innerHTML = fotosHtml;

    } else {  // se não encontrou candidato com aquele número - VOTO NULO
        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        descricao.innerHTML = '<div class= "aviso--grande pisca">VOTO NULO</div>'  //cria-se um nova class (aviso-grande)
    }
}

function clicou(n) {
    //assim que clicar em um número, primeiramente se verifica se há algum quadrado com o pisca ativado
    let elNumero = document.querySelector(".numero.pisca"); //seleciona o quadrado que tiver com pisca - pois é onde vai preencher
    if (elNumero !== null) {   //ou seja, se há algum número piscando
        elNumero.innerHTML = n; //preenchendo o quadrado piscando com o número digitado (n)
        numero = `${numero}${n}`

        //remover o pisca do que foi preenchido e passar para o próximo
        elNumero.classList.remove("pisca");
        if (elNumero.nextElementSibling !== null) {  //verificando se há um número a seguir (pois o último número não tem ninguem depois)
            elNumero.nextElementSibling.classList.add("pisca"); //adiciona no próximo
        } else {  //ou seja, ja preencheu até o último item
            atualizaInterface();
        }
    }
}


function branco(){
    if (numero === "") {  //pois esse função só funciona se não tiver nada digitado (tem que apertar corrige antes)
        votoBranco = true;
        seuVotoPara.style.display = "block";
        aviso.style.display = "block";
        numeros.innerHTML = "";  //vai remover os números
        descricao.innerHTML = '<div class= "aviso--grande pisca">VOTO EM BRANCO</div>'
    } else {
        alert("Para votar em BRANCO, não pode ter digitado nenhum número!")
    }
}
function corrige(){
    comecarEtapa();        //pois esse botão apenas reinicia
}
function confirma(){
    //o botão confirma só funciona se tiver preenchido algum número (mesmo que nulo) ou se tiver votado em branco
    let etapa = etapas[etapaAtual];

    let votoConfirmado = false; //variável que confirma o voto

    if (votoBranco === true) {  //votou em branco
        votoConfirmado = true; //pois o voto foi confirmado
        votos.push({   //o que vai ser enviado
            etapa: etapas[etapaAtual].titulo,
            voto: "branco"
        });
    } else if (numero.length === etapa.numeros) {  //deve ter digitado todos os números que tiverem nessa etapa
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        });
    }

    if (votoConfirmado === true) {   //vai passar para a próxima etapa
        etapaAtual++;
        if (etapas[etapaAtual] !== undefined) { //se essa etapa existir (for diferente de "indefinida")
            comecarEtapa();
        } else {      //não existem mais etapas, então quer dizer que a votação chegou ao fim (MOSTRAR A TELA FIM)
            document.querySelector(".tela").innerHTML = '<div class= "aviso--gigante pisca">FIM</div>'
            console.log(votos);
        }
    }
    
}

comecarEtapa();