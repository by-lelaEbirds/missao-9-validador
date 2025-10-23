import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// =============================================================================
// 1. CONFIGURAÇÃO INICIAL
// =============================================================================
dotenv.config();
const app = express();
app.use(express.json()); // Essencial para ler o body de requisições POST

// =============================================================================
// 2. FUNÇÃO DE VALIDAÇÃO (A LÓGICA DA MISSÃO)
// =============================================================================

/**
 * Valida uma senha com base nas regras da Missão 9.
 * Utiliza Regex para o desafio bônus.
 */
const validarSenha = (senha: string) => {
    const erros: string[] = [];

    // Regra 1: Mínimo de 8 caracteres
    if (senha.length < 8) {
        erros.push("A senha precisa ter no mínimo 8 caracteres.");
    }

    // Regra 2: Pelo menos 1 letra maiúscula (Bônus Regex)
    if (!/[A-Z]/.test(senha)) {
        erros.push("A senha precisa ter pelo menos 1 letra maiúscula.");
    }

    // Regra 3: Pelo menos 1 número (Bônus Regex)
    if (!/[0-9]/.test(senha)) {
        erros.push("A senha precisa ter pelo menos 1 número.");
    }

    // Regra 4: Pelo menos 1 caractere especial (Bônus Regex)
    if (!/[!@#$%^&*]/.test(senha)) {
        erros.push("A senha precisa ter pelo menos 1 caractere especial (ex: !@#$%^&*).");
    }

    // Retorna o resultado final
    if (erros.length > 0) {
        return { valida: false, erros: erros };
    } else {
        return { valida: true };
    }
};

// =============================================================================
// 3. ENDPOINTS DA API
// =============================================================================

// Rota principal para verificar se a API está no ar
app.get('/', (req: Request, res: Response) => {
    res.send('Missão 9 - O Validador de Senhas - API no ar!');
});

// Endpoint oficial da missão (para ferramentas como Hoppscotch/Postman)
app.post('/validar-senha', (req: Request, res: Response) => {
    const { senha } = req.body;

    // Verifica se a senha foi enviada no corpo da requisição
    if (!senha) {
        return res.status(400).json({ valida: false, erros: ["Nenhuma senha foi fornecida no corpo (body) da requisição."] });
    }

    const resultado = validarSenha(senha as string);

    // Retorna 400 (Bad Request) se a senha for inválida
    if (!resultado.valida) {
        return res.status(400).json(resultado);
    }

    // Retorna 200 (OK) se a senha for válida
    return res.status(200).json(resultado);
});

// =============================================================================
// 4. ENDPOINT DE TESTE (Para testar 100% pelo navegador)
// =============================================================================

// Esta rota especial lê a senha da URL (query parameter)
// Exemplo: /teste-senha?senha=MinhaSenhaForte!123
app.get('/teste-senha', (req: Request, res: Response) => {
    const { senha } = req.query; // Pega a senha da URL

    if (!senha) {
        return res.status(400).json({ 
            valida: false, 
            erros: [
                "Nenhuma senha foi fornecida.",
                "Use a URL assim: .../teste-senha?senha=sua_senha_aqui"
            ] 
        });
    }

    const resultado = validarSenha(senha as string);

    if (!resultado.valida) {
        return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);
});


// =============================================================================
// 5. INICIANDO O SERVIDOR
// =============================================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
