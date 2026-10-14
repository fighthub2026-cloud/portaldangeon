# Estudo de direção chibi compacta

Referências fornecidas pelo usuário: peças de personagem CraftPix, prévia do personagem montado e `Animations.scml`. A nova proposta visual está em [`references/chibi-compact-base.png`](references/chibi-compact-base.png).

## O que a referência mostra

- Cabeça muito grande, tronco pequeno e membros curtos.
- Contorno escuro grosso, formas arredondadas e poucas áreas de sombra.
- Rosto separado da cabeça, com expressões alternativas.
- Corpo, braços, mãos, pés e equipamento em imagens próprias.
- Sobreposições que escondem os encaixes: cabeça sobre pescoço, corpo/manga sobre braço, mão/luva sobre punho e bota sobre perna.

Isso é diferente do avatar anterior, mais alongado e com acabamento pintado. A imagem nova adapta a linguagem visual para uma base original, careca, de cueca e sem equipamento. É uma referência de aparência, ainda sem peças exportadas, rig ou máscaras de cor.

## Inspeção do SCML

O arquivo foi lido como dados XML. Formato `spriter_data`, SCML 1.0, gerador BrashMonkey Spriter r11, entidade `Valkyrie`.

- 14 imagens referenciadas: corpo, cabeça, braços, mãos, espada, pernas/pés, três expressões faciais, efeito de corte e escudo.
- 9 ossos.
- 18 sequências, incluindo a pose `Base` e 17 animações.
- Posição, ângulo, escala, hierarquia e ordem de desenho estão registrados nas timelines.
- Os arquivos referenciados não estão incorporados ao SCML.
- Não há `character_map` declarado neste arquivo; troca de traje não está automaticamente configurada.

Sequências: Base, Idle, Idle Blinking, Slashing, Throwing, Kicking, Walking, Running, Run Slashing, Run Throwing, Sliding, Jump Start, Jump Loop, Slashing in The Air, Throwing in The Air, Falling Down, Hurt e Dying.

O arquivo da referência usa animação por peças e ossos. Isso pode ser usado como ferramenta de autoria e depois exportado em quadros completos, compatíveis com a reprodução por sprites desejada pelo usuário. A existência do SCML não comprova uma integração pronta à Unity.

## Aplicação ao projeto

1. Aprovar as proporções e o acabamento da nova base.
2. Preparar as peças desde o desenho, sem repetir os recortes inadequados do teste anterior.
3. Validar sobreposições, expressões e movimento em uma única vista.
4. Se a entrega para o jogo continuar sendo quadro a quadro, exportar a sequência com escala e origem fixas.
5. Cada traje completo pode ser um conjunto de peças compatíveis, trocado de uma vez, ou uma sequência própria de quadros seguindo o mesmo guia.
6. Armas e efeitos continuam separados. Cores independentes precisam de máscaras próprias por região, com contornos protegidos.

A referência enviada cobre uma vista lateral/três quartos. Não fornece por si só todas as vistas necessárias para o movimento em oito direções do projeto isométrico; essas artes adicionais precisam ser preparadas e validadas.

Os arquivos de terceiros não foram republicados neste estudo. Foram registrados apenas os achados da inspeção e a nova referência visual original.

## Mago adaptado ao padrão compacto

Proposta visual: [`references/chibi-mage-modular-concept.png`](references/chibi-mage-modular-concept.png). A prancha reúne o mago montado e uma apresentação das peças: cabeça sem expressão, rostos alternativos, traje com capa, mangas curtas, mãos, botinhas, cajado e efeito separados. Preserva cabelo roxo escuro, olhos ciano, roupa roxa e dourada e capa magenta.

O padrão solicitado é uma família de peças compactas com encaixes compatíveis, variando preenchimentos e silhuetas conforme o traje. Cada roupa precisa respeitar a escala, a posição do desenho no arquivo, as margens, as sobreposições e os pontos de ligação. A referência é uma proposta de aparência; a prancha ainda não contém sprites individuais com transparência, máscaras de cor, pivôs ou animações validadas. A montagem ilustrada também precisa ser conferida contra as peças reais durante a preparação do kit.
