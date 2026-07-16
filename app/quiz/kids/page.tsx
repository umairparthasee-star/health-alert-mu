"use client";

import React, { useState } from "react";

// --- Types ---
interface KidsHealthQuestion {
  id: number;
  badge: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  imageUrl: string;
}

// --- Kids Health Whiz Style Pool (25 highly visual, simple questions) ---
const kidsHealthPool: KidsHealthQuestion[] = [
  {
    id: 1,
    badge: "🦟",
    topic: "MOSQUITO ATTACK!",
    question: "Where do mosquitoes lay their tiny eggs around your house?",
    options: [
      "In clear puddles of water (like in an old toy or bucket)",
      "In dry sand at the beach",
      "Inside your dark school bag",
      "On top of green dry grass"
    ],
    correctAnswer: "In clear puddles of water (like in an old toy or bucket)",
    explanation: "Mosquitoes need still water to lay eggs! Turn over old buckets and coconut shells so baby bugs cannot grow.",
    imageUrl: "https://img.magnific.com/premium-vector/cartoon-dengue-mosquito-dengue-virus-thin-soft-blue-background_17893-65.jpg"
  },
  {
    id: 2,
    badge: "☀️",
    topic: "SUN POWER!",
    question: "What awesome thing does your body make when you play in the morning sun?",
    options: [
      "Sweet candy points",
      "Vitamin D to make your bones super strong",
      "A cold runny nose",
      "Big purple spots"
    ],
    correctAnswer: "Vitamin D to make your bones super strong",
    explanation: "The morning sun helps your skin make Vitamin D. This is a natural power-up that keeps your bones and teeth strong!",
    imageUrl: "https://media.istockphoto.com/id/871046604/vector/happy-kids-jumping-together-during-a-sunny-day.jpg?s=612x612&w=0&k=20&c=TV-YjTRm1WHKyffhQpgOEgEGiphr5ce5SjUjhAYLrrE="
  },
  {
    id: 3,
    badge: "🧼",
    topic: "GERM BUSTERS!",
    question: "What is the best way to get rid of bad tummy bugs before you eat?",
    options: [
      "Wiping your hands on your t-shirt",
      "Washing your hands with clean water and soap",
      "Blowing on your fingers three times",
      "Waving your hands in the air"
    ],
    correctAnswer: "Washing your hands with clean water and soap",
    explanation: "Soap washes away invisible bugs from your fingers. Wash them for 20 seconds before you grab your food!",
    imageUrl: "https://png.pngtree.com/png-clipart/20241112/original/pngtree-happy-boy-washing-hands-with-soap-and-water-clipart-illustration-png-image_16954611.png"
  },
  {
    id: 4,
    badge: "🌧️",
    topic: "MUDDY DANGER!",
    question: "Why should you never walk barefoot in mud after a big cyclone?",
    options: [
      "Your toes will get cold",
      "Bad germs from rat pee hide in the mud and can make you sick",
      "The mud will turn your skin green",
      "Your shoes will get mad"
    ],
    correctAnswer: "Bad germs from rat pee hide in the mud and can make you sick",
    explanation: "Heavy rain washes dirty animal traces into mud. Always wear closed shoes or boots after a storm to stay safe!",
    imageUrl: "https://media.istockphoto.com/id/853494270/vector/girl-playing-in-puddle.jpg?s=612x612&w=0&k=20&c=KvXU8ZJnPKv6kbHZ0sYuVPo9dpC70XTDNxggTPellOM="
  },
  {
    id: 5,
    badge: "👁️",
    topic: "DISCO EYE SHIELD!",
    question: "If someone has red, itchy eyes (Conjunctivitis) at school, how do you stay safe?",
    options: [
      "Wash your hands with soap and never rub your eyes",
      "Close both eyes when talking to them",
      "Wear your jacket backwards",
      "Run away to another town"
    ],
    correctAnswer: "Wash your hands with soap and never rub your eyes",
    explanation: "Conjunctivitis also known as 'Disco Eyes' is an eye germ that hitches a ride on fingers. Keep your hands clean and away from your face!",
    imageUrl: "https://chblob.icloudhospital.com/thumbnailcontainer/1-Conjunctivitis-1cb05280-1185-46a5-81a8-cd26a2671479.jpg"
  },
  {
    id: 6,
    badge: "🌴",
    topic: "MALARIA SECRETS!",
    question: "Can you easily catch Malaria from a local mosquito bite in Mauritius today?",
    options: [
      "Yes, it is in every single garden",
      "No, Mauritius is certified free of local Malaria!",
      "Only if you eat tropical sugarcane",
      "Only on school holidays"
    ],
    correctAnswer: "No, Mauritius is certified free of local Malaria!",
    explanation: "Great news! Mauritius was declared Malaria-free by global doctors. While we still watch out for travel cases, it doesn't spread locally here!",
    imageUrl: "https://media.istockphoto.com/id/2206475728/vector/group-of-happy-child-jumping-on-meadow.jpg?s=612x612&w=0&k=20&c=2j8Jeu0nCJyLHlYtSBcYourVFhegKKsIm6dkd41FOws="
  },
  {
    id: 7,
    badge: "🍉",
    topic: "FRUIT SAFETY!",
    question: "What is a super important step before eating sweet local mangoes or guavas?",
    options: [
      "Washing them under clean running tap water",
      "Keeping them in a dry drawer",
      "Blowing on them twice",
      "Peeling them without checking"
    ],
    correctAnswer: "Washing them under clean running tap water",
    explanation: "Garden snails and bugs crawl on fresh fruits and leave sticky slime behind. Always wash fruits under tap water to wash slime germs away!",
    imageUrl: "https://png.pngtree.com/png-clipart/20241112/original/pngtree-happy-boy-washing-hands-with-soap-and-water-clipart-illustration-png-image_16954611.png"
  },
  {
    id: 8,
    badge: "🧣",
    topic: "WINTER SNEEZES!",
    question: "During which months does the runny-nose flu spread fastest in Mauritius?",
    options: [
      "In hot December summer days",
      "In the cool, windy winter months (May to September)",
      "Only on the first day of spring",
      "It is exactly the same every single day"
    ],
    correctAnswer: "In the cool, windy winter months (May to September)",
    explanation: "Flu germs love the cool, breezy winter months because people stay close together indoors, making it super easy for sneezes to travel!",
    imageUrl: "https://media.istockphoto.com/id/2206475728/vector/group-of-happy-child-jumping-on-meadow.jpg?s=612x612&w=0&k=20&c=2j8Jeu0nCJyLHlYtSBcYourVFhegKKsIm6dkd41FOws="
  },
  {
    id: 9,
    badge: "🐚",
    topic: "BEACH DAYS!",
    question: "Why is swimming in the river or sea unsafe right after a heavy tropical storm?",
    options: [
      "All the fish are hiding on the ocean floor",
      "Storm rains wash dirty mud and road germs down into the water",
      "The sea water loses all its saltiness",
      "The water turns freezing cold like ice"
    ],
    correctAnswer: "Storm rains wash dirty mud and road germs down into the water",
    explanation: "Heavy rains sweep dirty soil and chemicals into our waterways. Swimming right after a storm can give you bad skin rashes or tummy aches!",
    imageUrl: "https://media.istockphoto.com/id/853494270/vector/girl-playing-in-puddle.jpg?s=612x612&w=0&k=20&c=KvXU8ZJnPKv6kbHZ0sYuVPo9dpC70XTDNxggTPellOM="
  },
  {
    id: 10,
    badge: "🦷",
    topic: "CAVITY BUSTERS!",
    question: "Why must you brush your teeth right before going to bed?",
    options: [
      "To make your pillow stay cold and fresh",
      "To wash away sweet food so cavity bugs do not damage your teeth at night",
      "To make your tooth foam smell like fruit",
      "To help you dream about space"
    ],
    correctAnswer: "To wash away sweet food so cavity bugs do not damage your teeth at night",
    explanation: "While you sleep, sugar on your teeth acts as food for bad mouth bugs. Brushing right before bed washes away their midnight buffet!",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/068/968/348/non_2x/young-boy-in-blue-pajamas-brushing-his-teeth-in-front-of-a-mirror-cartoon-illustration-of-a-daily-dental-hygiene-routine-vector.jpg"
  },
  {
    id: 11,
    badge: "🧴",
    topic: "SUN PROTECTION!",
    question: "What is the healthiest habit when playing outside on a hot Mauritian afternoon?",
    options: [
      "Putting on sunscreen cream and staying in the shade",
      "Drinking warm tea and running very fast",
      "Wiping your face with a dry t-shirt",
      "Playing without a hat to stay cool"
    ],
    correctAnswer: "Putting on sunscreen cream and staying in the shade",
    explanation: "Our tropical sun is highly active. Applying SPF sunscreen and finding tree shade during peak hours prevents painful sunburns!",
    imageUrl: "https://media.istockphoto.com/id/871046604/vector/happy-kids-jumping-together-during-a-sunny-day.jpg?s=612x612&w=0&k=20&c=TV-YjTRm1WHKyffhQpgOEgEGiphr5ce5SjUjhAYLrrE="
  },
  {
    id: 12,
    badge: "🗑️",
    topic: "DENGUE DEFENSE!",
    question: "How can you help your family keep Dengue mosquitoes away from your garden?",
    options: [
      "By keeping old empty tyres filled with rainwater",
      "By throwing plastic cups in the grass",
      "By emptying out all standing water from buckets and plant pots",
      "By closing all house doors and never going outside"
    ],
    correctAnswer: "By emptying out all standing water from buckets and plant pots",
    explanation: "Dengue mosquitoes love laying their eggs in small pockets of clean water. Clearing away standing water shuts down their nurseries!",
    imageUrl: "https://img.magnific.com/premium-vector/cartoon-dengue-mosquito-dengue-virus-thin-soft-blue-background_17893-65.jpg"
  },
  {
    id: 13,
    badge: "🐕",
    topic: "STRAY ANIMALS!",
    question: "What should you do if a stray neighborhood dog or cat scratches you?",
    options: [
      "Scratch them back to be even",
      "Keep it a secret so you do not get in trouble",
      "Tell an adult immediately so they can wash it and check with a doctor",
      "Cover it with dry garden dirt"
    ],
    correctAnswer: "Tell an adult immediately so they can wash it and check with a doctor",
    explanation: "Animal claws carry bad soil germs. Tell an adult right away so they can clean the scratch with soap to prevent serious infections!",
    imageUrl: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcQVlqC5rhD9wWmaOFcAvWYGoqAvBfJSt5nRjT4KuVBB8wQ7GRiYN52FTMq3YVh9iCJUayOb2PKjGaXiL9g"
  },
  {
    id: 14,
    badge: "🚨",
    topic: "HELP HELPLINE!",
    question: "What is the free emergency number to call for a public hospital ambulance in Mauritius?",
    options: [
      "114",
      "999",
      "115",
      "112"
    ],
    correctAnswer: "114",
    explanation: "Dialing 114 rings the hospital emergency ambulance team (SAMU) who will rush medical helpers to your house!",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/047/830/112/non_2x/3d-illustration-of-a-cute-cartoon-boy-doctor-in-a-white-coat-smiling-and-holding-a-stethoscope-ideal-for-healthcare-and-educational-content-png.png"
  },
  {
    id: 15,
    badge: "🤢",
    topic: "TUMMY BUGS!",
    question: "How can we make sure tap water has zero germs to drink after a cyclone?",
    options: [
      "Straining it through a t-shirt",
      "Boiling the tap water thoroughly before drinking it",
      "Adding a spoonful of sugar to the cup",
      "Leaving it in an open glass on the table"
    ],
    correctAnswer: "Boiling the tap water thoroughly before drinking it",
    explanation: "Cyclones can shake up pipelines and let soil bacteria inside. Boiling water for one full minute destroys all stomach bugs!",
    imageUrl: "https://png.pngtree.com/png-clipart/20241112/original/pngtree-happy-boy-washing-hands-with-soap-and-water-clipart-illustration-png-image_16954611.png"
  },
  {
    id: 16,
    badge: "🏥",
    topic: "MOSQUITO TIMING!",
    question: "At what times of the day are Dengue mosquitoes busiest and most likely to bite?",
    options: [
      "Only in the pitch black middle of the night",
      "During the daylight hours (especially mornings and afternoons)",
      "Only when the wind blows from the south",
      "Only during lunch hour"
    ],
    correctAnswer: "During the daylight hours (especially mornings and afternoons)",
    explanation: "Unlike common night mosquitoes, Dengue mosquitoes are daytime hunters! They love biting in the hours after sunrise and before sunset.",
    imageUrl: "https://img.magnific.com/premium-vector/cartoon-dengue-mosquito-dengue-virus-thin-soft-blue-background_17893-65.jpg"
  },
  {
    id: 17,
    badge: "🍭",
    topic: "SWEET LIMITS!",
    question: "What is the danger of eating lots of sweet candies and fizzy drinks every single day?",
    options: [
      "Your teeth will get holes and your body gets tired of handling sugar",
      "Your hair will turn bright pink",
      "Your ears will grow double in size",
      "It turns you into an actual superhero"
    ],
    correctAnswer: "Your teeth will get holes and your body gets tired of handling sugar",
    explanation: "Too much sugar rots teeth and causes heavy spikes in blood sugar. Choosing fresh fruits instead keeps your body happy!",
    imageUrl: "https://media.istockphoto.com/id/871046604/vector/happy-kids-jumping-together-during-a-sunny-day.jpg?s=612x612&w=0&k=20&c=TV-YjTRm1WHKyffhQpgOEgEGiphr5ce5SjUjhAYLrrE="
  },
  {
    id: 18,
    badge: "🦠",
    topic: "GERM SHIELD!",
    question: "How should you cover your mouth when you cough or sneeze to protect your school friends?",
    options: [
      "Sneeze right onto your bare palms",
      "Cough into your bent inner elbow or a clean tissue paper",
      "Close your eyes and turn around",
      "Sneeze toward the school ceiling"
    ],
    correctAnswer: "Cough into your bent inner elbow or a clean tissue paper",
    explanation: "Sneezing on hands transfers sticky germs onto everything you touch. Sneezing into your inner elbow stops the spread!",
    imageUrl: "https://png.pngtree.com/png-clipart/20241112/original/pngtree-happy-boy-washing-hands-with-soap-and-water-clipart-illustration-png-image_16954611.png"
  },
  {
    id: 19,
    badge: "🕷️",
    topic: "ITCHY SCABIES!",
    question: "How does an extra itchy skin rash called Scabies crawl between family members?",
    options: [
      "Through close, direct skin-to-skin touch for a long time",
      "By sharing the same pencil case at school",
      "By reading the same library book",
      "By looking at the same picture"
    ],
    correctAnswer: "Through close, direct skin-to-skin touch for a long time",
    explanation: "Scabies is caused by tiny skin-burrowing mites. They cannot jump, so they only travel through direct, sustained skin contact.",
    imageUrl: "https://media.istockphoto.com/id/871046604/vector/happy-kids-jumping-together-during-a-sunny-day.jpg?s=612x612&w=0&k=20&c=TV-YjTRm1WHKyffhQpgOEgEGiphr5ce5SjUjhAYLrrE="
  },
  {
    id: 20,
    badge: "🎈",
    topic: "CHICKENPOX!",
    question: "What causes a child to get itchy, fluid-filled red spots during Chickenpox?",
    options: [
      "A tiny virus germ that spreads easily through air and touch",
      "Eating too many red strawberries",
      "Playing too close to big red balloons",
      "Sleeping in too late on school mornings"
    ],
    correctAnswer: "A tiny virus germ that spreads easily through air and touch",
    explanation: "Chickenpox is caused by a highly contagious virus. Resting at home prevents your school friends from catching the itchy spots!",
    imageUrl: "https://media.istockphoto.com/id/871046604/vector/happy-kids-jumping-together-during-a-sunny-day.jpg?s=612x612&w=0&k=20&c=TV-YjTRm1WHKyffhQpgOEgEGiphr5ce5SjUjhAYLrrE="
  },
 
  {
    id: 21,
    badge: "👓",
    topic: "DISCO EYE WASH!",
    question: "What should you NEVER do if your eyes feel scratchy and look red like 'Disco Eyes'?",
    options: [
      "Rub your eyes with dirty hands and share towels with your family",
      "Tell a parent or teacher right away",
      "Wash your hands often with soap and water",
      "Wear dark sunglasses to shield your eyes from bright lights"
    ],
    correctAnswer: "Rub your eyes with dirty hands and share towels with your family",
    explanation: "Rubbing spreads the Disco Eyes germs on your hands. Sharing towels will pass the virus directly to your family members!",
    imageUrl: "https://static.vecteezy.com/system/resources/previews/028/273/941/non_2x/happy-boy-is-washing-his-hands-to-prevent-disease-at-the-hand-washing-sink-flat-cartoon-illustration-vector.jpg"
  },
  {
    id: 22,
    badge: "🍃",
    topic: "MOZZIE REPELLENT!",
    question: "What is a smart habit to protect your legs from bites when playing outside near sunset?",
    options: [
      "Applying skin-safe mosquito cream or spray",
      "Wearing your shorts backwards",
      "Standing completely still without moving at all",
      "Rubbing fruit jam on your skin"
    ],
    correctAnswer: "Applying skin-safe mosquito cream or spray",
    explanation: "Mosquito spray or cream creates an invisible shield that confuses the day mosquitoes and stops them from biting!",
    imageUrl: "https://img.magnific.com/premium-vector/cartoon-dengue-mosquito-dengue-virus-thin-soft-blue-background_17893-65.jpg"
  },
  {
    id: 23,
    badge: "🧃",
    topic: "VITAMIN POWERS!",
    question: "Which healthy snack gives your immune system a super boost to fight off winter colds?",
    options: [
      "Fried local potato chips",
      "Fresh local fruits like oranges and guavas packed with Vitamin C",
      "Salty snacks from the boutique",
      "Sweet candy bars"
    ],
    correctAnswer: "Fresh local fruits like oranges and guavas packed with Vitamin C",
    explanation: "Local fruits like oranges, guavas, and papayas have Vitamin C. This nutrient boosts your white blood cell shields to block colds!",
    imageUrl: "https://media.istockphoto.com/id/871046604/vector/happy-kids-jumping-together-during-a-sunny-day.jpg?s=612x612&w=0&k=20&c=TV-YjTRm1WHKyffhQpgOEgEGiphr5ce5SjUjhAYLrrE="
  },
  {
    id: 24,
    badge: "🧼",
    topic: "SUPER SCRUBBING!",
    question: "How long should you scrub your hands with soap to wash away dirty germs?",
    options: [
      "For 2 seconds (just a quick splash of water)",
      "For 20 seconds (about as long as singing 'Happy Birthday' twice)",
      "For a full hour",
      "Only until your hands smell like fruit"
    ],
    correctAnswer: "For 20 seconds (about as long as singing 'Happy Birthday' twice)",
    explanation: "Germs cling strongly to skin folds. Scrubbing thoroughly for 20 seconds breaks down and floats the germs down the drain!",
    imageUrl: "https://png.pngtree.com/png-clipart/20241112/original/pngtree-happy-boy-washing-hands-with-soap-and-water-clipart-illustration-png-image_16954611.png"
  }
];

export default function Home() {
  const [activeQuestions, setActiveQuestions] = useState<KidsHealthQuestion[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [clickedAnswer, setClickedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const currentQuestion = activeQuestions[currentIdx];
  const totalQuestions = activeQuestions.length;

  const startNewGame = () => {
    // Shuffles the full pool and pulls exactly 5 random cards
    const shuffled = [...kidsHealthPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    setActiveQuestions(shuffled);
    setCurrentIdx(0);
    setClickedAnswer(null);
    setScore(0);
    setGameComplete(false);
    setGameStarted(true);
  };

  const handleChoiceClick = (option: string) => {
    if (clickedAnswer) return; // Prevent double-clicking
    setClickedAnswer(option);
    if (option === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextCard = () => {
    setClickedAnswer(null);
    if (currentIdx + 1 < totalQuestions) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setGameComplete(true);
    }
  };

  return (
    <main className="min-h-screen bg-white flex flex-col items-center py-8 px-4 font-sans text-stone-900">
      
      {/* Kids Health Signature Header Block */}
      <div className="bg-black text-white px-8 py-3 transform -rotate-1 shadow-md mb-8 text-center border-4 border-white max-w-md w-full">
        <h1 className="text-3xl font-black tracking-tighter uppercase italic">
          KIDS HEALTH
        </h1>
        <p className="text-[#fffb00] font-black tracking-widest uppercase text-xs">
          ★ HERO QUIZ GAME ★
        </p>
      </div>

      {/* Main Arcade Frame */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black p-5 relative overflow-hidden">
        
        {/* Progress Tracker dots */}
        {gameStarted && !gameComplete && (
          <div className="flex justify-between items-center bg-stone-100 p-2 border-2 border-black rounded-xl mb-4">
            <span className="text-xs font-black uppercase text-stone-500">
              CARD {currentIdx + 1}/{totalQuestions}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalQuestions }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 border-2 border-black rounded-full transition-all ${
                    i === currentIdx ? "bg-black scale-110" : i < currentIdx ? "bg-green-400" : "bg-white"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* SCREEN A: Start Game Banner */}
        {!gameStarted ? (
          <div className="text-center py-6">
            <div className="text-7xl mb-4 transform hover:scale-110 transition-transform cursor-pointer animate-bounce">🦁</div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-stone-950 mb-3">
              BE A HEALTH HERO!
            </h2>
            <p className="text-stone-600 font-bold mb-6 text-sm leading-relaxed">
              Answer awesome questions about health! Beat the game to earn your medal.
            </p>
            <button
              onClick={startNewGame}
              className="w-full bg-emerald-400 hover:bg-emerald-50 text-black font-black text-xl py-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all uppercase"
            >
              START GAME 🎮
            </button>
          </div>
        ) : !gameComplete && currentQuestion ? (
          /* SCREEN B: Dynamic Active Question Card */
          <div>
            {/* Topic Category Badge */}
            <div className="bg-fuchsia-500 text-white font-black text-xs uppercase px-3 py-1 rounded-md border-2 border-black w-fit mb-3 tracking-wider">
              {currentQuestion.badge} {currentQuestion.topic}
            </div>

            {/* Visual Cartoon Card Image */}
            <div className="w-full border-4 border-black h-40 rounded-xl overflow-hidden bg-sky-100 mb-4 shadow-inner relative flex justify-center items-center">
              <img 
                src={currentQuestion.imageUrl} 
                alt="Topic View" 
                className="object-cover h-full w-full"
              />
            </div>

            {/* Question Text */}
            <h2 className="text-lg md:text-xl font-black mb-4 leading-tight text-stone-900">
              {currentQuestion.question}
            </h2>

            {/* Choice Option Layout Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {currentQuestion.options.map((option, idx) => {
                const colors = ["bg-sky-300", "bg-amber-300", "bg-lime-300", "bg-coral-300"];
                const isCorrect = option === currentQuestion.correctAnswer;
                const isChosen = clickedAnswer === option;

                let optionStyle = `${colors[idx]} hover:brightness-95 text-black border-2 border-black`;
                if (clickedAnswer) {
                  if (isCorrect) {
                    optionStyle = "bg-green-400 text-black border-4 border-black font-black scale-[1.01]";
                  } else if (isChosen) {
                    optionStyle = "bg-red-400 text-black border-4 border-black border-dashed opacity-80";
                  } else {
                    optionStyle = "bg-stone-100 text-stone-400 border-2 border-stone-200 opacity-40 cursor-not-allowed";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleChoiceClick(option)}
                    disabled={!!clickedAnswer}
                    className={`w-full text-left p-3 rounded-xl font-bold text-sm transition-all duration-150 flex items-center gap-2 ${optionStyle} ${!clickedAnswer ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none" : ""}`}
                  >
                    {clickedAnswer && isCorrect && <span className="text-lg">✅</span>}
                    {clickedAnswer && isChosen && !isCorrect && <span className="text-lg">❌</span>}
                    <span className="leading-tight">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback Reveal Box */}
            {clickedAnswer && (
              <div className="p-4 bg-amber-50 border-4 border-black rounded-xl mb-4 animate-fadeIn">
                <p className="font-black text-sm text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                  {clickedAnswer === currentQuestion.correctAnswer ? "🎉 YOU GOT IT RIGHT!" : "👀 OOPS! HERE IS THE FACT:"}
                </p>
                <p className="text-xs md:text-sm font-semibold text-stone-700 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next Card Navigation Controller */}
            {clickedAnswer && (
              <button
                onClick={handleNextCard}
                className="w-full bg-black text-[#fffb00] font-black py-3 rounded-xl text-center border-2 border-black hover:bg-stone-900 transition-all text-sm uppercase tracking-wider"
              >
                {currentIdx + 1 === totalQuestions ? "See Score Panel 🏁" : "Next Question ➔"}
              </button>
            )}
          </div>
        ) : (
          /* SCREEN C: Game Finished Score Panel */
          <div className="text-center py-6">
            <div className="text-7xl mb-4">👑</div>
            <h2 className="text-3xl font-black text-stone-950 uppercase tracking-tight mb-2">
              QUIZ COMPLETE!
            </h2>
            <p className="text-sm font-bold text-stone-500 mb-6">
              You checked out all the health cards.
            </p>

            {/* Final Game Stats Badge */}
            <div className="border-4 border-black bg-[#fffb00] p-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-xs mx-auto mb-6 transform -rotate-1">
              <span className="text-xs font-black tracking-widest text-stone-600 block uppercase">
                YOUR FINAL SCORE
              </span>
              <div className="text-5xl font-black text-black my-1">
                {score} <span className="text-xl font-normal text-stone-600">/ {totalQuestions}</span>
              </div>
              <p className="text-xs font-bold text-stone-800 uppercase tracking-tight mt-1">
                {score === totalQuestions ? "🏅 PERFECT SCORE CHAMP!" : score >= 3 ? "👍 EXCELLENT EXPLORER!" : "📚 KEEP LEARNING!"}
              </p>
            </div>

            <button
              onClick={startNewGame}
              className="w-full bg-indigo-400 hover:bg-indigo-50 text-black font-black text-lg py-3.5 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase transition-all"
            >
              Play Game Again 🔄
            </button>
          </div>
        )}
      </div>
    </main>
  );
}