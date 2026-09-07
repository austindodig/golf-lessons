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
