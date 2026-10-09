# Portais — RPG em HTML

A versão mais recente é **Portais_3D_v8.html**.

## Baixar e jogar

1. No GitHub, clique em **Code → Download ZIP**.
2. Extraia o arquivo ZIP.
3. Abra **Portais_3D_v8.html** no navegador.

O jogo funciona offline: imagens e sons estão incorporados ou são gerados pelo próprio HTML. O progresso fica salvo neste navegador. Use **Novo jogo** no menu para reiniciar, com confirmação.

## Controles

- **WASD / setas:** mover. **Botão direito:** mover até o ponto clicado, seguindo uma rota pelo mapa.
- **J / Espaço / clique:** atacar. Faça ataques em sequência para executar corte, revés e finalizador. Um ataque pressionado durante a animação entra na fila para o próximo golpe.
- **Shift / K:** esquivar e cancelar o combo atual.
- **Q:** Corte Cruzado, desbloqueado no nível 2, com recarga de 6 segundos.
- **I:** perfil, atributos e equipamentos.
- **E:** interagir com o portal.
- **Esc:** fechar painel ou abrir o menu de pausa.
- **♫:** ativar ou silenciar os sons.

No celular, use os botões de toque. Os sons começam após uma interação com o jogo, conforme as regras do navegador.

## Novidades da v4

Combo de três golpes com finalizador mais forte, sons de lâmina e impacto, faíscas e pausa breve nos acertos. Mobs comuns recuam e ficam brevemente atordoados. Colisões, menu, salvamento e Corte Cruzado da v3 foram mantidos.

## Novidades da v5

Jogo ocupa toda a janela, com retrato circular e barras compactas sobre o cenário. Novas árvores, pedras e troncos detalhados; os obstáculos mantêm bases visíveis. Inimigos mostram as áreas de perigo antes dos ataques e a recuperação depois deles. HUD com ícones, recargas visuais e vida e estado do inimigo; controles de toque também indicam recarga.

## Novidades da v6

Sprites novos em alta resolução para goblins, conjuradores e o Guardião da Fenda, com poses de frente e costas, movimento e ataques. As marcas no chão foram removidas dos mobs comuns e mantidas nos ataques do chefe. HUD em tela cheia, colisões, combo e salvamento foram preservados.

## Novidades da v7 — mundo 3D

Motor WebGL com Three.js incorporado ao HTML: cenário, caçador, mobs e chefe são malhas 3D. Câmera isométrica, iluminação e sombras, retrato do modelo, pernas e braços articulados com transições de movimento, portais com shader animado e efeitos tridimensionais. O botão direito permite andar pelo mapa com cálculo de rota; WASD e controles de toque continuam disponíveis.

Esta versão estabelece uma base 3D estilizada com modelos procedurais. A referência de League of Legends orienta a câmera e a leitura de combate; os modelos ainda têm um acabamento simples. O navegador precisa oferecer suporte a WebGL. Não há dependências de rede durante o jogo.

## Novidades da v8 — identidade dos personagens

Modelos 3D próprios com casaco escuro, cabelo e duas lâminas no caçador; goblin com orelhas pontudas e equipamento de couro; mago de capuz, vestes bordadas e cajado; guardião com placas de pedra violeta e chifres curvos. Pernas, joelhos, braços e cotovelos continuam articulados. Texturas pintadas de tecido, rosto e pedra dão acabamento aos materiais.

O cenário usa texturas de grama e terra incorporadas, troncos com casca, raízes, galhos e copas feitas de folhas instanciadas, além de pedras irregulares. Os modelos são uma evolução artesanal da base procedural, ainda não equivalentes a personagens produzidos para um jogo comercial como League of Legends. Combate, colisões, salvamento, avisos apenas do chefão e controles existentes foram preservados.

Validação em Chromium: combo, colisões, esquiva, especial, áudio, menu e perfil; seleção do chão e rota por clique; animação das articulações; reconstrução e descarte de geometrias nas trocas de mapa; layout desktop e celular. Sem erros de JavaScript ou shader e sem requisições externas durante o jogo.
