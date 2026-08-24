import { PracticePhrase, MinimalPair, PhoneticSound, QuizQuestion, ConversationScenario } from '@/types/english';

export const practicePhrases: PracticePhrase[] = [
  {
    id: 'p1',
    english: 'Could you please slow down a bit?',
    spanish: '¿Podrías hablar un poco más despacio, por favor?',
    ipa: '/kʊd juː pliːz sləʊ daʊn ə bɪt/',
    difficulty: 'beginner',
    category: 'Daily Life',
    tips: 'La "L" en "could" es muda. No digas "culd", pronuncia /kʊd/.',
    exampleContext: 'Úsalo cuando hables con un hablante nativo y hable demasiado rápido.',
  },
  {
    id: 'p2',
    english: 'I would like to order a coffee to go.',
    spanish: 'Me gustaría pedir un café para llevar.',
    ipa: '/aɪ wʊd laɪk tə ˈɔːdər ə ˈkɒfi tə ɡəʊ/',
    difficulty: 'beginner',
    category: 'Travel & Food',
    tips: 'Une "would like" pronunciándolo suavemente como "I\'d like".',
    exampleContext: 'Frase imprescindible en cafeterías y restaurantes.',
  },
  {
    id: 'p3',
    english: 'I think this is a great opportunity.',
    spanish: 'Creo que esta es una gran oportunidad.',
    ipa: '/aɪ θɪŋk ðɪs ɪz ə ɡreɪt ˌɒpəˈtjuːnəti/',
    difficulty: 'intermediate',
    category: 'Business',
    tips: 'Coloca la lengua entre los dientes para la "TH" en "think" (/θ/) y "this" (/ð/).',
    exampleContext: 'Excelente frase para reuniones de trabajo o entrevistas.',
  },
  {
    id: 'p4',
    english: 'Let\'s call it a day and continue tomorrow.',
    spanish: 'Dejémoslo por hoy y continuemos mañana.',
    ipa: '/lets kɔːl ɪt ə deɪ ənd kənˈtɪnjuː təˈmɒrəʊ/',
    difficulty: 'intermediate',
    category: 'Idioms',
    tips: '"Call it a day" es un modismo común que significa terminar de trabajar por la jornada.',
    exampleContext: 'Se usa al final de una reunión o día laboral.',
  },
  {
    id: 'p5',
    english: 'Could you provide more details regarding the project deadline?',
    spanish: '¿Podrías proporcionar más detalles sobre la fecha límite del proyecto?',
    ipa: '/kʊd juː prəˈvaɪd mɔː ˈdiːteɪlz rɪˈɡɑːdɪŋ ðə ˈprɒdʒekt ˈdedlaɪn/',
    difficulty: 'advanced',
    category: 'Business',
    tips: 'Acentúa "DEADline" en la primera sílaba y mantén la "R" suave en "regarding".',
    exampleContext: 'Ideal para comunicación profesional formal.',
  },
  {
    id: 'p6',
    english: 'Where is the nearest subway station?',
    spanish: '¿Dónde está la estación de metro más cercana?',
    ipa: '/weər ɪz ðə ˈnɪərɪst ˈsʌbweɪ ˈsteɪʃn/',
    difficulty: 'beginner',
    category: 'Travel & Food',
    tips: 'En "station" (/steɪʃn/), la "ti" suena como "sh" (/ʃ/).',
    exampleContext: 'Muy útil al viajar por ciudades grandes.',
  }
];

export const minimalPairs: MinimalPair[] = [
  {
    id: 'mp1',
    soundFocus: 'Vocal corta /ɪ/ vs. Vocal larga /iː/',
    wordA: { word: 'Ship', ipa: '/ʃɪp/', spanish: 'Barco' },
    wordB: { word: 'Sheep', ipa: '/ʃiːp/', spanish: 'Oveja' },
    explanation: 'La /ɪ/ en "ship" es relajada y corta (casi entre E e I). La /iː/ en "sheep" es tensa y larga como sonriendo.',
  },
  {
    id: 'mp2',
    soundFocus: 'Sonido "TH" sordo /θ/ vs. Sonido "S" /s/',
    wordA: { word: 'Think', ipa: '/θɪŋk/', spanish: 'Pensar' },
    wordB: { word: 'Sink', ipa: '/sɪŋk/', spanish: 'Fregadero / Hundirse' },
    explanation: 'Para "Think", la lengua toca los dientes frontales dejando salir el aire. En "Sink", la lengua queda detrás de los dientes.',
  },
  {
    id: 'mp3',
    soundFocus: 'Sonido "B" /b/ vs. Sonido "V" labiodental /v/',
    wordA: { word: 'Berry', ipa: '/ˈberi/', spanish: 'Baya / Fruta' },
    wordB: { word: 'Very', ipa: '/ˈveri/', spanish: 'Muy' },
    explanation: 'En "Very", los dientes superiores apoyan suavemente sobre el labio inferior produciendo una pequeña vibración.',
  },
  {
    id: 'mp4',
    soundFocus: 'Vocal /æ/ vs. Vocal /ʌ/',
    wordA: { word: 'Cat', ipa: '/kæt/', spanish: 'Gato' },
    wordB: { word: 'Cut', ipa: '/kʌt/', spanish: 'Cortar' },
    explanation: '"Cat" abre la boca ampliamente tirando las comisuras hacia atrás. "Cut" abre la boca relajada y corta.',
  }
];

export const phoneticSounds: PhoneticSound[] = [
  {
    id: 'ps1',
    symbol: '/θ/',
    soundName: 'TH Sorda (Unvoiced TH)',
    description: 'Sonido producido colocando la punta de la lengua suavemente entre los dientes incisivos sin usar las cuerdas vocales.',
    spanishTip: 'Semejante a la "Z" en el español de España (como en "zapato"). Se sopla aire con la lengua entre los dientes.',
    examples: [
      { word: 'Think', ipa: '/θɪŋk/', spanish: 'Pensar' },
      { word: 'Three', ipa: '/θriː/', spanish: 'Tres' },
      { word: 'Thank you', ipa: '/θæŋk juː/', spanish: 'Gracias' },
    ]
  },
  {
    id: 'ps2',
    symbol: '/ð/',
    soundName: 'TH Sonora (Voiced TH)',
    description: 'Misma posición de la lengua que /θ/, pero haciendo vibrar las cuerdas vocales.',
    spanishTip: 'Imagina la "D" suave en español cuando dices "cada" o "nada", pero tocando los dientes con la lengua.',
    examples: [
      { word: 'This', ipa: '/ðɪs/', spanish: 'Este/Esta' },
      { word: 'Mother', ipa: '/ˈmʌðər/', spanish: 'Madre' },
      { word: 'Weather', ipa: '/ˈweðər/', spanish: 'Clima' },
    ]
  },
  {
    id: 'ps3',
    symbol: '/r/',
    soundName: 'R Americana Suave',
    description: 'La lengua se curva ligeramente hacia atrás sin tocar jamás el paladar ni los dientes.',
    spanishTip: 'A diferencia de la "R" fuerte o suave en español, la "R" en inglés NUNCA vibra ni toca el techo de la boca.',
    examples: [
      { word: 'Red', ipa: '/red/', spanish: 'Rojo' },
      { word: 'Right', ipa: '/raɪt/', spanish: 'Correcto / Derecha' },
      { word: 'Car', ipa: '/kɑːr/', spanish: 'Coche' },
    ]
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    targetEnglish: 'Could you please slow down a bit?',
    spanishPrompt: '¿Cómo pedirías amablemente que hablen más despacio?',
    ipa: '/kʊd juː pliːz sləʊ daʊn ə bɪt/',
    options: [
      'Could you please slow down a bit?',
      'Can you speak more fast please?',
      'Speak low down a bit please.',
      'Could you stop talking so quickly?'
    ],
    correctAnswer: 'Could you please slow down a bit?',
    audioHint: 'Could you please slow down a bit?'
  },
  {
    id: 'q2',
    targetEnglish: 'Ship',
    spanishPrompt: '¿Cuál palabra significa "Barco" con el sonido de vocal corta /ɪ/?',
    ipa: '/ʃɪp/',
    options: ['Sheep', 'Ship', 'Shape', 'Shop'],
    correctAnswer: 'Ship',
    audioHint: 'Ship'
  },
  {
    id: 'q3',
    targetEnglish: 'I think this is a great opportunity.',
    spanishPrompt: 'Selecciona la frase correcta con pronunciación de "TH":',
    ipa: '/aɪ θɪŋk ðɪs ɪz ə ɡreɪt ˌɒpəˈtjuːnəti/',
    options: [
      'I think this is a great opportunity.',
      'I sink dis is a great opportunity.',
      'I tink tis is a great opportunity.',
      'I thought this is a big opportunity.'
    ],
    correctAnswer: 'I think this is a great opportunity.',
    audioHint: 'I think this is a great opportunity.'
  }
];

export const conversationScenarios: ConversationScenario[] = [
  {
    id: 'sc1',
    title: '☕ Pedir Café en una Cafetería',
    description: 'Practica pedir tu bebida favorita y responde al cajero en un entorno cotidiano.',
    category: 'Travel & Food',
    difficulty: 'beginner',
    dialogue: [
      {
        id: 'd1',
        speaker: 'AI',
        english: 'Hi there! Welcome to Star Coffee. What can I get started for you today?',
        spanish: '¡Hola! Bienvenido a Star Coffee. ¿Qué puedo prepararte hoy?',
        ipa: '/haɪ ðeər! ˈwelkəm tə stɑː ˈkɒfi. wɒt kæn aɪ ɡet ˈstɑːtɪd fɔː juː təˈdeɪ?/',
      },
      {
        id: 'd2',
        speaker: 'User',
        english: 'Hi, I would like a large iced coffee with oat milk, please.',
        spanish: 'Hola, me gustaría un café helado grande con leche de avena, por favor.',
        ipa: '/haɪ, aɪ wʊd laɪk ə lɑːdʒ aɪst ˈkɒfi wɪð əʊt mɪlk, pliːz/',
        promptTip: 'Pronuncia "iced" (/aɪst/) claramente con el sonido final /t/.',
      },
      {
        id: 'd3',
        speaker: 'AI',
        english: 'Great choice! Would you like any pastry or muffin with that?',
        spanish: '¡Gran elección! ¿Te gustaría algún pastel o muffin para acompañar?',
        ipa: '/ɡreɪt tʃɔɪs! wʊd juː laɪk ˈeni ˈpeɪstri ɔː ˈmʌfɪn wɪð ðæt?/',
      },
      {
        id: 'd4',
        speaker: 'User',
        english: 'No thanks, just the coffee to go.',
        spanish: 'No gracias, solo el café para llevar.',
        ipa: '/nəʊ θæŋks, dʒʌst ðə ˈkɒfi tə ɡəʊ/',
        promptTip: 'Asegura el sonido /θ/ en "thanks".',
      },
    ],
  },
  {
    id: 'sc2',
    title: '🏨 Check-in en el Hotel',
    description: 'Simula el registro de entrada en la recepción de un hotel internacional.',
    category: 'Travel & Food',
    difficulty: 'intermediate',
    dialogue: [
      {
        id: 'd1',
        speaker: 'AI',
        english: 'Good afternoon! Welcome to the Grand Plaza. How may I assist you?',
        spanish: '¡Buenas tardes! Bienvenido al Grand Plaza. ¿En qué puedo ayudarle?',
        ipa: '/ɡʊd ˌɑːftəˈnuːn! ˈwelkəm tə ðə ɡrænd ˈplɑːzə. haʊ meɪ aɪ əˈsɪst juː?/',
      },
      {
        id: 'd2',
        speaker: 'User',
        english: 'Hello, I have a reservation under the name of Garcia.',
        spanish: 'Hola, tengo una reservación a nombre de García.',
        ipa: '/həˈləʊ, aɪ hæv ə ˌrezəˈveɪʃn ˈʌndər ðə neɪm əv ɡɑːˈsiːə/',
        promptTip: 'Acentúa "reserVAtion" (/ˌrezəˈveɪʃn/).',
      },
      {
        id: 'd3',
        speaker: 'AI',
        english: 'Perfect. May I please see your passport and a credit card for incidentals?',
        spanish: 'Perfecto. ¿Podría ver su pasaporte y una tarjeta de crédito para gastos imprevistos?',
        ipa: '/ˈpɜːfɪkt. meɪ aɪ pliːz siː jɔː ˈpɑːspɔːt ənd ə ˈkredɪt kɑːd fɔːr ˌɪnsɪˈdentlz?/',
      },
      {
        id: 'd4',
        speaker: 'User',
        english: 'Sure, here you go. Is breakfast included in the booking?',
        spanish: 'Claro, aquí tiene. ¿El desayuno está incluido en la reserva?',
        ipa: '/ʃʊər, hɪər juː ɡəʊ. ɪz ˈbrekfəst ɪnˈkluːdɪd ɪn ðə ˈbʊkɪŋ?/',
        promptTip: 'Pronuncia "breakfast" como /ˈbrekfəst/ (no brekFAST).',
      },
    ],
  },
];