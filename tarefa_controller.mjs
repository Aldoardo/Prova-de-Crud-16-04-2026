import { Tarefa } from "../model/tarefa_model.mjs.mjs";
import { TarefaService } from "../service/tarefa_service.mjs";

export class TarefaController {
    constructor() {
        this.service = new TarefaService();
    }

    adicionarTarefa(descricao) {
        const dados = {
            descricao,
            concluida: false
        };

        const erros = Tarefa.validar(dados);
        if (erros.length > 0) {
            return { sucesso: false, erros, acao: 'salvar' };
        }

        const tarefas = this.service.buscarTodas();
        const novaTarefa = new Tarefa(null, descricao, false);
        tarefas.push(novaTarefa);
        this.service.salvarTodas(tarefas);
        return { sucesso: true, tarefa: novaTarefa, acao: 'salvar' };
    }

    listarTarefas() {
        return this.service.buscarTodas();
    }

    atualizarTarefa(id, novosDados) {
        const tarefas = this.service.buscarTodas();
        const tarefa = tarefas.find(t => t.id === id);
        
        if (!tarefa) {
            return {
                sucesso: false,
                erros: ['Tarefa não encontrada.'],
                acao: 'alterar'
            };
        }

        const dadosParaValidar = {
            descricao: novosDados.descricao !== undefined ? novosDados.descricao : tarefa.descricao,
            concluida: novosDados.concluida !== undefined ? novosDados.concluida : tarefa.concluida
        };

        const erros = Tarefa.validar(dadosParaValidar);
        if (erros.length > 0) {
            return { sucesso: false, erros, acao: 'alterar' };
        }

        if (novosDados.descricao !== undefined) {
            tarefa.descricao = novosDados.descricao;
        }
        if (novosDados.concluida !== undefined) {
            tarefa.concluida = novosDados.concluida;
        }

        this.service.salvarTodas(tarefas);
        return { sucesso: true, tarefa, acao: 'alterar' };
    }

    removerTarefa(id) {
        const tarefas = this.service.buscarTodas();
        const index = tarefas.findIndex(t => t.id === id);
        
        if (index !== -1) {
            const tarefaRemovida = tarefas.splice(index, 1);
            this.service.salvarTodas(tarefas);
            return { sucesso: true, tarefa: tarefaRemovida[0], acao: 'excluir' };
        }

        return {
            sucesso: false,
            erros: ['Tarefa não encontrada.'],
            acao: 'excluir'
        };
    }

    alternarConclusao(id) {
        const tarefas = this.service.buscarTodas();
        const tarefa = tarefas.find(t => t.id === id);
        
        if (tarefa) {
            tarefa.concluida = !tarefa.concluida;
            this.service.salvarTodas(tarefas);
            return { sucesso: true, tarefa, acao: 'alterar' };
        }
        return { sucesso: false, erros: ['Tarefa não encontrada.'], acao: 'alterar' };
    }
}
