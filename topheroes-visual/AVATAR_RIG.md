# Primeiro teste de esqueleto 2D

Abra `avatar-rig.html` no navegador. O arquivo incorpora o atlas, os controles e o código: não precisa de instalação, bibliotecas ou internet depois do download.

## O que foi preparado

- Uma vista frontal do corpo-base careca, descalço e de cueca.
- Doze peças ilustradas transparentes, em `avatar-rig-assets/`.
- Cabeça, tronco, quadril, mãos abertas, punhos e pés separados.
- Braços e pernas completos deformados por malhas texturizadas contínuas, com juntas em ombro/cotovelo/punho e quadril/joelho/tornozelo.
- Alternativa de braço/antebraço e coxa/canela separados, incluída nas peças.
- Respiração, caminhada no lugar e um soco lateral de estudo.
- Troca da mão relaxada por punho, interpolação de poses e transição entre ações.
- Inspeção dos ossos, pausa, posição no ciclo, velocidade e zoom.
- Teste de pele, preservando o desenho original como referência restaurável.

O personagem não é uma imagem inteira balançando: os membros possuem articulações e a arte se deforma com elas. O soco usa poses planejadas de preparação, extensão e recuperação. Isso ainda não equivale à animação final de combate.

## Arquivos

- `avatar-rig.html`: demonstração completa, autocontida.
- `avatar-rig-assets/source-atlas.png`: arte original gerada para as peças.
- `avatar-rig-assets/*.png`: peças recortadas do atlas, com transparência e preparação das sobreposições. Os braços/pernas completos têm suavização de alpha nas extremidades; mãos e pés têm suavização na região de encaixe.
- `avatar-rig-assets/rig.json`: recortes no atlas e tamanhos/pivôs do estudo.
- `avatar-rig-assets/rig-runtime.js`: implementação Canvas 2D para consulta e reaproveitamento.
- `references/avatar-rig-preview.png`: captura real do teste no navegador.

As coordenadas `rect` do JSON se referem ao atlas original. Os PNGs individuais já estão extraídos desses recortes. `meta` configura o tamanho de exibição em unidades do rig e pivôs normalizados. Os três valores `joints` de cada membro completo identificam, na textura, as posições longitudinais das articulações.

## Uso

1. Escolha Respirar, Caminhar ou Soco.
2. Use a velocidade baixa para inspecionar o movimento.
3. Ative os ossos para conferir o esqueleto.
4. Arraste a posição do ciclo para pausar em um ponto específico.
5. Experimente os tons de pele e restaure a arte original para comparar.
6. Exporte um quadro, os encaixes ou as peças, se necessário. Para várias peças, o navegador pode solicitar autorização para downloads múltiplos; o pacote ZIP também contém todas elas.

## Validação realizada

Chromium nesta máquina: carregamento das 12 peças com alpha, mudanças reais de pose nas três ações, posicionamento no ciclo, debug, exportação JSON/PNG, recoloração sem mudar olhos azuis/contornos escuros/cueca, restauração dos pixels originais e layout sem rolagem horizontal em 320 e 390 pixels. Nenhuma requisição externa nem erro de JavaScript durante esses testes.

A interface foi verificada em dimensões de celular no navegador; ainda não foi testada em um aparelho físico. A abertura foi validada por um servidor local de teste, porque a política do navegador desta máquina bloqueia navegação `file://`. A demonstração não depende desse servidor: todos os recursos usados estão incorporados no HTML.

## Limites deste estudo

Ainda é uma única vista frontal. A caminhada não percorre um mapa e o soco não atinge alvos. Não há arma, traje, cabelo, navegação em oito direções, colisões nem integração à Unity.

O encaixe da cintura, as sobreposições e a deformação em poses extremas ainda precisam de avaliação artística. As peças geradas não são um rig final aprovado. A recoloração é uma máscara inicial de pele, específica deste corpo-base; não deve ser reaproveitada para roupas sem máscaras próprias.

Para continuar, avaliar primeiro a caminhada e o soco no tamanho real do jogo. Depois ajustar os encaixes necessários e preparar a vista de gameplay isométrica, as demais direções, os diferentes tipos de mão e o primeiro traje simples.
