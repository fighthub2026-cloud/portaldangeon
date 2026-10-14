# Aetheria — mapa de produção da conjuração quadro a quadro

Prancha visual: [`references/mage-cast-frame-map.png`](references/mage-cast-frame-map.png).

## Objetivo e limites desta entrega

Criar uma animação de conjuração detalhada do mago aprovado, desenhada quadro a quadro. A arte deve preservar rosto, proporções chibi, cabelo, traje roxo/magenta, metais dourados, luvas e botas marrons. A mudança de técnica substitui o teste de membros recortados: as articulações serão desenhadas em cada pose, sem expor linhas de corte.

A prancha visual é uma referência de poses e acabamento. Não é um atlas pronto para importação e não comprova alinhamento, camadas, máscaras, transparência ou temporização. Esses componentes precisam ser produzidos e conferidos nos arquivos de origem. Na prancha atual, personagem, cajado e efeitos ainda estão pintados juntos; o alinhamento e a trajetória do equipamento precisam ser regularizados antes de virar uma sequência reproduzível.

## Enquadramento que permanece fixo

- Uma única vista em três quartos de frente, voltada diagonalmente para a esquerda da tela, coerente com a câmera isométrica do jogo.
- Cajado na mão direita anatômica durante toda a sequência, posicionada à esquerda da imagem na pose neutra de referência; a mão esquerda faz o gesto de conjuração. Não espelhar nem trocar a arma de mão.
- Câmera, projeção, iluminação e escala constantes. Não aumentar a cabeça ou o corpo na hora do impacto.
- O ponto de referência é o contato no chão entre os pés. Ele permanece alinhado em todos os quadros, mesmo quando o tronco inclina.
- O movimento inicial é uma conjuração parada. Pés plantados, sem deslizamento; quadris, joelhos, ombros, mãos e tecido participam da transferência de peso.
- Cada quadro usa a mesma tela e margem de segurança, inclusive para a ponta do cajado. O recorte automático individual não pode deslocar o personagem.
- O tamanho em pixels deve ser definido pelo zoom de gameplay antes da produção final. A prancha atual define aparência, não uma resolução final já validada.

## Sequência proposta — 12 desenhos únicos, 960 ms

Os tempos são uma proposta de animação, ainda não validada em reprodução. O quadro 8 marca a emissão da magia, aos 560 ms. O quadro 7 prepara a extensão rápida, ainda sem emitir o projétil. Os desenhos têm exposições diferentes para dar aceleração ao golpe; não se deve exigir a mesma duração de todos os quadros.

| Quadro | Início | Exposição | Pose e intenção | Cajado e magia |
|---|---:|---:|---|---|
| 01 | 0 ms | 80 ms | Pronto para conjurar: postura relaxada, olhos no alvo, peso equilibrado. | Cajado quase vertical; nenhuma magia ativa. |
| 02 | 80 ms | 70 ms | Antecipação: joelhos cedem um pouco, tronco recua, ombros começam a preparar o gesto. | Mão direita traz a empunhadura ligeiramente para trás; esquerda se abre. |
| 03 | 150 ms | 70 ms | Preparação mais profunda: corpo gira discretamente, braço direito dobra, expressão fica concentrada. | Ponta do cajado sobe e recua; primeira faísca pequena, em camada separada. |
| 04 | 220 ms | 90 ms | Início da carga: tronco se estabiliza, mão esquerda aproxima-se da área da gema sem tocá-la. | Acúmulo de energia na ponta; arma mantém forma e comprimento. |
| 05 | 310 ms | 110 ms | Carga: pose comprimida, ombro direito armado, olhar firme; capa acompanha com atraso. | Energia cresce; pequenas partículas são efeitos independentes. |
| 06 | 420 ms | 100 ms | Máxima tensão: último instante de concentração; sem ficar completamente imóvel em todas as partes. | Cajado pronto para avançar; gema intensa, mas detalhes do personagem continuam legíveis. |
| 07 | 520 ms | 40 ms | Extensão preparatória: impulso rápido do ombro e braço, tronco avança, mão esquerda abre o gesto. | Cajado aponta ao alvo; energia concentrada na ponta, ainda sem projétil. |
| 08 | 560 ms | 50 ms | Liberação: braço atinge a extensão do golpe, peso à frente, rosto continua mirando. | Evento de gameplay `cast_release`; flash na ponta e início do projétil, que segue trajetória independente. |
| 09 | 610 ms | 70 ms | Reação: pequeno recuo de punho e ombro após a emissão; roupa ainda segue o avanço. | Brilho residual diminui; sem fazer o cajado entortar. |
| 10 | 680 ms | 80 ms | Recuperação: cotovelo relaxa, tronco volta, mão esquerda desce; capa alcança o movimento. | Cajado retorna por um arco curto e controlado. |
| 11 | 760 ms | 100 ms | Assentamento: postura quase inicial, tecidos e mãos concluem a recuperação. | Brilho residual termina. |
| 12 | 860 ms | 100 ms | Retorno: pose de saída compatível com o quadro 1 ou com a animação de espera. | Cajado pronto para a próxima ação. |

Doze quadros são o estudo inicial do gesto. Não equivalem a uma garantia de fluidez final. Reproduzir em tamanho real e em câmera lenta; acrescentar desenhos intermediários onde houver saltos, principalmente ombro, mão e silhueta do rosto. Rodar o jogo a 60 Hz não cria desenhos intermediários automaticamente.

## Arquivos e camadas da produção real

Cada quadro terá um documento fonte com camadas nomeadas e a mesma origem. O pacote exportado deve permitir compor:

1. **Corpo/traje completo:** roupas, botas, acessórios, luvas e pele exposta daquele traje, desenhados na pose correspondente. A mão que abraça o cajado pode precisar de uma camada frontal própria.
2. **Cabeça e opções de aparência:** cabeça/rosto, cabelo e sobrancelhas separados quando a personalização exigir. A posição acompanha o guia do quadro; não é uma cabeça colada num ponto fixo da tela.
3. **Arma:** imagem própria do cajado, sem estar pintada no personagem. A troca de cajado não exige redesenhar a roupa se o novo modelo respeitar a empunhadura e o enquadramento.
4. **Mão frontal/oclusão:** dedos que passam à frente da haste. Essa camada esconde o trecho correto da arma sem produzir frestas. A mão traseira e os trechos de arma à frente/atrás do corpo exigem ordenação ou máscaras próprias.
5. **Efeitos:** carga, flash, projétil e partículas em arquivos separados. A magia azul não deve ficar gravada na cor da roupa nem iluminar permanentemente as máscaras.
6. **Sombra de contato:** separada e alinhada ao chão; não pode carregar um pedaço de fundo pintado junto.

Exemplo de organização planejada: `cast_SW/body_outfit/`, `head/`, `hair/`, `hand_foreground/`, `weapon/`, `fx/`, `masks/` e um arquivo de dados por sequência. Os nomes de direção podem ser ajustados à convenção do projeto.

## Troca de cajado

Registrar por quadro um encaixe de empunhadura ligado à mão, com posição, rotação, escala e regra de oclusão. Cada arma terá sua própria origem de empunhadura e seu ponto de emissão da magia.

Campos planejados: `frame`, `duration_ms`, `root`, `head_anchor`, `grip_anchor`, `weapon_rotation`, `weapon_scale`, `hand_occlusion` e `release_event`. Na definição da arma: `grip_origin` e `muzzle_tip`.

As coordenadas normalizadas ainda não foram medidas. Não inventar coordenadas e apresentá-las como verificadas. Medir nos quadros aprovados, tomando a mesma tela como referência, e conferir visualmente cada encaixe. Os cajados podem ter comprimentos e gemas diferentes; o efeito nasce na ponta efetiva do equipamento, não numa posição fixa herdada do primeiro cajado.

A haste é rígida. A troca preserva os ângulos da animação e admite adaptação de empunhadura. Armas com diâmetro ou formato muito diferente podem exigir outra pose de mão. Espada e arco terão movimentos próprios; esta conjuração não se converte automaticamente em ataque de guerreiro ou arqueiro.

## Cores personalizáveis

Produzir máscaras por região, em cada quadro, junto com a arte. Regiões iniciais: pele exposta, tecido principal, tecido secundário/capa, acabamento dourado, luvas, botas, cinto/bolsas, metais, gema/broche, cabelo, sobrancelhas e íris. A arma declara suas próprias regiões, por exemplo madeira, metal e cristal.

Separar o que define a região do que define sombra, brilho e contorno. A recoloração deve preservar alfa e detalhes de iluminação; não procurar pixels por semelhança com a cor roxa ou marrom. Manter o contorno protegido.

Mapas de IDs não devem sofrer interpolação entre identificadores; máscaras suaves de cobertura são outro método e precisam de tratamento próprio. Filtragem, compressão e cores de borda precisam ser testadas na importação.

A prancha gerada com cor final não contém automaticamente essas máscaras. Recolorir por seleção aproximada seria repetir o problema de vazamentos já observado.

## Como replicar nas roupas futuras

A sequência aprovada vira um **guia mestre de poses**: mesma tela, escala, raiz, anatomia, direção, contatos das mãos e temporização. Manter também guias de cabeça, ombros, quadris, joelhos, pés e empunhadura.

Para cada traje novo, desenhar os 12 quadros seguindo esse guia e produzir as máscaras correspondentes. A animação e seus eventos podem ser reutilizados; os desenhos das roupas não são gerados automaticamente. Dobras, saias, capas, volume e peças rígidas precisam de ajuste próprio por quadro. Um traje volumoso pode exigir silhuetas e oclusões diferentes sem deslocar os pontos de contato.

Cabeça, cabelo e arma podem ser reutilizados quando a pose e a ordenação forem compatíveis. Luvas e mãos ligadas ao traje precisam respeitar o encaixe estabelecido. Replicar o guia mantém consistência; copiar uma roupa parada sobre todos os quadros não mantém qualidade.

## Validação antes de expandir

- Reproduzir a sequência, não avaliar somente a prancha estática.
- Sobrepor quadros consecutivos para detectar mudanças acidentais de proporção e deslocamento dos pés.
- Conferir rosto, contorno, dedos, empunhadura e comprimento da arma em todos os quadros.
- Verificar que a magia sai no evento de liberação e acompanha a ponta do cajado equipado.
- Trocar pelo menos dois cajados e recolorir regiões vizinhas com cores muito diferentes.
- Testar branco, preto e tons de pele claros e escuros sem bordas contaminadas.
- Produzir um segundo traje simples sobre o mesmo guia para validar o método antes de ampliar o catálogo.
- Conferir tudo no zoom real de gameplay. Só então preparar outras direções e exportar o atlas de produção.
