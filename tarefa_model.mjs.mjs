export class Tarefa {
    constructor(id = null, descricao = '', concluida = false) {
        this.id = id ?? crypto.randomUUID();
        this.descricao = descricao;
        this.concluida = concluida;
    }

    static validar(dados) {
        const erros = [];
        if (!dados.descricao || dados.descricao.trim() === '') {
            erros.push('A descrição é obrigatória.');
        }
        if (typeof dados.concluida !== 'boolean') {
            erros.push('Concluída inválida. Deve ser um valor booleano.');
        }
        return erros;
    }
}