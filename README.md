# Vetra Fashion

Tema Shopify **Online Store 2.0** construído sobre o **[Skeleton Theme](https://github.com/Shopify/skeleton-theme)**
oficial da Shopify (base MIT, © Shopify — ver `LICENSE.md`) — o único código-base aprovado pela
Shopify Theme Store para novas submissões.

Este projeto é a migração do [Thema Vetra](https://github.com/SrLuizGuimaraes/Thema-Vetra) (que
era baseado no Dawn, hoje inelegível para a Theme Store) para o Skeleton Theme, recriando as
mesmas funcionalidades premium de moda (mega menu, quick view, sticky cart, lookbook com
hotspots, etc.) com código 100% original sobre a nova base.

> **Clean-room:** nenhuma linha de código, classe CSS, snippet ou asset é copiada de temas
> pagos. Recriamos apenas **comportamento e aparência** com implementação própria.

## Arquitetura

Mantém a estrutura do Skeleton Theme (`sections/`, `snippets/`, `blocks/`, `templates/*.json`,
`config/settings_schema.json`). Todo recurso novo é adicionado como **section/snippet/block
novo**, sem alterar destrutivamente os arquivos originais do Skeleton.

## Desenvolvimento local

```bash
npm install -g @shopify/cli
shopify theme dev --store sua-loja.myshopify.com   # preview com hot reload
shopify theme check                                # lint / boas práticas
shopify theme push                                 # publica na loja
```

## Roadmap de migração

1. **Fundação** — fork do Skeleton Theme, Shopify CLI, estrutura de branches ✅
2. **Base visual** — cores, tipografia, header/footer próprios (Skeleton não traz layout pronto) ✅
3. **Navegação** — mega menu, menu mobile, quick view ✅
4. **Produto e coleção** — grid de produtos com filtros/swatches, PDP com galeria e zoom ✅
5. **Carrinho** — cart drawer AJAX, sticky cart, notas de pedido ✅
6. **Merchandising** — badges, stock counter, countdown, promo popups/tiles ✅
7. **Polimento** — lookbook com hotspots, before/after slider, animações de scroll, home montada ✅

Todas as fases do roadmap inicial estão implementadas e confirmadas rodando ao vivo numa loja de
desenvolvimento (header, carrinho AJAX, PDP com variantes, countdown, filtros de coleção).

## Paridade com o Thema Vetra original

Identidade visual (cores `#67101A`/`#1C1C1C`/`#F5F1EC` e tipografia Montserrat) e as 16 seções
`vetra-*` do tema original foram conferidas e recriadas aqui com código próprio:

before-after, collection-list, complete-look, countdown, featured-collection, lookbook, marquee,
promo-popup, promo-tiles, quick-view (snippet + JS), recently-viewed, shipping-estimator (com
cotação real via `/cart/shipping_rates.json`), slideshow, sticky-cart (embutido no PDP),
stock-counter (embutido no PDP), tabs, trust-badges.

## Créditos

Base: Shopify Skeleton Theme (MIT). Personalizações e recursos adicionais: código original
deste repositório.
