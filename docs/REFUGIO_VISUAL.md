# Sistema visual dos mapas — base v5

## Escopo e preservação

HTML5 Canvas 2D, grade isométrica 32 × 16. Não há migração de engine. Após avaliação do piloto, o usuário autorizou aplicar o mesmo padrão aos mapas `hub` e `dungeon`. Mapas, colisões, água, portais, posições dos inimigos, movimentação, combate, IA, progressão, inventário, HUD e salvamento mantêm o código anterior. Os dois mapas usam o catálogo, e a dungeon recebe vegetação retorcida, cristais e ruínas.

## Arquivos

- `assets/environment/refuge/objects.png`: carvalho, pinheiro, árvore antiga, rochas, samambaia, tronco, coluna e portal.
- `assets/environment/refuge/terrain.png`: grama, musgo, grama seca, terra úmida, trilha, pedras antigas, folhas e água.
- `assets/environment/refuge/details.png`: ponte, lanterna, altar e cogumelos.
- `assets/environment/dungeon/objects.png`: árvore retorcida, cristais rúnicos, arco de ruínas e tronco com cogumelos.
- `catalog.json`: recortes normalizados, categorias, atlas, tamanho de exibição, origem e transparência.
- `renderer.js`: integração visual editável; marcadores de dados substituídos pelo script.
- `scripts/embed-refuge.py`: gera novamente o bloco incorporado no HTML. Executar `python3 scripts/embed-refuge.py` na raiz do repositório.

O catálogo é a fonte dos recortes; os atlas gerados não possuem células de objetos perfeitamente uniformes. Não dividir automaticamente a folha de objetos em oito retângulos iguais. Os PNGs foram produzidos por geração de imagens para este piloto e inspecionados no jogo; não são assets de um pacote comercial nem modelos 3D.

## Como desenhamos

O carregamento prepara recortes transparentes uma vez, remove margens vazias e monta pequenos canvases em duas vezes a resolução lógica. A exibição usa vizinho mais próximo, sem suavização. Os terrenos são recortados em losangos e reutilizados em cache; a trilha recebe bordas de musgo conforme os vizinhos. Variações são determinísticas e agrupadas por áreas.

Cada objeto é alinhado pela sua base. Objetos do cenário entram na mesma lista de profundidade dos personagens. Árvores reduzem opacidade quando a imagem encobre o protagonista; uma indicação discreta da célula sólida permanece no chão. Sombras são desenhadas abaixo dos objetos. A estrutura do portal muda, mas seu efeito animado, posição e interação permanecem. Lanternas usam os pontos de luz existentes.

Decorações não escrevem em `M`, não criam colisões e não geram recompensas. Não adicionar objetos altos no meio de uma trilha; raízes e copas podem avançar visualmente, mas não ampliam a colisão. Objetos grandes que cruzem várias células podem exigir divisão em partes antes de sua integração.

Quando os PNGs ainda não carregaram, o cenário anterior continua disponível. Os PNGs, catálogo e integração também ficam incorporados ao HTML: jogar não exige internet, Python ou Node.

## Validação

`tests/refuge-art.cjs` usa Playwright e Chromium. Requer `playwright` disponível no Node e Chromium em `/usr/bin/chromium`. Executar `node tests/refuge-art.cjs`. O teste compara com a base no commit `26eb96e`, verifica igualdade do código anterior à seção de desenho, mudança visual do Refúgio, preservação do código funcional e visibilidade de mobs atrás de objetos, carregamento dos atlas, cache estável, renderização desktop e celular, ausência de erros e de requisições externas. Capturas ficam em `/tmp/portais-refuge-pilot*.png`.

Também foram executados os testes existentes de combo, esquiva, colisão com mobs, linha de visão, especial, áudio, menu, perfil e acesso às duas pontes e ao portal. O ensaio de 60 quadros no Chromium desta máquina registrou cerca de 27 ms por quadro em 1280 × 800; não é uma garantia de desempenho em celulares reais. Os PNGs incorporados aumentam o tamanho do HTML offline.

## Expansão à Floresta da Fenda

O mesmo catálogo agora contém 24 objetos e oito terrenos. A entrada usa grama e trilhas; a região central usa musgo escuro; trechos inferiores recebem folhas caídas; a arena do chefe usa pavimentação antiga. Cristais, troncos e árvores retorcidas substituem os obstáculos simples exclusivamente no desenho. Um arco monumental ocupa uma célula já sólida junto à arena. Névoa discreta aparece em três regiões do mapa, sem novos estados de jogo. Portais de ida e volta e lanternas usam o mesmo padrão de sprites.

Não há árvores decorativas sólidas no meio dos caminhos. As decorações baixas evitam trilhas e o piso da arena. A grade de colisões, coordenadas do portal e posições de todos os inimigos e do chefe são exatamente as anteriores.

Validação atual: código funcional inalterado; nova distribuição de obstáculos e detecção de oclusão de mobs; capturas da entrada, região central e chefe na dungeon; desktop/celular; carregamento sem requisições externas; cache estável após trocas entre os mapas; regressão de combate. Capturas da dungeon ficam em `/tmp/portais-dungeon-*.png`.

O banco e a fogueira do Refúgio continuam com o desenho anterior. Personagens e HUD não foram redesenhados nesta tarefa de cenário.

## Visibilidade dos caminhos e inimigos

Árvores altas são espaçadas e não são escolhidas junto às trilhas. As bordas da arena recebem obstáculos baixos; o arco monumental permanece. Os elementos baixos conservam a indicação da célula sólida sem ampliar colisões.

A detecção de oclusão considera a área desenhada de todos os personagens vivos, incluindo goblins, magos e o chefe, e respeita a ordem de profundidade. Quando um objeto encobre um ator, sua parte superior usa 13% de opacidade; os últimos dez pixels da base continuam opacos. Isso mantém a leitura do obstáculo sem esconder o combate. Decorações baixas são menos frequentes e evitam a proximidade imediata dos atores.

O teste valida um mob atrás e à frente da árvore e a baixa densidade de árvores altas nas células sólidas visíveis. Nenhuma célula, colisão ou posição funcional foi alterada.

## Terrenos e variedade natural

As bordas entre terrenos diferentes agora usam mistura de pixels das texturas vizinhas, com padrão determinístico e sem filtro de borrão. Cada combinação de terreno e vizinhança é preparada uma única vez e reutilizada em cache. A base do losango é preenchida para evitar pequenos buracos de transparência nos encaixes. A água mantém sua borda e colisão existentes.

O atlas `assets/environment/shared/low-obstacles.png` contém muro com musgo, toco com raízes, degraus em ruínas e rochas com cogumelos. Todos ocupam células já sólidas, usam silhuetas baixas e participam da transparência para atores. O setor sudoeste da dungeon recebe mais cogumelos baixos fora das trilhas; a região do chefe mantém seu piso antigo e área livre de decorações.

Água recebe ondulações discretas; lanternas variam suavemente a intensidade; cristais e rochas com cogumelos têm um brilho fraco. Essas animações não mudam colisões ou estados de jogo.

## Som ambiente

Dois canais Web Audio reutilizáveis sintetizam vento e água com ruído filtrado. O áudio usa o contexto já existente, após interação do usuário. O volume do riacho depende da proximidade no Refúgio; a dungeon recebe vento mais grave. O botão de áudio existente silencia tudo. Pausa e aba oculta também silenciam o ambiente, com transição gradual de volume. Não há arquivos de áudio externos ou alterações no salvamento.

Validação adicional: presença de água perto do riacho, vento na dungeon, silêncio na pausa e ao silenciar áudio. Código funcional anterior à seção de desenho permanece igual à versão anterior.

## Ruínas Ancestrais — primeiro lugar reconhecível

A região central da dungeon (aproximadamente x=15–25, y=3–15) recebe um pátio de pedra antiga com limite orgânico, calculado por uma influência elíptica. Pedra e musgo se misturam gradualmente nas bordas com o sistema de transições existente. O mapa funcional não participa desse cálculo.

O atlas `assets/environment/dungeon/ancestral-ruins.png` adiciona laje gravada, santuário, estátua de guardião quebrada e escombros com relevos. O santuário ocupa a célula já sólida (20,7), a estátua (21,12) e os escombros (18,10) e (23,10). Muros, colunas e degraus reforçam as margens do pátio. Objetos mantêm silhuetas moderadas e a transparência para atores.

Lajes gravadas em (19,8), (22,10) e (19,13) são desenhadas na camada do chão, antes dos personagens. São decoração plana, sem interação ou colisão adicional. A arena do chefe e o Refúgio não receberam alterações nessa etapa.

Validação: presença dos marcos nas células existentes, piso de pedra no centro, código funcional intacto, imagem do Refúgio idêntica, transparência de obstáculos, cache estável, desktop/celular, áudio e regressão do combate.
