import { Product } from '../types';
import cocaColaImg from '../assets/images/coca_cola_can_1789227306156.jpg';
import fantaImg from '../assets/images/fanta_orange_can_1789227326450.jpg';
import spriteImg from '../assets/images/sprite_bottle_can_1789227342904.jpg';

// Standard high-res photo assets
export const IMAGES = {
  cocaCola: cocaColaImg || '/images/coca_cola.jpg',
  fanta: fantaImg || '/images/fanta.jpg',
  sprite: spriteImg || '/images/sprite.jpg',
  batatasFritas:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBzgpufDGuFos7wbld0wVK_XqwoRXoKb0aOj5W86ofeYxxS0Jr-LXZAcwHM5QjU0fnthxvacpuV4GVJ0z2x_EnxyCgRyNm0yywk69BkYIZ1TY2lYWrTUj6rD7XQ66n4EObU9ld8Cs9xN000DSH8xVyoVulBowZtc3r2IOlBG4OI3CSyhG8KNZf2ldmR780l1eucrAAlSyAJGcxYi3EWN_a_Hfbg4hM3FGiqLJo03R3AFL6HhIlk5f035w',
  crispyAlcides:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDb_uw3Y_ZDEd9EckJKAdbOMpO2fECm3UhrYtcZ7i1HYMlEb4zE-z1DeXdrvpH3n-uU6RDDQERMq2rFB72h_fSk_JVrYXQn7csIlLAiTUCW2KFmSU0ARa7jplYeS2S4BkhuUO55F98ihNAviZNqb6OkaCsmxvH4ZrSm-VpZP93dBbk8qH3AK--23hVVCPps-RI8EnUmFVfYS8Pcza47FgREQKoPEtJ3zcx3l5yznwf4SKmsbpzWXiDhsQ',
  crispyCangahi:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSb0XnS8F7FUyyORfrBGj4CFvB-gUGkvoRdrgmxYS6qxlvQodiFz9tU8JaX3nfGgpiZdPemwt4uUfajhbVi_drOqUd-Etd2hlYOWt6VlzHO8V5qLeU_FFWTiHs3zlXgrN33KqcvEaHeKgaTWveYrHWmfrI7aO6NBeeGgPI0SNHU39ykdtFAtvgS4QNiISXI643yy6FVVPoN9DY3MOnim4Be2YjJRs05ooOXK6TSph5BsmsrQozJNiRNQ',
  crispyExecutivo:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB_q0cqkESr5uOfLL0knJ2VGA6X_NjA2MeXdenbtUI4TVE247m7E51Rl4NihjXtrmTV3qMiydmAAmcRXikG9xidOVNY_VyMU0vRZToA6oJkXYUwInRabZyCHw3dCn3-AI50_tOF9RuZ6au-7yvspuco3mLhce8wySauAUTZrUTt9Sdzu1d3hTgXnyhu2EHoNyOCMfTl2SCnbwqnVnpSHE1VTWenOUbfGhJ4-XfPzoIayFg20RPp_KA71Q',
  crispyReal:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDb_uw3Y_ZDEd9EckJKAdbOMpO2fECm3UhrYtcZ7i1HYMlEb4zE-z1DeXdrvpH3n-uU6RDDQERMq2rFB72h_fSk_JVrYXQn7csIlLAiTUCW2KFmSU0ARa7jplYeS2S4BkhuUO55F98ihNAviZNqb6OkaCsmxvH4ZrSm-VpZP93dBbk8qH3AK--23hVVCPps-RI8EnUmFVfYS8Pcza47FgREQKoPEtJ3zcx3l5yznwf4SKmsbpzWXiDhsQ',
  cheeseDrumstick:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB_q0cqkESr5uOfLL0knJ2VGA6X_NjA2MeXdenbtUI4TVE247m7E51Rl4NihjXtrmTV3qMiydmAAmcRXikG9xidOVNY_VyMU0vRZToA6oJkXYUwInRabZyCHw3dCn3-AI50_tOF9RuZ6au-7yvspuco3mLhce8wySauAUTZrUTt9Sdzu1d3hTgXnyhu2EHoNyOCMfTl2SCnbwqnVnpSHE1VTWenOUbfGhJ4-XfPzoIayFg20RPp_KA71Q',
  frangoArtesanal:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCSb0XnS8F7FUyyORfrBGj4CFvB-gUGkvoRdrgmxYS6qxlvQodiFz9tU8JaX3nfGgpiZdPemwt4uUfajhbVi_drOqUd-Etd2hlYOWt6VlzHO8V5qLeU_FFWTiHs3zlXgrN33KqcvEaHeKgaTWveYrHWmfrI7aO6NBeeGgPI0SNHU39ykdtFAtvgS4QNiISXI643yy6FVVPoN9DY3MOnim4Be2YjJRs05ooOXK6TSph5BsmsrQozJNiRNQ',
  eventos:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB_q0cqkESr5uOfLL0knJ2VGA6X_NjA2MeXdenbtUI4TVE247m7E51Rl4NihjXtrmTV3qMiydmAAmcRXikG9xidOVNY_VyMU0vRZToA6oJkXYUwInRabZyCHw3dCn3-AI50_tOF9RuZ6au-7yvspuco3mLhce8wySauAUTZrUTt9Sdzu1d3hTgXnyhu2EHoNyOCMfTl2SCnbwqnVnpSHE1VTWenOUbfGhJ4-XfPzoIayFg20RPp_KA71Q',
};

export const DEFAULT_PRODUCT_IMAGE = IMAGES.crispyAlcides;

/**
 * Resolves the genuine, authentic photo for any product based on its identity,
 * preventing any single generic image from repeating over drinks or different meals.
 */
export const getProductImage = (
  product?: Partial<Product> | string | null,
  rawCandidate?: string | null
): string => {
  const prodObj = typeof product === 'object' && product !== null ? product : null;
  const candidate = (prodObj?.image || rawCandidate || (typeof product === 'string' ? product : '') || '').trim();

  // If candidate is a user-uploaded image (data URL or Supabase storage upload)
  if (candidate.startsWith('data:image') || candidate.includes('supabase.co/storage')) {
    return candidate;
  }

  const name = (prodObj?.name || (typeof product === 'string' ? product : '') || '').toLowerCase();
  const id = (prodObj?.id || '').toLowerCase();
  const category = (prodObj?.category || '').toLowerCase();

  // 1. BEBIDAS (Never show chicken!)
  if (name.includes('coca') || id.includes('coca')) {
    return IMAGES.cocaCola;
  }
  if (name.includes('fanta') || id.includes('fanta')) {
    return IMAGES.fanta;
  }
  if (name.includes('sprite') || id.includes('sprite')) {
    return IMAGES.sprite;
  }
  if (category.includes('bebida') || name.includes('refrigerante') || name.includes('suco') || name.includes('água') || name.includes('agua')) {
    return IMAGES.cocaCola;
  }

  // 2. ACOMPANHAMENTOS
  if (name.includes('batata') || id.includes('batata') || category.includes('acompanha')) {
    return IMAGES.batatasFritas;
  }

  // 3. COMBOS ESPECÍFICOS
  if (name.includes('cangahi') || id.includes('cangahi')) {
    return IMAGES.crispyCangahi;
  }
  if (name.includes('executivo') || id.includes('executivo')) {
    return IMAGES.crispyExecutivo;
  }
  if (name.includes('alcides') || id.includes('alcides')) {
    return IMAGES.crispyAlcides;
  }
  if (name.includes('real') || id.includes('real')) {
    return IMAGES.crispyReal;
  }

  // 4. CHEESE DRUMS & FRANGO
  if (name.includes('artesanal') || id.includes('artesanal')) {
    return IMAGES.frangoArtesanal;
  }
  if (name.includes('drumstick') || id.includes('drumstick') || category.includes('cheese')) {
    return IMAGES.cheeseDrumstick;
  }

  // 5. EVENTOS
  if (name.includes('evento') || category.includes('evento')) {
    return IMAGES.eventos;
  }

  // If candidate is a valid non-empty web URL and not repetitive
  if (candidate && (candidate.startsWith('http://') || candidate.startsWith('https://') || candidate.startsWith('/'))) {
    return candidate;
  }

  return DEFAULT_PRODUCT_IMAGE;
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'crispy-alcides',
    name: 'Crispy Alcides',
    description: '5 Cheese Drums crocantes recheados com queijo derretido + 1 Refrigerante de 500ml bem gelado.',
    price: 5100,
    category: 'Combos',
    image: IMAGES.crispyAlcides,
    badge: 'Top 1',
    badgeType: 'top',
    isFeatured: true,
  },
  {
    id: 'crispy-cangahi',
    name: 'Crispy Cangahi',
    description: '5 Cheese Drums estaladiços + 1 Porção de Batatas douradas crocantes + 1 Refrigerante de 500ml.',
    price: 5850,
    category: 'Combos',
    image: IMAGES.crispyCangahi,
    badge: 'Favorito',
    badgeType: 'favorito',
    isFeatured: true,
  },
  {
    id: 'crispy-executivo',
    name: 'Crispy Executivo',
    description: '8 Cheese Drums volumosos e suculentos + 1 Porção de Batata frita + 1 Refrigerante de 500ml.',
    price: 8350,
    category: 'Combos',
    image: IMAGES.crispyExecutivo,
    badgeType: 'combo',
    isFeatured: true,
  },
  {
    id: 'crispy-real',
    name: 'Crispy Real',
    description: 'Banquete completo: 10 Cheese Drums crocantes + 2 Refrigerantes de 500ml + 3 Batatas estaladiças.',
    price: 12650,
    category: 'Combos',
    image: IMAGES.crispyReal,
    badge: 'Família',
    badgeType: 'familia',
    isFeatured: true,
  },
  {
    id: 'cheese-drumstick',
    name: 'Cheese Drumstick (4 un)',
    description: '4 unidades douradas de coxa recheada com queijo mozarela cremoso derretido.',
    price: 3700,
    category: 'Cheese Drums',
    image: IMAGES.cheeseDrumstick,
    badge: 'Original',
    badgeType: 'original',
  },
  {
    id: 'frango-artesanal',
    name: 'Frango Artesanal',
    description: 'Crocante por fora, suculento por dentro e temperado na perfeição artesanal da Tchemba.',
    price: 0,
    category: 'Cheese Drums',
    image: IMAGES.frangoArtesanal,
    badge: 'Especial',
    badgeType: 'especial',
    isConsultation: true,
  },
  {
    id: 'batatas-fritas',
    name: 'Batatas Fritas',
    description: 'Porção generosa dourada, estaladiça e temperada com sal fino e especiarias suaves.',
    price: 900,
    category: 'Acompanhamentos',
    image: IMAGES.batatasFritas,
  },
  {
    id: 'coca-cola-500ml',
    name: 'Coca-Cola 500ml',
    description: 'Garrafa de 500ml bem gelada para acompanhar a sua refeição com máxima refrescância.',
    price: 700,
    category: 'Bebidas',
    image: IMAGES.cocaCola,
  },
  {
    id: 'fanta-500ml',
    name: 'Fanta 500ml',
    description: 'Fanta Laranja 500ml bem fresca, sabor frutada e efervescente.',
    price: 700,
    category: 'Bebidas',
    image: IMAGES.fanta,
  },
  {
    id: 'sprite-500ml',
    name: 'Sprite 500ml',
    description: 'Sprite limão 500ml bem gelada com aquele toque cítrico revigorante.',
    price: 700,
    category: 'Bebidas',
    image: IMAGES.sprite,
  },
  {
    id: 'producao-eventos-20',
    name: 'Venda para Eventos – 20 Cheese Drums',
    description: 'Produção sob encomenda para aniversários, reuniões e convívios familiares. Entregue quente e estaladiço no Huambo.',
    price: 18100,
    category: 'Eventos',
    image: IMAGES.eventos,
    badge: 'Por Encomenda',
    badgeType: 'evento',
    pieces: '20 Peças',
  },
  {
    id: 'producao-eventos-30',
    name: 'Venda para Eventos – 30 Cheese Drums',
    description: 'Bandeja generosa de 30 unidades artesanais com queijo derretido por dentro e crocância única.',
    price: 27500,
    category: 'Eventos',
    image: IMAGES.eventos,
    badge: 'Por Encomenda',
    badgeType: 'evento',
    pieces: '30 Peças',
  },
  {
    id: 'producao-eventos-40',
    name: 'Venda para Eventos – 40 Cheese Drums',
    description: 'Perfeito para grandes confraternizações, aniversários e celebrações de amigos no Huambo.',
    price: 36600,
    category: 'Eventos',
    image: IMAGES.eventos,
    badge: 'Por Encomenda',
    badgeType: 'evento',
    pieces: '40 Peças',
  },
  {
    id: 'producao-eventos-50',
    name: 'Venda para Eventos – 50 Cheese Drums',
    description: 'Produção em grande escala para celebrações com a máxima qualidade e entrega pontual.',
    price: 46000,
    category: 'Eventos',
    image: IMAGES.eventos,
    badge: 'Por Encomenda',
    badgeType: 'evento',
    pieces: '50 Peças',
  },
];

export const FORMAT_KZ = (amount: number): string => {
  return `${amount.toLocaleString('pt-AO')} Kz`;
};
