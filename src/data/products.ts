export type ProductCopy = {
  category: string;
  name: string;
  subtitle: string;
  material: string;
  imageAlt: string;
  description: string;
  studyNotes: string[];
};

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
  zh: ProductCopy;
};

export const products: Product[] = [
  {
    id: 'clean',
    number: '01',
    category: 'Clean',
    name: 'The Everyday Scrub',
    subtitle: 'A little care, every day.',
    material: 'Loofah fiber · stitching study',
    image: '/images/clean-study.jpg',
    imageAlt: 'An oval loofah scrub pad with a small cobalt-blue cotton hanging loop, photographed on warm plaster.',
    description:
      'A simple cleaning companion inspired by the open, springy structure of dried loofah. We are exploring how its texture, edge and hanging detail might fit into a daily routine.',
    studyNotes: ['Surface and grip', 'Edge binding', 'Drying and storage'],
    zh: {
      category: '清洁',
      name: '日常清洁垫',
      subtitle: '每天一点轻松清洁。',
      material: '丝瓜络纤维 · 缝线设计探索',
      imageAlt: '椭圆形丝瓜络清洁垫，配有钴蓝色棉绳挂环，置于暖白色背景上。',
      description: '一款从干燥丝瓜络的蓬松纤维结构中获得灵感的清洁小物。我们正在探索它的肌理、包边与悬挂细节，如何自然融入日常清洁。',
      studyNotes: ['表面肌理与握感', '包边方式', '悬挂与晾干'],
    },
  },
  {
    id: 'grow',
    number: '02',
    category: 'Grow',
    name: 'The Little Planter',
    subtitle: 'A new place for a small green thing.',
    material: 'Loofah fiber · vessel study',
    image: '/images/grow-study.jpg',
    imageAlt: 'A small succulent in a pale ceramic pot wrapped with a textured loofah sleeve.',
    description:
      'An exploration of loofah as a tactile outer sleeve for a small plant vessel. Its construction and compatibility with watering are still part of the design study.',
    studyNotes: ['Vessel structure', 'Removable inner pot', 'Care in use'],
    zh: {
      category: '栽植',
      name: '纤维小花器',
      subtitle: '给一株小绿植一个新家。',
      material: '丝瓜络纤维 · 花器外套探索',
      imageAlt: '一株小型多肉种在浅色陶盆中，外侧包覆丝瓜络纤维套。',
      description: '尝试将丝瓜络做成小型花器的触感外套。外套结构、内盆拆卸方式与浇水时的使用体验，仍在探索之中。',
      studyNotes: ['花器结构', '可拆卸内盆', '日常养护体验'],
    },
  },
  {
    id: 'gather',
    number: '03',
    category: 'Gather',
    name: 'The Gathering Bowl',
    subtitle: 'A home for the little things.',
    material: 'Corn husk · folding and weaving study',
    image: '/images/gather-study.jpg',
    imageAlt: 'A shallow folded corn-husk catchall bowl with delicate cobalt stitching, photographed on warm plaster.',
    description:
      'A small catchall shaped by the folding and layering possibilities of corn husk. The study asks how an agricultural material might hold everyday odds and ends beautifully.',
    studyNotes: ['Folding and layering', 'Shape retention', 'Everyday organization'],
    zh: {
      category: '收纳',
      name: '折叶收纳碗',
      subtitle: '让零碎小物各有归处。',
      material: '玉米皮 · 折叠与编织探索',
      imageAlt: '以玉米皮折叠成浅口收纳碗，边缘点缀钴蓝色缝线。',
      description: '从玉米皮的折叠与叠层方式出发，探索一只轻巧的桌面收纳碗。它尝试让来自农作物的材料，温和地收纳日常小物。',
      studyNotes: ['折叠与叠层', '形态保持', '日常收纳方式'],
    },
  },
];
