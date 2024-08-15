const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Verifica e cria o diretório "notas" se não existir
const notasDir = path.join(__dirname, 'notas');
if (!fs.existsSync(notasDir)) {
    fs.mkdir(notasDir, { recursive: true }, (err) => {
        if (err) throw err;
        console.log('Diretório criado com sucesso!');
    });
}

function run() {
    console.log('------------------------------------');
    rl.question(`O que deseja fazer? \n1 - Criar anotação\n2 - Ler anotação\n3 - Excluir anotação\n4 - Sair\nEscolha uma opção: `, (answer) => {
        if (answer === '1') {
            createNote();
        }else if (answer === '2') {
            readNote();
        }else if (answer === '3') {
            deleteNote();
        }else if (answer === '4') {
            console.log(`Saindo...`);
            rl.close();
            process.exit(0)
        }else {
            console.log('Opção inválida. Tente novamente.');
            console.clear()
            run();
        }
    });
}

function createNote() {
    rl.question('Digite o título da anotação: ', (title) => {
        rl.question('Digite a anotação: ', (content) => {
            const filePath = path.join(notasDir, `${title}.txt`);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Anotação "${title}" criada com sucesso.`);
            run(); // Volta ao menu principal após criar a anotação
        });
    });
}

function readNote() {
    rl.question('Qual o título da anotação: ', (title) => {
        const filePath = path.join(notasDir, `${title}.txt`);
        if (fs.existsSync(filePath)) {
            console.log('------------------------------------');
            console.log(`Título: ${title}`);
            console.log(fs.readFileSync(filePath, 'utf-8'));
            console.log('------------------------------------');
        } else {
            console.log('Anotação não encontrada.');
        }
        run(); // Volta ao menu principal após ler a anotação
    });
}
function deleteNote() {
    rl.question('Qual o título da anotação que deseja excluir: ', (title) => {
        const filePath = path.join(notasDir, `${title}.txt`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            console.log(`Anotação "${title}" excluída com sucesso.`);
        } else {
            console.log('Anotação não encontrada.');
        }
        run(); // Volta ao menu principal após ler a anotação
    });
}

rl.on("SIGINT", () => { // Captura Ctrl+C
    rl.question("Deseja realmente sair? s/n ", (answer) => {
        if (answer.trim().toLowerCase() === "s") {
            rl.close();
            process.exit(0)
        } else {
            run();
        }
    });
});

run(); // Inicia o programa
