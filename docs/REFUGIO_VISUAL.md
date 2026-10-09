# Piloto visual do Refúgio — base v5

## Escopo e preservação

HTML5 Canvas 2D, grade isométrica 32 × 16. Não há migração de engine. Este piloto altera apenas o desenho do mapa `hub`. Mapas, colisões, água, portais, posições dos inimigos, movimentação, combate, IA, progressão, inventário, HUD e salvamento mantêm o código anterior. A dungeon permanece visualmente idêntica.

## Arquivos

- `assets/environment/refuge/objects.png`: carvalho, pinheiro, árvore antiga, rochas, samambaia, tronco, coluna e portal.
- `assets/environment/refuge/terrain.png`: grama, musgo, grama seca, terra úmida, trilha, pedras antigas, folhas e água.
- `assets/environment/refuge/details.png`: ponte, lanterna, altar e cogumelos.
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

`tests/refuge-art.cjs` usa Playwright e Chromium. Requer `playwright` disponível no Node e Chromium em `/usr/bin/chromium`. Executar `node tests/refuge-art.cjs`. O teste compara com a base no commit `1fd2baf`, verifica igualdade do código anterior à seção de desenho, igualdade dos pixels da dungeon, carregamento dos atlas, cache estável, renderização desktop e celular, ausência de erros e de requisições externas. Capturas ficam em `/tmp/portais-refuge-pilot*.png`.

Também foram executados os testes existentes de combo, esquiva, colisão com mobs, linha de visão, especial, áudio, menu, perfil e acesso às duas pontes e ao portal. O ensaio de 60 quadros no Chromium desta máquina registrou cerca de 27 ms por quadro em 1280 × 800; não é uma garantia de desempenho em celulares reais. A versão offline aumenta para aproximadamente 13 MB devido aos PNGs incorporados.

## Próxima etapa

Avaliar o Refúgio antes de estender o catálogo à dungeon. Árvores corrompidas, ruínas monumentais do chefe e transições artísticas mais elaboradas ainda precisam de produção e validação específicas. O banco e a fogueira continuam com o desenho anterior neste piloto.
