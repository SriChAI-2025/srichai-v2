// Mock data for demo mode
export interface MockExam {
  _id: string;
  title: string;
  description: string;
  examCode: string;
  createdAt: string;
  status: 'draft' | 'active' | 'completed';
  sections: MockSection[];
  stats: {
    questionCount: number;
    totalAnswers: number;
    gradedAnswers: number;
    studentCount: number;
  };
}

export interface MockSection {
  _id: string;
  title: string;
  description: string;
  order: number;
  questions: MockQuestion[];
}

export interface MockQuestion {
  _id: string;
  examId: string;
  sectionId: string;
  questionCode: string;
  promptText: string;
  promptImage?: string;
  modelAnswer: string;
  referenceMaterial?: string;
  exampleResponses: Array<{
    text: string;
    score: number;
  }>;
  maxScore: number;
  order: number;
  answers: MockAnswer[];
}

export interface MockAnswer {
  _id: string;
  examId: string;
  questionId: string;
  studentId: string;
  answerText?: string;
  answerImage?: string;
  score?: number;
  scoreGivenBy?: 'teacher' | 'ai';
  feedback?: string;
  gradedAt?: string;
  createdAt: string;
}

// Generate student IDs
const generateStudentIds = (count: number) => {
  return Array.from({ length: count }, (_, i) => `student_${(i + 1).toString().padStart(3, '0')}`);
};

// Generate random image URLs from Pexels
const getRandomImageUrl = () => {
  const imageIds = [
    '159711', '261909', '1370295', '256541', '1181244', '1181677', '1181263', 
    '1181406', '1181298', '1181472', '1181533', '1181619', '1181686', '1181715',
    '1181772', '301920', '159775', '159740', '159844', '159866', '159888',
    '159901', '159924', '159947', '159970', '159993', '160016', '160039'
  ];
  const randomId = imageIds[Math.floor(Math.random() * imageIds.length)];
  return `https://images.pexels.com/photos/${randomId}/pexels-photo-${randomId}.jpeg?auto=compress&cs=tinysrgb&w=800`;
};

// Get math section A answer images
const getMathSectionAImage = () => {
  const mathImages = [
    '/mathsa1.png', '/mathsa2.png', '/mathsa3.png', '/mathsa4.png', '/mathsa5.png',
    '/mathsa6.png', '/mathsa7.png', '/mathsa8.png', '/mathsa9.png', '/mathsa10.png'
  ];
  return mathImages[Math.floor(Math.random() * mathImages.length)];
};

// Get shuffled math images for different sections
const getMathSectionBImage = () => {
  // Shuffled order for Section B
  const mathImages = [
    '/mathsa3.png', '/mathsa7.png', '/mathsa1.png', '/mathsa9.png', '/mathsa5.png',
    '/mathsa10.png', '/mathsa2.png', '/mathsa6.png', '/mathsa4.png', '/mathsa8.png'
  ];
  return mathImages[Math.floor(Math.random() * mathImages.length)];
};

const getMathSectionCImage = () => {
  // Different shuffled order for Section C
  const mathImages = [
    '/mathsa8.png', '/mathsa4.png', '/mathsa10.png', '/mathsa2.png', '/mathsa6.png',
    '/mathsa1.png', '/mathsa9.png', '/mathsa3.png', '/mathsa7.png', '/mathsa5.png'
  ];
  return mathImages[Math.floor(Math.random() * mathImages.length)];
};

// Get physics section A answer images
const getPhysicsSectionAImage = () => {
  const physicsImages = [
    '/physics1.png', '/physics2.png', '/physics3.png', '/physics4.png', '/physics5.png',
    '/physics6.png', '/physics7.png', '/physics8.png', '/physics9.png', '/physics10.png', '/physics11.png'
  ];
  return physicsImages[Math.floor(Math.random() * physicsImages.length)];
};

// Get shuffled physics images for different sections
const getPhysicsSectionBImage = () => {
  // Shuffled order for Section B
  const physicsImages = [
    '/physics4.png', '/physics8.png', '/physics2.png', '/physics10.png', '/physics6.png',
    '/physics11.png', '/physics3.png', '/physics7.png', '/physics1.png', '/physics9.png', '/physics5.png'
  ];
  return physicsImages[Math.floor(Math.random() * physicsImages.length)];
};

const getPhysicsSectionCImage = () => {
  // Different shuffled order for Section C
  const physicsImages = [
    '/physics9.png', '/physics5.png', '/physics11.png', '/physics3.png', '/physics7.png',
    '/physics1.png', '/physics10.png', '/physics4.png', '/physics8.png', '/physics2.png', '/physics6.png'
  ];
  return physicsImages[Math.floor(Math.random() * physicsImages.length)];
};

// Helper function to get appropriate math image based on section
const getMathImageForSection = (examId: string, sectionId: string) => {
  if (examId !== 'exam2') return getRandomImageUrl(); // Only for math exam
  
  if (sectionId === 'section4') return getMathSectionAImage(); // Section A
  if (sectionId === 'section5') return getMathSectionBImage(); // Section B
  if (sectionId === 'section6') return getMathSectionCImage(); // Section C
  
  return getMathSectionAImage(); // Fallback
};

// Helper function to get appropriate physics image based on section
const getPhysicsImageForSection = (examId: string, sectionId: string) => {
  if (examId !== 'exam1') return getRandomImageUrl(); // Only for physics exam
  
  if (sectionId === 'section1') return getPhysicsSectionAImage(); // Section A
  if (sectionId === 'section2') return getPhysicsSectionBImage(); // Section B
  if (sectionId === 'section3') return getPhysicsSectionCImage(); // Section C
  
  return getPhysicsSectionAImage(); // Fallback
};

// Generate answers for a question
const generateAnswersForQuestion = (examId: string, questionId: string, studentIds: string[], sectionId?: string) => {
  return studentIds.map((studentId, index) => {
    const isGraded = Math.random() > 0.4; // 60% chance of being graded
    const answer: MockAnswer = {
      _id: `a_${questionId}_${studentId}`,
      examId,
      questionId,
      studentId,
      answerImage: examId === 'exam2' 
        ? getMathImageForSection(examId, sectionId || '') 
        : examId === 'exam1' 
        ? getPhysicsImageForSection(examId, sectionId || '')
        : getRandomImageUrl(),
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    if (isGraded) {
      // Determine max score based on section
      let maxScore = 10; // Default for Section C
      
      // Find the question to get its actual max score
      for (const exam of mockExams) {
        for (const section of exam.sections) {
          const question = section.questions.find(q => q._id === questionId);
          if (question) {
            maxScore = question.maxScore;
            break;
          }
        }
        if (maxScore !== 10) break;
      }
      
      // If we couldn't find the question yet (during initial creation), 
      // determine by section title patterns
      if (maxScore === 10 && sectionId) {
        if (sectionId.includes('section1') || sectionId.includes('section4')) {
          maxScore = 2; // Section A
        } else if (sectionId.includes('section2') || sectionId.includes('section5')) {
          maxScore = 5; // Section B
        }
        // Section C remains 10
      }
      
      // Generate score within the appropriate range (30-100% of max score)
      const minScore = Math.max(1, Math.ceil(maxScore * 0.3));
      answer.score = Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore;
      answer.scoreGivenBy = Math.random() > 0.5 ? 'teacher' : 'ai';
      answer.gradedAt = new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString();
      if (Math.random() > 0.7) {
        answer.feedback = 'Good work! Keep it up.';
      }
    }

    return answer;
  });
};

export const mockExams: MockExam[] = [
  {
    _id: 'exam1',
    title: 'Physics Midterm 2024',
    description: 'Comprehensive physics examination covering mechanics, thermodynamics, and wave motion',
    createdAt: '2024-01-15T10:00:00Z',
    status: 'active',
    sections: [
      {
        _id: 'section1',
        title: 'Section A: Short Answers',
        description: 'Answer briefly in 2-3 sentences (2 marks each)',
        order: 0,
        questions: [
          {
            _id: 'q1_a1',
            examId: 'exam1',
            sectionId: 'section1',
            promptText: 'Define Newton\'s First Law of Motion and provide one real-world example.',
            modelAnswer: 'Newton\'s First Law states that an object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force. Example: A book on a table remains stationary until pushed.',
            referenceMaterial: 'Textbook Chapter 2, pages 45-52',
            exampleResponses: [
              { text: 'Objects don\'t change motion unless force acts on them.', score: 1 },
              { text: 'Law of inertia - objects resist changes in motion. Example: car passengers move forward when brakes are applied.', score: 2 }
            ],
            maxScore: 2,
            order: 0,
            answers: []
          },
          {
            _id: 'q1_a2',
            examId: 'exam1',
            sectionId: 'section1',
            promptText: 'What is the difference between speed and velocity?',
            modelAnswer: 'Speed is a scalar quantity representing how fast an object moves. Velocity is a vector quantity that includes both speed and direction.',
            referenceMaterial: 'Textbook Chapter 1, pages 15-20',
            exampleResponses: [
              { text: 'Speed is how fast, velocity includes direction.', score: 1 },
              { text: 'Speed is scalar (magnitude only), velocity is vector (magnitude and direction).', score: 2 }
            ],
            maxScore: 2,
            order: 1,
            answers: []
          },
          {
            _id: 'q1_a3',
            examId: 'exam1',
            sectionId: 'section1',
            promptText: 'Define acceleration and state its SI unit.',
            modelAnswer: 'Acceleration is the rate of change of velocity with respect to time. Its SI unit is meters per second squared (m/s²).',
            referenceMaterial: 'Textbook Chapter 1, pages 25-30',
            exampleResponses: [
              { text: 'Change in velocity over time. Unit: m/s².', score: 2 },
              { text: 'How fast velocity changes.', score: 1 }
            ],
            maxScore: 2,
            order: 2,
            answers: []
          },
          {
            _id: 'q1_a4',
            examId: 'exam1',
            sectionId: 'section1',
            promptText: 'What is the principle of conservation of energy?',
            modelAnswer: 'Energy cannot be created or destroyed, only transformed from one form to another. The total energy in an isolated system remains constant.',
            referenceMaterial: 'Textbook Chapter 5, pages 95-100',
            exampleResponses: [
              { text: 'Energy cannot be created or destroyed, only changed forms.', score: 2 },
              { text: 'Energy stays the same.', score: 1 }
            ],
            maxScore: 2,
            order: 3,
            answers: []
          },
          {
            _id: 'q1_a5',
            examId: 'exam1',
            sectionId: 'section1',
            promptText: 'Define frequency and wavelength of a wave.',
            modelAnswer: 'Frequency is the number of complete oscillations per unit time (Hz). Wavelength is the distance between two consecutive points in phase on a wave (meters).',
            referenceMaterial: 'Textbook Chapter 7, pages 140-145',
            exampleResponses: [
              { text: 'Frequency: oscillations per second. Wavelength: distance between wave peaks.', score: 2 },
              { text: 'How often waves repeat and how long they are.', score: 1 }
            ],
            maxScore: 2,
            order: 4,
            answers: []
          }
        ]
      },
      {
        _id: 'section2',
        title: 'Section B: Detailed Explanations',
        description: 'Provide detailed explanations with examples (5 marks each)',
        order: 1,
        questions: [
          {
            _id: 'q1_b1',
            examId: 'exam1',
            sectionId: 'section2',
            promptText: 'Explain the three laws of thermodynamics with practical applications.',
            modelAnswer: 'First Law: Energy cannot be created or destroyed (conservation of energy) - used in heat engines. Second Law: Entropy of isolated systems increases - explains why heat flows from hot to cold. Third Law: Entropy approaches zero as temperature approaches absolute zero - used in cryogenics.',
            referenceMaterial: 'Textbook Chapter 6, pages 110-130',
            exampleResponses: [
              { text: 'Basic explanation of energy conservation and heat flow.', score: 3 },
              { text: 'Detailed explanation with examples and applications.', score: 5 }
            ],
            maxScore: 5,
            order: 0,
            answers: []
          },
          {
            _id: 'q1_b2',
            examId: 'exam1',
            sectionId: 'section2',
            promptText: 'Describe the photoelectric effect and its significance in quantum physics.',
            modelAnswer: 'The photoelectric effect occurs when electrons are emitted from a material surface when light hits it. Einstein explained this using quantum theory, showing light behaves as particles (photons). This led to the development of quantum mechanics and has applications in solar cells and photodiodes.',
            referenceMaterial: 'Textbook Chapter 8, pages 160-175',
            exampleResponses: [
              { text: 'Light knocks electrons out of metals.', score: 2 },
              { text: 'Detailed explanation of photon-electron interaction and quantum implications.', score: 5 }
            ],
            maxScore: 5,
            order: 1,
            answers: []
          },
          {
            _id: 'q1_b3',
            examId: 'exam1',
            sectionId: 'section2',
            promptText: 'Explain electromagnetic induction and Faraday\'s law with applications.',
            modelAnswer: 'Electromagnetic induction is the production of EMF when magnetic flux through a conductor changes. Faraday\'s law states EMF = -dΦ/dt. Applications include generators, transformers, and induction motors.',
            referenceMaterial: 'Textbook Chapter 9, pages 180-200',
            exampleResponses: [
              { text: 'Changing magnetic fields create electricity.', score: 2 },
              { text: 'Complete explanation with mathematical law and practical applications.', score: 5 }
            ],
            maxScore: 5,
            order: 2,
            answers: []
          },
          {
            _id: 'q1_b4',
            examId: 'exam1',
            sectionId: 'section2',
            promptText: 'Discuss the wave-particle duality of light with experimental evidence.',
            modelAnswer: 'Light exhibits both wave and particle properties. Wave nature: interference, diffraction (Young\'s double slit). Particle nature: photoelectric effect, Compton scattering. This duality is fundamental to quantum mechanics.',
            referenceMaterial: 'Textbook Chapter 8, pages 155-180',
            exampleResponses: [
              { text: 'Light is both wave and particle.', score: 2 },
              { text: 'Detailed discussion with experimental evidence and implications.', score: 5 }
            ],
            maxScore: 5,
            order: 3,
            answers: []
          },
          {
            _id: 'q1_b5',
            examId: 'exam1',
            sectionId: 'section2',
            promptText: 'Explain the concept of electric field and its relationship with electric potential.',
            modelAnswer: 'Electric field is the force per unit charge at a point in space (E = F/q). Electric potential is the work done per unit charge to bring a charge from infinity (V = W/q). Relationship: E = -dV/dr (field is negative gradient of potential).',
            referenceMaterial: 'Textbook Chapter 4, pages 70-90',
            exampleResponses: [
              { text: 'Electric field is force on charges, potential is energy.', score: 3 },
              { text: 'Complete explanation with mathematical relationships and units.', score: 5 }
            ],
            maxScore: 5,
            order: 4,
            answers: []
          }
        ]
      },
      {
        _id: 'section3',
        title: 'Section C: Problem Solving',
        description: 'Solve problems showing all work and calculations (10 marks each)',
        order: 2,
        questions: [
          {
            _id: 'q1_c1',
            examId: 'exam1',
            sectionId: 'section3',
            promptText: 'A 5kg object is pushed with a force of 20N. If the coefficient of friction is 0.3, calculate the acceleration. (g = 9.8 m/s²)',
            modelAnswer: 'Given: m = 5kg, F = 20N, μ = 0.3, g = 9.8 m/s²\nStep 1: Calculate friction force: f = μ × N = μ × mg = 0.3 × 5 × 9.8 = 14.7N\nStep 2: Calculate net force: F_net = F_applied - f = 20 - 14.7 = 5.3N\nStep 3: Calculate acceleration: a = F_net/m = 5.3/5 = 1.06 m/s²',
            referenceMaterial: 'Textbook Chapter 3, Newton\'s Laws and Friction',
            exampleResponses: [
              { text: 'F = ma, so a = F/m = 20/5 = 4 m/s²', score: 3 },
              { text: 'Complete solution with friction calculation: a = 1.06 m/s²', score: 10 }
            ],
            maxScore: 10,
            order: 0,
            answers: []
          },
          {
            _id: 'q1_c2',
            examId: 'exam1',
            sectionId: 'section3',
            promptText: 'A projectile is launched at 30° with initial velocity 50 m/s. Find maximum height and range. (g = 9.8 m/s²)',
            modelAnswer: 'Given: v₀ = 50 m/s, θ = 30°, g = 9.8 m/s²\nv₀ₓ = v₀cos30° = 50 × 0.866 = 43.3 m/s\nv₀ᵧ = v₀sin30° = 50 × 0.5 = 25 m/s\nMax height: H = v₀ᵧ²/(2g) = 25²/(2×9.8) = 31.9 m\nRange: R = v₀²sin(2θ)/g = 50²sin(60°)/9.8 = 220.4 m',
            referenceMaterial: 'Textbook Chapter 2, Projectile Motion',
            exampleResponses: [
              { text: 'Basic projectile formulas without proper calculation.', score: 4 },
              { text: 'Complete solution with component analysis and correct answers.', score: 10 }
            ],
            maxScore: 10,
            order: 1,
            answers: []
          },
          {
            _id: 'q1_c3',
            examId: 'exam1',
            sectionId: 'section3',
            promptText: 'Calculate the electric field at a point 2m from a 5μC point charge. Also find the potential at this point.',
            modelAnswer: 'Given: q = 5μC = 5×10⁻⁶ C, r = 2m, k = 9×10⁹ Nm²/C²\nElectric field: E = kq/r² = (9×10⁹ × 5×10⁻⁶)/2² = 11,250 N/C\nElectric potential: V = kq/r = (9×10⁹ × 5×10⁻⁶)/2 = 22,500 V',
            referenceMaterial: 'Textbook Chapter 4, Electric Fields and Potential',
            exampleResponses: [
              { text: 'Basic formulas without numerical calculation.', score: 4 },
              { text: 'Complete calculation with correct units and answers.', score: 10 }
            ],
            maxScore: 10,
            order: 2,
            answers: []
          },
          {
            _id: 'q1_c4',
            examId: 'exam1',
            sectionId: 'section3',
            promptText: 'A spring with spring constant 200 N/m is compressed by 0.1m. Calculate the elastic potential energy and the speed of a 0.5kg mass when released.',
            modelAnswer: 'Given: k = 200 N/m, x = 0.1m, m = 0.5kg\nElastic PE: U = ½kx² = ½ × 200 × (0.1)² = 1 J\nUsing conservation of energy: U = KE\n½kx² = ½mv²\nv = √(kx²/m) = √(200 × 0.01/0.5) = √4 = 2 m/s',
            referenceMaterial: 'Textbook Chapter 5, Energy and Springs',
            exampleResponses: [
              { text: 'Basic energy formulas without complete solution.', score: 5 },
              { text: 'Complete solution using conservation of energy.', score: 10 }
            ],
            maxScore: 10,
            order: 3,
            answers: []
          },
          {
            _id: 'q1_c5',
            examId: 'exam1',
            sectionId: 'section3',
            promptText: 'A wave has frequency 50 Hz and wavelength 4m. Calculate its speed. If this wave enters a medium where its speed becomes 150 m/s, find the new wavelength.',
            modelAnswer: 'Given: f = 50 Hz, λ₁ = 4m, v₂ = 150 m/s\nWave speed: v₁ = fλ₁ = 50 × 4 = 200 m/s\nFrequency remains constant when entering new medium\nNew wavelength: λ₂ = v₂/f = 150/50 = 3 m',
            referenceMaterial: 'Textbook Chapter 7, Wave Properties',
            exampleResponses: [
              { text: 'Basic wave equation without considering medium change.', score: 5 },
              { text: 'Complete solution considering frequency conservation.', score: 10 }
            ],
            maxScore: 10,
            order: 4,
            answers: []
          }
        ]
      }
    ],
    stats: {
      questionCount: 15,
      totalAnswers: 0,
      gradedAnswers: 0,
      studentCount: 0
    }
  },
  {
    _id: 'exam2',
    title: 'Mathematics Final Exam',
    description: 'Comprehensive mathematics examination covering algebra, calculus, and geometry',
    examCode: 'MATH2024FIN',
    createdAt: '2024-01-10T09:00:00Z',
    status: 'completed',
    sections: [
      {
        _id: 'section4',
        title: 'Section A: Basic Concepts',
        description: 'Short answer questions (2 marks each)',
        order: 0,
        questions: [
          {
            _id: 'q2_a1',
            examId: 'exam2',
            sectionId: 'section4',
            questionCode: 'Q1A',
            promptText: 'Define the derivative of a function.',
            modelAnswer: 'The derivative of a function f(x) at a point is the limit of the rate of change of the function as the interval approaches zero. It represents the slope of the tangent line at that point.',
            maxScore: 2,
            order: 0,
            answers: []
          },
          {
            _id: 'q2_a2',
            examId: 'exam2',
            sectionId: 'section4',
            questionCode: 'Q2A',
            promptText: 'What is the Pythagorean theorem?',
            modelAnswer: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c².',
            maxScore: 2,
            order: 1,
            answers: []
          },
          {
            _id: 'q2_a3',
            examId: 'exam2',
            sectionId: 'section4',
            questionCode: 'Q3A',
            promptText: 'Define a prime number.',
            modelAnswer: 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.',
            maxScore: 2,
            order: 2,
            answers: []
          },
          {
            _id: 'q2_a4',
            examId: 'exam2',
            sectionId: 'section4',
            questionCode: 'Q4A',
            promptText: 'What is the quadratic formula?',
            modelAnswer: 'For equation ax² + bx + c = 0, the solutions are x = (-b ± √(b² - 4ac)) / 2a.',
            maxScore: 2,
            order: 3,
            answers: []
          },
          {
            _id: 'q2_a5',
            examId: 'exam2',
            sectionId: 'section4',
            questionCode: 'Q5A',
            promptText: 'Define the area of a circle.',
            modelAnswer: 'The area of a circle with radius r is A = πr².',
            maxScore: 2,
            order: 4,
            answers: []
          }
        ]
      },
      {
        _id: 'section5',
        title: 'Section B: Applications',
        description: 'Applied mathematics problems (5 marks each)',
        order: 1,
        questions: [
          {
            _id: 'q2_b1',
            examId: 'exam2',
            sectionId: 'section5',
            questionCode: 'Q1B',
            promptText: 'Explain the fundamental theorem of calculus.',
            modelAnswer: 'The fundamental theorem connects differentiation and integration. Part 1: If F(x) = ∫f(t)dt from a to x, then F\'(x) = f(x). Part 2: ∫f(x)dx from a to b = F(b) - F(a) where F\'(x) = f(x).',
            maxScore: 5,
            order: 0,
            answers: []
          },
          {
            _id: 'q2_b2',
            examId: 'exam2',
            sectionId: 'section5',
            questionCode: 'Q2B',
            promptText: 'Describe the properties of logarithms.',
            modelAnswer: 'Key properties: log(ab) = log(a) + log(b), log(a/b) = log(a) - log(b), log(aⁿ) = n·log(a), log_a(a) = 1, log_a(1) = 0.',
            maxScore: 5,
            order: 1,
            answers: []
          },
          {
            _id: 'q2_b3',
            examId: 'exam2',
            sectionId: 'section5',
            questionCode: 'Q3B',
            promptText: 'Explain matrix multiplication and its properties.',
            modelAnswer: 'Matrix multiplication: (AB)ij = Σ(Aik × Bkj). Properties: not commutative (AB ≠ BA), associative ((AB)C = A(BC)), distributive (A(B+C) = AB + AC).',
            maxScore: 5,
            order: 2,
            answers: []
          },
          {
            _id: 'q2_b4',
            examId: 'exam2',
            sectionId: 'section5',
            questionCode: 'Q4B',
            promptText: 'Describe the binomial theorem.',
            modelAnswer: '(a + b)ⁿ = Σ(nCk × aⁿ⁻ᵏ × bᵏ) for k = 0 to n, where nCk = n!/(k!(n-k)!) is the binomial coefficient.',
            maxScore: 5,
            order: 3,
            answers: []
          },
          {
            _id: 'q2_b5',
            examId: 'exam2',
            sectionId: 'section5',
            questionCode: 'Q5B',
            promptText: 'Explain the concept of limits in calculus.',
            modelAnswer: 'A limit describes the value a function approaches as the input approaches a certain value. Formally: lim(x→a) f(x) = L if for every ε > 0, there exists δ > 0 such that |f(x) - L| < ε when 0 < |x - a| < δ.',
            maxScore: 5,
            order: 4,
            answers: []
          }
        ]
      },
      {
        _id: 'section6',
        title: 'Section C: Complex Problems',
        description: 'Advanced problem solving (10 marks each)',
        order: 2,
        questions: [
          {
            _id: 'q2_c1',
            examId: 'exam2',
            sectionId: 'section6',
            questionCode: 'Q1C',
            promptText: 'Find the area under the curve y = x² from x = 0 to x = 3 using integration.',
            modelAnswer: 'Area = ∫₀³ x² dx = [x³/3]₀³ = (3³/3) - (0³/3) = 27/3 - 0 = 9 square units.',
            maxScore: 10,
            order: 0,
            answers: []
          },
          {
            _id: 'q2_c2',
            examId: 'exam2',
            sectionId: 'section6',
            questionCode: 'Q2C',
            promptText: 'Solve the system of equations: 2x + 3y = 7, 4x - y = 1 using substitution method.',
            modelAnswer: 'From equation 2: y = 4x - 1. Substitute into equation 1: 2x + 3(4x - 1) = 7, 2x + 12x - 3 = 7, 14x = 10, x = 5/7. Then y = 4(5/7) - 1 = 20/7 - 7/7 = 13/7. Solution: x = 5/7, y = 13/7.',
            maxScore: 10,
            order: 1,
            answers: []
          },
          {
            _id: 'q2_c3',
            examId: 'exam2',
            sectionId: 'section6',
            questionCode: 'Q3C',
            promptText: 'Find the maximum and minimum values of f(x) = x³ - 6x² + 9x + 1 on the interval [0, 4].',
            modelAnswer: 'f\'(x) = 3x² - 12x + 9 = 3(x² - 4x + 3) = 3(x - 1)(x - 3). Critical points: x = 1, 3. f(0) = 1, f(1) = 5, f(3) = 1, f(4) = 5. Maximum: 5 at x = 1 and x = 4. Minimum: 1 at x = 0 and x = 3.',
            maxScore: 10,
            order: 2,
            answers: []
          },
          {
            _id: 'q2_c4',
            examId: 'exam2',
            sectionId: 'section6',
            questionCode: 'Q4C',
            promptText: 'Prove that the sum of first n natural numbers is n(n+1)/2 using mathematical induction.',
            modelAnswer: 'Base case: n = 1, sum = 1 = 1(1+1)/2 = 1 ✓. Inductive step: Assume true for n = k, i.e., 1+2+...+k = k(k+1)/2. For n = k+1: 1+2+...+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k/2 + 1) = (k+1)(k+2)/2. Thus true for all n ≥ 1.',
            maxScore: 10,
            order: 3,
            answers: []
          },
          {
            _id: 'q2_c5',
            examId: 'exam2',
            sectionId: 'section6',
            questionCode: 'Q5C',
            promptText: 'Find the equation of the tangent line to the curve y = e^x at the point where x = ln(2).',
            modelAnswer: 'At x = ln(2): y = e^(ln(2)) = 2. Point: (ln(2), 2). dy/dx = e^x, so slope at x = ln(2) is e^(ln(2)) = 2. Tangent line: y - 2 = 2(x - ln(2)), y = 2x - 2ln(2) + 2.',
            maxScore: 10,
            order: 4,
            answers: []
          }
        ]
      }
    ],
    stats: {
      questionCount: 15,
      totalAnswers: 0,
      gradedAnswers: 0,
      studentCount: 0
    }
  }
];

// Generate answers for all questions
const studentIds = generateStudentIds(8); // 8 students

// Add answers to all questions
mockExams.forEach(exam => {
  exam.sections.forEach(section => {
    section.questions.forEach(question => {
      question.answers = generateAnswersForQuestion(exam._id, question._id, studentIds, section._id);
    });
  });
});

// Update exam stats
mockExams.forEach(exam => {
  const allAnswers = exam.sections.flatMap(s => s.questions.flatMap(q => q.answers));
  const gradedAnswers = allAnswers.filter(a => a.score !== undefined);
  const studentIds = [...new Set(allAnswers.map(a => a.studentId))];
  
  exam.stats = {
    questionCount: exam.sections.reduce((sum, s) => sum + s.questions.length, 0),
    totalAnswers: allAnswers.length,
    gradedAnswers: gradedAnswers.length,
    studentCount: studentIds.length
  };
});

// Helper functions for mock data management
let examCounter = mockExams.length + 1;
let questionCounter = 100;
let answerCounter = 1000;
let examCodeCounter = 1000;

export const createMockExam = (examData: Partial<MockExam>): MockExam => {
  // Generate exam code if not provided
  const examCode = examData.title ? 
    `EX${examCodeCounter++}` : 
    `EX${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
  const newExam: MockExam = {
    _id: `exam${examCounter++}`,
    title: examData.title || 'New Exam',
    description: examData.description || '',
    createdAt: new Date().toISOString(),
    status: examData.status || 'draft',
    sections: examData.sections || [],
    examCode: examCode,
    stats: {
      questionCount: 0,
      totalAnswers: 0,
      gradedAnswers: 0,
      studentCount: 0
    }
  };
  
  mockExams.push(newExam);
  return newExam;
};

export const createMockQuestion = (questionData: Partial<MockQuestion> & { questionCode?: string }): MockQuestion => {
  const newQuestion: MockQuestion = {
    _id: `q${questionCounter++}`,
    examId: questionData.examId || '',
    sectionId: questionData.sectionId || '',
    promptText: questionData.promptText || '',
    questionCode: questionData.questionCode || `Q${questionCounter}`,
    modelAnswer: questionData.modelAnswer || '',
    referenceMaterial: questionData.referenceMaterial || '',
    exampleResponses: questionData.exampleResponses || [],
    maxScore: questionData.maxScore || 10,
    order: questionData.order || 0,
    answers: []
  };
  
  return newQuestion;
};

export const createMockAnswer = (answerData: Partial<MockAnswer>): MockAnswer => {
  const newAnswer: MockAnswer = {
    _id: `a${answerCounter++}`,
    examId: answerData.examId || '',
    questionId: answerData.questionId || '',
    studentId: answerData.studentId || `student_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    answerText: answerData.answerText,
    answerImage: answerData.answerImage,
    score: answerData.score,
    scoreGivenBy: answerData.scoreGivenBy,
    feedback: answerData.feedback,
    gradedAt: answerData.gradedAt,
    createdAt: answerData.createdAt || new Date().toISOString()
  };
  
  return newAnswer;
};

export const updateExamStats = (examId: string) => {
  const exam = mockExams.find(e => e._id === examId);
  if (!exam) return;
  
  const allAnswers = exam.sections.flatMap(s => s.questions.flatMap(q => q.answers));
  const gradedAnswers = allAnswers.filter(a => a.score !== undefined);
  const studentIds = [...new Set(allAnswers.map(a => a.studentId))];
  
  exam.stats = {
    questionCount: exam.sections.reduce((sum, s) => sum + s.questions.length, 0),
    totalAnswers: allAnswers.length,
    gradedAnswers: gradedAnswers.length,
    studentCount: studentIds.length
  };
};