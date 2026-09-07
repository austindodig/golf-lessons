export default {
  slug: 'ball-flight',
  number: 9,
  title: 'The Ball Flight Laws',
  kicker: 'The lab',
  tagline: 'The face starts it, the path bends it.',
  summary: 'The modern ball flight laws: the face sets the start, face-to-path sets the curve, gear effect, spin loft, why a slice happens, and how to diagnose yourself from divot and flight.',
  duration: '30 min',
  level: 'Beginner to Intermediate',
  hero: {
    image: 'ball-flight',
    stats: [
      { label: 'Start direction', value: '75 to 85% from the face' },
      { label: 'Curve', value: 'Face relative to path' },
      { label: 'Contact time', value: 'About half a millisecond' },
    ],
  },
  sections: [
    {
      id: 'face-starts-it',
      heading: 'The face sets the start',
      body: [
        "For most of golf's history players were taught that the ball starts along the path of the swing and curves according to the face. Launch monitors settled the argument the other way. The ball leaves in a direction that is mostly the face angle, and the path only nudges it. With an iron the face accounts for roughly 85 percent of the start direction; with a driver, closer to 75 percent, because lower loft and higher speed give the path slightly more say. Either way, where the face points at the instant of contact is where the ball goes first.",
        "The percentages turn into numbers you can use. A 7-iron with the face 4 degrees open to the target and a path straight down the line starts the ball about 3.5 degrees right; a driver with the same face starts it about 3 degrees right. Over 150 yards, 3 degrees is about 8 yards. That is why a square face is worth more than anything else at impact, and why the grip, the lead wrist and the release come up in every lesson here: they are the face controls. Everything below is for a right-hander; left-handers swap every left and right.",
        "The reason is friction and time. The ball is on the face for about half a millisecond, during which it compresses, is squeezed between the face and its own inertia, and springs off very nearly perpendicular to the face. The path adds a little sideways drag, which is the small remaining share. Start direction is therefore a face problem, and when a shot starts offline you fix the face first, not the path. The grid below lays out the nine start-and-curve combinations. Every one of them is a particular face angle paired with a particular path, and nothing else.",
      ],
      keyPoints: [
        'The ball starts close to where the face points: about 85 percent with irons, 75 with the driver.',
        'A shot that starts offline is a face problem, so fix the face before the path.',
        'Left-handed golfers mirror everything: swap every left and right.',
      ],
      module: {
        type: 'flight-laws',
        preset: {},
        caption: 'The nine flights: three start directions by three curves. Start comes mostly from the face, curve from the path relative to the face.',
      },
    },
    {
      id: 'path-bends-it',
      heading: 'The path, relative to the face, sets the curve',
      body: [
        "Curve comes from the difference between where the face points and where the clubhead is travelling at impact, called face-to-path. If the face is open to the path, pointing right of the direction the clubhead is moving, the spin axis tilts right and the ball curves right: a fade, or with more tilt, a slice. If the face is closed to the path, the axis tilts left and the ball draws or hooks. If face and path match, the ball flies straight in whatever direction it started. Note the words: open or closed *to the path*, not to the target.",
        "That distinction is the whole modern law. A face 2 degrees open to the target with a path 6 degrees in-to-out is 4 degrees closed to the path; the ball starts a little right and draws left. The same face with a path 4 degrees out-to-in is 6 degrees open to the path; the ball starts a little right and slices further right. Same face, same start, opposite curves. Once you think in face-to-path, every shot you have ever hit makes sense, and so does every fix.",
        "How far the ball curves for each degree of face-to-path depends on loft and speed. The sideways tilt of the spin axis is diluted by backspin, so a wedge with 50 degrees of loft barely curves with a face-to-path that would send a driver 30 yards sideways. With a driver each degree of face-to-path is worth a few yards of curve on a full shot, and the number shrinks through the bag. Faster ball speed adds more time in the air for the same tilt to work. This is why a slice shows up first with the driver, and why fixing it there fixes it everywhere.",
      ],
      keyPoints: [
        'Face open to the path curves right; face closed to the path curves left.',
        'Face-to-path is measured against the path, never against the target.',
        'Lower loft and higher speed turn the same face-to-path into a bigger curve.',
      ],
    },
    {
      id: 'nine-flights',
      heading: 'The nine ball flights',
      body: [
        "Combine three start directions with three curves and you have the nine flights. Start relative to the target is push (right), straight, or pull (left); curve is draw (left), straight, or fade (right). A push starts right because the face was open to the target; a pull starts left because it was closed. A push-draw starts right and curves back left; a pull-fade starts left and curves back right. A push-fade starts right and keeps going right, a pull-draw starts left and keeps going left, and each of those is a shot that never had a chance.",
        "The two shapes tour players actually play are the push-draw and the pull-fade, and they share a geometry: face and path both point to the same side of the target, with the path further from the target than the face. To draw the ball to the flag, aim the face a degree or two right of it and swing the path 2 to 3 degrees further right than that. To fade it, aim the face a degree or two left and swing the path further left. The ball starts near the face, curves toward the target, and finishes on it. A straight shot needs face and path both at zero, which is why it is the hardest shot in golf.",
        "The simulator below is set to a 7-iron with the path 4 degrees in-to-out and the face 2 degrees open to the target. The face is 2 degrees closed to the path, so the ball starts just right and draws back through the flag. Drag the face open past the path and the same start line becomes a push-fade. Drag the path to zero and the same face becomes a straight push. Spend five minutes here and you will read your own ball flight for the rest of your life.",
      ],
      keyPoints: [
        'Start: push, straight or pull. Curve: draw, straight or fade. Nine combinations.',
        'A curved shot that finishes on target has face and path on the same side, path further out.',
        'Push-draw and pull-fade are playable; push-fade and pull-draw are double misses.',
      ],
      module: {
        type: 'ball-flight',
        preset: { club: '7-iron', path: 4, face: 2, focus: 'face' },
        caption: 'A push-draw 7-iron: path 4 degrees in-to-out, face 2 degrees open to the target, so 2 degrees closed to the path. Move the face slider and watch the start line follow it.',
      },
    },
    {
      id: 'gear-effect',
      heading: 'Strike location and the gear effect',
      body: [
        "Face and path are two of the laws; where on the face you strike the ball is the third. A driver's centre of gravity sits well behind the face, so a strike toward the toe twists the head open around that centre and, as it twists, the face rolls across the ball like one gear driving another. The ball starts a shade right, because the face opened, and picks up draw spin from the gearing, so toe strikes with a driver hook. Heel strikes do the reverse: they start a little left and fade or slice. The bulge, the curve built across a driver face, is there to soften this.",
        "The gear effect works vertically too. A ball struck high on a driver face launches higher with less spin, usually a gift for distance; a ball struck low launches lower with more spin, the recipe for a short, climbing drive. With irons the centre of gravity is close to the face, so the gear effect is small, but an off-centre strike still loses ball speed and carry, and a toe strike still flies weakly right with a little draw. Impact tape or a spray of dry shampoo on the face shows you, in ten shots, more than an hour of video.",
        "Check strike before you blame the swing. A golfer who hooks the driver and slices the irons is often not swinging two different ways; the driver is hitting the toe. Fix the strike, by adjusting where the ball sits on the face at address and by keeping your chest over the ball through impact, and the flight often fixes itself.",
      ],
      keyPoints: [
        'Driver toe strike: starts right and hooks. Heel strike: starts left and slices.',
        'High on the face launches higher with less spin; low launches lower with more.',
        'With irons an off-centre strike mostly costs ball speed and carry.',
      ],
    },
    {
      id: 'spin-loft',
      heading: 'Spin loft: launch, spin and the trade-off',
      body: [
        "Two numbers describe the vertical side of impact. Dynamic loft is the loft the face actually presents at contact, after shaft lean and the release have changed the number stamped on the sole. Attack angle is whether the club head is travelling down or up as it arrives. Subtract attack angle from dynamic loft and you have spin loft, the angle between where the face points and where the club is going. Spin loft is the single biggest lever on how much the ball spins, and it is why a 7-iron struck 4 degrees down with 21 degrees of dynamic loft spins around 7,000 rpm while a driver with 12 degrees of dynamic loft and a level strike spins under 3,000.",
        "Launch angle follows dynamic loft more than anything else, about 85 percent of it, with a small nod to attack angle. So the two numbers pull in different directions. More dynamic loft means higher launch, which you often want, but it also means more spin loft, which you often do not. The driver is the clearest case. Hitting up on the ball with a tee raises launch without adding loft, so spin loft falls and the ball flies higher with less spin: the high, long, penetrating drive. Hitting down on a driver does the opposite, and the ball balloons.",
        "With irons the arithmetic flips. You want a descending strike, so spin loft is naturally large and the ball spins enough to hold a green. The mistake is scooping: adding dynamic loft with the hands to lift the ball. Launch goes up a little, spin loft goes up a lot, ball speed falls because the strike gets thinner, and the shot climbs, drifts and comes up short. The lab below lets you move attack angle and watch spin and carry respond; the driver and the 7-iron behave like two different games.",
      ],
      keyPoints: [
        'Spin loft = dynamic loft minus attack angle. It drives spin.',
        'Launch follows dynamic loft; spin follows spin loft.',
        'Driver: hit up to lower spin loft. Irons: hit down and let spin loft do its job.',
      ],
    },
    {
      id: 'why-a-slice',
      heading: 'Why a slice happens, and the geometry of the fix',
      body: [
        "The most common shot in golf is a pull-slice: the ball starts left of the target and curves hard right, finishing well right. Read it with the laws and the diagnosis writes itself. Starting left means the face was pointing left of the target at impact. Curving right means the face was open to the path, so the path was even further left. A typical slicer delivers a face 2 degrees closed to the target on a path 8 degrees left: face-to-path is plus 6, the spin axis tilts about 20 degrees, and the drive curves 40 yards. The player sees a slice and instinctively aims further left, which steepens the path and makes the curve worse.",
        "Fixing it is a two-part job in a set order. First close the face relative to the path, not relative to the target: a stronger grip, a flatter lead wrist at the top, and a release that lets the toe pass the heel. Second bring the path back to neutral or slightly in-to-out by turning the trail shoulder down and behind the ball in transition rather than out toward the ball. Do the face first. A face that matches a leftward path turns the slice into a straight pull, which is the halfway house, and then the path work turns the pull into a straight shot or a draw.",
        "A hook is the mirror image, usually a push-hook: face open to the target but closed to a path that is well in-to-out. The order of repair is the same, face first, then path. In both cases the face-to-path number is what you are trying to shrink. Zero face-to-path is a straight shot in whatever direction the face points; 2 or 3 degrees is a playable draw or fade. The ball does not know what you intended. It knows two numbers.",
      ],
      keyPoints: [
        'Pull-slice: face left of target, path further left, face open to path.',
        'Fix the face relative to the path first, then neutralise the path.',
        'Shrink face-to-path toward zero; a few degrees either way is a shape, not a fault.',
      ],
      callout: { title: 'The slicer’s trap', text: 'Aiming further left to allow for the slice moves the path further left, which opens the face to the path even more. The curve grows. Aim at the target and fix the numbers instead.' },
    },
    {
      id: 'diagnose-yourself',
      heading: 'Read your divot and your flight',
      body: [
        "You already own a launch monitor: the ground and the sky. The divot reports the path and the low point. A divot pointing left of the target line means an out-to-in path; pointing right means in-to-out. A divot that starts behind the ball says the low point was too early, the fat and thin factory. A divot of even depth that starts at the ball and gets shallower toward the target is the goal. On a mat, the scuff mark tells the same story; on the range, lay a club on the ground parallel to the target line and read the divot against it.",
        "The flight reports the face. Note the start direction against a mark on the horizon before the ball begins to curve; that is the face at impact. Then note the curve; that is the face relative to the path. Put the two together and you have both numbers. Finally check the trajectory. Too high with too little distance is spin loft too large, usually a scoop or a steep attack; too low and running is delofting or a ball too far back. Strike location on the face is the last check, with tape or foot spray, because gear effect can mimic a path problem.",
        "Here is the decision tree. Start direction wrong: fix the face first, through grip and lead wrist. Start direction right but curving: fix the path, through transition and body rotation. Straight but the wrong height: fix spin loft, through ball position and attack angle. Straight and the right height but short: fix strike, through balance and posture. Work through it in that order, one variable at a time, and every session on the range becomes a lesson instead of a guess.",
      ],
      keyPoints: [
        'Divot direction shows path; divot start point shows low point.',
        'Start direction shows the face; curve shows face-to-path.',
        'Order of repair: start direction, then curve, then height, then strike.',
      ],
    },
  ],
  faults: [
    { name: 'Pull-slice', symptom: 'Starts left, curves hard right, finishes right and short.', cause: 'Face closed to the target but open to a path that travels well out-to-in, tilting the spin axis to the right.', fix: 'Strengthen the grip and flatten the lead wrist to close the face to the path, then drop the trail shoulder behind the ball in transition to neutralise the path.' },
    { name: 'Push-hook', symptom: 'Starts right, then dives left.', cause: 'Face open to the target but closed to a path that is strongly in-to-out, tilting the spin axis left.', fix: 'Quieten the hand release and keep the chest rotating through impact so the face stops closing past the path.' },
    { name: 'Straight pull', symptom: 'Flies dead straight but left of the target.', cause: 'Face and path match each other but both point left of the target at impact.', fix: 'Check alignment first, then feel the trail shoulder work down rather than around in the downswing so the path swings from the inside.' },
    { name: 'Straight push', symptom: 'Flies dead straight but right of the target.', cause: 'Face and path match each other but both point right, often from a ball too far back or hips sliding past the ball.', fix: 'Move the ball a touch forward and rotate the hips through impact instead of sliding, so the club can square to the target.' },
    { name: 'Ballooning drive', symptom: 'Climbs steeply, hangs, and drops short.', cause: 'Spin loft too large: a downward attack angle with the driver, often with a low face strike, producing high spin.', fix: 'Tee the ball higher, move it inside the lead heel, tilt the spine away from the target and swing up through the ball.' },
    { name: 'Toe hook with the driver', symptom: 'Starts a shade right, then hooks; irons behave normally.', cause: 'Toe strike: gear effect adds draw spin and costs ball speed, mimicking a path problem that is really a strike problem.', fix: 'Check strike with foot spray, address the ball nearer the heel, and keep the chest over the ball through impact.' },
  ],
  drills: [
    { name: 'Two-gate start line', goal: 'Trains a square face by giving instant feedback on start direction.', steps: ['Place two tees a club head apart, 2 yards in front of the ball on the target line.', 'Hit 7-irons through the gate at three-quarter speed.', 'Miss left means the face was closed at impact; miss right, open. Adjust grip and lead wrist, not aim.', 'Score ten balls; move the gate closer as you improve.'], reps: '3 sets of 10' },
    { name: 'Alignment-stick path check', goal: 'Reads the path from the divot so you can separate face faults from path faults.', steps: ['Lay a stick on the ground parallel to the target line, just outside the ball.', 'Hit five shots and photograph the divots against the stick.', 'Divots pointing left mean out-to-in; right means in-to-out. Note the pattern, then adjust with a shoulder feel.', 'Repeat and compare the pictures.'], reps: '4 rounds of 5' },
    { name: 'Nine flights on purpose', goal: 'Builds real ownership of face and path by hitting all nine shapes deliberately.', steps: ['Start with the three straight-start shots: straight, draw, fade.', 'Add the push family by moving the ball back and swinging out; then the pull family by moving it forward and swinging across.', 'Call each shot before you hit it and grade the start and curve separately.', 'Finish with five stock shots.'], reps: '2 balls per shape' },
    { name: 'Foot-spray strike map', goal: 'Removes gear effect from the diagnosis by showing exactly where the ball meets the face.', steps: ['Spray the driver face lightly with dry foot spray.', 'Hit five drives without wiping and look at the cluster.', 'Toe cluster with hooks or heel cluster with slices means the strike is the fault, not the swing.', 'Adjust where the ball sits on the face at address and repeat.'], reps: '3 sets of 5' },
  ],
  checklist: [
    'Watch the start direction against a horizon mark on every shot.',
    'Note the curve separately from the start.',
    'Read the divot direction against a stick.',
    'Check where the divot starts relative to the ball.',
    'Check strike location with tape or spray once a session.',
    'Fix the face before the path, the path before the height.',
    'Change one variable at a time and hit five before judging.',
    'Finish with five stock shots at the target.',
  ],
  quiz: [
    { question: 'A 7-iron starts 4 degrees right of the target and flies dead straight. What happened at impact?', options: ['Face square, path 4 degrees right', 'Face and path both about 4 degrees right', 'Face 4 degrees closed, path square', 'Face square, path 4 degrees left'], answer: 1, explanation: 'A straight flight means face and path matched; starting right means both pointed right of the target.' },
    { question: 'Which pair of numbers produces a pull-slice for a right-hander?', options: ['Face open to target, path in-to-out', 'Face closed to target, path further left, face open to path', 'Face square, path square, toe strike', 'Face closed to path, path in-to-out'], answer: 1, explanation: 'The ball starts left because the face points left, and curves right because the face is open to a path that is even further left.' },
    { question: 'What is spin loft?', options: ['Static loft plus attack angle', 'Dynamic loft minus attack angle', 'Launch angle minus dynamic loft', 'The tilt of the spin axis'], answer: 1, explanation: 'Spin loft is the angle between where the face points and where the club is travelling: dynamic loft minus attack angle.' },
    { question: 'A toe strike with the driver typically produces which flight?', options: ['Starts left and slices', 'Starts slightly right and hooks', 'Flies straight but low', 'Starts right and slices'], answer: 1, explanation: 'Gear effect from a toe strike adds draw spin, so the ball starts a shade right and curves left.' },
    { question: 'A shot starts on line but curves 30 yards right. What do you fix first?', options: ['The start direction, with the grip', 'The path, since the face already matched the target at the start', 'Ball position, to change spin loft', 'Nothing, aim further left'], answer: 1, explanation: 'A correct start means the face was fine; a large curve means the path was well left of the face, so the path is the fault.' },
  ],
  next: 'setup',
};
