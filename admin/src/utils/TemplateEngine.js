/**
 * Template Variant Engine for Kings 24x7 Enterprise Builder
 * Allows switching visual presentations (Grid, List, Carousel, Masonry) without changing content config.
 */

export const TEMPLATE_VARIANTS = {
  grid: {
    id: 'grid',
    name: 'Responsive Grid Cards',
    icon: 'fas fa-th',
    description: '3 or 4 column grid of visual news cards.'
  },
  list: {
    id: 'list',
    name: 'Compact List Rows',
    icon: 'fas fa-list',
    description: 'Single column compact row list with thumbnail.'
  },
  carousel: {
    id: 'carousel',
    name: 'Horizontal Swipe Carousel',
    icon: 'fas fa-sliders-h',
    description: 'Horizontal scrolling card track with touch controls.'
  },
  masonry: {
    id: 'masonry',
    name: 'Staggered Masonry Layout',
    icon: 'fas fa-cubes',
    description: 'Pinterest-style dynamic height grid.'
  },
  headline_stack: {
    id: 'headline_stack',
    name: 'Featured Banner + Stack',
    icon: 'fas fa-newspaper',
    description: '1 large featured banner with stacked side headlines.'
  }
};

export const getAvailableTemplates = () => Object.values(TEMPLATE_VARIANTS);
