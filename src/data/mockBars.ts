export interface Bar {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  address: string;
  description: string;
  imageUrl: string;
  rating: number;
  type: 'bar' | 'restaurante' | 'café';
  joke?: string;
  gameType?: 'flip-card' | 'spin-bottle' | 'higher-lower';
}

export const mockBars: Bar[] = [
  {
    id: '1',
    name: 'El Portal Tapas Bar',
    // centered near provided location (lon, lat)
    coordinates: [2.1845503791450893 - 0.0015, 41.380841369044106 + 0.0009],
    address: 'Calle Mayor 12, Barcelona',
    description: 'Authentic Spanish tapas in the heart of Barcelona. Known for their patatas bravas and vermouth.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    rating: 4.5,
    type: 'bar',
    gameType: 'flip-card',
    joke: "¿Qué le dice una copa a otra? ¡Qué calor hace aquí!",
  },
  {
    id: '2',
    name: 'La Terraza del Urban',
    coordinates: [2.1845503791450893 + 0.0008, 41.380841369044106 - 0.0006],
    address: 'Carrera de San Jerónimo 34, Barcelona',
    description: 'Rooftop bar with stunning city views. Perfect for sunset cocktails.',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    rating: 4.8,
    type: 'bar'
  ,
  joke: 'Un día me hice un análisis de sangre y me salió alcohol en la sangre... ¡y cerveza en el alma!'
  },
  {
    id: '3',
    name: 'Café de Oriente',
    coordinates: [2.1845503791450893 - 0.0022, 41.380841369044106 + 0.0014],
    address: 'Plaza de Oriente 2, Barcelona',
    description: 'Historic café facing the Royal Palace. Elegant atmosphere and excellent coffee.',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop',
    rating: 4.6,
    type: 'café'
  ,
  joke: '¿Cuál es el colmo de un cervecero? Que le dé alergia al lúpulo.'
  },
  {
    id: '4',
    name: 'Mercado de San Miguel',
    coordinates: [2.1845503791450893 + 0.0012, 41.380841369044106 - 0.0011],
    address: 'Plaza de San Miguel, Barcelona',
    description: 'Iconic market hall with gourmet food stands and wine bars.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    rating: 4.7,
    type: 'restaurante'
  ,
  joke: 'En el mercado siempre hay algo para picar... y una buena excusa para brindar.'
  },
  {
    id: '5',
    name: 'The Passenger Bar',
    coordinates: [2.1845503791450893 - 0.0006, 41.380841369044106 + 0.0035],
    address: 'Calle Pez 16, Malasaña, Barcelona',
    description: 'Trendy cocktail bar in Malasaña. Known for creative drinks and live music.',
    imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=600&fit=crop',
    rating: 4.4,
    type: 'bar'
  ,
  joke: '¿Sabes por qué los del bar son los mejores futbolistas? Porque siempre están dando la copa.'
  },
  {
    id: '6',
    name: 'Botín restaurante',
    coordinates: [2.1845503791450893 + 0.0016, 41.380841369044106 - 0.0021],
    address: 'Calle Cuchilleros 17, Barcelona',
    description: 'World\'s oldest restaurante according to Guinness. Famous for roast suckling pig.',
    imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    rating: 4.9,
    type: 'restaurante'
  ,
  joke: 'Famoso por su horno, y por historias que se cuentan entre plato y plato.'
  },
  {
    id: '7',
    name: 'Salmon Guru',
    coordinates: [2.1845503791450893 + 0.0002, 41.380841369044106 + 0.0026],
    address: 'Calle Echegaray 21, Barcelona',
    description: 'Award-winning cocktail bar. Innovative mixology in a vibrant setting.',
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop',
    rating: 4.8,
    type: 'bar'
  ,
  joke: "Estaba en el bar y le digo al camarero: 'Ponme una cerveza, por favor'. Y me dice: '¿Fría?'"
  },
  {
    id: '8',
    name: 'Federal Café',
    coordinates: [2.1845503791450893 - 0.0028, 41.380841369044106 + 0.0040],
    address: 'Plaza de las Comendadoras 9, Barcelona',
    description: 'Australian-style brunch spot. Great coffee and healthy options.',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    rating: 4.5,
    type: 'café'
  ,
  joke: 'Mi médico me dijo que beba más agua; voy al bar y pido una cerveza. ¡Salud!'
  },
  {
    id: '9',
    name: 'Casa Lucio',
    coordinates: [2.1845503791450893 - 0.0011, 41.380841369044106 - 0.0028],
    address: 'Cava Baja 35, Barcelona',
    description: 'Traditional Spanish cuisine. Famous for their huevos rotos.',
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    rating: 4.7,
    type: 'restaurante'
  ,
  joke: 'Aquí las raciones vienen con historias y buena compañía.'
  },
  {
    id: '10',
    name: 'Ojala Beach Club',
    coordinates: [2.1845503791450893 + 0.0024, 41.380841369044106 + 0.0039],
    address: 'Calle San Andrés 1, Barcelona',
    description: 'Beach-themed bar with sand floor. Tropical cocktails and chill vibes.',
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop',
    rating: 4.6,
    type: 'bar',
    gameType: 'flip-card',
    joke: 'Beach vibes y cócteles: perfecto para perder la noción del tiempo.'
  },
  {
    id: '11',
    name: 'Bar Manolo',
    coordinates: [2.1845503791450893 + 0.0035, 41.380841369044106 + 0.0052],
    address: 'Calle Serrano 52, Barcelona',
    description: 'Avant-garde Asian street food. Michelin-starred chef\'s casual concept.',
    imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/9f/59/90/bar-manolo.jpg?w=900&h=-1&s=1',
    rating: 4.9,
    type: 'restaurante',
    gameType: 'spin-bottle',
    joke: 'Y dice, mi abuelo cuando llegó a españa llegó con una mano delante y otra detrás. Qué era pobre? No, egipcio. (Risas)'
  },
  {
    id: '12',
    name: 'Maricastaña Bar',
    coordinates: [2.1845503791450893 - 0.0003, 41.380841369044106 + 0.0019],
    address: 'Calle Arenal 16, Barcelona',
    description: 'Vintage cocktail bar with 1920s décor. Expert bartenders and classic drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop',
    rating: 4.5,
    type: 'bar'
  ,
  joke: 'Vintage y cócteles: aquí las historias se sirven con hielo.'
  }
  ,
  {
    id: '13',
    name: 'Bar Nova',
    coordinates: [2.1845503791450893 + 0.0005, 41.380841369044106 - 0.0009],
    address: 'Carrer dels Pensaments 3',
    description: 'Cozy neighborhood bar with local beers.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    rating: 4.2,
    type: 'bar'
  ,
  joke: 'Un bar de barrio nunca falla: siempre hay una anécdota para compartir.'
  },
  {
    id: '14',
    name: 'Tapas & Tonic',
    coordinates: [2.1845503791450893 - 0.0010, 41.380841369044106 - 0.0015],
    address: 'Plaça Falsa 7',
    description: 'Small tapas place and great tonics.',
    imageUrl: 'https://images.unsplash.com/photo-1541542684-8e8f0e6d0f0f?w=800&h=600&fit=crop',
    rating: 4.3,
    type: 'restaurante'
  ,
  joke: 'Tapas & Tonic: la mezcla perfecta para contar un chiste entre bocado y bocado.'
  },
  {
    id: '15',
    name: 'Corner Coffee',
    coordinates: [2.1845503791450893 + 0.0020, 41.380841369044106 + 0.0007],
    address: 'Carrer de la Llum 10',
    description: 'Friendly café with excellent espresso.',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop',
    rating: 4.1,
    type: 'café'
  ,
  joke: 'El café de la esquina siempre tiene el mejor plan: una taza y una charla larga.'
  },
  {
    id: '16',
    name: 'Rooftop Beats',
    coordinates: [2.1845503791450893 - 0.0025, 41.380841369044106 + 0.0022],
    address: 'Carrer del Cel 2',
    description: 'Rooftop bar with DJs and cocktails.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    rating: 4.4,
    type: 'bar'
  ,
  joke: 'Rooftop Beats: donde hasta las estrellas vienen a pedir otra copa.'
  },
  {
    id: '17',
    name: 'The Old Cellar',
    coordinates: [2.1845503791450893 + 0.0013, 41.380841369044106 - 0.0032],
    address: 'Carrer del Vi 5',
    description: 'Wine bar with a curated selection and small plates.',
    imageUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070fe0?w=800&h=600&fit=crop',
    rating: 4.6,
    type: 'bar'
  ,
  joke: 'En la bodega siempre hay una historia añeja y una copa para acompañarla.'
  },
  {
    id: '18',
    name: 'Bistro Azul',
    coordinates: [2.1845503791450893 - 0.0009, 41.380841369044106 + 0.0045],
    address: 'Carrer del Mar 22',
    description: 'Casual bistro serving Mediterranean dishes.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    rating: 4.0,
    type: 'restaurante',
    gameType: 'higher-lower'
  ,
  joke: 'Bistro Azul: el color del mar y el sabor de una buena conversación.'
  },
  {
    id: '19',
    name: 'Late Night Lounge',
    coordinates: [2.1845503791450893 + 0.0030, 41.380841369044106 + 0.0011],
    address: 'Carrer Nocturn 9',
    description: 'Open late with cocktails and live music.',
    imageUrl: 'https://images.unsplash.com/photo-1541542684-8e8f0e6d0f0f?w=800&h=600&fit=crop',
    rating: 4.3,
    type: 'bar'
  ,
  joke: 'Si sales tarde, busca el local que nunca cierra: la música y las risas siguen ahí.'
  },
  {
    id: '20',
    name: 'Green Garden Café',
    coordinates: [2.1845503791450893 - 0.0018, 41.380841369044106 - 0.0025],
    address: 'Jardins 4',
    description: 'Bright café with plant-filled interior and brunch menu.',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop',
    rating: 4.2,
    type: 'café'
  ,
  joke: 'Plantas, brunch y risas: el café perfecto para un domingo lento.'
  },
  {
    id: '21',
    name: 'Sunset Tapas',
    coordinates: [2.1845503791450893 + 0.0026, 41.380841369044106 - 0.0019],
    address: 'Passeig del Sol 1',
    description: 'Tapas spot ideal for watching sunsets with a drink.',
    imageUrl: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop',
    rating: 4.5,
    type: 'bar'
  ,
  joke: 'Tapas al atardecer: el plan para una buena despedida de sol.'
  },
  {
    id: '22',
    name: 'Plaza Coffee House',
    coordinates: [2.1845503791450893 - 0.0004, 41.380841369044106 + 0.0029],
    address: 'Plaça Major 11',
    description: 'Classic coffee house with pastries and quiet corners.',
    imageUrl: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop',
    rating: 4.1,
    type: 'café'
  ,
  joke: 'Plaza Coffee House: un rincón para cafés largos y conversaciones cortas.'
  }
];
