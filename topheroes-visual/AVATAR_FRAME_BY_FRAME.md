# Avatar: estudo de sprites quadro a quadro

Esta versão usa 24 desenhos completos, reproduzidos em sequência. Não usa o esqueleto do teste anterior para deformar membros durante a reprodução.

## Abrir

Extraia o pacote e abra `avatar-frame-by-frame.html` no navegador. O HTML incorpora as três folhas e não precisa de instalação ou recursos externos. Clique em Reproduzir. É possível pausar, inspecionar cada quadro e comparar 12, 24 e 30 quadros por segundo.

## Conteúdo

- `avatar-frame-by-frame.html`: visualizador autocontido.
- `avatar-cast-frames/sheet-01.png`: preparação, quadros 01–08.
- `avatar-cast-frames/sheet-02.png`: extensão e gesto de liberação, quadros 09–16.
- `avatar-cast-frames/sheet-03.png`: recuperação, quadros 17–24.
- `avatar-cast-frames/frame-01.png` a `frame-24.png`: quadros completos com transparência, em telas de 444 × 444 pixels, usando o alinhamento vertical inicial do visualizador.
- `avatar-cast-frames/frames.json`: ordem, tamanho, velocidade inicial e estado de produção.
- `references/avatar-cast-frame-preview.gif`: prévia animada. O GIF repete a sequência com uma breve pausa inicial/final; o HTML permite examinar os PNGs com todas as cores originais.

O corpo-base está careca, descalço, de cueca e sem equipamento. O gesto prepara a mão para um futuro cajado separado. Este estudo não contém a camada do cajado nem o efeito mágico e não deve ser interpretado como a magia final saindo de uma mão vazia.

## O que foi feito

Os corpos foram gerados como desenhos inteiros em três folhas de oito quadros, seguindo a referência aprovada. As células são extraídas com a mesma escala de folha; não são ajustadas individualmente ao tamanho da silhueta. Pixels quase transparentes de ruído do atlas foram limpos na extração. Um alinhamento vertical opcional aproxima os apoios dos pés sem redimensionar ou deformar a arte.

A velocidade inicial de 24 fps reproduz os 24 desenhos em aproximadamente um segundo. Rodar o aplicativo a 60 Hz não inventa desenhos intermediários. O seletor muda a velocidade de exibição, não a qualidade nem a quantidade dos desenhos.

## Limites que ainda precisam de avaliação

Esta é uma primeira sequência para comparar o método de sprites com o rig anterior. A geração independente dos quadros pode variar rosto, proporções, posição das mãos e apoios. O alinhamento de base não corrige essas diferenças de desenho. A sequência ainda exige revisão artística antes de ser um guia definitivo de produção.

Não há nesta entrega máscaras de recoloração, camadas de arma/mão, equipamento intercambiável, animações das demais direções ou um segundo traje. Nenhuma dessas funções deve ser considerada pronta apenas porque os quadros podem ser reproduzidos.

## Como continuar nas roupas

Primeiro aprovar e corrigir a sequência-base em reprodução. Depois fixar por quadro a mesma tela, escala, apoio no chão, cabeça, anatomia e posição/orientação da empunhadura.

Cada traje futuro precisa de seus próprios desenhos sobre esse guia, respeitando esses pontos e a mesma temporização. Os arquivos de animação podem ser reutilizados; roupa, dobras, capa, acessórios e oclusões precisam ser desenhados para cada pose. Não basta aplicar uma roupa parada sobre todos os corpos.

O cajado será uma camada separada, com origem de empunhadura e ponta de emissão próprias. A mão frontal deve ocultar a haste corretamente. O efeito mágico também ficará separado. Diâmetros ou empunhaduras diferentes podem exigir outro desenho de mão.

Produzir máscaras de cores junto com os quadros de cada traje, incluindo proteção de contornos, olhos e detalhes. Não derivar regiões por seleção aproximada das cores da imagem pronta. Espadas e arcos terão suas próprias sequências, não somente uma troca de arma sobre o mesmo gesto de conjuração.

## Verificação realizada

Chromium: 24 quadros completos e distintos, transparência, reprodução e parada, repetição, avanço/retorno, inspeção, velocidades, alinhamento vertical, visualização das três folhas e exportação PNG. Layout conferido em 320 e 390 pixels de largura. Sem erros de JavaScript ou requisições externas. Isso verifica o visualizador; a aprovação artística da fluidez continua separada desses testes.
