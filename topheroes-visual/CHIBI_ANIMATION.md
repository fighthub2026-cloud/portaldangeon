# GIF do mago com peças reais

Prévia: [`references/chibi-mage-actions.gif`](references/chibi-mage-actions.gif).

O personagem foi montado a partir das peças do lado direito de [`references/chibi-mage-modular-concept.png`](references/chibi-mage-modular-concept.png). As 13 imagens extraídas, com transparência, estão em [`chibi-mage-assets/`](chibi-mage-assets/). O arquivo `parts.json` registra recortes da prancha original, limites visíveis e hashes dos PNGs. Os pivôs ali são sugestões de preparação, não um rig exportado para a engine.

Não foram geradas imagens novas para cada quadro nem usado o personagem inteiro do lado esquerdo como recorte móvel. Cabeça, rosto, tronco, mangas, mãos, botas, cajado e efeito são compostos separadamente. O fundo verde foi removido com Canvas, preservando os contornos das peças.

## Movimento

As poses vieram do `Animations.scml` da valquíria enviado pelo usuário anteriormente, com ajustes de escala, centros, ligação do cajado à mão e ordem de desenho para o mago. Esse SCML não é o ZIP de monstros cujo download excedeu o limite da ferramenta. O arquivo de terceiros e seus PNGs não foram republicados.

O GIF reúne as 17 ações do arquivo: Idle, Idle Blinking, Walking, Running, Slashing, Throwing, Kicking, Run Slashing, Run Throwing, Sliding, Jump Start, Jump Loop, Slashing in The Air, Throwing in The Air, Falling Down, Hurt e Dying. A pose estática `Base` não aparece como ação.

Para a apresentação, alguns ciclos se repetem e há pequenas transições entre clipes. As poses de salto receberam deslocamento vertical; a queda foi alinhada ao chão para manter o personagem no enquadramento. O cajado permanece equipado durante as ações, incluindo as poses de lançamento; a prévia não implementa projéteis ou regras de combate.

## Entrega e verificação

- GIF em loop, 640 × 440, 474 quadros, aproximadamente 30 quadros por segundo e 15,8 segundos de duração. O formato GIF alterna atrasos de 30 e 40 ms para representar essa taxa.
- As 17 ações foram renderizadas sem erros de execução. Todos os quadros foram conferidos para evitar cortes nas bordas e no rodapé.
- Cabeça, corpo e membros usam imagens rígidas com transformações contínuas; isso permite avaliar o padrão compacto sem repetir as emendas do avatar alongado.
- A prévia cobre uma vista. Não entrega oito direções, máscaras de recoloração ou integração com Unity/Godot.
