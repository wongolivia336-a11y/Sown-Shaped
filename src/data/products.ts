export type Product = {
  id: string;
  number: string;
  category: 'Clean' | 'Grow' | 'Gather';
  name: string;
  subtitle: string;
  material: string;
  image: string;
  imageAlt: string;
  description: string;
  studyNotes: string[];
};

export const products: Product[] = [
  {
    id: 'clean',
    number: '01',
    category: 'Clean',
    name: 'The Everyday Scrub',
    subtitle: 'A little care, every day.',
    material: 'Loofah fiber · stitching study',
    image: '/images/clean-study.svg',
    imageAlt: 'Illustrated concept of an oval loofah cleaning pad with a blue stitched hanging loop.',
    description:
      'A simple cleaning companion inspired by the open, springy structure of dried loofah. We are exploring how its texture, edge and hanging detail might fit into a daily routine.',
    studyNotes: ['Surface and grip', 'Edge binding', 'Drying and storage'],
  },
  {
    id: 'grow',
    number: '02',
    category: 'Grow',
    name: 'The Little Planter',
    subtitle: 'A new place for a small green thing.',
    material: 'Loofah fiber · vessel study',
    image: '/images/grow-study.svg',
    imageAlt: 'Illustrated concept of a textured loofah planter sleeve around an inner pot with a small stem.',
    description:
      'An exploration of loofah as a tactile outer sleeve for a small plant vessel. Its construction and compatibility with watering are still part of the design study.',
    studyNotes: ['Vessel structure', 'Removable inner pot', 'Care in use'],
  },
  {
    id: 'gather',
    number: '03',
    category: 'Gather',
    name: 'The Gathering Bowl',
    subtitle: 'A home for the little things.',
    material: 'Corn husk · folding and weaving study',
    image: '/images/gather-study.svg',
    imageAlt: 'Illustrated concept of a low, woven corn-husk catchall bowl in warm straw tones.',
    description:
      'A small catchall shaped by the folding and layering possibilities of corn husk. The study asks how an agricultural material might hold everyday odds and ends beautifully.',
    studyNotes: ['Folding and layering', 'Shape retention', 'Everyday organization'],
  },
];
