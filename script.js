document.addEventListener('DOMContentLoaded', () => {
    const sessoesListaDiv = document.getElementById('sessoes-lista');
    const nomeNovaSessaoInput = document.getElementById('nome-nova-sessao');
    const btnCriarSessao = document.getElementById('btn-criar-sessao');

    let sessoes = [];

    // --- Funções de Persistência (localStorage) ---
    function salvarSessoes() {
        localStorage.setItem('rpgTextSessoes', JSON.stringify(sessoes));
    }

    function carregarSessoes() {
        const sessoesSalvas = localStorage.getItem('rpgTextSessoes');
        if (sessoesSalvas) {
            sessoes = JSON.parse(sessoesSalvas);
        } else {
            // Exemplo inicial se não houver nada salvo
            sessoes = [
                { nome: 'Meus Contos', links: [] },
                { nome: 'Notas de Campanha', links: [] }
            ];
        }
        renderizarSessoes();
    }

    // --- Funções de Renderização ---
    function renderizarSessoes() {
        sessoesListaDiv.innerHTML = ''; // Limpa a lista atual
        if (sessoes.length === 0) {
            sessoesListaDiv.innerHTML = '<p>Nenhuma estante criada ainda. Crie uma abaixo!</p>';
            return;
        }

        sessoes.forEach((sessao, indexSessao) => {
            const sessaoDiv = document.createElement('div');
            sessaoDiv.classList.add('sessao');
            sessaoDiv.innerHTML = `
                <h3>
                    ${sessao.nome}
                    <button class="delete-sessao-btn" data-index="${indexSessao}" title="Excluir Estante">X</button>
                </h3>
                <ul id="links-sessao-${indexSessao}">
                    ${renderizarLinks(sessao.links, indexSessao)}
                </ul>
                <div class="input-group">
                    <input type="text" id="nome-novo-link-${indexSessao}" placeholder="Nome do Pergaminho">
                    <input type="url" id="url-novo-link-${indexSessao}" placeholder="Link direto (raw) do GitHub para o .txt">
                    <button class="btn-add-link" data-index="${indexSessao}">Adicionar Pergaminho</button>
                </div>
            `;
            sessoesListaDiv.appendChild(sessaoDiv);
        });

        // Adiciona event listeners aos botões recém-criados
        adicionarEventListenersSessoes();
    }

    function renderizarLinks(links, indexSessao) {
        if (!links || links.length === 0) {
            return '<li>Nenhum pergaminho nesta estante.</li>';
        }
        return links.map((link, indexLink) => `
            <li>
                <span>${link.nome || 'Pergaminho sem nome'}</span>
                <div class="link-actions">
                    <button class="btn-view-link" data-url="${link.url}" title="Visualizar"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/></svg></button>
                    <button class="btn-copy-link" data-url="${link.url}" title="Copiar Link de Partilha"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share-fill" viewBox="0 0 16 16"><path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5"/></svg></button>
                    <button class="btn-delete-link" data-sessao-index="${indexSessao}" data-link-index="${indexLink}" title="Excluir Pergaminho"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/></svg></button>
                </div>
            </li>
        `).join('');
    }

    // --- Funções de Manipulação de Dados ---
    function criarSessao() {
        const nome = nomeNovaSessaoInput.value.trim();
        if (nome) {
            sessoes.push({ nome: nome, links: [] });
            nomeNovaSessaoInput.value = ''; // Limpa o input
            salvarSessoes();
            renderizarSessoes();
        } else {
            alert('Por favor, digite um nome para a nova estante.');
        }
    }

    function excluirSessao(indexSessao) {
        if (confirm(`Tem certeza que deseja excluir a estante "${sessoes[indexSessao].nome}" e todos os seus pergaminhos?`)) {
            sessoes.splice(indexSessao, 1);
            salvarSessoes();
            renderizarSessoes();
        }
    }

    function adicionarLink(indexSessao) {
        const nomeInput = document.getElementById(`nome-novo-link-${indexSessao}`);
        const urlInput = document.getElementById(`url-novo-link-${indexSessao}`);
        const nome = nomeInput.value.trim();
        const url = urlInput.value.trim();

        if (url && url.startsWith('http') && url.includes('github.com') || url.includes('raw.githubusercontent.com')) { // Validação básica de URL
             if (!sessoes[indexSessao].links) {
                 sessoes[indexSessao].links = []; // Garante que links exista
             }
            sessoes[indexSessao].links.push({ nome: nome || 'Pergaminho sem nome', url: url });
            nomeInput.value = '';
            urlInput.value = '';
            salvarSessoes();
            renderizarSessoes(); // Re-renderiza para mostrar o novo link
        } else {
            alert('Por favor, insira um nome e um link direto (raw) válido do GitHub para o arquivo .txt.');
        }
    }

    function excluirLink(indexSessao, indexLink) {
        if (confirm(`Tem certeza que deseja excluir o pergaminho "${sessoes[indexSessao].links[indexLink].nome}"?`)) {
            sessoes[indexSessao].links.splice(indexLink, 1);
            salvarSessoes();
            renderizarSessoes();
        }
    }

    function gerarLinkVisualizacao(urlTxt) {
        // Constrói a URL para o visualizador, passando a URL raw do TXT como parâmetro
        const viewerUrl = new URL('visualizador.html', window.location.href);
        viewerUrl.searchParams.set('arquivo', urlTxt);
        return viewerUrl.toString();
    }

    // --- Adicionar Event Listeners ---
    function adicionarEventListenersSessoes() {
        document.querySelectorAll('.btn-add-link').forEach(button => {
            button.onclick = (e) => adicionarLink(e.target.dataset.index);
        });
        document.querySelectorAll('.delete-sessao-btn').forEach(button => {
            button.onclick = (e) => excluirSessao(e.target.dataset.index);
        });
        document.querySelectorAll('.btn-delete-link').forEach(button => {
            button.onclick = (e) => {
                const target = e.target.closest('button'); // Garante que pegamos o botão
                excluirLink(target.dataset.sessaoIndex, target.dataset.linkIndex);
            };
        });
        document.querySelectorAll('.btn-view-link').forEach(button => {
            button.onclick = (e) => {
                const urlTxt = e.target.closest('button').dataset.url;
                const linkVisualizacao = gerarLinkVisualizacao(urlTxt);
                window.open(linkVisualizacao, '_blank'); // Abre em nova aba
            };
        });
        document.querySelectorAll('.btn-copy-link').forEach(button => {
            button.onclick = (e) => {
                const urlTxt = e.target.closest('button').dataset.url;
                const linkVisualizacao = gerarLinkVisualizacao(urlTxt);
                navigator.clipboard.writeText(linkVisualizacao).then(() => {
                    alert('Link de partilha copiado para a área de transferência!');
                }).catch(err => {
                    console.error('Erro ao copiar link: ', err);
                    alert('Erro ao copiar o link.');
                });
            };
        });
    }

    btnCriarSessao.addEventListener('click', criarSessao);

    // --- Inicialização ---
    carregarSessoes();

});

