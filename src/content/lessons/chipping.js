export default {
  slug: 'chipping',
  number: 6,
  title: 'Chipping',
  kicker: 'Short game',
  tagline: 'A putt with loft, landed on a spot.',
  summary: 'Learn the chip as a lofted putting stroke, pick a landing spot every time, and use carry-to-roll ratios to choose the club that gets the ball rolling soonest.',
  duration: '25 min',
  level: 'Beginner to Intermediate',
  hero: {
    image: 'chipping',
    stats: [
      { label: 'Weight at address', value: '65–70% lead side' },
      { label: 'Ball position', value: 'Back of centre' },
      { label: '8-iron carry to roll', value: 'About 1 : 4' },
    ],
  },
  sections: [
    {
      id: 'a-putt-with-loft',
      heading: 'The chip is a putt with loft',
      body: [
        "A chip is the shot you hit when the ball is just off the green and nothing stands between it and the hole but short grass. Its job is not to fly; its job is to get onto the putting surface as early as possible and then roll like a putt, because a rolling ball is far easier to predict than a flying one. Think of the chip as a putt that needs a little loft to hop over the fringe. The stroke is a putting stroke, the read is a putting read, and the target is a landing spot, not the hole.",
        "That mindset changes what good technique looks like. A putt has no wrist hinge, no weight shift and no attempt to lift the ball, and neither does a chip. You will not be generating speed, so nothing in the setup needs to be athletic; everything is arranged so the club can brush the grass just past the ball and send it away low and rolling. Most golfers chip badly because they try to help the ball into the air. The loft on the club does that. You do not.",
      ],
      keyPoints: [
        'A chip lands early and rolls; a pitch flies most of the way.',
        'Read it like a putt, aim at a landing spot, let the roll finish the job.',
        'No hinge, no lift: the loft on the club gets the ball airborne.',
      ],
    },
    {
      id: 'setup',
      heading: 'Setup: everything forward',
      body: [
        "Bring your feet close together, heels no more than a few inches apart, and pull the lead foot back slightly so your hips are a touch open and can see the target. Put 65 to 70 percent of your weight on the lead foot and leave it there for the whole stroke. Play the ball an inch or two back of centre, roughly opposite the inside of your trail foot, and set your hands ahead of the ball so they sit in front of your lead thigh. The shaft now leans toward the target by 10 to 15 degrees. Left-handers mirror everything in this lesson.",
        "Grip down to the bottom of the handle, even onto the steel if the club is long, and stand closer to the ball than you would for a full shot so the shaft is more upright and the heel of the club sits slightly off the ground. That toe-down lie makes the club behave like a putter: less sole on the grass to snag, and a face that swings straight through rather than around you. Hold the club with your putting grip if you like; many good chippers do. Keep the pressure light and the arms soft, hanging from relaxed shoulders.",
      ],
      keyPoints: [
        'Heels a few inches apart, lead foot pulled back slightly.',
        'Weight 65–70% on the lead foot, and it never moves.',
        'Ball back of centre, hands ahead of the lead thigh, shaft leaning 10–15°.',
        'Grip down, stand close, heel of the club slightly off the ground.',
      ],
      callout: {
        title: 'Check',
        text: 'Look down at address: a line from your lead shoulder through your hands should reach the ground in front of the ball. If your hands are behind that line, you are set up to scoop before you have moved.',
      },
    },
    {
      id: 'the-stroke',
      heading: 'The stroke: shoulders rock, chest turns, club accelerates',
      body: [
        "Move the club away with your shoulders, keeping the triangle formed by your arms and chest intact, exactly as you would for a long putt. The wrists stay quiet; a hint of softness is fine, but you should never feel them consciously hinge or, worse, unhinge. The backswing is short, hardly longer than the putting stroke you would use for the same total distance. Then let your chest turn through toward the target so the club is pulled through impact by the body and the hands stay ahead of the clubhead all the way to the finish.",
        "The low point sits just in front of the ball, so the club strikes the ball first and then brushes the grass. You get that low point from the setup, not from trying: weight forward, hands ahead, and a chest that keeps turning so the arms never stall and flip. Accelerate through the ball. The follow-through should be at least as long as the backswing, with the clubhead staying low to the ground and the face still looking at the target. A finish that stops abruptly means the club slowed into the ball, and a decelerating club is the root of both the chunk and the blade.",
        "Tempo is unhurried but never lazy. Count *one* on the way back and *two* through impact, matching the rhythm you would use for a 20-foot putt. Distance comes from the length of the stroke and the club you choose, never from a harder hit. If you find yourself swinging faster for a longer chip, you have the wrong club in your hands.",
      ],
      keyPoints: [
        'Shoulders rock the triangle back, wrists quiet, backswing short.',
        'Chest turns through; hands lead the clubhead into the finish.',
        'Follow-through at least as long as the backswing, clubhead low.',
        'Same tempo for every chip; change the club or stroke length, not the speed.',
      ],
      module: {
        type: 'swing-viewer',
        preset: { club: 'chip', camera: 'face-on' },
        caption: 'Scrub slowly through impact from face-on. The hands stay ahead of the clubhead, the shaft keeps its forward lean, and the follow-through outlasts the backswing.',
      },
    },
    {
      id: 'landing-spot',
      heading: 'Pick a landing spot, then use the ratios',
      body: [
        "Never aim a chip at the hole. Aim at a landing spot, a patch of green about a yard past the fringe where the ball will take its first bounce on a surface you can trust. Walk to it, look at it, and picture the roll from there to the hole exactly as you would read a putt. The fringe and the rough bounce unpredictably; the green does not. Once the spot is chosen, the only question left is which club carries to that spot and then rolls the rest of the way.",
        "With the shaft leaning forward and the same putting-style stroke, each club produces a predictable ratio of carry to roll. The classic guide is the **rule of 12**: subtract the club number from twelve and you have the parts of roll for each one part of carry. An 8-iron rolls about four parts for every one it carries; a pitching wedge, counted as a 10, rolls about two to one; a sand wedge, counted as an 11, is roughly one to one. So a chip needing 5 yards of carry and 20 of roll wants an 8-iron; 10 and 10 asks for a sand wedge.",
        "Treat the ratios as a starting point, not a law. A fast, firm green or a downhill run stretches every roll number; a slow, soft or uphill green shrinks it. Your own delivery matters too: more shaft lean turns a 9-iron into an 8-iron, and a ball that sits down in the grass comes out lower and hotter. Calibrate on the practice green by chipping three clubs to the same landing spot and watching where each finishes, then adjust the rule of 12 until it becomes your own rule.",
      ],
      keyPoints: [
        'Land the ball about a yard onto the green, never on the fringe.',
        'Rule of 12: club number from twelve gives the parts of roll per one part of carry.',
        '8-iron about 1:4, pitching wedge about 1:2, sand wedge about 1:1.',
        'Faster, firmer or downhill greens add roll; slow, soft or uphill greens remove it.',
      ],
      module: {
        type: 'chip-calc',
        preset: { club: '9-iron' },
        caption: 'Move the landing spot and switch clubs to see how carry and roll trade off. Start with the 9-iron, then compare the 7-iron and the sand wedge from the same spot.',
      },
    },
    {
      id: 'club-selection',
      heading: 'Club selection: the least loft that lands on the green',
      body: [
        "The guiding principle is simple: use the **lowest lofted club that will still land the ball on the green**. Loft adds air time, and air time adds error, because a ball in the air is affected by the strike, the spin and the lie in ways a rolling ball is not. A 7-iron that lands a yard on and rolls 20 yards to the hole is a far easier shot than a lob wedge that has to fly 18 yards and stop in two. Most chips you face have plenty of green to work with; give yourself permission to use a mid-iron.",
        "Add loft only when the situation demands it: a short-sided pin with little green to land on, a downhill run that would send an 8-iron chip racing past, rough or a bank between you and the green, or a ball that must stop within a few paces. Even then, take the least loft that solves the problem. Work through the decision the same way every time: find the landing spot, estimate the carry and the roll, pick the club whose ratio fits, and then rehearse a stroke of the right length beside the ball while looking at the spot.",
      ],
      keyPoints: [
        'Lowest loft that lands on the green; more loft is more error.',
        'Add loft only for short-sided pins, downhill runs, rough or a bank in the way.',
        'Routine: landing spot, carry and roll, club by ratio, rehearse while looking at the spot.',
      ],
      callout: {
        title: 'One club or many?',
        text: 'Some players chip everything with one wedge and vary the landing spot; others change club and keep the stroke identical. The second approach is easier to learn and easier to repeat under pressure, because the stroke never has to change. Learn it first, and add variety later.',
      },
    },
    {
      id: 'lies-and-slopes',
      heading: 'Reading the lie: tight, fluffy, uphill, downhill',
      body: [
        "On a **tight lie**, where the ball sits on bare or closely mown turf, the margin between ball and ground has vanished, so the club must strike the ball cleanly or nothing. Keep the shaft lean moderate rather than extreme, because a heavily delofted face raises the trailing edge and lets the leading edge dig if the strike is a fraction early. Choose a less lofted club, a 7- or 8-iron, keep weight firmly forward, and make sure the follow-through stays low. Some players even chip a hybrid from these lies: the wide sole cannot dig, and the ball rolls like a putt.",
        "A **fluffy lie**, with the ball sitting up on top of the grass, looks like a gift and is a trap. If you ground the club it sinks into the grass beneath the ball, and the stroke then passes under the ball, catching it high on the face and sending it a few feet. Hover the club level with the ball at address, grip a fraction higher on the handle to match, keep the stroke shallow, and expect less spin and more roll than usual. From fluffy grass a sand wedge behaves more like a pitching wedge in the ratios.",
        "On slopes, tilt your shoulders to match the ground and swing along it. An **uphill** lie adds loft to the club and the slope stops the roll, so take a club or two with less loft, expect the ball to fly higher and shorter, and swing with a little more length. A **downhill** lie subtracts loft and the ground sends the ball running, so take more loft, play the ball a touch further back, keep your weight down the slope, and chase the clubhead down the hill after the ball. Whatever the slope, keep the landing spot on the green and let the ratios do the rest.",
      ],
      keyPoints: [
        'Tight lie: moderate shaft lean, less loft, weight forward, low follow-through.',
        'Fluffy lie: hover the club, shallow stroke, expect more roll.',
        'Uphill adds loft and kills roll: less loft, more length.',
        'Downhill removes loft and adds run: more loft, weight down the slope.',
      ],
    },
    {
      id: 'bump-and-run',
      heading: 'The bump and run, and the routine that ties it together',
      body: [
        "The bump and run is the chip taken to its logical end: a 7-iron or 8-iron from just off the green or from 20 to 40 yards of firm fairway, with the ball flying a small fraction of the distance and rolling the rest. It is one of the highest percentage shots in golf when the ground between you and the hole is short grass, because almost nothing can go badly wrong. Set up exactly as for a chip, ball back, hands ahead, weight forward, and make a slightly longer putting stroke. The ball comes off low, takes two skips and rolls like a putt.",
        "Reach for it into the wind, on firm or links-style ground, on an uphill approach with the whole green to work with, and any time your lofted chipping has felt fragile that day. Read it as one long putt: judge the pace of the green, allow for the break over the last two thirds of the roll, and pick a landing spot a yard onto the green as usual. The only thing to avoid is a landing spot in long grass or on a slope, where the first bounce becomes a guess.",
        "Whatever chip you choose, run the same routine. Read the lie first, because it may take some clubs out of your hands. Find the landing spot and read the roll from there like a putt. Choose the club by ratio, then take two rehearsal strokes beside the ball while looking at the landing spot, feeling the length that carries to it. Step in, settle 70 percent of your weight on the lead foot, glance once at the spot, and stroke it with a finish longer than the backswing. Judge the result by the landing spot you hit, not by where the ball stopped.",
      ],
      keyPoints: [
        'Bump and run: 7- or 8-iron, chip setup, slightly longer putting stroke.',
        'Best into wind, on firm ground, uphill, or with green to spare.',
        'Judge every chip by whether it hit the landing spot.',
      ],
    },
  ],
  faults: [
    {
      name: 'Chunk',
      symptom: 'The club digs behind the ball, the ball hops a few feet and the divot is behind where the ball was.',
      cause: 'The low point has moved behind the ball, most often because weight sits on the trail foot or the wrists unhinge early and the clubhead overtakes the hands.',
      fix: 'Set 70 percent of your weight on the lead foot with the hands ahead of the lead thigh, and rehearse brushing the grass an inch in front of the ball three times before each chip.',
    },
    {
      name: 'Blade',
      symptom: 'The leading edge catches the middle of the ball and it races across the green low and hot.',
      cause: 'The club is rising through impact because the low point is behind the ball, typically from a lifting chest or a scooping lead wrist trying to help the ball up.',
      fix: 'Keep the chest down and turning through impact with a flat lead wrist, and hit chips with the trail hand only to feel the club brush the grass after the ball.',
    },
    {
      name: 'Deceleration',
      symptom: 'Contact varies from chunk to blade with the same club, and the follow-through is shorter than the backswing.',
      cause: 'A backswing that is too long for the shot forces the club to slow into the ball, so the low point wanders and the strike becomes random.',
      fix: 'Halve the backswing and make the follow-through longer than the backswing on every chip, counting one back and two through at an even tempo.',
    },
    {
      name: 'Scoop and pop-up',
      symptom: 'The ball floats up softly and finishes well short of the landing spot.',
      cause: 'The lead wrist cups through impact and the hands fall behind the clubhead, adding loft and removing the forward shaft lean that the ratios depend on.',
      fix: 'Hold an alignment stick along the grip so it extends past your lead hip; if it touches your side on the through-swing you flipped. Chip until it never touches.',
    },
    {
      name: 'Runs well past the hole',
      symptom: 'A well-struck chip lands on the green and keeps rolling far beyond the hole.',
      cause: 'Too little loft for the situation, a flyer from grass trapped between face and ball, or a landing spot that missed the green and hit the firm fringe.',
      fix: 'Re-check the landing spot, land the ball a yard onto the green, and step up one club in loft when the lie is grassy or the green runs away downhill.',
    },
  ],
  drills: [
    {
      name: 'Landing spot towel',
      goal: 'Train your eye and stroke to land the ball on a chosen spot rather than near the hole.',
      steps: [
        'Lay a towel or small hoop about a yard onto the green from the fringe.',
        'Chip ten balls with a 9-iron, trying to land each one on the towel, and count the hits.',
        'Move to a different spot and repeat with a pitching wedge, then a sand wedge.',
        'Note which club rolled closest to the hole from each landing spot.',
      ],
      reps: '10 balls per club, 3 clubs',
    },
    {
      name: 'Three clubs, one spot',
      goal: 'Calibrate your personal carry-to-roll ratios against the rule of 12.',
      steps: [
        'Pick one landing spot a yard onto the green and one starting position off the fringe.',
        'Chip three balls each with an 8-iron, a pitching wedge and a sand wedge to that spot with the same stroke.',
        'Pace off the roll for each club and compare it with 4:1, 2:1 and 1:1.',
        'Write your own ratios on a card and use them on the course.',
      ],
      reps: '9 balls per session, twice a week',
    },
    {
      name: 'Alignment stick anti-flip',
      goal: 'Keep the hands ahead of the clubhead and the shaft leaning forward through impact.',
      steps: [
        'Slide an alignment stick down the grip so it runs up past your lead hip.',
        'Set up with weight forward and hands ahead so the stick points just outside your lead hip.',
        'Chip 20 balls; if the stick hits your side, the wrists flipped.',
        'Finish each chip with the stick still pointing away from your body and the chest facing the target.',
      ],
      reps: '2 sets of 20',
    },
    {
      name: 'Trail hand only',
      goal: 'Feel the club brushing the grass after the ball with a stable, accelerating clubhead.',
      steps: [
        'Hold a pitching wedge in the trail hand only and grip down to the bottom of the handle.',
        'Set up with weight forward and the ball back of centre.',
        'Chip ten balls, feeling the clubhead brush the grass past the ball while the wrist stays firm.',
        'Add the lead hand and hit ten more with the same feel.',
      ],
      reps: '3 sets of 10',
    },
  ],
  checklist: [
    'Feet a few inches apart, lead foot slightly back',
    '65–70% of weight on the lead foot, and it stays there',
    'Ball back of centre, hands ahead of the lead thigh',
    'Grip down, stand close, heel of the club just off the ground',
    'Landing spot chosen a yard onto the green',
    'Club chosen by carry-to-roll ratio, least loft that works',
    'Shoulders rock, wrists quiet, chest turns through',
    'Follow-through longer than the backswing',
  ],
  quiz: [
    {
      question: 'Where should a chip be aimed?',
      options: [
        'At the hole',
        'At a landing spot about a yard onto the green',
        'At the front edge of the fringe',
        'At the highest point of the break',
      ],
      answer: 1,
      explanation: 'You aim at a landing spot on the green because the green gives a predictable first bounce; the roll takes the ball to the hole.',
    },
    {
      question: 'Under the rule of 12, roughly how much does an 8-iron chip roll for every part it carries?',
      options: ['One part', 'Two parts', 'Four parts', 'Eight parts'],
      answer: 2,
      explanation: 'Twelve minus eight is four, so an 8-iron chip rolls about four parts for each one it carries.',
    },
    {
      question: 'What is the guiding principle for club selection when chipping?',
      options: [
        'Always use a sand wedge',
        'Use the highest loft you can',
        'Use the lowest lofted club that will still land the ball on the green',
        'Use whichever club you hit furthest',
      ],
      answer: 2,
      explanation: 'The least loft that lands on the green gets the ball rolling soonest, and a rolling ball is easier to predict than a flying one.',
    },
    {
      question: 'Your chips alternate between chunks and blades with the same club. What is the most likely cause?',
      options: [
        'The ball is too far back',
        'The backswing is too long and the club decelerates into the ball',
        'The green is too fast',
        'You are using too little loft',
      ],
      answer: 1,
      explanation: 'A decelerating club lets the low point wander, producing fat and thin strikes at random; shorten the backswing and lengthen the finish.',
    },
    {
      question: 'How should you adjust for a chip from a downhill lie?',
      options: [
        'Take less loft and lean back',
        'Take more loft, play the ball a touch back, and keep your weight down the slope',
        'Play the ball forward and scoop',
        'Use a putter from the fringe every time',
      ],
      answer: 1,
      explanation: 'The slope subtracts loft and adds run, so you add loft, play the ball a touch back, and chase the club down the hill.',
    },
  ],
  next: 'bunker',
};
