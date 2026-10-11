import type { Site } from './sites'

export type SiteCopy = Pick<Site, 'name' | 'alias' | 'dynasty' | 'year' | 'location' | 'tags' | 'intro' | 'monologue' | 'facts' | 'stats' | 'drama'>

/** English counterparts only; original dates, claims and Chinese narratives are preserved. */
export const englishSites: Record<string, SiteCopy> = {
  yingxian: {
    name: 'Wooden Pagoda of Yingxian', alias: 'Sakyamuni Pagoda of Fogong Temple', dynasty: 'Liao', year: '1056', location: 'Shanxi · Shuozhou · Yingxian',
    tags: ['Black Myth: Wukong location', 'World’s tallest wooden pagoda', 'Liao timber architecture'],
    intro: 'Built in 1056, the second year of the Liao dynasty’s Qingning era, this 67.31-metre pagoda is the tallest and oldest surviving multi-storey building made entirely of timber. It is celebrated alongside the Leaning Tower of Pisa and the Eiffel Tower as one of the world’s three remarkable towers. Not a single iron nail holds it together: 54 types of interlocking dougong bracket sets support the structure.',
    monologue: 'I am the Sakyamuni Pagoda. In 1056, Liao craftsmen called me out of a forest—three thousand cubic metres of Korean pine, without a single iron nail. They said I would not last a century. Yet I have counted nine hundred and sixty-nine seasons of wind and snow. Artillery bent my body; I leaned eleven degrees to the southeast, but I am still standing. I am waiting for you to look up at me again.',
    facts: [
      { title: 'A tower without nails', text: 'The pagoda contains 480 dougong bracket sets in 54 forms, earning it the name “a museum of dougong”. Their flexible joints have helped it survive repeated powerful earthquakes over nearly a thousand years.' },
      { title: 'Shellfire and misguided alterations', text: 'More than 200 shells struck the pagoda during warlord fighting in 1926. In the 1930s, local gentry removed its infilled walls and replaced them with lattice doors, weakening the structure and accelerating its lean.' },
      { title: 'Liang Sicheng’s astonishment', text: 'While surveying the pagoda in 1933, Liang Sicheng exclaimed that it was so magnificent it left him breathless. For decades afterwards, few dared undertake its restoration lightly.' },
    ],
    stats: [{ label: 'Height', value: '67.31 m' }, { label: 'Storeys', value: '5 visible; 9 in total' }, { label: 'Dougong brackets', value: '54 types / 480 sets' }, { label: 'Age', value: '969 years' }],
    drama: {
      title: 'I Have Counted 969 Seasons of Wind and Snow', logline: 'A wooden pagoda tells its own story: from Liao war beacons and Republican-era shellfire to you, looking up at it tonight.',
      scenes: [
        { no: '01', title: 'Lightning and Birth', visual: 'An aerial shot dives through Liao-era clouds. Lightning illuminates a forest of Korean pine. Amid sawing and mortise-cutting, the pagoda rises storey by storey.', vo: 'My name is Sakyamuni Pagoda. In 1056, the craftsmen of Liao built me—to watch the war beacons to the south, and to house two relics of the Buddha’s teeth.' },
        { no: '02', title: 'The Dance of Dougong', visual: 'A macro lens follows 54 kinds of dougong unfolding like layers of lotus petals. Close-ups show timber interlocking with timber; wind chimes ring softly.', vo: 'There is not one iron nail in my body. Fifty-four forms of dougong are fifty-four pairs of hands holding me up. When earthquakes come, they bend for me, release the force, and stand straight again.' },
        { no: '03', title: 'Shellfire and the Lean', visual: 'Black-and-white footage: smoke in 1926, shells grazing the eaves, wood splintering. The pagoda slowly leans towards the southeast.', vo: 'In the fifteenth year of the Republic, more than two hundred shells tore through my body. I bent eleven degrees—like an injured elder who refuses to fall.' },
        { no: '04', title: 'An Appointment Across the Centuries', visual: 'A time-lapse passes from day to night, leaving the pagoda silhouetted against the stars. Young visitors raise their phones; screen light falls across their faces.', vo: 'Nine hundred and sixty-nine years. I have counted hundreds of seasons of wind and snow, and seen countless palms joined in prayer. Now I am waiting for you—to look up at me again.' },
      ],
    },
  },
  foguang: {
    name: 'East Main Hall of Foguang Temple', alias: 'China’s foremost national treasure', dynasty: 'Tang', year: '857', location: 'Shanxi · Xinzhou · Wutai County',
    tags: ['Tang timber architecture', 'Liang Sicheng and Lin Huiyin', 'Black Myth: Wukong location'],
    intro: 'Built in 857, the eleventh year of the Tang dynasty’s Dazhong era, this is China’s largest and most completely preserved surviving Tang timber building. In 1937, guided by murals at Dunhuang, Liang Sicheng and Lin Huiyin identified it, overturning the claim by Japanese scholars that no Tang timber architecture survived in China.',
    monologue: 'I am the East Main Hall. In July 1937, four people rode donkeys for two days along mountain paths to find me. The scholar named Lin discovered a small inscription on my main beam: “Ning Gongyu, the female lay disciple from the Upper Capital who provided offerings for this Buddha hall.” She spoke a name from eleven centuries earlier into the world again. Five days later, gunfire sounded at the Marco Polo Bridge. They recorded me in their drawings, then stepped into the war.',
    facts: [
      { title: 'Overturning a claim', text: 'Japanese scholar Sekino Tadashi had claimed that no Tang timber buildings remained in China and that one must visit Japan to see them. The identification of Foguang Temple’s East Main Hall overturned that claim.' },
      { title: 'A name on the beam', text: 'Lin Huiyin, who was farsighted, faintly noticed writing on a beam. Cleaning revealed the name of the female lay disciple Ning Gongyu, matching the inscription on a stone sutra pillar and establishing the hall’s date.' },
      { title: 'Four Tang treasures in one', text: 'The hall preserves Tang architecture, sculpture, murals and inscriptions together. Liang Sicheng called it “China’s foremost national treasure”.' },
    ],
    stats: [{ label: 'Width', value: '7 bays' }, { label: 'Bracket system', value: '7-puzuo dougong' }, { label: 'Identification', value: '1937' }, { label: 'Age', value: '1,168 years' }],
  },
  yungang: {
    name: 'Yungang Grottoes', alias: 'Cave temples of Mount Wuzhou', dynasty: 'Northern Wei', year: '460', location: 'Shanxi · Datong', tags: ['UNESCO World Heritage', 'Northern Wei imperial grottoes'],
    intro: 'Excavation began in 460, the first year of the Northern Wei dynasty’s Heping era, and continued for more than 60 years. Today, 45 principal caves and over 59,000 sculptures survive. The great Buddhas in the Five Caves of Tanyao were modelled on Northern Wei emperors. This was China’s first major state-sponsored grotto complex.',
    monologue: 'I was once a cliff face on Mount Wuzhou. Fifteen centuries ago, the monk Tanyao came to me with tens of thousands of craftsmen. They carved the faces of five emperors into the stone, along with Xianbei horsemen, Gandharan art from India, and the robes of the Central Plains. Stone has no memory of its own. With so many hands carving, I became a book of history.',
    facts: [
      { title: 'The emperor as Buddha', text: 'The five great Buddhas in Tanyao’s caves, numbered 16–20, correspond to five Northern Wei emperors. Their imperial likenesses united Buddhist imagery with royal authority.' },
      { title: 'The Music Cave', text: 'Cave 12 depicts celestial musicians with more than 40 instruments of 14 types. Known as the “Music Cave”, it preserves a Northern Wei court concert in stone.' },
      { title: 'An unexpected restoration story', text: 'Glass eyes were once inserted into the great Buddhas to bring their gaze to life. They were removed during recent restoration: the original unadorned eyes looked calmly into the distance.' },
    ],
    stats: [{ label: 'Principal caves', value: '45' }, { label: 'Sculptures', value: '59,000+' }, { label: 'Excavation period', value: '60+ years' }, { label: 'World Heritage', value: '2001' }],
  },
  xuankong: {
    name: 'Hanging Temple', alias: 'Xuankong Pavilion', dynasty: 'Northern Wei', year: 'c. 491', location: 'Shanxi · Datong · Hunyuan County', tags: ['Mount Heng’s celebrated wonder', 'Three traditions in one temple'],
    intro: 'Built in the late Northern Wei period, the temple hangs halfway up Cuiping Peak in Mount Heng’s Jinlong Gorge, around 50 metres above the ground. Its 40 halls and pavilions rest on cantilevered beams embedded in the cliff, supported by the rock. Celebrated among the world’s ten most precarious buildings, it is also a rare temple bringing Buddhism, Taoism and Confucianism together.',
    monologue: 'People say I hang in mid-air, held up by a dozen or so wooden posts. Those upright timbers usually bear no load. What really holds me is the horizontal beams driven deep into the cliff, like wedges in stone. For fifteen hundred years, visitors have looked up and drawn a sharp breath. That breath is the reason I am here.',
    facts: [
      { title: 'A structural illusion', text: 'The apparently load-bearing posts can actually move. The real supports are hemlock beams embedded for two-thirds of their length into the cliff—the traditional “half-inserted flying beams” that form the foundation.' },
      { title: 'The Hall of Three Teachings', text: 'The hall enshrines Sakyamuni, Laozi and Confucius together. The Hanging Temple is the only surviving elevated timber temple combining these three traditions.' },
      { title: 'Poets and travellers', text: 'Legend says Li Bai inscribed “Magnificent” on the cliff after his visit. The traveller Xu Xiake called it “a great wonder under heaven”.' },
    ],
    stats: [{ label: 'Above the valley', value: 'Approx. 50 m' }, { label: 'Halls and pavilions', value: '40' }, { label: 'Recognition', value: 'Among the world’s ten most precarious buildings' }, { label: 'Age', value: '1,530+ years' }],
  },
  hengshan: {
    name: 'Mount Heng', alias: 'Northern pillar of earth and heaven', dynasty: 'Landscape', year: 'Centuries of sacred-mountain rites', location: 'Shanxi · Datong · Hunyuan', tags: ['Northern Great Mountain', 'Home of the Hanging Temple', 'A celebrated mountain beyond the frontier'],
    intro: 'The northern member of China’s Five Great Mountains, Mount Heng rises to 2,016.1 metres at Tianfeng Peak. Commanding the northern frontier, it has long been a strategic passage and sacred place. The Hanging Temple clings to Cuiping Peak, while ancient Hunyuan lies below—a mountain worthy of the title “northern pillar of earth and heaven”.',
    monologue: 'I am the quietest of the Five Great Mountains. Hua is steep, Tai revered, the southern Heng graceful, and Song profound. I have guarded the wind and snow beyond Yanmen Pass for four thousand years. Emperors travelled far to honour me, carving “Northern Great Mountain” stroke by stroke into stone. I lent half a cliff to a small temple, too, so people could look up in wonder for fifteen hundred years. Suspended, yet firmly held—that is my character.',
    facts: [
      { title: 'Rites of the Northern Mountain', text: 'Since Emperor Xuan of Han formally established the Five Great Mountains’ sacrificial system, Heng has held the northern position. During the Ming and Qing periods, the temple used for royal rites to the northern mountain stood at its foot.' },
      { title: 'A borrowed cliff', text: 'The Hanging Temple occupies a cliff on Mount Heng’s Cuiping Peak. The mountain shelters it from floods and strong sunshine—a loan lasting fifteen hundred years.' },
      { title: 'Traces of Zhang Guolao', text: 'Legend places the immortal Zhang Guolao’s spiritual practice here. Guolao Ridge and marks said to be his donkey’s hoofprints remain; many of Mount Heng’s eighteen celebrated sights are associated with him.' },
    ],
    stats: [{ label: 'Tianfeng Peak', value: '2,016.1 m' }, { label: 'Status', value: 'Northern Great Mountain' }, { label: 'Ritual history', value: '2,000+ years' }, { label: 'Renown', value: 'Northern pillar of heaven · Frontier mountain' }],
  },
  jinci: {
    name: 'Jinci Temple', alias: 'Shrine of Tang Shuyu', dynasty: 'Northern Song', year: '1023–1032', location: 'Shanxi · Taiyuan', tags: ['Song timber architecture', 'Three wonders and three treasures', 'Taiyuan’s origins'],
    intro: 'Built to honour Tang Shuyu, the founding lord of Jin, Jinci is China’s earliest surviving royal ancestral temple garden. The Hall of the Holy Mother exemplifies Song architecture. Its 43 painted attendant figures seem to tell a lifetime’s story with each expression, while the Flying Bridge over the Fish Pond is China’s earliest surviving ancient cross-shaped bridge.',
    monologue: 'I witnessed the afternoon when a paulownia leaf became a promise. A leaf was cut into the shape of a jade tablet; a playful remark founded a state. Later came the Hall of the Holy Mother, Nanlao Spring, the Zhou cypress and Tang locust tree. People from Taiyuan visit me at festivals, calling me “the source of Jinyang”. A city began with a game, but its memories have been taken seriously for three thousand years.',
    facts: [
      { title: 'Flying Bridge over the Fish Pond', text: 'China’s only surviving ancient cross-shaped bridge has a level east–west deck and north–south arms sloping like a bird’s wings. Liang Sicheng discussed it in his study of Qing construction methods.' },
      { title: 'The attendants’ eyes', text: 'The 43 Song painted attendants each have a distinct expression. Mei Lanfang once stayed for three days to study the gaze of a figure known for its contrasting expressions.' },
      { title: 'Nanlao Spring', text: 'Its name, “Never-Aging Spring”, comes from a blessing in the Book of Songs. The water stays at 17°C. Li Bai wrote that the streams of Jinci were like green jade.' },
    ],
    stats: [{ label: 'Holy Mother Hall width', value: '7 bays' }, { label: 'Song painted figures', value: '43' }, { label: 'Zhou cypress age', value: 'Approx. 3,000 years' }, { label: 'Garden area', value: '1,696 mu (approx. 113 ha)' }],
  },
  shuanglin: {
    name: 'Shuanglin Temple', alias: 'A treasury of painted sculpture', dynasty: 'Ming', year: 'Founded in Northern Qi; rebuilt in Ming', location: 'Shanxi · Jinzhong · Pingyao', tags: ['Black Myth: Wukong location', 'Treasury of Eastern painted sculpture', 'UNESCO World Heritage'],
    intro: 'Founded in the Northern Qi period, the temple preserves 2,052 painted sculptures dating from the Song to the Ming dynasties. It is acclaimed as a treasury of Eastern painted sculpture. The Thousand-Armed Guanyin is serene and dignified, while the Weituo guardian, often called the “Eastern David”, unites a fierce gaze with a twisting waist—strength and suppleness at their height.',
    monologue: 'Pingyao’s draft banks closed, and its escort agencies ceased work. Only after the old city became a World Heritage site did people follow the six-kilometre dirt road to find me. I had waited a long time, guarding more than two thousand painted figures. General Weituo has stood on one leg for six hundred years, his armour bright as new. You call him the “Eastern David”. But David’s anger comes nowhere near his tenderness.',
    facts: [
      { title: 'The peerless Weituo', text: 'The guardian twists in an S-shaped pose, balanced on one foot. Celebrated as the finest Weituo sculpture, its sense of movement has been compared favourably with contemporary Western sculpture.' },
      { title: 'Thousand-Armed Guanyin', text: 'Twenty-six arms each hold a ritual implement. The figure’s full, dignified features make it one of Shuanglin Temple’s greatest sculptures.' },
      { title: 'Walls of suspended sculpture', text: 'Five hundred bodhisattvas occupy five or six tiers across the walls of the Thousand Buddha Hall. Their robes seem still to float among the clouds.' },
    ],
    stats: [{ label: 'Painted sculptures', value: '2,052' }, { label: 'Halls', value: '10' }, { label: 'Founded', value: 'Northern Qi' }, { label: 'World Heritage', value: '1997 (with Pingyao)' }],
  },
  xiaoxitian: {
    name: 'Xiaoxitian, Xi County', alias: 'Thousand Buddha Hermitage', dynasty: 'Ming', year: '1634', location: 'Shanxi · Linfen · Xi County', tags: ['Black Myth: Wukong location', 'Masterpiece of suspended sculpture'],
    intro: 'Built in 1634, the seventh year of the Ming dynasty’s Chongzhen era, its Great Buddha Hall contains over 1,900 suspended sculptures. From three metres tall to finger-sized, they fill the space with a three-dimensional Buddhist Pure Land. Its appearance in Black Myth: Wukong, associated with the line “Before the future Buddha, why do you not bow?”, made it a widely celebrated destination.',
    monologue: 'I have stood on Phoenix Mountain for four hundred years. Craftsmen shaped the whole Western Pure Land and suspended it from my beams, columns and walls—nineteen hundred painted figures, without an empty inch of wall. Last autumn, a group of game makers came. Later, the whole world heard those words: “Before the future Buddha, why do you not bow?”',
    facts: [
      { title: 'A hall filled with suspended sculpture', text: 'More than 1,900 sculptures cover the hall’s beams, columns and walls. The smallest are thumb-sized; gilded robe folds still gleam after four hundred years.' },
      { title: 'Why “Little Western Heaven”?', text: 'The name refers to its panoramic depiction of the Western Pure Land, once paired with a separate “Greater Western Heaven”. That larger site was destroyed, leaving Xiaoxitian as a unique survivor.' },
      { title: 'The Black Myth effect', text: 'As a reference location for Black Myth: Wukong, it saw visitor numbers multiply in 2024. For the first time, this small mountain temple needed visitor limits.' },
    ],
    stats: [{ label: 'Suspended sculptures', value: '1,900+' }, { label: 'Largest figure', value: '3.2 m' }, { label: 'Smallest figure', value: 'Thumb-sized' }, { label: 'Age', value: '391 years' }],
  },
  yonglegong: {
    name: 'Yongle Palace', alias: 'Palace of Great Pure Yang and Longevity', dynasty: 'Yuan', year: '1247–1358', location: 'Shanxi · Yuncheng · Ruicheng', tags: ['Masterpiece of Yuan murals', 'An extraordinary heritage relocation'],
    intro: 'Built in honour of the Taoist immortal Lü Dongbin, its four Yuan halls preserve 1,005 square metres of murals. In the Assembly of the Immortals, 290 deities pay homage to the Celestial Worthy of the Primordial Beginning—a pinnacle of ancient Chinese figure painting. Beginning in 1959, construction of the Sanmenxia reservoir prompted the palace to be dismantled, numbered and relocated 25 kilometres, an extraordinary feat of heritage conservation.',
    monologue: 'Sixty-six years ago, people thought I would sink beneath the Yellow River. So they cut, numbered and packed every wall, carrying me from Yongle town to a new home twenty-five kilometres away, as though moving a dream. All 290 immortals arrived; not one was left behind. The Assembly of the Immortals you see today was lifted back into place by countless pairs of hands.',
    facts: [
      { title: 'Assembly of the Immortals', text: 'Across a total length of 97 metres, 290 deities stand over two metres tall, their robes and ribbons flowing as if in the wind. The work is celebrated as a crowning achievement of Eastern art.' },
      { title: 'Relocating an entire palace', text: 'From 1959 to 1964, the murals were cut into sections, moved and reassembled without an established precedent. The project became a textbook example of heritage relocation.' },
      { title: 'Everyday life in the murals', text: 'The outer walls of the Three Pure Ones Hall retain artists’ inscriptions and scenes of ordinary life. Even a fish seller’s everyday trade is preserved in full.' },
    ],
    stats: [{ label: 'Mural area', value: '1,005 m²' }, { label: 'Deities in the assembly', value: '290' }, { label: 'Relocation distance', value: '25 km' }, { label: 'Painting period', value: '110+ years' }],
  },
  wutaishan: {
    name: 'Temple Complex of Mount Wutai', alias: 'Mount of Clear Coolness', dynasty: 'Northern Wei', year: 'Founded in the Northern Wei period', location: 'Shanxi · Xinzhou · Wutai County', tags: ['UNESCO World Heritage', 'Foremost of the Four Sacred Buddhist Mountains'],
    intro: 'Foremost among China’s Four Sacred Buddhist Mountains, Wutai is the sacred seat of Manjusri. Temple building began in the Northern Wei period; more than 300 monasteries stood at its height, and 47 survive. Xiantong Temple’s bronze hall, Tayuan Temple’s great white stupa and Pusa Ding’s glazed roofs together form a three-dimensional history of Han Chinese and Tibetan Buddhist architecture.',
    monologue: 'People call me the Mount of Clear Coolness. My five plateau summits are like five open palms, cradling nineteen hundred years of devotion. The Mount Wutai mural at Dunhuang shows how I once looked. Northern Wei emperors came, Tang princesses came, and the Qianlong Emperor returned again and again. They did more than worship the Buddha: they asked a mountain how faith could outlive a dynasty.',
    facts: [
      { title: 'A sacred mountain in a mural', text: 'The Mount Wutai mural in Cave 61 of Dunhuang’s Mogao Caves is a large work from the Five Dynasties period. Liang Sicheng followed its clues to find Foguang Temple.' },
      { title: 'The Great White Stupa', text: 'Tayuan Temple’s 56.4-metre white stupa houses a stupa associated with Ashoka’s relics. A symbol of Mount Wutai, it was rebuilt with Nepalese craftsmen during the Yuan dynasty’s Dade era and records exchanges between Buddhist traditions.' },
      { title: 'The bronze hall', text: 'Cast in the Ming dynasty’s Wanli era using 100,000 jin of bronze, Xiantong Temple’s hall contains walls covered with ten thousand small Buddha figures. It is one of China’s largest surviving bronze halls.' },
    ],
    stats: [{ label: 'Surviving monasteries', value: '47' }, { label: 'North Terrace elevation', value: '3,061 m' }, { label: 'World Heritage', value: '2009' }, { label: 'Temple-building history', value: '1,900+ years' }],
  },
  yanmenguan: {
    name: 'Yanmen Pass', alias: 'China’s foremost mountain pass', dynasty: 'Ming', year: 'Surviving fortress · Ming', location: 'Shanxi · Xinzhou · Dai County', tags: ['China’s foremost pass', 'Great Wall stronghold'],
    intro: '“Of the nine great frontier passes, Yanmen comes first.” From King Wuling of Zhao’s adoption of nomadic dress and mounted archery, through the campaigns of Li Guang, Wei Qing and Huo Qubing against the Xiongnu, to the Yang family generals guarding the three passes, this gateway has witnessed three thousand years of warfare and marriage diplomacy.',
    monologue: 'Wild geese flying south cross my ridge, so people call me Yanmen—the Gate of Geese. Every brick in my walls has heard horses’ hooves. Li Guang hunted a tiger here, Yang Ye shed his blood here, and Wang Zhaojun turned back for one last look. For three thousand years, dynasties promised to guard me forever. In the end, only the mountain wind remained.',
    facts: [
      { title: 'Home ground of the Yang generals', text: 'The Northern Song general Yang Ye defended Yanmen. His defeat of a vast Liao force with only a few thousand cavalry helped inspire the folk legends of the Yang family generals.' },
      { title: 'Zhaojun’s last glance', text: 'Legend says Wang Zhaojun looked back towards Chang’an at Yanmen on her journey to a diplomatic marriage, playing her pipa. The lament associated with her spread thereafter.' },
      { title: 'Three millennia of conflict', text: 'A pass was established here by Zhao during the Warring States period. Historical records describe more than a thousand engagements, making it one of China’s most frequently contested gateways.' },
    ],
    stats: [{ label: 'Title', value: 'China’s foremost pass' }, { label: 'History as a pass', value: '3,000+ years' }, { label: 'Surviving fortress', value: 'Ming dynasty' }, { label: 'Elevation', value: 'Approx. 1,800 m' }],
  },
  niangziguan: {
    name: 'Niangzi Pass', alias: 'The Great Wall’s ninth pass', dynasty: 'Ming', year: 'Surviving fortress · 1542', location: 'Shanxi · Yangquan · Pingding County', tags: ['The ninth pass under heaven', 'Homes above flowing springs'],
    intro: 'Named for the Tang dynasty’s Princess Pingyang and the army she commanded here, the surviving fortress was built in 1542, the twenty-first year of the Ming dynasty’s Jiajing era. Springs rush below it, creating homes above flowing water. Deep in the Taihang Mountains, this formidable gateway unites strength with gentleness.',
    monologue: 'Other passes bear the names of generals; I bear a princess’s. Thirteen hundred years ago, Princess Pingyang and her army guarded this place, shielding half of Emperor Gaozu’s realm. People remembered her name and gave it to me as well. Later came springs, waterfalls and villages above the water. When the clash of swords faded, I became the gentlest of mighty passes.',
    facts: [
      { title: 'Named for a princess', text: 'Princess Pingyang, daughter of the founding Tang emperor, is said to have stationed her army of tens of thousands at Weize Pass. It was renamed Niangzi Pass, a rare tribute to a woman among Great Wall gateways.' },
      { title: 'Homes above water', text: 'In the village below the pass, streams and springs run through every household. Houses stand above spring outlets, earning the area the name “the Jiangnan of the north”.' },
      { title: 'A century-old station', text: 'The Zhengtai railway, opened in 1906, established a station below the pass. Still in use, it is a living record of Shanxi’s railway industry.' },
    ],
    stats: [{ label: 'Namesake', value: 'Princess Pingyang · Tang' }, { label: 'Fortress built', value: '1542' }, { label: 'Title', value: 'The ninth pass under heaven' }, { label: 'Railway station opened', value: '1906' }],
  },
  qiaojia: {
    name: 'Qiao Family Compound', alias: 'Zaizhong Hall', dynasty: 'Qing', year: '1756', location: 'Shanxi · Jinzhong · Qi County', tags: ['Shanxi merchant residence', 'A jewel of northern domestic architecture'],
    intro: 'The residence of Qing-era Shanxi merchant Qiao Zhiyong was founded in the twentieth year of the Qianlong era. Its plan resembles the Chinese double-happiness character, with six major courtyards, twenty smaller ones and 313 rooms. Exquisite brick, wood and stone carvings have earned it the reputation of a jewel of northern residential architecture.',
    monologue: 'My master Qiao Zhiyong once hoped to sit the imperial examinations. Only when his family faced hardship did he take up the abacus. He laid down rules: no concubines, no mistreatment of servants, no gambling. His draft banks later served the whole country, yet he stayed in this double-happiness-shaped compound. People say, “For imperial palaces, see the Forbidden City; for private homes, see the Qiaos.” The palace reveals an empire. Here, you see a family’s self-discipline.',
    facts: [
      { title: 'The double-happiness plan', text: 'Seen from above, the compound resembles the double-happiness character. Six large courtyards contain twenty smaller ones, preserving an unusually complete northern residential layout.' },
      { title: 'A gift from Empress Dowager Cixi', text: 'When Cixi fled west through Qi County in 1900, the Qiao family received her. Gifts including the Nine-Dragon Lantern remain among the compound’s treasured objects.' },
      { title: 'A familiar setting on screen', text: 'Dozens of films and television dramas, including Raise the Red Lantern and Qiao’s Grand Courtyard, used the compound as a location, making it a symbol of Shanxi merchant culture.' },
    ],
    stats: [{ label: 'Rooms', value: '313' }, { label: 'Area', value: '10,642 m²' }, { label: 'Founded', value: 'Qianlong era, year 20 · Qing' }, { label: 'Renown', value: 'A model of the Chinese private residence' }],
  },
  huangcheng: {
    name: 'House of the Huangcheng Chancellor', alias: 'Wuting Mountain Village', dynasty: 'Qing', year: 'Late Ming–early Qing', location: 'Shanxi · Jincheng · Yangcheng County', tags: ['Home of an imperial tutor', 'Residence of a distinguished scholarly family'],
    intro: 'This was the home of Chen Tingjing, a grand secretary of the Wenyuan Pavilion under the Qing Kangxi Emperor and chief editor of the Kangxi Dictionary. Inner and outer fortified compounds follow the hillside, overlooked by the seven-storey Heshan Tower. Kangxi stayed here twice. The residence is celebrated as northern China’s foremost home of a great scholarly family.',
    monologue: 'Chen Tingjing worked on the Kangxi Dictionary in my study for six years, and the Kangxi Emperor stayed in my courtyards twice. People call me “Huangcheng”—Imperial City—though I was only a family home. Nine jinshi degree-holders and six Hanlin scholars gave this house the bearing of a court. The seven-storey Heshan Tower sheltered the lives of an entire village during war.',
    facts: [
      { title: 'Two imperial visits', text: 'The Kangxi Emperor stayed with the Chen family twice during his southern tours and bestowed a plaque reading “Wuting Mountain Village”. These visits gave the residence its imperial name.' },
      { title: 'Heshan Tower', text: 'This seven-storey, 23-metre tower was built in the late Ming to resist raiders. A well and grain mill inside allowed the whole village to shelter for extended periods.' },
      { title: 'Nine jinshi in one family', text: 'Across the Ming and Qing periods, the Chen family produced nine jinshi examination graduates and six Hanlin scholars. An imperial couplet praising their achievements still hangs above the residence.' },
    ],
    stats: [{ label: 'Courtyards', value: '16' }, { label: 'Area', value: '36,580 m²' }, { label: 'Heshan Tower', value: '7 storeys · 23 m' }, { label: 'Kangxi’s stays', value: 'Twice' }],
  },
  guandimiao: {
    name: 'Guandi Temple, Xiezhou', alias: 'Ancestral temple of Guan Yu', dynasty: 'Qing', year: 'Surviving buildings · Qing Kangxi era', location: 'Shanxi · Yuncheng · Yanhu District', tags: ['Guan Yu’s hometown', 'Ancestral temple of Guan Yu'],
    intro: 'Xiezhou, Guan Yu’s hometown, houses the world’s largest and highest-ranking temple dedicated to him. Founded in 589, the ninth year of the Sui dynasty’s Kaihuang era, its surviving buildings were largely reconstructed under Qing Emperor Kangxi. It is recognised as the ancestral temple of more than 30,000 Guandi temples worldwide.',
    monologue: 'There are more than thirty thousand temples to Guan Yu, from Osaka to San Francisco, but their incense traditions trace back to me. Guan Yunchang was the boy from Xiezhou I watched grow up. People honour more than his blade: they honour loyalty and righteousness. Eighteen hundred years on, those two principles stand more firmly than any temple.',
    facts: [
      { title: 'Ancestor of thousands of temples', text: 'More than 30,000 Guandi temples exist worldwide. Because of its age and scale, Xiezhou is revered as their ancestral martial temple, attracting worshippers from China and abroad every year.' },
      { title: 'Suspended columns', text: 'On the second floor of the Spring and Autumn Pavilion, corridor columns hang above the floor, supported entirely by cantilever beams. This suspended-beam, hanging-column structure is a unique surviving example in China.' },
      { title: 'Reborn after fire', text: 'A fire in the forty-first year of Kangxi’s reign destroyed the temple. Reconstruction to its original form took ten years; many buildings seen today date from that rebuilding.' },
    ],
    stats: [{ label: 'Founded', value: 'Sui · 589' }, { label: 'Area', value: '220,000 m²' }, { label: 'Global Guandi temples', value: 'Ancestral temple of 30,000+' }, { label: 'Spring and Autumn Pavilion', value: 'Unique suspended-column structure' }],
  },
  hukou: {
    name: 'Hukou Waterfall', alias: 'Heart of the Yellow River', dynasty: 'Landscape', year: 'Quaternary period to the present', location: 'Shanxi · Linfen · Ji County', tags: ['Yellow River wonder', 'World’s largest yellow waterfall'],
    intro: 'Here, the Yellow River abruptly narrows from 300 metres to 30 metres, thundering into a rock channel more than 20 metres deep—as though a thousand miles of river were gathered into a kettle. The world’s largest yellow waterfall has become a vivid embodiment of the Chinese national spirit.',
    monologue: 'For a thousand li, I travelled slowly across the Loess Plateau. At Hukou, the earth drew its shoulders together, squeezing me into a rock channel thirty metres wide. Then I would leap. Across countless ages, year after year and day after day, I have turned a curtain of water into thunder. In 1938, a poet named Guang Weiran saw me as he crossed the Yellow River. Later, he wrote the words of the Yellow River Cantata.',
    facts: [
      { title: 'The Ten-Li Dragon Channel', text: 'Below the waterfall, the Yellow River has cut a rock channel ten li long and barely more than thirty metres wide. It is known as the “Ten-Li Dragon Channel”.' },
      { title: 'The Yellow River Cantata', text: 'In 1938, Guang Weiran passed Hukou while crossing the Yellow River. The waterfall inspired his poem; Xian Xinghai set it to music, creating the Yellow River Cantata.' },
      { title: 'A wonder in every season', text: 'Summer brings mist rising from the water, autumn rainbows play above the falls, and winter turns the cascade into silver ice. Hukou wears a different face in every season.' },
    ],
    stats: [{ label: 'River narrows', value: '300 m → 30 m' }, { label: 'Drop', value: '20+ m' }, { label: 'Status', value: 'World’s largest yellow waterfall' }, { label: 'Dragon Channel length', value: '10 li (approx. 5 km)' }],
  },
}
