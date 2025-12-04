import React, { useState, useEffect } from 'react';
import { Download, Save, Send, ChevronDown, ChevronUp, Info } from 'lucide-react';

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
  const [sendStatus, setSendStatus] = useState('');

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
      items: [
        {
          text: "Light, unexpected touch on skin",
          examples: "clothing tags, someone brushing past you in a queue, light tap on shoulder, hair touching your face, sleeping partner accidentally touching you"
        },
        {
          text: "Deep pressure touch and firm contact",
          examples: "tight hugs, massage, weighted blankets, firm handshakes, compression clothing, leaning against walls or furniture"
        },
        {
          text: "Exploring various textures with hands",
          examples: "petting animals, fabric shopping, handling paperwork, craft materials, touching produce at the grocery store, fidget toys"
        },
        {
          text: "Temperature variations and thermal input",
          examples: "hot coffee vs iced drinks, seasonal weather changes, hot showers, cold swimming pools, air conditioning, touching cold metal"
        },
        {
          text: "Grooming and self-care activities",
          examples: "hair brushing/washing, nail trimming, shaving, face washing, teeth brushing, applying makeup, skin care routines"
        },
        {
          text: "Getting hands, face, or body 'messy' or sticky",
          examples: "cooking with sticky ingredients, gardening, applying lotion, hand sanitizer, sweaty palms, food on face while eating"
        },
        {
          text: "Contact with water on skin",
          examples: "daily showers, swimming, washing dishes, rain on skin, splashing from tap, humid environments"
        },
        {
          text: "Drying off after water exposure",
          examples: "towel drying after shower, using hand dryers in public restrooms, air drying, changing from wet to dry clothes after rain or exercise"
        },
        {
          text: "Clothing textures, fit, and sensations",
          examples: "seams in socks, tight waistbands, scratchy wool, fitted vs loose clothing, bra straps, collars, tags in shirts, new vs worn-in clothes"
        },
        {
          text: "Walking barefoot on different surfaces",
          examples: "carpet at home, cold tiles, grass in the yard, sand at beach, rough concrete, smooth wood floors, gravel"
        },
        {
          text: "Sitting or lying on various surface textures",
          examples: "leather vs fabric couch, office chairs, different bed sheets, car seats, outdoor furniture, yoga mats, beach towels"
        },
        {
          text: "Physical proximity to others and incidental touch in social situations",
          examples: "crowded trains/buses, standing in queues, sitting close in movie theaters, dancing, handshakes or hugs in greetings, sitting close to partner"
        }
      ]
    },
    proprioceptive: {
      title: "Proprioceptive System",
      subtitle: "Body Position & Force Awareness",
      description: "Sensing body position, movement, and force through muscles, joints, and connective tissue.",
      color: "bg-green-50 border-green-200",
      items: [
        {
          text: "Heavy work activities requiring significant effort",
          examples: "pushing heavy shopping trolleys, moving furniture, carrying groceries from car, pushing revolving doors, lifting heavy packages"
        },
        {
          text: "Resistive activities using muscle strength",
          examples: "opening tight jar lids, using manual can openers, pulling stuck drawers, opening heavy doors, rock climbing, lifting weights at gym"
        },
        {
          text: "Deep pressure or compression input",
          examples: "tight hugs from loved ones, wearing compression socks/clothing, being under heavy duvets, squeezing into tight spaces like airplane seats"
        },
        {
          text: "Eating crunchy foods that provide strong oral input",
          examples: "raw carrots, apples, nuts, chips/crisps, crusty bread, ice cubes, hard candy, pretzels, celery"
        },
        {
          text: "Impact activities providing joint compression",
          examples: "jumping on trampoline, stomping while walking, clapping enthusiastically, running/jogging, jumping off curbs, dance workouts"
        },
        {
          text: "Sustained physical effort and endurance activities",
          examples: "long walks, hiking, swimming laps, cycling to work, marathon cleaning sessions, gardening, physical labor jobs"
        },
        {
          text: "Fine motor tasks requiring graded force control",
          examples: "handwriting, typing, buttoning shirts, using scissors, threading needles, assembling flat-pack furniture, using tweezers"
        },
        {
          text: "Activities requiring body awareness without visual input",
          examples: "navigating your home in the dark, knowing where your feet are while driving, reaching for items behind you, getting dressed under covers"
        },
        {
          text: "Stretching, yoga, or body positioning activities",
          examples: "morning stretches, yoga classes, pilates, sitting cross-legged, reaching to scratch your back, stretching at desk"
        },
        {
          text: "Carrying or wearing weighted items",
          examples: "backpack with laptop, weighted blanket, carrying shopping bags, wearing heavy winter coat, ankle/wrist weights during exercise"
        }
      ]
    },
    vestibular: {
      title: "Vestibular System",
      subtitle: "Movement, Balance & Spatial Orientation",
      description: "Processing movement, gravity, head position, and spatial orientation through the inner ear.",
      color: "bg-purple-50 border-purple-200",
      items: [
        {
          text: "Linear movement in straight lines",
          examples: "swinging on park swings, lift/elevator rides, train travel, rocking chairs, being pushed in wheelchair, sliding down slides"
        },
        {
          text: "Rotational or spinning movement",
          examples: "spinning in office chair, merry-go-rounds, rolling down hills, doing cartwheels, dancing with turns, revolving doors"
        },
        {
          text: "Being moved passively by others",
          examples: "being rocked, carried, pushed in wheelchair, dentist chair recline, massage table adjustments, partner moving you while dancing"
        },
        {
          text: "Active self-initiated movement through space",
          examples: "running for the bus, dancing freely, skipping, jumping, walking briskly, playing sports, aerobic exercise classes"
        },
        {
          text: "Changes in head position from upright",
          examples: "bending over bathroom sink, looking up at tall buildings, lying down from sitting, reaching down to tie shoes, looking under furniture"
        },
        {
          text: "Having head tilted or upside down",
          examples: "doing somersaults, hanging upside down, headstands, yoga inversions, washing hair in salon sink, looking between your legs"
        },
        {
          text: "Activities challenging balance",
          examples: "walking on ice, standing on one foot to put on shoes, riding bicycle, using scooter, ice skating, balancing on curb, yoga balance poses"
        },
        {
          text: "Being up high or at heights",
          examples: "looking down from office building, standing on ladders, looking over balcony railings, climbing observation towers, glass floor attractions"
        },
        {
          text: "Climbing up or descending down",
          examples: "using stairs at work, climbing ladders, walking up/down hills, escalators, getting in/out of vehicles, steep streets"
        },
        {
          text: "Fast or sudden movements and speed changes",
          examples: "running then stopping quickly, someone pulling out in front of your car, sudden direction changes while walking, emergency braking"
        },
        {
          text: "Walking or playing on unstable surfaces",
          examples: "deep carpet, grass, sand, gravel paths, walking on mattress, trampolines, bouncy castles, boats on water"
        },
        {
          text: "Vehicle movement and transportation",
          examples: "car rides as passenger, buses, trains, boats, aeroplane travel, roller coasters, cable cars, ferries"
        },
        {
          text: "Activities combining multiple movement types simultaneously",
          examples: "dancing with turns and jumps, sports requiring running and coordination, driving while turning corners, walking while looking at phone"
        }
      ]
    },
    auditory: {
      title: "Auditory System",
      subtitle: "Sound Processing & Auditory Discrimination",
      description: "Processing, filtering, localising, and interpreting sounds through the ears and auditory pathways.",
      color: "bg-yellow-50 border-yellow-200",
      items: [
        {
          text: "Loud or sudden unexpected sounds",
          examples: "sirens, fire alarms, hand dryers in restrooms, balloons popping, dogs barking, doors slamming, car horns, dropped dishes"
        },
        {
          text: "Background noise in busy environments",
          examples: "restaurants during peak hours, shopping centres, office open-plan spaces, parties, busy streets, airports, gyms"
        },
        {
          text: "Overlapping or competing sounds",
          examples: "multiple conversations at dinner party, TV on while people talk, conference calls with background noise, busy coffee shops"
        },
        {
          text: "High-pitched sounds",
          examples: "children squealing, certain voices, smoke alarms beeping, whistles, tea kettles, squeaky brakes, dentist drill"
        },
        {
          text: "Low-pitched or bass sounds",
          examples: "trucks passing, thunder, bass-heavy music, car engines, construction equipment, deep voices, airplane engines"
        },
        {
          text: "Volume preferences for music, television, and media",
          examples: "preferred volume levels at home, in car, wearing headphones; partner saying it's too loud/quiet"
        },
        {
          text: "Following verbal instructions when background noise is present",
          examples: "listening to GPS in noisy car, hearing waiter in busy restaurant, phone calls in public, work meetings with AC noise"
        },
        {
          text: "Repetitive or monotonous sounds",
          examples: "ticking clocks, humming refrigerator, buzzing lights, dripping taps, neighbor's music through walls, office printer"
        },
        {
          text: "Participating in social conversations with turn-taking and listening",
          examples: "dinner conversations, work meetings, phone calls, catching up with friends, family gatherings, networking events"
        },
        {
          text: "Speaking or being spoken to amid other sounds or voices",
          examples: "having conversation while TV is on, talking at parties, phone calls in public, drive-through ordering"
        },
        {
          text: "Echoing environments",
          examples: "swimming pools, gymnasiums, underground car parks, empty halls, bathrooms with tile walls, shopping center atriums"
        },
        {
          text: "Games or activities with rapid verbal instructions",
          examples: "following recipe videos, GPS navigation while driving, exercise classes, online tutorials, fast-paced meetings"
        },
        {
          text: "Singing, music-making, or vocal expression",
          examples: "singing in shower, humming while working, karaoke, singing along to radio in car, choir, musical instruments"
        },
        {
          text: "Unfamiliar sounds, accents, or languages",
          examples: "traveling abroad, new workplace sounds, regional accents, foreign language conversations, new neighborhood noises"
        },
        {
          text: "Quiet or very low sound environments",
          examples: "libraries, meditation spaces, sleeping in silent room, early morning quiet, waiting rooms, empty offices after hours"
        }
      ]
    },
    visual: {
      title: "Visual System",
      subtitle: "Sight Processing & Visual Perception",
      description: "Processing visual information including light, colour, pattern, movement, and spatial relationships.",
      color: "bg-indigo-50 border-indigo-200",
      items: [
        {
          text: "Bright lights or intense sunlight",
          examples: "fluorescent office lighting, camera flash, bright sunshine, car headlights at night, LED screens, bright shop displays"
        },
        {
          text: "Dim lighting, shadows, or darkness",
          examples: "romantic restaurant lighting, driving at dusk, shadows in parking garages, dimly lit bars, candlelight, early morning darkness"
        },
        {
          text: "Visually 'busy' or cluttered environments",
          examples: "crowded shops with displays, messy desks, patterned wallpaper, toy-scattered rooms, busy websites, cluttered kitchen counters"
        },
        {
          text: "Visual patterns, stripes, or high-contrast designs",
          examples: "striped clothing, patterned carpets, geometric designs, zebra crossings, tiled floors, checkered patterns"
        },
        {
          text: "Moving or spinning visual stimuli",
          examples: "ceiling fans, fidget spinners, windmills, flowing water, traffic passing, leaves blowing, crowds moving"
        },
        {
          text: "Shiny, reflective, or sparkly objects and surfaces",
          examples: "glitter, sequins, mirrors, polished floors, jewelry, metallic surfaces, car chrome, wet pavement reflections"
        },
        {
          text: "Eye-hand coordination tasks",
          examples: "catching thrown items, handwriting, typing, threading needles, using utensils while eating, cutting with scissors, playing sports"
        },
        {
          text: "Visual tracking of moving objects",
          examples: "following balls in sports, watching cars pass, tracking people walking by, following subtitles on screen, watching birds"
        },
        {
          text: "Visual discrimination and analysis",
          examples: "jigsaw puzzles, finding your car in parking lot, spot-the-difference games, proofreading documents, finding items on shelf"
        },
        {
          text: "Activities requiring colour, shape, and size differentiation",
          examples: "matching socks, organizing files by color, selecting produce, choosing outfits, sorting items, reading maps"
        },
        {
          text: "Reading and sustained visual attention to text",
          examples: "reading books, reading emails/documents, following recipes, reading road signs, scrolling social media"
        },
        {
          text: "Finding specific objects in visually complex environments",
          examples: "finding keys in handbag, locating items in full fridge, finding specific book on shelf, spotting friend in crowd"
        },
        {
          text: "Screen time activities",
          examples: "working on computer, watching TV, using smartphone, video gaming, tablets, video calls, streaming content"
        },
        {
          text: "Fast-paced or action-packed visual media",
          examples: "action movies, sports on TV, video games, fast-cutting advertisements, quick social media scrolling, news tickers"
        },
        {
          text: "New or novel visual experiences",
          examples: "kaleidoscopes, 3D movies, VR headsets, colored glasses, art installations, light shows, new environments"
        },
        {
          text: "Making eye contact during social interactions",
          examples: "job interviews, conversations with colleagues, dating, presentations, talking with strangers, video calls, networking"
        }
      ]
    },
    gustatory: {
      title: "Gustatory System",
      subtitle: "Taste & Oral Flavour Processing",
      description: "Processing tastes and flavours through taste buds and oral sensory receptors.",
      color: "bg-pink-50 border-pink-200",
      items: [
        {
          text: "Strong or intense flavours",
          examples: "very spicy curries, sour candies, bitter coffee, salty chips, very sweet desserts, hot sauce, strong cheese, pickles"
        },
        {
          text: "Bland or mild-flavoured foods",
          examples: "plain rice, white bread, plain pasta, chicken without seasoning, mild cheese, plain yogurt, potatoes"
        },
        {
          text: "Trying new or unfamiliar foods and flavours",
          examples: "ordering unknown dishes at restaurants, trying international cuisines, sampling at markets, experimenting with recipes"
        },
        {
          text: "Eating familiar and preferred foods consistently",
          examples: "ordering same meal at restaurant, eating same breakfast daily, preferred brands, comfort foods, safe meals"
        },
        {
          text: "Mixed or complex flavours in combined dishes",
          examples: "casseroles, stews, mixed salads, stir-fries, curries, pasta with multiple ingredients, complex sauces"
        },
        {
          text: "Single, unmixed flavours presented separately",
          examples: "deconstructed meals, foods kept separate on plate, plain proteins, individual side dishes, unmixed ingredients"
        },
        {
          text: "Temperature of foods and drinks",
          examples: "hot coffee vs iced coffee, preference for room temperature water, hot soup vs cold soup, warm vs cold sandwiches"
        },
        {
          text: "Specific taste categories",
          examples: "sweet desserts, salty snacks, sour citrus, bitter dark chocolate, umami/savory broths, preference for certain taste profiles"
        },
        {
          text: "Strong-tasting condiments and sauces",
          examples: "tomato sauce, mustard, vinegar, soy sauce, hot sauce, BBQ sauce, mayonnaise, relish, chutney"
        },
        {
          text: "Exploring taste through mouthing non-food objects",
          examples: "chewing pen caps, biting nails, chewing straws, mouthing jewelry, licking fingers, tasting hair"
        }
      ]
    },
    olfactory: {
      title: "Olfactory System",
      subtitle: "Smell & Scent Processing",
      description: "Processing scents and odours through nasal passages and olfactory receptors.",
      color: "bg-teal-50 border-teal-200",
      items: [
        {
          text: "Strong or intense odours",
          examples: "perfume/cologne, petrol stations, cleaning products, paint fumes, air fresheners, strong chemicals, nail polish"
        },
        {
          text: "Food smells and cooking aromas",
          examples: "baking bread, frying onions, strong spices like curry, fish cooking, garlic, coffee brewing, burnt toast"
        },
        {
          text: "Natural outdoor scents",
          examples: "flowers in bloom, fresh cut grass, ocean air, rain smell, bushland eucalyptus, pine trees, earth after rain"
        },
        {
          text: "Body odours",
          examples: "sweat, breath smells, deodorant, others' perfume/cologne in close quarters, gym smells, hair products"
        },
        {
          text: "Unfamiliar or novel scents in new environments",
          examples: "new car smell, hotel rooms, new workplace, someone else's home, visiting different countries, new buildings"
        },
        {
          text: "Seeking to smell non-food items",
          examples: "smelling new books, fabric/clothing, people/partners, pets, fresh laundry, gasoline, markers, play-dough"
        },
        {
          text: "Environmental odours",
          examples: "car exhaust, cigarette smoke, industrial smells, garbage bins, public transport smells, city air quality"
        },
        {
          text: "Subtle or faint scents",
          examples: "light perfumes, mild soap, fresh air, clean laundry, subtle essential oils, barely-there fragrances"
        },
        {
          text: "Artificial fragrances",
          examples: "scented candles, air fresheners in cars, perfumed laundry products, scented hand sanitizer, room sprays"
        },
        {
          text: "Smells associated with specific places",
          examples: "doctor's surgery antiseptic smell, school corridor smell, swimming pool chlorine, dentist office, hospital smell"
        }
      ]
    },
    interoceptive: {
      title: "Interoceptive System",
      subtitle: "Internal Body Signals & States",
      description: "Sensing and interpreting internal body signals, sensations, and physiological states.",
      color: "bg-orange-50 border-orange-200",
      items: [
        {
          text: "Hunger signals and recognising when the body needs food",
          examples: "stomach rumbling, low energy, irritability, light-headedness, knowing when you've skipped a meal, appetite cues"
        },
        {
          text: "Fullness or satiation cues after eating a meal",
          examples: "knowing when to stop eating, feeling 'stuffed', comfortable fullness, recognising you've had enough"
        },
        {
          text: "Thirst and recognising need for hydration",
          examples: "dry mouth, parched feeling, headache from dehydration, knowing you need water, craving fluids"
        },
        {
          text: "Bladder urgency and signals to urinate",
          examples: "feeling 'I need to go now', moderate urge, mild awareness of full bladder, urgency sensations"
        },
        {
          text: "Bowel signals and recognising need for toileting",
          examples: "stomach cramps indicating need, urgency awareness, regular patterns, discomfort before bowel movement"
        },
        {
          text: "Digestive sensations",
          examples: "stomach gurgling, gas, bloating after meals, cramping, nausea, indigestion, 'upset stomach' feeling"
        },
        {
          text: "Body temperature regulation",
          examples: "recognising feeling too hot and need to remove layers, shivering when cold, sweating, flushed face, chills"
        },
        {
          text: "Heart rate awareness",
          examples: "noticing heartbeat during exercise, racing heart when anxious, pounding chest, awareness of pulse, heart fluttering"
        },
        {
          text: "Breathing sensations and respiratory awareness",
          examples: "shortness of breath after stairs, needing deep breath, breathing changes when anxious, noticing breath pace"
        },
        {
          text: "Muscle tension, tightness, or soreness in body",
          examples: "tight shoulders from stress, sore legs after exercise, neck tension, back ache, jaw clenching, muscle fatigue"
        },
        {
          text: "Pain signals and discomfort recognition",
          examples: "headaches, body aches, injury pain, chronic pain awareness, toothache, menstrual cramps, joint pain"
        },
        {
          text: "Fatigue and energy level awareness",
          examples: "recognising tiredness, exhaustion, need for rest, energy dips during day, feeling drained, needing sleep"
        },
        {
          text: "Emotions felt as physical sensations",
          examples: "butterflies when nervous, chest tightness when anxious, warmth when happy, heaviness when sad, tension when angry"
        },
        {
          text: "Itch or tickle sensations on skin",
          examples: "noticing mosquito bite, dry skin itchiness, tickle prompting scratch, irritation awareness, allergic reactions"
        },
        {
          text: "Dizziness, lightheadedness, or feeling faint",
          examples: "standing up too quickly, room spinning, unsteady feeling, near-fainting sensation, vertigo"
        },
        {
          text: "Sleep and wake signals",
          examples: "feeling sleepy at night, recognising need for sleep, waking refreshed or groggy, drowsiness, alertness levels"
        },
        {
          text: "Sexual arousal or related physical sensations",
          examples: "recognising arousal cues, physical responses, awareness of desires, body's sexual responses"
        },
        {
          text: "Menstrual cycle-related sensations",
          examples: "cramping, bloating, breast tenderness, hormonal shifts, ovulation awareness, PMS symptoms, cycle patterns"
        },
        {
          text: "Changes in body state during stress or emotional dysregulation",
          examples: "panic attack physical symptoms, shutdown numbness, hypervigilance body tension, freeze response, overwhelm sensations"
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
      activeColor: 'bg-red-600 text-white shadow-md'
    },
    {
      value: 'seeks',
      label: 'SEEKS',
      description: 'Actively pursues or shows preference',
      example: 'e.g., Requests massage, turns up music, seeks spicy food',
      color: 'bg-green-100 border-green-300 text-green-800',
      activeColor: 'bg-green-600 text-white shadow-md'
    },
    {
      value: 'mixed',
      label: 'MIXED',
      description: 'Response varies by context or state',
      example: 'e.g., Enjoys touch when calm, avoids when stressed',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
      activeColor: 'bg-yellow-600 text-white shadow-md'
    },
    {
      value: 'neutral',
      label: 'NEUTRAL',
      description: 'No strong preference either way',
      example: 'e.g., Can take it or leave it, doesn\'t notice much',
      color: 'bg-slate-100 border-slate-300 text-slate-800',
      activeColor: 'bg-slate-600 text-white shadow-md'
    }
  ];

  const handleResponseChange = (category, itemIndex, value) => {
    setFormData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [`${category}-${itemIndex}`]: {
          ...prev.responses[`${category}-${itemIndex}`],
          response: value
        }
      }
    }));
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

  const handleSave = () => {
    localStorage.setItem('sensoryAssessment', JSON.stringify(formData));
    setSaveStatus('Assessment saved successfully!');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const generateReport = () => {
    let content = `COMPREHENSIVE SENSORY PROFILE ASSESSMENT\nA Neuroaffirming Approach to Understanding Sensory Processing\n\n`;
    content += `Name: ${formData.name}\n`;
    content += `Date of Birth: ${formData.dob}\n`;
    content += `Assessment Date: ${formData.assessmentDate}\n`;
    content += `Completed By: ${formData.completedBy}\n`;
    if (formData.additionalInfo) {
      content += `Additional Information: ${formData.additionalInfo}\n`;
    }
    content += `\n${'='.repeat(80)}\n\n`;

    Object.entries(sensoryCategories).forEach(([key, category]) => {
      content += `${category.title.toUpperCase()}\n`;
      content += `${category.subtitle}\n`;
      content += `${'-'.repeat(80)}\n\n`;

      category.items.forEach((item, idx) => {
        const response = formData.responses[`${key}-${idx}`];
        content += `${idx + 1}. ${item.text}\n`;
        content += `   Examples: ${item.examples}\n`;
        content += `   Response: ${response?.response?.toUpperCase() || 'Not answered'}\n`;
        if (response?.notes) {
          content += `   Notes: ${response.notes}\n`;
        }
        content += `\n`;
      });
      content += `\n`;
    });

    return content;
  };

  const handleDownload = () => {
    const content = generateReport();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sensory-assessment-${formData.name || 'unnamed'}-${formData.assessmentDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendEmail = () => {
    setSendStatus('Preparing to send...');

    // Generate email content
    let emailBody = `Comprehensive Sensory Profile Assessment%0D%0A%0D%0A`;
    emailBody += `Name: ${formData.name}%0D%0A`;
    emailBody += `Date of Birth: ${formData.dob}%0D%0A`;
    emailBody += `Assessment Date: ${formData.assessmentDate}%0D%0A`;
    emailBody += `Completed By: ${formData.completedBy}%0D%0A`;
    if (formData.additionalInfo) {
      emailBody += `Additional Information: ${formData.additionalInfo}%0D%0A`;
    }
    emailBody += `%0D%0A`;

    let completedCount = 0;
    Object.values(formData.responses).forEach(r => {
      if (r.response) completedCount++;
    });

    emailBody += `%0D%0ACompleted: ${completedCount} items%0D%0A%0D%0A`;
    emailBody += `Please see attached assessment results.`;

    const subject = `Sensory Assessment - ${formData.name || 'Unnamed'} - ${formData.assessmentDate}`;
    const mailtoLink = `mailto:natalie.erdedi@gmail.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;

    window.location.href = mailtoLink;
    setSendStatus('Email client opened. Please attach the downloaded assessment file.');
    setTimeout(() => setSendStatus(''), 5000);
  };

  const getProgress = () => {
    const totalItems = Object.values(sensoryCategories).reduce((sum, cat) => sum + cat.items.length, 0);
    const completedItems = Object.values(formData.responses).filter(r => r.response).length;
    return Math.round((completedItems / totalItems) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-light text-slate-800 mb-2">
            Comprehensive Sensory Profile Assessment
          </h1>
          <p className="text-slate-600 font-light mb-6">
            A Neuroaffirming Approach to Understanding Sensory Processing
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-slate-700 leading-relaxed">
                <p className="mb-2">
                  This assessment explores eight sensory systems through a lens of curiosity, acceptance,
                  and neurodiversity-affirmation. Every individual has unique sensory preferences that
                  reflect how their nervous system processes the world.
                </p>
                <p className="font-medium text-slate-800">
                  Understanding these patterns helps create environments and strategies that honour
                  sensory needs rather than pathologising natural neurological differences.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Assessment Date</label>
              <input
                type="date"
                value={formData.assessmentDate}
                onChange={(e) => setFormData({...formData, assessmentDate: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Completed By</label>
              <input
                type="text"
                value={formData.completedBy}
                onChange={(e) => setFormData({...formData, completedBy: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              rows="3"
              placeholder="Any additional context that may be helpful..."
            />
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">Progress</span>
              <span className="text-sm text-slate-600">{getProgress()}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Progress
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
            <button
              onClick={handleSendEmail}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send to Natalie
            </button>
          </div>

          {saveStatus && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
              {saveStatus}
            </div>
          )}

          {sendStatus && (
            <div className="mt-4 p-3 bg-purple-100 text-purple-800 rounded-lg text-sm">
              {sendStatus}
            </div>
          )}
        </div>

        {/* Response Guide */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Response Guide</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {responseOptions.map(option => (
              <div key={option.value} className={`p-4 rounded-lg border-2 ${option.color}`}>
                <div className="font-semibold mb-1">{option.label}</div>
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
              className={`w-full p-6 text-left ${category.color} border-l-4 transition-colors hover:bg-opacity-80`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-medium text-slate-800 mb-1">
                    {category.title}
                  </h2>
                  <p className="text-sm text-slate-600 mb-1">{category.subtitle}</p>
                  <p className="text-xs text-slate-500">{category.description}</p>
                </div>
                {activeSection === key ? (
                  <ChevronUp className="w-6 h-6 text-slate-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-slate-600" />
                )}
              </div>
            </button>

            {activeSection === key && (
              <div className="p-6 space-y-6">
                {category.items.map((item, idx) => (
                  <div key={idx} className="border-b border-slate-200 pb-6 last:border-0">
                    <p className="text-slate-800 mb-1 font-light leading-relaxed">{item.text}</p>
                    <p className="text-xs text-slate-500 mb-3 italic">Examples: {item.examples}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                      {responseOptions.map(option => {
                        const isSelected = formData.responses[`${key}-${idx}`]?.response === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleResponseChange(key, idx, option.value)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 ${
                              isSelected
                                ? option.activeColor
                                : option.color + ' hover:opacity-80'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>

                    <textarea
                      value={formData.responses[`${key}-${idx}`]?.notes || ''}
                      onChange={(e) => handleNotesChange(key, idx, e.target.value)}
                      placeholder="Add notes (optional)..."
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      rows="2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer Note */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-slate-600 italic mb-4 leading-relaxed">
              "Honouring sensory differences isn't about fixing what's broken—it's about
              recognising and supporting the unique way each nervous system experiences the world."
            </p>
            <p className="text-xs text-slate-500">
              Private & Confidential • Your responses are stored locally and only shared when you choose to send them
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensoryAssessment;
