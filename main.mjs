import { TarefaController } from "./tarefa_controller.mjs";

const controller = new TarefaController();

const descricaoInput = document.getElementById('descricaoInput');
const btnAdicionar = document.getElementById('btnAdicionar');
const tarefasList = document.getElementById('tarefasList');
const descricaoEditar = document.getElementById('descricaoEditar');
const btnSalvarEdicao = document.getElementById('btnSalvarEdicao');
const mensagemContainer = document.getElementById('mensagemContainer');
const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));

let tarefaIdEditando = null;

function mostrarMensagem(texto, tipo = 'success') {
    mensagemContainer.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            ${texto}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>
    `;

    setTimeout(() => {
        const alerta = mensagemContainer.querySelector('.alert');
        if (alerta) {
            alerta.classList.remove('show');
        }
    }, 3500);
}


document.addEventListener('DOMContentLoaded', () => {
    renderizarTarefas();
    descricaoInput.focus();
});

btnAdicionar.addEventListener('click', adicionarTarefa);
descricaoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        adicionarTarefa();
    }
});

btnSalvarEdicao.addEventListener('click', salvarEdicao);
descricaoEditar.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        salvarEdicao();
    }
});

function adicionarTarefa() {
    const descricao = descricaoInput.value.trim();
    
    if (descricao === '') {
        mostrarMensagem('Por favor, digite uma descrição para a tarefa!', 'danger');
        descricaoInput.focus();
        return;
    }

    const resultado = controller.adicionarTarefa(descricao);

    if (!resultado.sucesso) {
        mostrarMensagem(resultado.erros.join(' '), 'danger');
        descricaoInput.focus();
        return;
    }

    descricaoInput.value = '';
    descricaoInput.focus();
    mostrarMensagem('Tarefa salva com sucesso.', 'success');
    renderizarTarefas();
}

function renderizarTarefas() {
    const tarefas = controller.listarTarefas();
    
    tarefasList.innerHTML = '';

    if (tarefas.length === 0) {
        tarefasList.innerHTML = '<li class="list-group-item msg-vazia">Nenhuma tarefa ainda.</li>';
        return;
    }

    tarefas.forEach(tarefa => {
        const liItem = document.createElement('li');
        liItem.className = `list-group-item tarefa-item ${tarefa.concluida ? 'concluida' : ''}`;
        liItem.id = `tarefa-${tarefa.id}`;

        const content = document.createElement('div');
        content.className = 'tarefa-content';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'form-check-input';
        checkbox.checked = tarefa.concluida;
        checkbox.addEventListener('change', () => {
            alternarConclusao(tarefa.id);
        });

        const texto = document.createElement('span');
        texto.className = 'tarefa-texto';
        texto.textContent = tarefa.descricao;

        content.appendChild(checkbox);
        content.appendChild(texto);

        const acoes = document.createElement('div');
        acoes.className = 'tarefa-acoes';

        const btnEditar = document.createElement('button');
        btnEditar.className = 'btn btn-sm btn-warning';
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => {
            abrirEdicao(tarefa.id, tarefa.descricao);
        });

        const btnRemover = document.createElement('button');
        btnRemover.className = 'btn btn-sm btn-danger';
        btnRemover.textContent = 'Remover';
        btnRemover.addEventListener('click', () => {
            removerTarefa(tarefa.id);
        });

        acoes.appendChild(btnEditar);
        acoes.appendChild(btnRemover);

        liItem.appendChild(content);
        liItem.appendChild(acoes);

        tarefasList.appendChild(liItem);
    });
}

function alternarConclusao(id) {
    controller.alternarConclusao(id);
    renderizarTarefas();
}

function removerTarefa(id) {
    if (confirm('Tem certeza que deseja remover esta tarefa?')) {
        const resultado = controller.removerTarefa(id);
        if (resultado.sucesso) {
            mostrarMensagem('Tarefa excluída com sucesso.', 'success');
        } else {
            mostrarMensagem(resultado.erros.join(' '), 'danger');
        }
        renderizarTarefas();
    }
}

function abrirEdicao(id, descricao) {
    tarefaIdEditando = id;
    descricaoEditar.value = descricao;
    descricaoEditar.focus();
    editarModal.show();
}

function salvarEdicao() {
    const novaDescricao = descricaoEditar.value.trim();
    
    if (novaDescricao === '') {
        mostrarMensagem('A descrição não pode ser vazia!', 'danger');
        descricaoEditar.focus();
        return;
    }

    if (tarefaIdEditando) {
        const resultado = controller.atualizarTarefa(tarefaIdEditando, { descricao: novaDescricao });

        if (!resultado.sucesso) {
            mostrarMensagem(resultado.erros.join(' '), 'danger');
            return;
        }

        editarModal.hide();
        mostrarMensagem('Tarefa alterada com sucesso.', 'success');
        renderizarTarefas();
    }
}
