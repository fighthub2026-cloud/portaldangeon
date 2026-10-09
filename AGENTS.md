# Direção atual do projeto

Decisão do usuário em 2026-10-09: voltar à v5 e trabalhar em cima dela.

- A base ativa é `Portais_Floresta_v5.html`, com visual 2D.
- O usuário rejeitou o resultado visual da evolução 3D, incluindo a v8.
- Próximas melhorias devem partir da v5 e preservar sua identidade visual.
- Não continuar a evolução das versões v6, v7 ou v8 nem retomar a migração para 3D sem uma nova solicitação do usuário.
- As outras versões podem permanecer como histórico.
- Depois da escolha da base, o usuário autorizou melhorar primeiro uma área do mapa. O refúgio da v5 foi renovado com clareira, trilhas, riacho, pontes e pontos marcantes. Avaliar esta área antes de expandir as mudanças ao mapa inteiro.

- O usuário autorizou aplicar o mesmo padrão em todo o jogo. O catálogo PNG e os terrenos atendem ao Refúgio e à dungeon, com variações de cenário da Floresta da Fenda. Fontes em `assets/environment/refuge` e `assets/environment/dungeon`, incorporação por `scripts/embed-refuge.py`. Preservar os sistemas de jogo e a base v5 2D.

- Priorizar a visibilidade dos caminhos e mobs: árvores altas espaçadas, obstáculos baixos junto a trilhas e arena, e transparência da parte superior quando encobrir qualquer ator vivo. Manter bases e colisões legíveis.

- Terrenos usam transições de pixels em cache. Obstáculos baixos adicionais em `assets/environment/shared`. Som ambiente usa o contexto de áudio existente e deve respeitar mute, pausa e aba oculta; não modificar combate ou salvamento para efeitos ambientais.

- Ruínas Ancestrais implantadas visualmente no trecho central da dungeon. Preservar marcos em células já sólidas, inscrições na camada do chão e leitura do combate. Fontes do novo atlas em `assets/environment/dungeon/ancestral-ruins.png`.
