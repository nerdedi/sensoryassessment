import jsPDF from 'jspdf';
import { AlertCircle, BarChart3, Brain, ChevronDown, ChevronUp, Download, Info, Mic, MicOff, Save, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SensoryAssessment = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    completedBy: '',
    additionalInfo: '',
    responses: {}
  });

  const [activeSection, setActiveSection] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [submitStatus, setSubmitStatus] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [recordingNote, setRecordingNote] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [expandedGuidance, setExpandedGuidance] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            const currentText = formData.responses[recordingNote]?.notes || '';
            setFormData(prev => ({
              ...prev,
              responses: {
                ...prev.responses,
                [recordingNote]: {
                  ...prev.responses[recordingNote],
                  notes: currentText + (currentText ? ' ' : '') + transcript
                }
              }
            }));
          }
        }
      };
    }
  }, [recordingNote, formData.responses]);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem('sensoryAssessment');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  const sensoryCategories = {
    tactile: {
      title: "Tactile System",
      subtitle: "Touch & Texture Processing",
      description: "Processing touch, pressure, texture, and temperature through the skin and body surface.",
      color: "bg-blue-50 border-blue-200",
      iconPath: "/icons/tactile.svg",
      items: [
        {
          text: "Light, unexpected touch on skin",
          examples: "clothing tags, someone brushing past you in a queue, light tap on shoulder, hair touching your face, sleeping partner accidentally touching you",
          guidance: "This explores how you respond to unexpected or light touch that you haven't chosen. Think about situations where something touches you unexpectedly—like a tag rubbing on skin, someone bumping past you, or hair blowing across your face. Some people find these very bothering (avoids), others don't notice much (neutral), and some actively enjoy these sensations (seeks)."
        },
        {
          text: "Deep pressure touch and firm contact",
          examples: "tight hugs, massage, weighted blankets, firm handshakes, compression clothing, leaning against walls or furniture",
          guidance: "This is about firm, intentional touch and pressure. Unlike light unexpected touch, this is typically something you can control or predict. Deep pressure often feels calming or organizing to many people. Consider how you feel when getting a hug or massage—do you seek it out, avoid it, or does it depend on your mood?"
        },
        {
          text: "Exploring various textures with hands",
          examples: "petting animals, fabric shopping, handling paperwork, craft materials, touching produce at the grocery store, fidget toys",
          guidance: "This is about actively touching and exploring different textures with your hands. It's about the experience of feeling different materials and surfaces. Some people love the sensory input from textures (seeks), others find it overwhelming, and many enjoy it in specific contexts (mixed)."
        },
        {
          text: "Temperature variations and thermal input",
          examples: "hot coffee vs iced drinks, seasonal weather changes, hot showers, cold swimming pools, air conditioning, touching cold metal",
          guidance: "How you experience temperature changes—both hot and cold. This includes things like the shock of cold water, the comfort of warm drinks, or how you feel seasonal changes. Some people are very sensitive to temperature (avoids extreme temperatures), others seek them out (loves hot baths or ice), and some enjoy variety."
        },
        {
          text: "Grooming and self-care activities",
          examples: "hair brushing/washing, nail trimming, shaving, face washing, teeth brushing, applying makeup, skin care routines",
          guidance: "Personal care and grooming involves touch to your own body in often sensitive areas like face and scalp. Some people find these activities pleasant or necessary but potentially overstimulating (mixed), others avoid them if possible, and others find them calming and enjoy lots of self-care rituals."
        },
        {
          text: "Getting hands, face, or body 'messy' or sticky",
          examples: "cooking with sticky ingredients, gardening, applying lotion, hand sanitizer, sweaty palms, food on face while eating",
          guidance: "This is about tactile sensations that some people find particularly unpleasant—sticky, messy, or uncomfortable textures. Some people actively avoid these experiences, others don't mind them, and some actually enjoy the sensory input they provide."
        },
        {
          text: "Contact with water on skin",
          examples: "daily showers, swimming, washing dishes, rain on skin, splashing from tap, humid environments",
          guidance: "Water is a unique tactile experience—it can be soothing or overwhelming. This includes showers, swimming, and even getting wet in the rain. Some people love water activities (seeks), others find them distressing, and many enjoy them in specific contexts (mixed)."
        },
        {
          text: "Drying off after water exposure",
          examples: "towel drying after shower, using hand dryers in public restrooms, air drying, changing from wet to dry clothes after rain or exercise",
          guidance: "The experience of drying off—whether rubbing with towels or air drying—is distinct from being wet. Some people love the feeling of being wrapped in a towel, others find vigorous toweling uncomfortable, and preferences may vary by situation."
        },
        {
          text: "Clothing textures, fit, and sensations",
          examples: "seams in socks, tight waistbands, scratchy wool, fitted vs loose clothing, bra straps, collars, tags in shirts, new vs worn-in clothes",
          guidance: "Clothing is something you wear all day, so tactile sensations from fabric, seams, fit, and tags can significantly affect comfort. Many people have specific preferences about clothing texture and fit. Some can wear anything (neutral), others are very particular about how things feel."
        },
        {
          text: "Walking barefoot on different surfaces",
          examples: "carpet at home, cold tiles, grass in the yard, sand at beach, rough concrete, smooth wood floors, gravel",
          guidance: "The feeling of different surfaces under your feet when barefoot. Barefoot experiences give direct tactile input to a sensitive area. Some people love going barefoot (seeks), others prefer always having shoes on (avoids), and many have preferences depending on the surface or situation."
        },
        {
          text: "Sitting or lying on various surface textures",
          examples: "leather vs fabric couch, office chairs, different bed sheets, car seats, outdoor furniture, yoga mats, beach towels",
          guidance: "Different seating and resting surfaces have different tactile properties. Since you sit or lie on these for extended periods, the texture can be important. Some people are very sensitive to seat texture, others adapt easily, and many have strong preferences."
        },
        {
          text: "Physical proximity to others and incidental touch in social situations",
          examples: "crowded trains/buses, standing in queues, sitting close in movie theaters, dancing, handshakes or hugs in greetings, sitting close to partner",
          guidance: "This is about unintentional or culturally-expected touch in social situations. It includes proximity in crowds, handshakes, and other social touch expectations. Some people find social touch anxiety-provoking (avoids), others find it comforting (seeks), and many it depends on who it is (mixed)."
        }
      ]
    },
    proprioceptive: {
      title: "Proprioceptive System",
      subtitle: "Body Position & Force Awareness",
      description: "Sensing body position, movement, and force through muscles, joints, and connective tissue.",
      color: "bg-green-50 border-green-200",
      iconPath: "/icons/proprioceptive.svg",
      items: [
        {
          text: "Heavy work activities requiring significant effort",
          examples: "pushing heavy shopping trolleys, moving furniture, carrying groceries from car, pushing revolving doors, lifting heavy packages",
          guidance: "This explores how you respond to activities requiring physical effort and strength. Think about pushing a trolley through a supermarket or moving furniture. Some people find these activities energizing and satisfying, others find them tiring, and some actively seek them out for the strong proprioceptive feedback they provide."
        },
        {
          text: "Resistive activities using muscle strength",
          examples: "opening tight jar lids, using manual can openers, pulling stuck drawers, opening heavy doors, rock climbing, lifting weights at gym",
          guidance: "These are activities where your muscles work against resistance. The resistance provides proprioceptive feedback through muscle activation. Some people enjoy this feeling (seeks), others prefer activities without resistance, and many enjoy it in specific contexts (mixed)."
        },
        {
          text: "Deep pressure or compression input",
          examples: "tight hugs from loved ones, wearing compression socks/clothing, being under heavy duvets, squeezing into tight spaces like airplane seats",
          guidance: "Deep pressure and compression through the body often feels calming and organizing to the nervous system. This includes weighted blankets, tight hugs, or compression clothing. Some people actively seek these experiences, others find them uncomfortable."
        },
        {
          text: "Eating crunchy foods that provide strong oral input",
          examples: "raw carrots, apples, nuts, chips/crisps, crusty bread, ice cubes, hard candy, pretzels, celery",
          guidance: "Crunchy foods provide strong proprioceptive feedback through jaw muscles and teeth. This can be very satisfying for some people who seek strong input (especially if they also seek other intense sensations), while others might find it uncomfortable or irritating to their teeth or jaw."
        },
        {
          text: "Impact activities providing joint compression",
          examples: "jumping on trampoline, stomping while walking, clapping enthusiastically, running/jogging, jumping off curbs, dance workouts",
          guidance: "Impact activities like jumping or stomping provide intense proprioceptive feedback through joints and muscles. Some people find this very organizing and enjoyable (seeks), others avoid impact for comfort reasons, and many enjoy it in specific contexts."
        },
        {
          text: "Sustained physical effort and endurance activities",
          examples: "long walks, hiking, swimming laps, cycling to work, marathon cleaning sessions, gardening, physical labor jobs",
          guidance: "These are activities requiring sustained effort over time. They provide continuous proprioceptive feedback. Some people find them energizing and love the feeling of physically accomplishing something, others find sustained effort tiring, and many enjoy it depending on the activity."
        },
        {
          text: "Fine motor tasks requiring graded force control",
          examples: "handwriting, typing, buttoning shirts, using scissors, threading needles, assembling flat-pack furniture, using tweezers",
          guidance: "These require precise control of hand strength and movement—firm enough to accomplish the task, gentle enough to avoid breaking things. Some people have naturally good control, others need practice or more time, and some find precision activities calming while others find them frustrating."
        },
        {
          text: "Activities requiring body awareness without visual input",
          examples: "navigating your home in the dark, knowing where your feet are while driving, reaching for items behind you, getting dressed under covers",
          guidance: "This is about proprioceptive body awareness without looking. Can you reach behind you accurately? Know where your feet are in the dark? Some people have strong body awareness, others rely more on vision."
        },
        {
          text: "Stretching, yoga, or body positioning activities",
          examples: "morning stretches, yoga classes, pilates, sitting cross-legged, reaching to scratch your back, stretching at desk",
          guidance: "Stretching and yoga provide proprioceptive feedback through muscles and joints being lengthened or positioned. Some people love the feeling and range of motion, others find it uncomfortable, and many enjoy stretching in specific contexts."
        },
        {
          text: "Carrying or wearing weighted items",
          examples: "backpack with laptop, weighted blanket, carrying shopping bags, wearing heavy winter coat, ankle/wrist weights during exercise",
          guidance: "The feeling of carrying weight or wearing heavy items throughout the day. Some people find this grounding and organizing, others find it burdensome or restrictive, and many have preferences depending on the context and duration."
        }
      ]
    },
    vestibular: {
      title: "Vestibular System",
      subtitle: "Movement, Balance & Spatial Orientation",
      description: "Processing movement, gravity, head position, and spatial orientation through the inner ear.",
      color: "bg-purple-50 border-purple-200",
      iconPath: "/icons/vestibular.svg",
      items: [
        {
          text: "Linear movement in straight lines",
          examples: "swinging on park swings, lift/elevator rides, train travel, rocking chairs, being pushed in wheelchair, sliding down slides",
          guidance: "This explores how you feel with back-and-forth or up-and-down movement. Swings, elevators, and trains are examples. Some people find this soothing (seeks), others find it queasy or uncomfortable (avoids), and many enjoy it in specific contexts (mixed)."
        },
        {
          text: "Rotational or spinning movement",
          examples: "spinning in office chair, merry-go-rounds, rolling down hills, doing cartwheels, dancing with turns, revolving doors",
          guidance: "Spinning and rotating movements are distinct from linear movement. Some people love the dizzy feeling of spinning (seeks), others find it immediately uncomfortable or triggering nausea (avoids), and some enjoy it briefly but not for extended periods."
        },
        {
          text: "Being moved passively by others",
          examples: "being rocked, carried, pushed in wheelchair, dentist chair recline, massage table adjustments, partner moving you while dancing",
          guidance: "This is about being moved by someone else versus moving yourself. Passive movement can feel either helpless/uncomfortable or trusting/safe depending on the person and context. Some people find it relaxing, others anxiety-provoking."
        },
        {
          text: "Active self-initiated movement through space",
          examples: "running for the bus, dancing freely, skipping, jumping, walking briskly, playing sports, aerobic exercise classes",
          guidance: "When you initiate movement yourself, you have more control and can predict what's happening. Some people love active movement (seeks sports/dancing), others prefer calmer activities, and many enjoy movement in specific contexts."
        },
        {
          text: "Changes in head position from upright",
          examples: "bending over bathroom sink, looking up at tall buildings, lying down from sitting, reaching down to tie shoes, looking under furniture",
          guidance: "Tilting your head changes vestibular input. Some people easily adapt to head position changes, others feel momentarily dizzy or disoriented when bending or looking up."
        },
        {
          text: "Having head tilted or upside down",
          examples: "doing somersaults, hanging upside down, headstands, yoga inversions, washing hair in salon sink, looking between your legs",
          guidance: "More extreme head positions (inversions, upside down) provide stronger vestibular input. Some people love the sensation and seek it out (yoga inversions), others find it immediately disorienting or nauseating, and some have safety concerns about blood rushing to the head."
        },
        {
          text: "Activities challenging balance",
          examples: "walking on ice, standing on one foot to put on shoes, riding bicycle, using scooter, ice skating, balancing on curb, yoga balance poses",
          guidance: "Balance-challenging activities require vestibular coordination. Some people naturally enjoy these challenges and seek them out (ice skating, yoga), others find them anxiety-provoking or unsteady-feeling."
        },
        {
          text: "Being up high or at heights",
          examples: "looking down from office building, standing on ladders, looking over balcony railings, climbing observation towers, glass floor attractions",
          guidance: "Heights provide distinct vestibular and visual input. Some people enjoy the visual experience and feel of elevation, others experience vertigo or anxiety (acrophobia), and many feel anxious primarily about safety risk rather than the vestibular sensation itself."
        },
        {
          text: "Climbing up or descending down",
          examples: "using stairs at work, climbing ladders, walking up/down hills, escalators, getting in/out of vehicles, steep streets",
          guidance: "Going up and down engages vestibular system as body position changes relative to gravity. Some people find stairs easy, others find descending particularly challenging or dizzying, and many find specific heights triggering (tall ladders vs regular stairs)."
        },
        {
          text: "Fast or sudden movements and speed changes",
          examples: "running then stopping quickly, someone pulling out in front of your car, sudden direction changes while walking, emergency braking",
          guidance: "Rapid acceleration, deceleration, or direction changes are vestibular-heavy. Some people enjoy the thrill of these movements, others find them jarring or disorienting."
        },
        {
          text: "Walking or playing on unstable surfaces",
          examples: "deep carpet, grass, sand, gravel paths, walking on mattress, trampolines, bouncy castles, boats on water",
          guidance: "Unstable surfaces require constant vestibular and proprioceptive adjustment. Some people love the challenge and seeking of unstable surfaces, others find them tiring or anxiety-provoking. Sand and grass require more balance effort than firm ground."
        },
        {
          text: "Vehicle movement and transportation",
          examples: "car rides as passenger, buses, trains, boats, aeroplane travel, roller coasters, cable cars, ferries",
          guidance: "Vehicles provide combination of linear, rotational, and sometimes unexpected movements. Some people enjoy transportation (seeks), some experience motion sickness (avoids), and many are fine with cars but struggle with boats or planes."
        },
        {
          text: "Activities combining multiple movement types simultaneously",
          examples: "dancing with turns and jumps, sports requiring running and coordination, driving while turning corners, walking while looking at phone",
          guidance: "Complex movement combining different types (rotating while jumping, driving while turning) is vestibular-intensive. Some people naturally coordinate these without thought, others find them requires conscious effort or feel uncoordinated."
        }
      ]
    },
    auditory: {
      title: "Auditory System",
      subtitle: "Sound Processing & Auditory Discrimination",
      description: "Processing, filtering, localising, and interpreting sounds through the ears and auditory pathways.",
      color: "bg-yellow-50 border-yellow-200",
      iconPath: "/icons/auditory.svg",
      items: [
        {
          text: "Loud or sudden unexpected sounds",
          examples: "sirens, fire alarms, hand dryers in restrooms, balloons popping, dogs barking, doors slamming, car horns, dropped dishes",
          guidance: "This explores sensitivity to loud or startling sounds. Some people startle easily at unexpected loud noises (avoids/high sensitivity), others don't notice much, and some enjoy loud noises like fireworks or concerts (seeks). This is different from volume—it's about the unexpectedness and intensity."
        },
        {
          text: "Background noise in busy environments",
          examples: "restaurants during peak hours, shopping centres, office open-plan spaces, parties, busy streets, airports, gyms",
          guidance: "Steady background noise in busy places can be either comforting (white noise effect, provides stimulation) or exhausting (having to filter through too much). Some people prefer quiet, others prefer ambient noise."
        },
        {
          text: "Overlapping or competing sounds",
          examples: "multiple conversations at dinner party, TV on while people talk, conference calls with background noise, busy coffee shops",
          guidance: "Having multiple sound sources at once requires your brain to separate and focus on one—this is called the 'cocktail party problem.' Some people find this effortless, others find it very tiring or anxiety-provoking."
        },
        {
          text: "High-pitched sounds",
          examples: "children squealing, certain voices, smoke alarms beeping, whistles, tea kettles, squeaky brakes, dentist drill",
          guidance: "Some frequencies are more noticeable or bothersome than others. High-pitched sounds bother some people significantly (avoids), others don't notice them, and some find them interesting."
        },
        {
          text: "Low-pitched or bass sounds",
          examples: "trucks passing, thunder, bass-heavy music, car engines, construction equipment, deep voices, airplane engines",
          guidance: "Low frequencies/bass can be felt through the body as vibration. Some people feel this is pleasant (seeks bass-heavy music), others find it overwhelming or uncomfortable."
        },
        {
          text: "Volume preferences for music, television, and media",
          examples: "preferred volume levels at home, in car, wearing headphones; partner saying it's too loud/quiet",
          guidance: "Everyone has volume preferences. This explores whether you typically prefer quiet, moderate, or loud volumes. Some people have significant sensitivity to volume, others adapt easily."
        },
        {
          text: "Following verbal instructions when background noise is present",
          examples: "listening to GPS in noisy car, hearing waiter in busy restaurant, phone calls in public, work meetings with AC noise",
          guidance: "This is about auditory processing and filtering skills. Can you understand what someone is saying even when there's background noise? Some people filter easily, others struggle and feel exhausted trying."
        },
        {
          text: "Repetitive or monotonous sounds",
          examples: "ticking clocks, humming refrigerator, buzzing lights, dripping taps, neighbor's music through walls, office printer",
          guidance: "Repetitive sounds can either fade into the background for people or become increasingly maddening/noticeable. Some people barely notice them, others find them impossible to ignore."
        },
        {
          text: "Participating in social conversations with turn-taking and listening",
          examples: "dinner conversations, work meetings, phone calls, catching up with friends, family gatherings, networking events",
          guidance: "This explores auditory social skills and comfort with conversation. Some people love conversation (seeks), others find it draining, and many enjoy it in specific contexts."
        },
        {
          text: "Speaking or being spoken to amid other sounds or voices",
          examples: "having conversation while TV is on, talking at parties, phone calls in public, drive-through ordering",
          guidance: "Speaking or listening while other sounds are present requires divided attention. Some people do this easily while others need it quiet to communicate effectively."
        },
        {
          text: "Echoing environments",
          examples: "swimming pools, gymnasiums, underground car parks, empty halls, bathrooms with tile walls, shopping center atriums",
          guidance: "Echoing environments can make sounds feel louder or more intense. Some people find echo distressing or disorienting, others barely notice it."
        },
        {
          text: "Games or activities with rapid verbal instructions",
          examples: "following recipe videos, GPS navigation while driving, exercise classes, online tutorials, fast-paced meetings",
          guidance: "Fast-paced verbal information requires quick auditory processing and comprehension. Some people follow easily, others need slower pace or written instructions to understand."
        },
        {
          text: "Singing, music-making, or vocal expression",
          examples: "singing in shower, humming while working, karaoke, singing along to radio in car, choir, musical instruments",
          guidance: "This explores comfort with vocal expression and music-making. Some people sing/hum automatically (seeks), others feel self-conscious or uncomfortable making sounds."
        },
        {
          text: "Unfamiliar sounds, accents, or languages",
          examples: "traveling abroad, new workplace sounds, regional accents, foreign language conversations, new neighborhood noises",
          guidance: "Unfamiliar sounds require more cognitive processing as your brain works to decode them. Some people easily adapt to new sounds, others find unfamiliar sounds disorienting or anxiety-provoking."
        },
        {
          text: "Quiet or very low sound environments",
          examples: "libraries, meditation spaces, sleeping in silent room, early morning quiet, waiting rooms, empty offices after hours",
          guidance: "Very quiet environments can feel either peaceful or isolating. Some people actively seek quiet (needs quiet to concentrate), others find pure silence uncomfortable and prefer some background sound."
        }
      ]
    },
    visual: {
      title: "Visual System",
      subtitle: "Sight Processing & Visual Perception",
      description: "Processing visual information including light, colour, pattern, movement, and spatial relationships.",
      color: "bg-indigo-50 border-indigo-200",
      iconPath: "/icons/visual.svg",
      items: [
        {
          text: "Bright lights or intense sunlight",
          examples: "fluorescent office lighting, camera flash, bright sunshine, car headlights at night, LED screens, bright shop displays",
          guidance: "This explores sensitivity to bright light. Some people are very bothered by bright/fluorescent lighting and prefer softer light (avoids), others don't notice much, and some actively seek bright environments."
        },
        {
          text: "Dim lighting, shadows, or darkness",
          examples: "romantic restaurant lighting, driving at dusk, shadows in parking garages, dimly lit bars, candlelight, early morning darkness",
          guidance: "Some people find dim environments cozy (seeks), others find them disorienting or anxiety-provoking due to visibility concerns (avoids). Navigation in darkness is different from choosing dim ambiance."
        },
        {
          text: "Visually 'busy' or cluttered environments",
          examples: "crowded shops with displays, messy desks, patterned wallpaper, toy-scattered rooms, busy websites, cluttered kitchen counters",
          guidance: "Visually complex environments require more processing. Some people find them stimulating and enjoy browsing busy shops (seeks), others find them overwhelming and exhausting (avoids). This is related to attention and sensory processing."
        },
        {
          text: "Visual patterns, stripes, or high-contrast designs",
          examples: "striped clothing, patterned carpets, geometric designs, zebra crossings, tiled floors, checkered patterns",
          guidance: "Patterns and high contrast can be visually striking. Some people find them interesting and seek them out, others find them overwhelming or distracting, and some find certain patterns nauseating."
        },
        {
          text: "Moving or spinning visual stimuli",
          examples: "ceiling fans, fidget spinners, windmills, flowing water, traffic passing, leaves blowing, crowds moving",
          guidance: "Moving visual stimuli attract attention. Some people find movement calming or focusing (seeks fidget toys), others find it distracting or disorienting (avoids)."
        },
        {
          text: "Shiny, reflective, or sparkly objects and surfaces",
          examples: "glitter, sequins, mirrors, polished floors, jewelry, metallic surfaces, car chrome, wet pavement reflections",
          guidance: "Shiny/reflective objects catch the eye and can be stimulating. Some people are drawn to sparkly things (seeks), others find them distracting or uncomfortable."
        },
        {
          text: "Eye-hand coordination tasks",
          examples: "catching thrown items, handwriting, typing, threading needles, using utensils while eating, cutting with scissors, playing sports",
          guidance: "These tasks require precise visual-motor coordination. Some people have natural coordination and enjoy these activities, others find them challenging or require more time to develop skills."
        },
        {
          text: "Visual tracking of moving objects",
          examples: "following balls in sports, watching cars pass, tracking people walking by, following subtitles on screen, watching birds",
          guidance: "Tracking moving objects requires visual focus and smooth eye movements. Some people naturally enjoy watching movement (finds birds or sports interesting), others find it tiring."
        },
        {
          text: "Visual discrimination and analysis",
          examples: "jigsaw puzzles, finding your car in parking lot, spot-the-difference games, proofreading documents, finding items on shelf",
          guidance: "These tasks require detailed visual analysis and comparison. Some people naturally enjoy these activities and find them engaging (seeks puzzles), others find them frustrating or tiring."
        },
        {
          text: "Activities requiring colour, shape, and size differentiation",
          examples: "matching socks, organizing files by color, selecting produce, choosing outfits, sorting items, reading maps",
          guidance: "Color and shape discrimination is important for many daily tasks. Some people have natural color perception and enjoy color organization, others find color matching challenging."
        },
        {
          text: "Reading and sustained visual attention to text",
          examples: "reading books, reading emails/documents, following recipes, reading road signs, scrolling social media",
          guidance: "Reading requires sustained visual focus and attention. Some people enjoy reading and lose time in books (seeks), others find reading tiring or have difficulty sustaining focus."
        },
        {
          text: "Finding specific objects in visually complex environments",
          examples: "finding keys in handbag, locating items in full fridge, finding specific book on shelf, spotting friend in crowd",
          guidance: "Visual search requires focused attention and filtering. Some people spot things quickly (strong visual attention), others take longer or need help locating items."
        },
        {
          text: "Screen time activities",
          examples: "working on computer, watching TV, using smartphone, video gaming, tablets, video calls, streaming content",
          guidance: "Screen-based activities involve sustained visual focus, light exposure, and eye strain for some. Some people comfortably spend extended time on screens, others need frequent breaks."
        },
        {
          text: "Fast-paced or action-packed visual media",
          examples: "action movies, sports on TV, video games, fast-cutting advertisements, quick social media scrolling, news tickers",
          guidance: "Fast-paced visual input requires quick processing and tracking. Some people find this exciting and engaging (seeks), others find it overwhelming or disorienting."
        },
        {
          text: "New or novel visual experiences",
          examples: "kaleidoscopes, 3D movies, VR headsets, colored glasses, art installations, light shows, new environments",
          guidance: "Novel visual experiences are new to process. Some people enjoy novelty and stimulation (seeks), others find unexpected visual experiences disorienting or anxiety-provoking."
        },
        {
          text: "Making eye contact during social interactions",
          examples: "job interviews, conversations with colleagues, dating, presentations, talking with strangers, video calls, networking",
          guidance: "Eye contact is culturally expected but can feel intense or uncomfortable. Some people naturally maintain eye contact comfortably, others find it anxiety-provoking or prefer to look away."
        }
      ]
    },
    gustatory: {
      title: "Gustatory System",
      subtitle: "Taste & Oral Flavour Processing",
      description: "Processing tastes and flavours through taste buds and oral sensory receptors.",
      color: "bg-pink-50 border-pink-200",
      iconPath: "/icons/gustatory.svg",
      items: [
        {
          text: "Strong or intense flavours",
          examples: "very spicy curries, sour candies, bitter coffee, salty chips, very sweet desserts, hot sauce, strong cheese, pickles",
          guidance: "Some people enjoy intense flavors and seek them out (loves spicy food), others find them overwhelming or unpleasant. Intensity and palatability are separate—some people avoid intensity even if they like the flavor."
        },
        {
          text: "Bland or mild-flavoured foods",
          examples: "plain rice, white bread, plain pasta, chicken without seasoning, mild cheese, plain yogurt, potatoes",
          guidance: "Bland foods are predictable and safe. Some people prefer mild flavors (seeks), others find them boring and uninteresting. Many eat bland foods for safety/comfort but prefer flavor when possible."
        },
        {
          text: "Trying new or unfamiliar foods and flavours",
          examples: "ordering unknown dishes at restaurants, trying international cuisines, sampling at markets, experimenting with recipes",
          guidance: "New foods require comfort with novelty and change. Some people love trying new things and exploring cuisines (seeks adventure), others have food anxiety and prefer familiar foods (avoids novelty)."
        },
        {
          text: "Eating familiar and preferred foods consistently",
          examples: "ordering same meal at restaurant, eating same breakfast daily, preferred brands, comfort foods, safe meals",
          guidance: "Familiar foods provide predictability and comfort. Some people naturally prefer variety, others strongly prefer eating the same foods and become distressed when they're unavailable (food monotony, restricted diets)."
        },
        {
          text: "Mixed or complex flavours in combined dishes",
          examples: "casseroles, stews, mixed salads, stir-fries, curries, pasta with multiple ingredients, complex sauces",
          guidance: "Complex dishes blend multiple flavors that can be confusing to taste individually. Some people enjoy the complexity, others prefer to taste individual components separately."
        },
        {
          text: "Single, unmixed flavours presented separately",
          examples: "deconstructed meals, foods kept separate on plate, plain proteins, individual side dishes, unmixed ingredients",
          guidance: "Keeping foods separate allows tasting each flavor independently. Some people prefer foods deconstructed and not mixed, others don't mind mixing."
        },
        {
          text: "Temperature of foods and drinks",
          examples: "hot coffee vs iced coffee, preference for room temperature water, hot soup vs cold soup, warm vs cold sandwiches",
          guidance: "Temperature affects flavor perception and comfort. Some people are sensitive to temperature extremes, others have strong preferences (always hot coffee, never cold drinks)."
        },
        {
          text: "Specific taste categories",
          examples: "sweet desserts, salty snacks, sour citrus, bitter dark chocolate, umami/savory broths, preference for certain taste profiles",
          guidance: "Different tastes (sweet, salty, sour, bitter, umami) have different appeal. Some people have clear taste preferences while others enjoy variety."
        },
        {
          text: "Strong-tasting condiments and sauces",
          examples: "tomato sauce, mustard, vinegar, soy sauce, hot sauce, BBQ sauce, mayonnaise, relish, chutney",
          guidance: "Condiments can transform a dish. Some people avoid them (prefer plain foods), others use them liberally (seeks flavor enhancement)."
        },
        {
          text: "Exploring taste through mouthing non-food objects",
          examples: "chewing pen caps, biting nails, chewing straws, mouthing jewelry, licking fingers, tasting hair",
          guidance: "Mouthing non-food objects is common in childhood and normal exploratory behavior. In older children or adults, it may indicate seeking oral input. Some people continue to mouth non-food objects for sensory input (seeking), others never did (neutral/avoids)."
        }
      ]
    },
    olfactory: {
      title: "Olfactory System",
      subtitle: "Smell & Scent Processing",
      description: "Processing scents and odours through nasal passages and olfactory receptors.",
      color: "bg-teal-50 border-teal-200",
      iconPath: "/icons/olfactory.svg",
      items: [
        {
          text: "Strong or intense odours",
          examples: "perfume/cologne, petrol stations, cleaning products, paint fumes, air fresheners, strong chemicals, nail polish",
          guidance: "Some people are highly sensitive to strong smells and find them overwhelming or nauseating (avoids), others barely notice them, and some actively seek strong scents (loves perfume)."
        },
        {
          text: "Food smells and cooking aromas",
          examples: "baking bread, frying onions, strong spices like curry, fish cooking, garlic, coffee brewing, burnt toast",
          guidance: "Food smells can be appetizing or off-putting. Some people love the smell of food cooking and use aroma to enhance eating (seeks), others find strong food smells nauseating."
        },
        {
          text: "Natural outdoor scents",
          examples: "flowers in bloom, fresh cut grass, ocean air, rain smell, bushland eucalyptus, pine trees, earth after rain",
          guidance: "Natural scents often feel fresh and pleasant. Some people seek out natural environments for the scents (loves flowers/fresh air), others prefer scent-neutral environments."
        },
        {
          text: "Body odours",
          examples: "sweat, breath smells, deodorant, others' perfume/cologne in close quarters, gym smells, hair products",
          guidance: "Body odors in close quarters (gym, crowded transit) can be bothersome. Some people are highly bothered by body odors (avoids), others don't notice much."
        },
        {
          text: "Unfamiliar or novel scents in new environments",
          examples: "new car smell, hotel rooms, new workplace, someone else's home, visiting different countries, new buildings",
          guidance: "New smells require olfactory processing. Some people find new scents interesting or even pleasing (new car smell lovers), others find them slightly off-putting."
        },
        {
          text: "Seeking to smell non-food items",
          examples: "smelling new books, fabric/clothing, people/partners, pets, fresh laundry, gasoline, markers, play-dough",
          guidance: "Actively seeking to smell things (new books, fabric, partners) is common and often enjoyable. Some people naturally do this (seeks sensory input), others rarely think to smell things."
        },
        {
          text: "Environmental odours",
          examples: "car exhaust, cigarette smoke, industrial smells, garbage bins, public transport smells, city air quality",
          guidance: "Environmental odors from pollution or waste can be unpleasant. Some people are bothered significantly and need to avoid these environments (avoids), others adapt easily."
        },
        {
          text: "Subtle or faint scents",
          examples: "light perfumes, mild soap, fresh air, clean laundry, subtle essential oils, barely-there fragrances",
          guidance: "Subtle scents require olfactory sensitivity to notice. Some people notice faint scents easily and find them pleasant, others don't notice unless stronger."
        },
        {
          text: "Artificial fragrances",
          examples: "scented candles, air fresheners in cars, perfumed laundry products, scented hand sanitizer, room sprays",
          guidance: "Artificial scents can be pleasant (seeks them out) or feel chemical and bothersome (avoids). Some people prefer natural scents, others like artificial fragrances."
        },
        {
          text: "Smells associated with specific places",
          examples: "doctor's surgery antiseptic smell, school corridor smell, swimming pool chlorine, dentist office, hospital smell",
          guidance: "Familiar place-specific smells can trigger memories or emotional responses. Some are positive (school smell nostalgia), others are negative (anxiety at doctor's office smell)."
        }
      ]
    },
    interoceptive: {
      title: "Interoceptive System",
      subtitle: "Internal Body Signals & States",
      description: "Sensing and interpreting internal body signals, sensations, and physiological states.",
      color: "bg-orange-50 border-orange-200",
      iconPath: "/icons/interoceptive.svg",
      items: [
        {
          text: "Hunger signals and recognising when the body needs food",
          examples: "stomach rumbling, low energy, irritability, light-headedness, knowing when you've skipped a meal, appetite cues",
          guidance: "This explores whether you easily notice when your body needs food. Some people have strong hunger signals and notice immediately when they need to eat, others miss hunger cues and can forget to eat, or ignore them intentionally."
        },
        {
          text: "Fullness or satiation cues after eating a meal",
          examples: "knowing when to stop eating, feeling 'stuffed', comfortable fullness, recognising you've had enough",
          guidance: "Can you sense when you're satisfied and should stop eating? Some people easily stop when full (seeks), others overeat past comfort, and some struggle to recognize fullness signals (restricted food intake or overeating patterns)."
        },
        {
          text: "Thirst and recognising need for hydration",
          examples: "dry mouth, parched feeling, headache from dehydration, knowing you need water, craving fluids",
          guidance: "Like hunger, some people notice thirst easily (seeks water regularly), while others dehydrate without noticing (avoids/doesn't notice), which can affect energy and health."
        },
        {
          text: "Bladder urgency and signals to urinate",
          examples: "feeling 'I need to go now', moderate urge, mild awareness of full bladder, urgency sensations",
          guidance: "Bladder awareness varies significantly. Some people have strong signals and need frequent bathroom breaks, others have very weak signals and can hold urine longer (which can cause health issues)."
        },
        {
          text: "Bowel signals and recognising need for toileting",
          examples: "stomach cramps indicating need, urgency awareness, regular patterns, discomfort before bowel movement",
          guidance: "Some people have predictable bowel patterns and clear signals, others struggle with irregular signals or weak awareness. This affects digestive health and public confidence."
        },
        {
          text: "Digestive sensations",
          examples: "stomach gurgling, gas, bloating after meals, cramping, nausea, indigestion, 'upset stomach' feeling",
          guidance: "Digestion has various sensations that people notice to varying degrees. Some are highly aware of every digestive sensation, others barely notice, and many have strong sensations but try to ignore them."
        },
        {
          text: "Body temperature regulation",
          examples: "recognising feeling too hot and need to remove layers, shivering when cold, sweating, flushed face, chills",
          guidance: "Temperature awareness affects ability to regulate comfort. Some people quickly notice they're too hot/cold and adjust (seeks temperature regulation), others don't notice until very uncomfortable."
        },
        {
          text: "Heart rate awareness",
          examples: "noticing heartbeat during exercise, racing heart when anxious, pounding chest, awareness of pulse, heart fluttering",
          guidance: "Some people are very aware of their heartbeat and notice changes immediately, others rarely notice. High awareness can be helpful (knowing you're anxious) or create health anxiety."
        },
        {
          text: "Breathing sensations and respiratory awareness",
          examples: "shortness of breath after stairs, needing deep breath, breathing changes when anxious, noticing breath pace",
          guidance: "Breathing awareness connects to anxiety and stress response. Some people naturally notice their breathing, others don't unless in extreme stress or physical effort."
        },
        {
          text: "Muscle tension, tightness, or soreness in body",
          examples: "tight shoulders from stress, sore legs after exercise, neck tension, back ache, jaw clenching, muscle fatigue",
          guidance: "Some people quickly notice muscle tension (especially stress-related) and can self-correct (stretching, relaxing), others don't notice tension until it causes pain or dysfunction."
        },
        {
          text: "Pain signals and discomfort recognition",
          examples: "headaches, body aches, injury pain, chronic pain awareness, toothache, menstrual cramps, joint pain",
          guidance: "Pain awareness varies widely. Some people have high pain sensitivity and notice minor discomfort immediately, others have low sensitivity and might not notice significant pain, or have chronic pain and become desensitized."
        },
        {
          text: "Fatigue and energy level awareness",
          examples: "recognising tiredness, exhaustion, need for rest, energy dips during day, feeling drained, needing sleep",
          guidance: "Some people clearly recognize fatigue and respond by resting (seeks rest when tired), others push through, ignore fatigue, or struggle to recognize when they're exhausted despite low functioning."
        },
        {
          text: "Emotions felt as physical sensations",
          examples: "butterflies when nervous, chest tightness when anxious, warmth when happy, heaviness when sad, tension when angry",
          guidance: "Interoceptive awareness of emotions is crucial for emotional regulation. Some people easily sense emotion-related body sensations, others have difficulty connecting physical sensations to emotions, which can affect emotional awareness."
        },
        {
          text: "Itch or tickle sensations on skin",
          examples: "noticing mosquito bite, dry skin itchiness, tickle prompting scratch, irritation awareness, allergic reactions",
          guidance: "Some people notice minor itches and tickles immediately and scratch them, others miss or ignore itches, and some find tickling extremely bothersome while others find it pleasant."
        },
        {
          text: "Dizziness, lightheadedness, or feeling faint",
          examples: "standing up too quickly, room spinning, unsteady feeling, near-fainting sensation, vertigo",
          guidance: "Dizziness awareness and response varies. Some people quickly notice and sit down (prevents injury), others might not notice until nearly falling. Some experience vertigo easily, others rarely do."
        },
        {
          text: "Sleep and wake signals",
          examples: "feeling sleepy at night, recognising need for sleep, waking refreshed or groggy, drowsiness, alertness levels",
          guidance: "Sleep quality and awareness varies. Some people sleep deeply and wake refreshed, others sleep poorly or don't notice they need sleep until exhausted. This affects health and daytime functioning."
        },
        {
          text: "Sexual arousal or related physical sensations",
          examples: "recognising arousal cues, physical responses, awareness of desires, body's sexual responses",
          guidance: "Awareness of sexual arousal and desire varies by individual. Some people have strong awareness of these responses, others have low interoceptive awareness which can affect sexual satisfaction and communication with partners."
        },
        {
          text: "Menstrual cycle-related sensations",
          examples: "cramping, bloating, breast tenderness, hormonal shifts, ovulation awareness, PMS symptoms, cycle patterns",
          guidance: "People with menstrual cycles vary in cycle awareness. Some track patterns and notice symptoms clearly, others don't notice symptoms until significant discomfort, and some have very weak or absent cycle signals."
        },
        {
          text: "Changes in body state during stress or emotional dysregulation",
          examples: "panic attack physical symptoms, shutdown numbness, hypervigilance body tension, freeze response, overwhelm sensations",
          guidance: "During stress/dysregulation, some people clearly feel physical changes (racing heart, tightness) and recognize these as stress signals, helping them seek support. Others don't notice physical stress changes until they're already significantly dysregulated, which makes regulation harder."
        }
      ]
    }
  };

  const responseOptions = [
    {
      value: 'avoids',
      label: 'AVOIDS',
      description: 'Generally moves away from or shows discomfort',
      example: 'e.g., Removes tags immediately, declines hugs, covers ears',
      color: 'bg-red-100 border-red-300 text-red-800',
      activeColor: 'bg-red-600 text-white shadow-md',
      shortColor: 'bg-red-500'
    },
    {
      value: 'seeks',
      label: 'SEEKS',
      description: 'Actively pursues or shows preference',
      example: 'e.g., Requests massage, turns up music, seeks spicy food',
      color: 'bg-green-100 border-green-300 text-green-800',
      activeColor: 'bg-green-600 text-white shadow-md',
      shortColor: 'bg-green-500'
    },
    {
      value: 'mixed',
      label: 'MIXED',
      description: 'Response varies by context or state',
      example: 'e.g., Enjoys touch when calm, avoids when stressed',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      activeColor: 'bg-yellow-600 text-white shadow-md',
      shortColor: 'bg-yellow-500'
    },
    {
      value: 'neutral',
      label: 'NEUTRAL',
      description: 'No strong preference either way',
      example: 'e.g., Can take it or leave it, doesn\'t notice much',
      color: 'bg-slate-100 border-slate-300 text-slate-800',
      activeColor: 'bg-slate-600 text-white shadow-md',
      shortColor: 'bg-slate-500'
    }
  ];

  const handleResponseChange = (category, itemIndex, value) => {
    const key = `${category}-${itemIndex}`;
    const currentResponse = formData.responses[key]?.response;

    // Toggle: if same option clicked, deselect it
    if (currentResponse === value) {
      setFormData(prev => ({
        ...prev,
        responses: {
          ...prev.responses,
          [key]: {
            ...prev.responses[key],
            response: null
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        responses: {
          ...prev.responses,
          [key]: {
            ...prev.responses[key],
            response: value
          }
        }
      }));
    }
  };

  const handleNotesChange = (category, itemIndex, notes) => {
    setFormData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [`${category}-${itemIndex}`]: {
          ...prev.responses[`${category}-${itemIndex}`],
          notes: notes
        }
      }
    }));
  };

  const toggleVoiceRecording = (category, itemIndex) => {
    const key = `${category}-${itemIndex}`;

    if (!recognitionRef.current) {
      alert('Voice-to-text is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isRecording && recordingNote === key) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setRecordingNote(null);
    } else {
      setRecordingNote(key);
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const handleSave = () => {
    localStorage.setItem('sensoryAssessment', JSON.stringify(formData));
    setSaveStatus('Assessment saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    // Title
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 138);
    doc.text('COMPREHENSIVE SENSORY PROFILE ASSESSMENT', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('A Neuroaffirming Approach to Understanding Sensory Processing', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 12;

    // Personal Information
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${formData.name || 'Not provided'}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Date of Birth: ${formData.dob || 'Not provided'}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Assessment Date: ${formData.assessmentDate}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Completed By: ${formData.completedBy || 'Not provided'}`, margin, yPosition);
    yPosition += 10;

    if (formData.additionalInfo) {
      doc.setFontSize(10);
      const wrappedText = doc.splitTextToSize(`Additional Info: ${formData.additionalInfo}`, pageWidth - 2 * margin);
      doc.text(wrappedText, margin, yPosition);
      yPosition += wrappedText.length * 5 + 5;
    }

    // Analysis Summary Page (add before responses)
    doc.addPage();
    yPosition = margin;

    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text('SENSORY PROFILE ANALYSIS', margin, yPosition);
    yPosition += 8;

    const results = calculateResults();
    const total = results.avoids + results.seeks + results.mixed + results.neutral;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Overall Response Distribution:', margin, yPosition);
    yPosition += 6;

    const responseLabels = [
      { label: 'Avoids', value: results.avoids, color: [200, 50, 50] },
      { label: 'Seeks', value: results.seeks, color: [50, 150, 50] },
      { label: 'Mixed', value: results.mixed, color: [150, 100, 50] },
      { label: 'Neutral', value: results.neutral, color: [100, 100, 150] }
    ];

    responseLabels.forEach((item, idx) => {
      const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
      doc.setTextColor(...item.color);
      doc.text(`${item.label}: ${item.value} responses (${percentage}%)`, margin + 5, yPosition);
      yPosition += 5;
    });

    yPosition += 8;
    doc.setTextColor(0, 0, 0);
    doc.text('Sensory System Breakdown:', margin, yPosition);
    yPosition += 6;

    Object.entries(sensoryCategories).forEach(([key, category]) => {
      const categoryResponses = category.items.map((item, idx) => formData.responses[`${key}-${idx}`]).filter(r => r?.response);
      if (categoryResponses.length > 0) {
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(`${category.title}: ${categoryResponses.length}/${category.items.length} completed`, margin + 5, yPosition);
        yPosition += 5;
      }
    });

    yPosition += 10;
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text('Key Observations:', margin, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const observations = [];
    if (results.avoids > results.seeks * 2) observations.push('• High sensory avoidance patterns across the assessment');
    if (results.seeks > results.avoids * 2) observations.push('• Strong sensory seeking tendencies');
    if (results.mixed >= results.avoids && results.mixed >= results.seeks) observations.push('• Varied sensory responses suggesting context-dependent processing');
    if (total < 50) observations.push('• Incomplete assessment - consider completing remaining items for fuller profile');

    if (observations.length === 0) {
      observations.push('• Balanced sensory responses across avoidance, seeking, and neutral patterns');
    }

    observations.forEach(obs => {
      const wrappedObs = doc.splitTextToSize(obs, pageWidth - 2 * margin - 10);
      doc.text(wrappedObs, margin + 5, yPosition);
      yPosition += wrappedObs.length * 4 + 2;
    });

    // Responses
    Object.entries(sensoryCategories).forEach(([key, category]) => {
      doc.addPage();
      yPosition = margin;

      doc.setFontSize(13);
      doc.setTextColor(30, 58, 138);
      doc.text(`${category.icon} ${category.title}`, margin, yPosition);
      yPosition += 7;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(category.subtitle, margin, yPosition);
      yPosition += 8;

      category.items.forEach((item, idx) => {
        if (yPosition > pageHeight - 15) {
          doc.addPage();
          yPosition = margin;
        }

        const response = formData.responses[`${key}-${idx}`];
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${idx + 1}. ${item.text}`, margin + 3, yPosition);
        yPosition += 5;

        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        const wrappedExample = doc.splitTextToSize(`Examples: ${item.examples}`, pageWidth - 2 * margin - 6);
        doc.text(wrappedExample, margin + 6, yPosition);
        yPosition += wrappedExample.length * 4;

        if (response?.response) {
          doc.setTextColor(150, 30, 30);
          doc.text(`Response: ${response.response.toUpperCase()}`, margin + 6, yPosition);
          yPosition += 5;
        }

        if (response?.notes) {
          doc.setTextColor(100, 100, 100);
          const wrappedNotes = doc.splitTextToSize(`Notes: ${response.notes}`, pageWidth - 2 * margin - 6);
          doc.text(wrappedNotes, margin + 6, yPosition);
          yPosition += wrappedNotes.length * 4 + 2;
        }

        yPosition += 2;
      });

      yPosition += 8;
    });

    doc.save(`sensory-assessment-${formData.name || 'unnamed'}-${formData.assessmentDate}.pdf`);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setSubmitStatus('Please enter your name before submitting.');
      return;
    }

    // Check for unanswered questions
    const totalItems = Object.values(sensoryCategories).reduce((sum, cat) => sum + cat.items.length, 0);
    const answeredItems = Object.values(formData.responses).filter(r => r.response).length;
    const unansweredCount = totalItems - answeredItems;

    if (unansweredCount > 0) {
      const unansweredItems = [];
      Object.entries(sensoryCategories).forEach(([key, category]) => {
        category.items.forEach((item, idx) => {
          const response = formData.responses[`${key}-${idx}`];
          if (!response || !response.response) {
            unansweredItems.push({
              system: category.title,
              item: item.text,
              categoryKey: key
            });
          }
        });
      });

      // Show detailed message about missing questions
      setSubmitStatus(
        `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. ` +
        `Please complete all questions before submitting. ` +
        `Check the following section${unansweredItems.length > 1 ? 's' : ''}: ${
          [...new Set(unansweredItems.map(i => i.system))].join(', ')
        }.`
      );

      // Scroll to first unanswered question
      if (unansweredItems.length > 0) {
        setActiveSection(unansweredItems[0].categoryKey);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
      return;
    }

    setSubmitStatus('Preparing to submit...');

    // Create mailto link
    const subject = `Sensory Assessment Submission - ${formData.name}`;
    let emailBody = `Assessment submitted by: ${formData.name}%0D%0A`;
    emailBody += `Date of Birth: ${formData.dob}%0D%0A`;
    emailBody += `Assessment Date: ${formData.assessmentDate}%0D%0A`;
    emailBody += `Completed By: ${formData.completedBy}%0D%0A%0D%0A`;

    let completedCount = 0;
    Object.values(formData.responses).forEach(r => {
      if (r.response) completedCount++;
    });

    emailBody += `Completed: ${completedCount} items%0D%0A%0D%0A`;
    emailBody += `Please see the attached assessment report.%0D%0A%0D%0A`;
    emailBody += `This is a private and confidential assessment.`;

    const mailtoLink = `mailto:nerdedi@windgap.org.au?subject=${encodeURIComponent(subject)}&body=${emailBody}`;

    window.location.href = mailtoLink;
    setSubmitStatus('Email client opened. Please attach the PDF report.');
    setTimeout(() => setSubmitStatus(''), 5000);
  };

  const getProgress = () => {
    const totalItems = Object.values(sensoryCategories).reduce((sum, cat) => sum + cat.items.length, 0);
    const completedItems = Object.values(formData.responses).filter(r => r.response).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  const calculateResults = () => {
    const results = {
      avoids: 0,
      seeks: 0,
      mixed: 0,
      neutral: 0
    };

    Object.values(formData.responses).forEach(response => {
      if (response.response && results.hasOwnProperty(response.response)) {
        results[response.response]++;
      }
    });

    return results;
  };

  const LegendModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Assessment Guide & Legend</h2>
            <button
              onClick={() => setShowLegend(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              aria-label="Close legend"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-6 max-h-96 overflow-y-auto">
            {/* Response Options */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Response Options
              </h3>
              <div className="space-y-2 pl-7">
                <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                  <p className="font-semibold text-red-900">Avoids</p>
                  <p className="text-sm text-red-800">You tend to avoid or minimize this sensory experience. You find it uncomfortable or overstimulating.</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                  <p className="font-semibold text-green-900">Seeks</p>
                  <p className="text-sm text-green-800">You actively seek out or prefer this sensory experience. You find it enjoyable and may seek more of it.</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
                  <p className="font-semibold text-amber-900">Mixed</p>
                  <p className="text-sm text-amber-800">Your response varies depending on context. Sometimes you seek it, sometimes you avoid it.</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-900">Neutral</p>
                  <p className="text-sm text-blue-800">This sensory experience doesn't strongly affect you in either direction.</p>
                </div>
              </div>
            </div>

            {/* Icons & Features */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                Interface Features
              </h3>
              <div className="space-y-2 pl-7">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Brain Icon
                  </div>
                  <p className="text-sm text-slate-700 mt-1">Click the brain icon to expand detailed guidance. This explains what each question explores and provides context for different responses.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Mic className="w-5 h-5 text-blue-600" />
                    Voice Button
                  </div>
                  <p className="text-sm text-slate-700 mt-1">Use voice-to-text to add notes about your responses. Click the microphone icon to start recording, speak your notes, and click again to stop.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Save className="w-5 h-5 text-green-600" />
                    Save Button
                  </div>
                  <p className="text-sm text-slate-700 mt-1">Saves your progress locally on this device. Your data is private and never sent to anyone until you submit.</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Download className="w-5 h-5 text-orange-600" />
                    Download Button
                  </div>
                  <p className="text-sm text-slate-700 mt-1">Generates a professional PDF report of your assessment including all responses, analysis, and personal information.</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-teal-600" />
                Tips for Completing
              </h3>
              <ul className="text-sm text-slate-700 space-y-1 pl-7 list-disc">
                <li>There are no "right" or "wrong" answers—be honest about your actual experiences</li>
                <li>Consider how you typically respond, not how you think you should respond</li>
                <li>Use notes to add context: when does this happen? in what situations?</li>
                <li>You can click a response again to deselect it if you change your mind</li>
                <li>Take breaks if needed—there are 131 items total</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResultsView = () => {
    const results = calculateResults();
    const total = results.avoids + results.seeks + results.mixed + results.neutral;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Assessment Summary</h2>
            <button
              onClick={() => setShowResults(false)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
              aria-label="Close results"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-8 max-h-96 overflow-y-auto">
            {/* Personal Info */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-800">Personal Information</h3>
              <p className="text-slate-600"><strong>Name:</strong> {formData.name || 'Not provided'}</p>
              <p className="text-slate-600"><strong>Date of Birth:</strong> {formData.dob || 'Not provided'}</p>
              <p className="text-slate-600"><strong>Assessment Date:</strong> {formData.assessmentDate}</p>
            </div>

            {/* Response Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">Response Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <div className="text-3xl font-bold text-red-600">{results.avoids}</div>
                  <div className="text-sm text-slate-600">Avoids</div>
                  <div className="text-xs text-slate-500 mt-1">{total > 0 ? Math.round((results.avoids / total) * 100) : 0}%</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="text-3xl font-bold text-green-600">{results.seeks}</div>
                  <div className="text-sm text-slate-600">Seeks</div>
                  <div className="text-xs text-slate-500 mt-1">{total > 0 ? Math.round((results.seeks / total) * 100) : 0}%</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <div className="text-3xl font-bold text-yellow-600">{results.mixed}</div>
                  <div className="text-sm text-slate-600">Mixed</div>
                  <div className="text-xs text-slate-500 mt-1">{total > 0 ? Math.round((results.mixed / total) * 100) : 0}%</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
                  <div className="text-3xl font-bold text-slate-600">{results.neutral}</div>
                  <div className="text-sm text-slate-600">Neutral</div>
                  <div className="text-xs text-slate-500 mt-1">{total > 0 ? Math.round((results.neutral / total) * 100) : 0}%</div>
                </div>
              </div>
            </div>

            {/* Sensory System Breakdown */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">By Sensory System</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(sensoryCategories).map(([key, category]) => {
                  const systemResponses = category.items.map((_, idx) => formData.responses[`${key}-${idx}`]?.response).filter(Boolean);
                  const avoidCount = systemResponses.filter(r => r === 'avoids').length;
                  const seekCount = systemResponses.filter(r => r === 'seeks').length;

                  return (
                    <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-slate-800">{category.icon} {category.title}</p>
                          <p className="text-xs text-slate-500">{systemResponses.length} responses</p>
                        </div>
                        <div className="text-right">
                          {avoidCount > 0 && <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-1">{avoidCount} Avoids</span>}
                          {seekCount > 0 && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{seekCount} Seeks</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 p-6 rounded-b-2xl border-t border-slate-200 flex gap-3">
            <button
              onClick={generatePDF}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => setShowResults(false)}
              className="flex-1 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showResults) {
    return <ResultsView />;
  }

  if (showLegend) {
    return <LegendModal />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-8">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-center mb-6">
            <img src="/windgap-logo.svg" alt="Windgap Foundation" className="h-16 sm:h-20 w-auto" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800 mb-2">
            Comprehensive Sensory Profile Assessment
          </h1>
          <p className="text-slate-600 font-light mb-6 text-sm sm:text-base">
            A Neuroaffirming Approach to Understanding Sensory Processing
          </p>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 border border-green-200 p-6 mb-6 rounded-xl shadow-sm">
            <div className="text-sm text-slate-700 leading-relaxed space-y-4">
              <div>
                <p className="text-base text-slate-800 mb-3 leading-relaxed">
                  This assessment is designed to help us understand the unique way your nervous system experiences the world around you. There are no right or wrong answers here, only honest reflections of your lived experience.
                </p>
                <p className="text-slate-700">
                  You'll explore eight sensory systems, noticing how different sensations feel to you in everyday life. Some experiences you might actively seek out, others you may prefer to avoid, and many will fall somewhere in between. All of these responses are valid and meaningful.
                </p>
              </div>
              <div className="border-t border-green-100 pt-4">
                <p className="text-slate-700 mb-2">
                  What makes this assessment different is its foundation in neurodiversity and acceptance. Rather than looking for what needs 'fixing', we're interested in understanding your sensory patterns so we can work <em>with</em> your nervous system, not against it.
                </p>
                <p className="text-slate-700">
                  Your responses will help create a personalised sensory profile, a guide that offers insight into your sensory preferences, practical strategies for daily life, and ways to honour your neurological needs. Think of it as a roadmap to understanding yourself better, and creating environments where you can truly thrive.
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 mt-4">
                <p className="text-sm text-slate-600 italic">
                  Take your time. Save your progress whenever you need a break.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter name"
                aria-label="Full name"
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="assessmentDate" className="block text-sm font-medium text-slate-700 mb-2">Assessment Date</label>
              <input
                id="assessmentDate"
                type="date"
                value={formData.assessmentDate}
                onChange={(e) => setFormData({...formData, assessmentDate: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="completedBy" className="block text-sm font-medium text-slate-700 mb-2">Completed By</label>
              <input
                id="completedBy"
                type="text"
                value={formData.completedBy}
                onChange={(e) => setFormData({...formData, completedBy: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-700 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              rows="3"
              placeholder="Any additional context that may be helpful..."
            />
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm text-slate-600 font-semibold">{getProgress()}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base font-medium"
              aria-label="Save progress"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base font-medium"
              aria-label="Download PDF report"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => setShowResults(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base font-medium"
              aria-label="View assessment summary"
            >
              <BarChart3 className="w-4 h-4" />
              Summary
            </button>
            <button
              onClick={() => setShowLegend(true)}
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base font-medium"
              aria-label="Show legend and guide"
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Legend</span>
              <span className="sm:hidden">?</span>
            </button>
          </div>

          {saveStatus && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {saveStatus}
            </div>
          )}

          {submitStatus && (
            <div className={`mt-4 p-3 rounded-lg text-sm flex items-start gap-2 ${
              submitStatus.includes('unanswered') || submitStatus.includes('Please enter')
                ? 'bg-amber-100 text-amber-900 border-2 border-amber-300'
                : 'bg-purple-100 text-purple-800'
            }`}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{submitStatus}</span>
            </div>
          )}
        </div>

        {/* Response Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Response Guide</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {responseOptions.map(option => (
              <div key={option.value} className={`p-4 rounded-lg border-2 ${option.color}`}>
                <div className="font-semibold mb-1 text-sm sm:text-base">{option.label}</div>
                <div className="text-xs mb-2">{option.description}</div>
                <div className="text-xs italic opacity-80">{option.example}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sensory Systems */}
        {Object.entries(sensoryCategories).map(([key, category]) => (
          <div key={key} className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
            <button
              onClick={() => setActiveSection(activeSection === key ? null : key)}
              className={`w-full p-4 sm:p-6 text-left ${category.color} border-l-4 transition-colors hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              aria-expanded={activeSection === key}
              aria-controls={`${key}-content`}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-medium text-slate-800 mb-1 flex items-center gap-3">
                    {category.iconPath && (
                      <img src={category.iconPath} alt="" className="w-8 h-8 sm:w-10 sm:h-10" aria-hidden="true" />
                    )}
                    <span>{category.title}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mb-1">{category.subtitle}</p>
                  <p className="text-xs text-slate-500">{category.description}</p>
                </div>
                {activeSection === key ? (
                  <ChevronUp className="w-6 h-6 text-slate-600 flex-shrink-0 ml-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-600 flex-shrink-0 ml-4" aria-hidden="true" />
                )}
              </div>
            </button>

            {activeSection === key && (
              <div id={`${key}-content`} className="p-4 sm:p-6 space-y-6">
                {category.items.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-200 pb-6 last:border-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className="text-slate-800 font-light leading-relaxed text-sm sm:text-base flex-1">{item.text}</p>
                      {item.guidance && (
                        <button
                          onClick={() => setExpandedGuidance(expandedGuidance === `${key}-${idx}` ? null : `${key}-${idx}`)}
                          className="flex-shrink-0 p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-colors"
                          title="Show detailed guidance for this item"
                          aria-label="Expand guidance"
                          aria-expanded={expandedGuidance === `${key}-${idx}`}
                        >
                          <Brain className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {expandedGuidance === `${key}-${idx}` && item.guidance && (
                      <div className="bg-purple-50 border-l-4 border-purple-400 p-3 rounded-r mb-3 text-sm text-slate-700 leading-relaxed">
                        <p><strong>Guidance:</strong> {item.guidance}</p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 mb-3 italic">Examples: {item.examples}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {responseOptions.map(option => {
                        const isSelected = formData.responses[`${key}-${idx}`]?.response === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleResponseChange(key, idx, option.value)}
                            className={`px-2 sm:px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              isSelected
                                ? option.activeColor
                                : option.color + ' hover:opacity-80'
                            }`}
                            title={`Click to select or deselect ${option.label}`}
                            aria-pressed={isSelected}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <textarea
                          value={formData.responses[`${key}-${idx}`]?.notes || ''}
                          onChange={(e) => handleNotesChange(key, idx, e.target.value)}
                          placeholder="Add notes (optional)..."
                          className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          rows="2"
                          aria-label={`Notes for ${item.text}`}
                        />
                        <button
                          onClick={() => toggleVoiceRecording(key, idx)}
                          className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isRecording && recordingNote === `${key}-${idx}`
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                          }`}
                          title="Click to record voice notes"
                          aria-label={`Voice ${isRecording && recordingNote === `${key}-${idx}` ? 'stop' : 'start'} recording`}
                        >
                          {isRecording && recordingNote === `${key}-${idx}` ? (
                            <>
                              <MicOff className="w-4 h-4" />
                              <span className="hidden sm:inline">Stop</span>
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4" />
                              <span className="hidden sm:inline">Voice</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Submit Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="text-center space-y-4">
            <p className="text-slate-700 italic leading-relaxed" style={{ fontFamily: "'Caveat', cursive", fontSize: "1.5rem", fontWeight: "600", letterSpacing: "0.5px" }}>
              "Appreciating sensory differences isn't about fixing what's broken, it's about
              recognising and supporting the beautiful way each nervous system experiences the world."
            </p>
            <p className="text-xs text-slate-500">
              Private & Confidential • Your responses are stored locally and only shared when you choose to submit
            </p>
            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              aria-label="Submit assessment to nerdedi@windgap.org.au"
            >
              Submit Assessment
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white rounded-2xl shadow-lg p-6 mt-6 text-center">
          <div className="text-sm text-slate-600 leading-relaxed">
            <p className="mb-1">© 2025 Windgap Foundation Limited. Inclusive Education All Rights Reserved.</p>
            <p className="text-xs text-slate-500">
              ABN: 14 050 095 077 | Charity Provider Number: 12834 | NDIS Provider Number: 4050003694
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SensoryAssessment;
