import { Tarefa } from "./tarefa_model.mjs.mjs";

const KEY = "tarefas";

export class TarefaService {
    salvarTodas(tarefas) {
        localStorage.setItem(KEY, JSON.stringify(tarefas));
    }

    buscarTodas() {
        const tarefas = localStorage.getItem(KEY);
        if (tarefas) {
            return JSON.parse(tarefas);
        }
        return [];
    }
}
