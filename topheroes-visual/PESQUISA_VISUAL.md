# Pesquisa visual de referência: Top Heroes

## Estado

Pesquisa pendente de acesso às fontes. As tentativas de acessar Google, Google Play e a API da App Store nesta máquina receberam `403 Forbidden` do proxy de rede. Nenhuma imagem ou vídeo do jogo foi analisado nesta etapa. Este documento registra o escopo, sem apresentar hipóteses como resultados.

O objetivo deste projeto é implementar uma experiência **2D**. A tecnologia usada pelo jogo de referência deve ser investigada separadamente: uma aparência isométrica não comprova uso de sprites nem de modelos 3D.

## O que investigar

| Área | Evidências a reunir |
| --- | --- |
| Combate | Vídeos de gameplay real: posicionamento das equipes, deslocamento, cadência, animações de ataque, efeitos, dano e legibilidade em tela pequena. |
| Mapa | Capturas e vídeos de exploração: escala de personagens, tamanho de caminhos, organização de áreas, obstáculos, transições de terreno e separação entre mapa de exploração e mapa estratégico. |
| Câmera | Perspectiva, inclinação aparente, orientação, zoom e comportamento durante movimento e combate. Ângulos numéricos serão estimativas quando não houver documentação. |
| Iluminação | Direção e suavidade de sombras, luz ambiente, contraste, paleta, realces e efeitos emissivos. Distinguir o que é observável do processo técnico de produção. |
| Assets | Silhuetas, proporções, vegetação, rochas, construções, props, terrenos, variações e oclusão. |
| Sprites para a implementação 2D | Direções e quadros de personagens, ponto de origem, ordenação por profundidade, sombras, atlas, tiles e peças que exigem divisão em camadas. |

## Método

1. Confirmar a identidade do jogo e seu desenvolvedor nas lojas oficiais.
2. Reunir capturas oficiais e gameplay contínuo, distinguindo anúncios de cenas reais do jogo.
3. Registrar cada fonte com URL, data de consulta e, para vídeos, timestamps.
4. Comparar várias cenas de exploração e combate antes de recomendar câmera, escala e direção de arte.
5. Produzir recomendações de implementação 2D em PixiJS, indicando quais decisões são observações, estimativas ou propostas próprias.

Nenhum asset do jogo de referência foi copiado. A pasta contém somente dependências de desenvolvimento e documentação inicial.
