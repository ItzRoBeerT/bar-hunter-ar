export interface Bar {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  description: string;
  imageUrl: string;
  rating: number;
  type: 'bar' | 'restaurant' | 'café';
}

export const mockBars: Bar[] = [
  {
    id: '1',
    name: 'El Portal Tapas Bar',
    coordinates: [-3.7038, 40.4168],
    address: 'Calle Mayor 12, Madrid',
    description: 'Authentic Spanish tapas in the heart of Madrid. Known for their patatas bravas and vermouth.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    rating: 4.5,
    type: 'bar'
  },
  {
    id: '2',
    name: 'La Terraza del Urban',
    coordinates: [-3.6950, 40.4150],
    address: 'Carrera de San Jerónimo 34, Madrid',
    description: 'Rooftop bar with stunning city views. Perfect for sunset cocktails.',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    rating: 4.8,
    type: 'bar'
  },
  {
    id: '3',
    name: 'Café de Oriente',
    coordinates: [-3.7121, 40.4179],
    address: 'Plaza de Oriente 2, Madrid',
    description: 'Historic café facing the Royal Palace. Elegant atmosphere and excellent coffee.',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    rating: 4.6,
    type: 'café'
  },
  {
    id: '4',
    name: 'Mercado de San Miguel',
    coordinates: [-3.7086, 40.4155],
    address: 'Plaza de San Miguel, Madrid',
    description: 'Iconic market hall with gourmet food stands and wine bars.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    rating: 4.7,
    type: 'restaurant'
  },
  {
    id: '5',
    name: 'The Passenger Bar',
    coordinates: [-3.7015, 40.4205],
    address: 'Calle Pez 16, Malasaña, Madrid',
    description: 'Trendy cocktail bar in Malasaña. Known for creative drinks and live music.',
    imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=600&fit=crop',
    rating: 4.4,
    type: 'bar'
  },
  {
    id: '6',
    name: 'Botín Restaurant',
    coordinates: [-3.7076, 40.4143],
    address: 'Calle Cuchilleros 17, Madrid',
    description: 'World\'s oldest restaurant according to Guinness. Famous for roast suckling pig.',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    rating: 4.9,
    type: 'restaurant'
  },
  {
    id: '7',
    name: 'Salmon Guru',
    coordinates: [-3.7005, 40.4195],
    address: 'Calle Echegaray 21, Madrid',
    description: 'Award-winning cocktail bar. Innovative mixology in a vibrant setting.',
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
    rating: 4.8,
    type: 'bar'
  },
  {
    id: '8',
    name: 'Federal Café',
    coordinates: [-3.7095, 40.4225],
    address: 'Plaza de las Comendadoras 9, Madrid',
    description: 'Australian-style brunch spot. Great coffee and healthy options.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    rating: 4.5,
    type: 'café'
  },
  {
    id: '9',
    name: 'Casa Lucio',
    coordinates: [-3.7110, 40.4130],
    address: 'Cava Baja 35, Madrid',
    description: 'Traditional Spanish cuisine. Famous for their huevos rotos.',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    rating: 4.7,
    type: 'restaurant'
  },
  {
    id: '10',
    name: 'Ojala Beach Club',
    coordinates: [-3.7020, 40.4210],
    address: 'Calle San Andrés 1, Madrid',
    description: 'Beach-themed bar with sand floor. Tropical cocktails and chill vibes.',
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop',
    rating: 4.6,
    type: 'bar'
  },
  {
    id: '11',
    name: 'StreetXO',
    coordinates: [-3.6885, 40.4240],
    address: 'Calle Serrano 52, Madrid',
    description: 'Avant-garde Asian street food. Michelin-starred chef\'s casual concept.',
    imageUrl: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&h=600&fit=crop',
    rating: 4.9,
    type: 'restaurant'
  },
  {
    id: '12',
    name: 'Maricastaña Bar',
    coordinates: [-3.7055, 40.4188],
    address: 'Calle Arenal 16, Madrid',
    description: 'Vintage cocktail bar with 1920s décor. Expert bartenders and classic drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop',
    rating: 4.5,
    type: 'bar'
  }
];
