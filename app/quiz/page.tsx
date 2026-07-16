"use client";

import React, { useState } from "react";

// --- Types ---
interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// --- 1. Pool of 25 Mauritius-focused Simple Health Questions ---
const localHealthQuestionsPool: Question[] = [
  {
    id: 1,
    category: "Mosquito Diseases",
    question: "Which mosquito spreads Dengue fever around neighborhoods in Mauritius?",
    options: ["Aedes albopictus", "Anopheles arabiensis", "Culex pipiens", "Aedes aegypti"],
    correctAnswer: "Aedes albopictus",
    explanation: "The 'Aedes albopictus' mosquito spreads Dengue in Mauritius. It has black and white stripes on its legs and likes to hide in bushes outside.",
  },
  {
    id: 2,
    category: "Home Safety",
    question: "What is the best way to stop mosquitoes from breeding around your house?",
    options: ["Using air freshener sprays indoors", "Emptying out standing water every week", "Keeping outdoor lights on all night", "Using only electronic plug-ins"],
    correctAnswer: "Emptying out standing water every week",
    explanation: "Mosquitoes need water to lay eggs. Pouring water out of old tires, plant pots, and gutters every week stops them from growing.",
  },
  {
    id: 3,
    category: "Medicine Safety",
    question: "If you think you have Dengue fever, which painkiller medicine should you NEVER take?",
    options: ["Paracetamol", "Ibuprofen and Aspirin", "Panadol Regular", "Vitamin C"],
    correctAnswer: "Ibuprofen and Aspirin",
    explanation: "Ibuprofen and Aspirin thin your blood. Taking them while you have Dengue can cause dangerous internal bleeding.",
  },
  {
    id: 4,
    category: "Mosquito Behavior",
    question: "When are Dengue mosquitoes most active and most likely to bite you?",
    options: ["Only during the middle of the night", "During daylight hours", "Only when it is raining heavily", "Only between midnight and dawn"],
    correctAnswer: "During daylight hours",
    explanation: "Dengue mosquitoes bite during the day. They are busiest right after sunrise and a few hours before sunset.",
  },
  {
    id: 5,
    category: "Local Health Facts",
    question: "What is the official status of Malaria transmission on the island of Mauritius?",
    options: ["Certified as malaria-free", "Very common all over the island", "Only spreads during the winter", "High risk in big cities"],
    correctAnswer: "Certified as malaria-free",
    explanation: "Mauritius is officially certified as malaria-free. Doctors still watch out for cases brought in from other countries, but it does not spread locally.",
  },
  {
    id: 6,
    category: "Spotting Symptoms",
    question: "Which symptom is a main sign of Chikungunya that makes it different from a normal flu?",
    options: ["Severe, painful joints that last a long time", "Sudden loss of taste and smell", "A dry cough that will not stop", "Earaches and a sore throat"],
    correctAnswer: "Severe, painful joints that last a long time",
    explanation: "Chikungunya causes very bad joint pain in your hands, wrists, and feet. This pain can sometimes last for months.",
  },
  {
    id: 7,
    category: "Local Health Facts",
    question: "Is Leprosy still found in Mauritius today?",
    options: ["It was completely wiped out in 1950", "A few rare cases are still found and treated", "It only exists high up in the mountains", "It has never been found in Mauritius"],
    correctAnswer: "A few rare cases are still found and treated",
    explanation: "Leprosy is very rare, but a few cases are still found occasionally. It can be completely cured with free medicine from public hospitals.",
  },
  {
    id: 8,
    category: "Spotting Symptoms",
    question: "What is an early sign of Leprosy that you should look out for on your skin?",
    options: ["Painless skin patches that lose their feeling", "Very itchy red bumps that spread fast", "High fever with swollen legs", "Losing hair and having brittle nails"],
    correctAnswer: "Painless skin patches that lose their feeling",
    explanation: "Leprosy damages nerves. It often starts as a light or reddish patch of skin that does not itch, does not hurt, and cannot feel heat or touch.",
  },
  {
    id: 9,
    category: "Bad Weather Risks",
    question: "After heavy rains or cyclones in Mauritius, what sickness can you catch from mud or water dirty with rat urine?",
    options: ["Leptospirosis", "Malaria", "Tuberculosis", "Chikungunya"],
    correctAnswer: "Leptospirosis",
    explanation: "Leptospirosis is a serious sickness carried by rats. When heavy rain falls, rat urine washes into puddles and mud, which can infect humans.",
  },
  {
    id: 10,
    category: "Home Safety",
    question: "What should you wear to stay safe when cleaning up muddy yards or gardens after a big storm?",
    options: ["Rubber boots and gloves", "Strong insect spray", "No shoes so you do not ruin them", "Nothing special"],
    correctAnswer: "Rubber boots and gloves",
    explanation: "Dirty floodwater can carry germs. Wearing boots and gloves keeps the dirty water away from cuts or scratches on your skin.",
  },
  {
    id: 11,
    category: "Seasonal Flu",
    question: "When do most people catch the seasonal flu in Mauritius?",
    options: ["During hot summer months (December to February)", "During cooler winter months (May to September)", "Only during springtime", "It is exactly the same all year long"],
    correctAnswer: "During cooler winter months (May to September)",
    explanation: "The flu spreads much faster during the cool, windy winter months in Mauritius. This is when most people get sick.",
  },
  {
    id: 12,
    category: "Flu Prevention",
    question: "Who can get the free annual flu vaccine from the Mauritian government?",
    options: ["Only young school children", "People over 60, pregnant women, and the sick", "Only people traveling out of the country", "Only hotel workers"],
    correctAnswer: "People over 60, pregnant women, and the sick",
    explanation: "The government gives free flu vaccines every year to older adults, pregnant women, and people with long-term health problems to keep them safe.",
  },
  {
    id: 13,
    category: "Stomach Health",
    question: "How can you protect your family from catching a stomach flu (gastro) during hot and rainy months?",
    options: ["Boil your tap water before drinking it", "Stop eating all green vegetables", "Take antibiotic pills every morning", "Skip breakfast on humid days"],
    correctAnswer: "Boil your tap water before drinking it",
    explanation: "Heavy rain can sometimes get dirty germs into water pipes. Boiling your tap water for one minute kills these germs and stops stomach flu.",
  },
  {
    id: 14,
    category: "Diabetes Awareness",
    question: "What is the best everyday habit to help prevent Type 2 Diabetes?",
    options: ["Eating less white sugar, sweets, and white bread", "Buying only expensive organic foods", "Stop eating all plant foods", "Drinking only special herbal teas"],
    correctAnswer: "Eating less white sugar, sweets, and white bread",
    explanation: "Cutting down on sugary drinks, sweets, white rice, and white bread helps your body handle sugar better and lowers your diabetes risk.",
  },
  {
    id: 15,
    category: "Blood Pressure",
    question: "Which food habit is a main cause of high blood pressure among adults in Mauritius?",
    options: ["Eating too much salt", "Drinking black tea with milk", "Eating normal portions of white rice", "Using too much fresh garlic"],
    correctAnswer: "Eating too much salt",
    explanation: "Eating too much salt from snacks, soy sauce, bouillon cubes, and salted fish raises your blood pressure and strains your heart.",
  },
  {
    id: 16,
    category: "Medical Emergency",
    question: "Which symptom means a person with Dengue fever needs to go to the hospital immediately?",
    options: ["Severe stomach pain or vomiting that will not stop", "A mild, itchy rash on the back", "A slight dry cough", "Feeling a little bit tired"],
    correctAnswer: "Severe stomach pain or vomiting that will not stop",
    explanation: "Bad stomach pain and constant vomiting are warning signs that Dengue has become dangerous. The person needs hospital care right away.",
  },
  {
    id: 17,
    category: "Free Healthcare",
    question: "How much do you have to pay for Tuberculosis (TB) tests and medicine in Mauritian public hospitals?",
    options: ["It is completely free", "You need private medical insurance", "You must pay for the medicine yourself", "Only the first test is free"],
    correctAnswer: "It is completely free",
    explanation: "All checkups, chest X-rays, and treatment medicines for Tuberculosis are 100% free for everyone in public health centers.",
  },
  {
    id: 18,
    category: "Bad Weather Risks",
    question: "If your tap water looks a bit cloudy or dirty after a heavy cyclone, what should you do?",
    options: ["Boil it thoroughly before drinking or cooking", "Strain it through a clean t-shirt only", "Let it sit open in a jug for 4 hours", "Drink it if it does not smell bad"],
    correctAnswer: "Boil it thoroughly before drinking or cooking",
    explanation: "Cyclones can damage clean water pipes, letting dirt and germs inside. Boiling the water is the safest way to make it clean again.",
  },
  {
    id: 19,
    category: "Skin Infections",
    question: "How does Scabies—a very itchy skin rash caused by tiny bugs—spread to other people?",
    options: ["Close, direct skin-to-skin contact for a long time", "Breathing in dust inside an old house", "Swimming in a public pool", "Walking past someone on the street"],
    correctAnswer: "Close, direct skin-to-skin contact for a long time",
    explanation: "Scabies bugs spread when you hug or hold hands with an infected person for a long time. It spreads easily among families living together.",
  },
  {
    id: 20,
    category: "Liver Sickness",
    question: "How do people usually catch the Hepatitis A virus, which hurts the liver?",
    options: ["Eating food or water contaminated with the germ", "Breathing in cold winter air", "Getting bitten by day mosquitoes", "Staying out in the sun too long"],
    correctAnswer: "Eating food or water contaminated with the germ",
    explanation: "Hepatitis A spreads when a person consumes food or water contaminated with the virus, usually from dirty hands or poor washing.",
  },
  {
    id: 21,
    category: "Emergency Numbers",
    question: "What is the direct phone number to call for a free government SAMU ambulance in Mauritius?",
    options: ["114", "999", "115", "112"],
    correctAnswer: "114",
    explanation: "Dialing 114 from any phone connects you straight to the SAMU emergency ambulance team for serious medical emergencies.",
  },
  {
    id: 22,
    category: "Sun Safety",
    question: "What is the healthiest way to protect your skin from the harsh sun in Mauritius?",
    options: ["Using sunscreen (SPF 30+) and staying in the shade", "Drinking extra black coffee", "Relying on clouds to block the heat", "Applying cream only once in the morning"],
    correctAnswer: "Using sunscreen (SPF 30+) and staying in the shade",
    explanation: "The tropical sun in Mauritius is very strong. Put on sunscreen every 2 hours and try to stay in the shade between 10 AM and 3 PM.",
  },
  {
    id: 23,
    category: "Food Safety",
    question: "What should you do before eating raw fruits or vegetables grown in your garden?",
    options: ["Wash them thoroughly under clean running water", "Boil them for ten full minutes", "Freeze them overnight first", "Peel them without washing them"],
    correctAnswer: "Wash them thoroughly under clean running water",
    explanation: "Washing removes dirt and trace slime left behind by snails or slugs. This slime can carry harmful stomach parasites.",
  },
  {
    id: 24,
    category: "Dengue Recovery",
    question: "What is the most important thing to do while recovering from Dengue fever at home?",
    options: ["Drink plenty of water and rehydration juice", "Do heavy exercise to sweat it out", "Stop drinking all liquids", "Drink only hot milk"],
    correctAnswer: "Drink plenty of water and rehydration juice",
    explanation: "Dengue fever causes you to lose a lot of body water. Drinking water mixed with oral rehydration salts (ORS) keeps your strength up.",
  },
  {
    id: 25,
    category: "Animal Bites",
    question: "What is the current status of Rabies (dog madness virus) in Mauritius?",
    options: ["Mauritius is officially free of Rabies", "It is very common among stray dogs", "Only local fruit bats carry it", "It only spreads during summer"],
    correctAnswer: "Mauritius is officially free of Rabies",
    explanation: "Mauritius is recognized as Rabies-free. However, if a stray animal bites you, you should still wash the wound well and see a doctor to prevent lockjaw (Tetanus).",
  },
  {
    id: 26,
    category: "Mosquito Control",
    question: "What kind of water does the Dengue mosquito actually prefer to lay its eggs in?",
    options: ["Clean, still rainwater", "Dirty, muddy swamp water", "Salty seawater in lagoons", "Fast-running river water"],
    correctAnswer: "Clean, still rainwater",
    explanation: "A common mistake is thinking mosquitoes only breed in dirty water. The Dengue mosquito actually prefers clean, still water, like rainwater collected in clean plastic cups or flower pots.",
  },
  {
    id: 27,
    category: "Local Sea Hazards",
    question: "Why should we be careful about eating certain large reef fish (like 'Vieille Rouge' or 'Carangue') during hot summer months in Mauritius?",
    options: ["They can carry a natural toxin that causes severe itching and sickness", "They lose all their vitamins in warm water", "They carry mosquito eggs inside them", "They are out of season and illegal to catch"],
    correctAnswer: "They can carry a natural toxin that causes severe itching and sickness",
    explanation: "This is locally called 'la gratte' (Ciguatera). Microscopic algae on hot summer reefs produce a natural poison. When big fish eat smaller fish, the poison builds up and can make humans very sick if eaten.",
  },
  {
    id: 28,
    category: "Virus Transmission",
    question: "If a person gets Dengue fever, for about how many days can their blood pass the virus back to a biting mosquito?",
    options: ["Only 1 hour", "About 3 to 7 days", "At least 30 days", "For the rest of their life"],
    correctAnswer: "About 3 to 7 days",
    explanation: "When you are sick with Dengue, the virus is highly active in your blood for the first week. If a mosquito bites you during this time, it catches the virus and spreads it to others.",
  },
  {
    id: 29,
    category: "Eye Infections",
    question: "During a local outbreak of 'Disco eyes' (pink eye) in Mauritius, what is the most important rule to prevent spreading it?",
    options: ["Avoid reading books or watching TV", "Wash your hands often and do not touch your eyes", "Wear dark sunglasses indoors", "Eat raw carrots every morning"],
    correctAnswer: "Wash your hands often and do not touch your eyes",
    explanation: "'Disco eyes' is highly contagious. It spreads when you touch your infected eye, touch a surface (like a doorknob or towel), and then someone else touches that surface and rubs their eyes.",
  },
  {
    id: 30,
    category: "Heart Health",
    question: "Even if you feel completely healthy, how often should an adult get their blood pressure checked?",
    options: ["Only if they feel a bad headache", "At least once every year", "Once every 10 years", "Only after they turn 65"],
    correctAnswer: "At least once every year",
    explanation: "High blood pressure often has zero warning signs. Checking it once a year is the only way to catch it early before it can damage your heart.",
  },
  {
    id: 31,
    category: "Germ Infections",
    question: "How does the Leptospirosis bacteria actually manage to get inside a person's body?",
    options: ["Only through mosquito bites", "Through tiny cuts in the skin or through the eyes and mouth", "By breathing in the same air as a rat", "By touching dry plastic packages"],
    correctAnswer: "Through tiny cuts in the skin or through the eyes and mouth",
    explanation: "The bacteria live in water contaminated by rat urine. If you walk barefoot in muddy floodwater, the germ enters through small scratches on your skin, or if water splashes into your eyes or mouth.",
  },
  
  {
    id: 32,
    category: "Chikungunya History",
    question: "The word 'Chikungunya' comes from an African language. What does this name actually mean?",
    options: ["To bend up in pain", "The red insect bite", "High summer fever", "Slow morning walk"],
    correctAnswer: "To bend up in pain",
    explanation: "The disease gets its name because the joint pain is so painful that patients walk bent over. It describes how the virus physically affects the human body.",
  },
  {
    id: 33,
    category: "Stray Animals",
    question: "If you get a deep scratch from a stray animal in Mauritius, why will doctors at the hospital give you a Tetanus injection?",
    options: ["To stop you from catching rabies", "To protect you from a dangerous lockjaw muscle infection", "To make the scratch heal without leaving a scar", "To help you sleep better"],
    correctAnswer: "To protect you from a dangerous lockjaw muscle infection",
    explanation: "Tetanus bacteria live in soil and dirt. When an animal scratch or bite pushes dirt deep under your skin, it can cause 'lockjaw' (severe muscle spasms). A tetanus shot blocks this.",
  },
  {
    id: 34,
    category: "Flu & Virus",
    question: "Why can you NOT cure a common cold or the seasonal flu by taking antibiotic pills?",
    options: ["Antibiotics only kill bacteria, but colds and flu are caused by viruses", "Antibiotics are too weak for adult sickness", "Flu germs live only in the stomach", "Antibiotics only work if you have a fever over 40 degrees"],
    correctAnswer: "Antibiotics only kill bacteria, but colds and flu are caused by viruses",
    explanation: "This is a very common mistake. Colds and flu are viral infections. Antibiotics are designed exclusively to fight bacteria, so they will not help you get over a cold or flu.",
  },
  {
    id: 35,
    category: "Food Safety",
    question: "What is the main health danger of using dirty or cracked eggs from backyard chickens?",
    options: ["They contain too much salt", "They can carry Salmonella bacteria which cause severe diarrhea", "They have no protein inside them", "They make your bones weak"],
    correctAnswer: "They can carry Salmonella bacteria which cause severe diarrhea",
    explanation: "Cracks in eggshells let harmful bacteria like Salmonella enter the egg. Always use clean, uncracked eggs and cook them thoroughly to stay safe from severe food poisoning.",
  },
  {
    id: 36,
    category: "Silent Illness",
    question: "Why do doctors refer to high blood pressure as the 'Silent Killer'?",
    options: ["It only affects people while they are asleep", "It usually shows no symptoms until it causes a heart attack or stroke", "It stops you from being able to speak", "It spreads silently through the air like a cold"],
    correctAnswer: "It usually shows no symptoms until it causes a heart attack or stroke",
    explanation: "Most people with high blood pressure feel completely fine. However, behind the scenes, the high pressure slowly damages blood vessels, which is why regular checks are so important.",
  },
  {
    id: 37,
    category: "Mosquito Control",
    question: "In some villages, why do health workers pour safe oils on top of large puddles of water?",
    options: ["To make the water look clean", "To block baby mosquitoes from breathing at the water surface", "To kill weeds growing in the water", "To stop the wind from blowing the water"],
    correctAnswer: "To block baby mosquitoes from breathing at the water surface",
    explanation: "Baby mosquitoes (larvae) live underwater but must breathe air at the surface through a tiny tube. A thin layer of oil blocks their air supply, stopping them from turning into biting adults.",
  },
  {
    id: 38,
    category: "Healthy Eating",
    question: "What does eating high-fiber food (like dhal, red beans, oats, and vegetables) do for your blood vessels?",
    options: ["It helps wash away excess bad cholesterol", "It makes your blood flow twice as fast", "It thins your skin to help you stay cool", "It makes your body absorb more sugar"],
    correctAnswer: "It helps wash away excess bad cholesterol",
    explanation: "Soluble fiber acts like a sponge in your digestive system. It binds to cholesterol and carries it out of your body, helping keep your arteries clean and healthy.",
  },
  
  {
    id: 39,
    category: "Air Quality",
    question: "What long-term lung condition can be severely triggered by dust and smoke, such as during sugarcane harvest burning?",
    options: ["Diabetes", "Asthma", "High Blood Pressure", "Hepatitis"],
    correctAnswer: "Asthma",
    explanation: "Smoke and fine ash are strong irritants. For someone with asthma, breathing in these particles can cause their airways to swell shut, making it hard to breathe.",
  },
  {
    id: 40,
    category: "Diabetes Care",
    question: "Why is a minor cut or scratch on the foot highly dangerous for someone living with diabetes?",
    options: ["The cut will automatically spread to the hands", "High blood sugar and poor blood flow make infections grow fast and heal slowly", "It causes immediate hair loss", "It stops their body from absorbing water"],
    correctAnswer: "High blood sugar and poor blood flow make infections grow fast and heal slowly",
    explanation: "Diabetes can damage nerves and reduce blood flow in your feet. This means you might not feel a cut, and your body lacks the strong blood supply needed to heal it, raising the risk of severe wounds.",
  },
  {
    id: 41,
    category: "Skin Germs",
    question: "How do people catch Fungal Infections (like 'champignon' skin rashes) which are common in hot, humid places?",
    options: ["By eating too many ripe bananas", "By walking barefoot in damp public spaces like changing rooms", "By sitting under a fan for too long", "By wearing clean cotton clothes"],
    correctAnswer: "By walking barefoot in damp public spaces like changing rooms",
    explanation: "Fungus thrives in warm, wet environments. Walking barefoot in communal showers, pool decks, or gym locker rooms is the easiest way for the germ to attach to your feet.",
  },
  {
    id: 42,
    category: "Adult Vaccines",
    question: "Which painful skin rash with fluid-filled blisters can appear in older adults who had chickenpox when they were young?",
    options: ["Shingles (Zona)", "Measles", "Dengue rash", "Leprosy"],
    correctAnswer: "Shingles (Zona)",
    explanation: "After you recover from chickenpox, the virus does not leave your body; it stays asleep in your nerve cells. Decades later, if your immune system weakens, it can wake up as a painful rash called Shingles.",
  },
  {
    id: 43,
    category: "Dental Health",
    question: "What is the primary cause of tooth decay and gum infections in adults?",
    options: ["Drinking too much plain water", "Leaving food particles and sugary plaque on teeth by not brushing before sleep", "Chewing on raw mint leaves", "Brushing teeth with warm water"],
    correctAnswer: "Leaving food particles and sugary plaque on teeth by not brushing before sleep",
    explanation: "While you sleep, your mouth produces less saliva (which naturally fights germs). If you don't brush before bed, bacteria feed on leftover sugars, producing acid that rots your teeth and infects your gums.",
  },
  {
    id: 44,
    category: "Pregnancy Health",
    question: "If a pregnant woman catches Dengue fever, can the virus affect her unborn baby?",
    options: ["No, unborn babies are completely immune to all viruses", "Yes, it can pass to the baby during pregnancy or birth", "Only if the mother drinks cold water", "Only if she lives near the sea"],
    correctAnswer: "Yes, it can pass to the baby during pregnancy or birth",
    explanation: "Dengue can be passed from a pregnant mother to her baby. It can lead to early birth or low birth weight, which is why pregnant women must be extra careful to avoid mosquito bites.",
  },
  {
    id: 45,
    category: "Body Organs",
    question: "Which vital organ is responsible for filtering out and clearing alcohol and medicines from your blood?",
    options: ["The lungs", "The liver", "The stomach", "The thyroid gland"],
    correctAnswer: "The liver",
    explanation: "Your liver is your body's main chemical filter. It breaks down food, medicines, and toxins (like alcohol). Drinking too much over many years can scar the liver and stop it from working.",
  },
  
  {
    id: 46,
    category: "Lung Health",
    question: "How long can the bacteria that cause Tuberculosis (TB) stay asleep inside a healthy person's body before showing signs of sickness?",
    options: ["Only 24 hours", "For many years or even a lifetime", "Exactly 2 weeks", "Never more than 30 days"],
    correctAnswer: "For many years or even a lifetime",
    explanation: "This is called 'latent TB'. A strong immune system can lock up the bacteria so you don't feel sick or spread it. But if your body gets weak or old, the germ can wake up and make you sick years later.",
  }
];

// --- 2. Main Page Component ---
export default function Home() {
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const currentQuestion = activeQuestions[currentQuestionIdx];
  const totalQuestions = activeQuestions.length;

  const handleStartQuiz = () => {
    const selected = [...localHealthQuestionsPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
    
    setActiveQuestions(selected);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizComplete(false);
    setQuizStarted(true);
  };

  const handleOptionSelect = (option: string) => {
    if (!isSubmitted) setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || !currentQuestion) return;
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setIsSubmitted(true);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    if (currentQuestionIdx + 1 < totalQuestions) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 text-slate-800">
      {/* Page Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center text-slate-900 tracking-tight">
        Health Quiz
      </h1>

      {/* Main Quiz Box */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-200">
        
        {/* State 1: Welcome Screen */}
        {!quizStarted ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🧘🏻‍♀️</div>
            <h2 className="text-2xl font-bold text-emerald-600 mb-4">
              Boost Your Knowledge!
            </h2>
            <p className="text-slate-600 max-w-lg mx-auto mb-8 text-base md:text-lg leading-relaxed">
              Take this simple assessment to learn how to protect you and your family from health issues. 
              
            </p>
            <button
              onClick={handleStartQuiz}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl transition-all shadow-md shadow-emerald-600/10"
            >
              Start
            </button>
          </div>
        ) : !quizComplete && currentQuestion ? (
          /* State 2: Active Quiz Screen */
          <div>
            {/* Status Section */}
            <div className="flex justify-between items-center border-b pb-4 mb-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md w-fit">
                  {currentQuestion.category}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  Question {currentQuestionIdx + 1} of {totalQuestions}
                </span>
              </div>
              <div className="bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-700">
                Score: {score}
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-slate-900 leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Sideway Answer Options (2x2 Grid Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {currentQuestion.options.map((option, index) => {
                const letterPrefix = ["A", "B", "C", "D"][index];
                
                // Styling colors for options based on user action
                let choiceStyle = "border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                if (selectedAnswer === option) {
                  choiceStyle = "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20";
                }
                if (isSubmitted) {
                  if (option === currentQuestion.correctAnswer) {
                    choiceStyle = "border-green-500 bg-green-50 font-bold text-green-900 ring-2 ring-green-500/30";
                  } else if (selectedAnswer === option) {
                    choiceStyle = "border-red-400 bg-red-50 text-red-900 line-through opacity-80";
                  } else {
                    choiceStyle = "border-slate-100 text-slate-400 opacity-60";
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isSubmitted}
                    className={`w-full text-left px-5 py-4 border-2 rounded-xl transition-all flex items-center gap-4 ${choiceStyle}`}
                  >
                    <span className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold text-sm shrink-0 ${
                      isSubmitted && option === currentQuestion.correctAnswer
                        ? "bg-green-600 text-white"
                        : isSubmitted && selectedAnswer === option
                        ? "bg-red-500 text-white"
                        : selectedAnswer === option
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}>
                      {letterPrefix}
                    </span>
                    <span className="flex-1 font-semibold text-base leading-tight">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Enlarged & Simplified Health Fact Box */}
            {isSubmitted && (
              <div className="p-6 bg-blue-50 border-l-4 border-blue-500 rounded-xl mb-6 shadow-sm">
                <div className="text-blue-900 text-base md:text-lg font-medium leading-relaxed">
                  <span className="font-extrabold text-blue-900 block mb-1 text-lg md:text-xl">
                    💡 Helpful Health Fact:
                  </span>
                  {currentQuestion.explanation}
                </div>
              </div>
            )}

            {/* Bottom Actions Button */}
            <div className="flex justify-end border-t pt-4">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className={`px-8 py-3 rounded-xl text-white font-bold tracking-wide transition-all ${
                    selectedAnswer ? "bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/10" : "bg-slate-300 cursor-not-allowed"
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-xl text-white font-bold tracking-wide bg-slate-800 hover:bg-slate-900 transition-all"
                >
                  {currentQuestionIdx + 1 === totalQuestions ? "See Results" : "Next Question"}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* State 3: End Screen */
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2 text-slate-900">Great Job!</h3>
            <p className="text-lg text-slate-600 mb-6">
              You scored <span className="font-black text-emerald-600">{score}</span> out of {totalQuestions}.
            </p>
            
            <div className="bg-slate-50 border rounded-xl p-4 max-w-sm mx-auto mb-8 text-sm text-slate-600 leading-relaxed">
              {score >= 8 
                ? "Excellent! You know exactly how to stay safe and healthy at home." 
                : "Good job! Reading these facts is a great way to learn how to protect yourself and your family."}
            </div>

            <button
              onClick={handleStartQuiz}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10"
            >
              Play Again (New Questions)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}