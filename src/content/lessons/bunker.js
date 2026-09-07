export default {
  slug: 'bunker',
  number: 7,
  title: 'Bunker Play',
  kicker: 'Short game',
  tagline: 'Hit the sand, not the ball, and keep turning.',
  summary: 'Understand bounce, open the face before you grip, splash a dollar bill of sand from two inches behind the ball, and finish every swing.',
  duration: '25 min',
  level: 'Beginner to Intermediate',
  hero: {
    image: 'bunker',
    stats: [
      { label: 'Entry point', value: '2 inches behind the ball' },
      { label: 'Sand wedge bounce', value: '10–14°' },
      { label: 'Ball position', value: 'Inside lead heel' },
    ],
  },
  sections: [
    {
      id: 'miss-the-ball',
      heading: 'The only shot where you miss the ball on purpose',
      body: [
        "Every other shot in golf asks the clubface to strike the ball. The greenside bunker shot asks it to strike the sand. The club enters an inch or two behind the ball, slides underneath it on a thin cushion of sand, and that moving cushion lifts the ball out. The face never touches the ball. Once you accept that, most of the fear leaves: you no longer need a precise strike, only a swing that enters the sand in roughly the right place with enough speed to throw sand, and the ball, onto the green.",
        "Because sand absorbs so much energy, a bunker shot needs far more swing than the distance suggests, roughly two to three times the swing you would use for the same carry from grass, which is why timid swings leave the ball in the bunker. Tour players get up and down from greenside sand about half the time, and they do it with a committed, full-speed motion and a full finish. Your first goal is not a tap-in; it is getting out first time, every time.",
      ],
      keyPoints: [
        'The club strikes the sand, never the ball; a cushion of sand lifts it out.',
        'Sand needs two to three times the swing of the same carry from grass.',
        'First goal: out on the first attempt, with a full finish.',
      ],
    },
    {
      id: 'sand-wedge-and-bounce',
      heading: 'The sand wedge and why bounce matters',
      body: [
        "Turn a sand wedge on its side and look at the sole. The trailing edge hangs lower than the leading edge; the angle between them, measured against the ground with the shaft vertical, is the **bounce**. Most sand wedges carry 10 to 14 degrees of it. Bounce is what stops the club digging: as the sole meets the sand, the trailing edge hits first and the club skids forward through the sand rather than burying itself. A wedge with little bounce behaves like a knife; a wedge with plenty behaves like the hull of a boat.",
        "Opening the face is how you add bounce on demand. Rotate the face so it points right of the target and the sole rotates with it: the leading edge lifts, the trailing edge drops lower still, and the effective bounce rises by several degrees. An opened 56° wedge can present the sand with something close to 20 degrees, which is why it slides through soft sand instead of stalling. Opening the face also adds loft, so the ball comes out higher and lands softer, and it aims the face right, which the setup will fix.",
        "Match bounce to the sand you play most. **Soft, deep, fluffy sand** and a steeper swing want high bounce, 12 to 14 degrees, because the club needs help to stop digging. **Firm, wet or thin sand** wants lower bounce, 8 to 10 degrees, because too much bounce skips off the hard surface and sends the leading edge into the ball. If your wedge has high bounce and the sand is firm, open the face less; if it has low bounce and the sand is soft, open it more and swing a little shallower.",
      ],
      keyPoints: [
        'Bounce is the angle the sole hangs below the leading edge; sand wedges carry 10–14°.',
        'Opening the face lifts the leading edge and adds both bounce and loft.',
        'Soft sand and steep swings: high bounce. Firm, wet sand: low bounce, face less open.',
      ],
    },
    {
      id: 'setup',
      heading: 'Setup: feet in, face open, then grip',
      body: [
        "Wriggle your feet an inch into the sand. That lowers your body so the club naturally bottoms out below the ball, gives you a stable base, and tells you how firm the sand is, which you may not test with the club. Because you are now lower, grip down an inch. Take a stance wider than for a pitch, roughly shoulder width, knees flexed, about 60 percent of your weight on the lead foot. Play the ball forward, opposite the inside of your lead heel, so the low point of the swing falls behind it. Left-handers mirror everything.",
        "Now the step everyone gets wrong. **Open the face first, then take your grip.** Hold the club loosely with the trail hand, rotate the shaft so the face opens 20 to 30 degrees, and only then settle both hands into your normal grip. If you grip first and simply twist your hands, they will return to neutral at impact and take the face back to square, and the bounce disappears. Set the handle level with the ball or fractionally behind it, never leaning forward; forward lean removes the bounce you just created.",
        "With the face open, aim your feet, hips and shoulders left of the target until the face points at the flag, or just right of it. You will swing along your body line, so the path travels left while the face looks at the target, and the ball, following the face, starts near the flag with a little cut spin. Check it every time: face at the flag, body left, ball forward, weight lead side, hands level. Rehearse outside the bunker, since a practice swing that touches sand inside it costs a penalty.",
      ],
      keyPoints: [
        'Dig the feet in an inch, grip down an inch, stance about shoulder width.',
        'Ball inside the lead heel, weight 60% lead side, handle level with the ball.',
        'Open the face first, then grip; body aims left until the face points at the flag.',
        'Never touch the sand with a practice swing inside the bunker.',
      ],
      module: {
        type: 'ball-flight',
        preset: { club: 'sand-wedge' },
        caption: 'Set the face to 0° and the path to about -8°. The ball starts near the flag and drifts a touch right, the shape an open face and a body aimed left produce. From sand the cushion softens the spin, so the curve is smaller.',
      },
    },
    {
      id: 'the-splash',
      heading: 'The motion: enter two inches behind, take a dollar bill of sand',
      body: [
        "The swing is a slightly steeper version of your pitch. Hinge the wrists early so the club rises quickly, swing the lead arm back to about 9:00 for a standard shot, and swing along your body line, which points left of the flag. Focus on a spot two inches behind the ball; that is where the club enters the sand. From there the sole skids under the ball and exits about four inches past it, lifting a divot of sand the size of a dollar bill, six inches long and no more than an inch deep.",
        "Speed is everything through the sand. The cushion you are throwing weighs far more than the ball, so the club must be accelerating as it enters and still accelerating as it leaves. Keep the chest turning, keep the face open, and swing to a full finish with your weight on the lead foot. If the toe rolls over, the leading edge digs and the ball stays put, so the feel is the clubface, and your trail palm, facing the sky after impact. A full finish is not decoration; it is proof that you did not decelerate.",
        "Listen to the shot. A good splash makes a deep thump and throws a spray of sand onto the green; a thin click means the club skipped or entered too close; a dull dig with no spray means it entered too far back or too deep. The ball should climb quickly, land softly and take one hop. If it comes out low and hot, the face closed or the leading edge caught the ball. If it comes out short and heavy, you took too much sand or the club slowed down.",
      ],
      keyPoints: [
        'Early wrist hinge, slightly steeper than a pitch, swing along the body line.',
        'Enter the sand two inches behind the ball; exit four inches past it.',
        'Dollar-bill divot: six inches long, an inch deep at most.',
        'Accelerate through the sand to a full finish with the face open.',
      ],
      callout: {
        title: 'Feel it',
        text: 'Imagine the ball is sitting on a dollar bill and your job is to slide the club under the whole bill and toss it onto the green. Thinking about the sand instead of the ball is the single biggest change most golfers can make in a bunker.',
      },
      module: {
        type: 'bunker-viz',
        preset: {},
        caption: 'Watch the open face enter two inches behind the ball, skid beneath it and exit ahead. The sand moves the ball; the face never touches it.',
      },
    },
    {
      id: 'distance-control',
      heading: 'Distance control: sand and swing length, never deceleration',
      body: [
        "The worst way to hit a bunker shot shorter is to swing softer: a slower club stalls in the sand and the ball stays in or dribbles out. The first lever is **swing length**. A 7:30, a 9:00 and a 10:30 swing with the same entry point and full finish carry roughly 8, 15 and 25 yards for most golfers with a 56° wedge. The second lever is **the amount of sand**. Entering three inches behind the ball throws a thicker cushion and shortens the shot; entering one inch behind thins it and adds yards.",
        "A third lever is loft. Open the face more and the ball climbs higher and travels shorter; square it toward neutral and it flies lower and runs further. For long bunker shots of 25 to 40 yards, do not muscle the sand wedge. Take a gap wedge or pitching wedge, open it a little less, keep the same two-inch entry and full swing, and let the lower loft carry the extra distance. Decide the combination before you step in, rehearse it outside the bunker, and commit to the finish.",
        "Bunker shots land soft but not dead. From good sand with a clean splash the ball takes one hop and checks; from a thinner cushion or firm sand it comes out with more spin and stops faster; from a thick cushion or wet sand it comes out with almost none and rolls. Pick a landing spot a few paces short of the hole for a standard shot, and well short of it for a low-spin lie that will run, then commit to the swing that carries to that spot.",
      ],
      keyPoints: [
        'Never decelerate: shorter shots come from a shorter swing or more sand.',
        '7:30, 9:00 and 10:30 with a 56° wedge: roughly 8, 15 and 25 yards.',
        'More open face: higher and shorter. Longer shots: gap or pitching wedge, same technique.',
        'Decide the combination before you step in; rehearse outside the bunker.',
      ],
    },
    {
      id: 'difficult-lies',
      heading: 'Plugged, downhill and wet: adjusting the recipe',
      body: [
        "A **plugged ball**, or fried egg, sitting in its own crater cannot be splashed out with bounce, because the cushion of sand cannot get under it. Square the face, even close it slightly, so the leading edge becomes a digging tool. Play the ball back toward the centre of your stance, put 70 percent of your weight on the lead foot, hinge the wrists sharply and drive the leading edge into the sand an inch behind the ball. The sand stops the club, so there is little follow-through. The ball comes out low with no spin and runs, so land it well short.",
        "On a **downhill lie** the slope tilts the swing toward the ball and subtracts loft, so the ball wants to come out low and hot. Set your shoulders parallel to the slope, put most of your weight on the lower, lead foot, play the ball a touch further back and open the face more to recover the loft. Swing steeply down the slope and chase the clubhead down the hill after the ball; if you pull up, the leading edge catches the ball and it flies over the green. Expect a lower flight and more run, so land it short.",
        "**Wet, firm sand** is the opposite problem. The surface is hard, so an open face with lots of bounce skips off it and the leading edge blades the ball across the green. Square the face most of the way, choose your lower-bounce wedge or even a gap wedge, enter about an inch behind the ball instead of two, and take a thinner slice of sand. The ball comes out lower with more spin and checks hard. Uphill is friendlier: shoulders match the slope, swing up it, and lengthen the swing for a high, short flight.",
      ],
      keyPoints: [
        'Plugged: square or closed face, ball back, dig the leading edge in, no finish.',
        'Downhill: shoulders match the slope, weight low, open the face more, chase it down.',
        'Wet firm sand: squarer face, lower bounce, enter an inch behind, thinner slice.',
      ],
    },
    {
      id: 'fairway-bunkers',
      heading: 'Fairway bunkers: ball first, one club more',
      body: [
        "A fairway bunker shot is the greenside shot turned inside out. Here the sand is the enemy and you want to touch as little of it as possible, so the priority becomes **ball first, then sand**, exactly like an iron from the fairway with a smaller margin for error. Dig your feet in only lightly, just enough for stability, because sinking an inch lowers your swing arc and invites a heavy strike. Grip down to match whatever depth you did sink. Play the ball a touch back of your normal iron position, so the strike arrives before the low point.",
        "Check the lip first and choose a club that clears it comfortably, then take **one club more** than the distance normally needs, because the choked grip, the quieter legs and the slightly thinner strike all cost yards. Keep your lower body still and your chest tall, and think of it as a three-quarter swing made with the arms and shoulders. Aim to strike the ball fractionally thin: a thin fairway bunker shot still reaches the green, while a heavy one travels 40 yards. Finish in balance and expect a slightly lower flight with a little less spin.",
        "Everything in the sand comes down to a decision made before you step in. Greenside: read the sand with your feet, choose the entry point and swing length, open the face, grip, aim left, and splash through to a full finish. Fairway: clear the lip, one club more, ball first, chest tall. Rehearse outside, then make that exact swing inside, with no last-second steer.",
      ],
      keyPoints: [
        'Fairway bunker: ball first, feet only lightly dug in, grip down an inch.',
        'Clear the lip, then take one club more.',
        'Quiet legs, tall chest, three-quarter swing; a thin strike beats a heavy one.',
      ],
    },
  ],
  faults: [
    {
      name: 'Heavy, ball left in the bunker',
      symptom: 'A big spray of sand, a dull thud, and the ball moves a few feet or stays put.',
      cause: 'The club entered too far behind the ball or too deep, usually with a square face that dug, or it decelerated into the sand and lost the speed needed to throw the cushion.',
      fix: 'Draw a line two inches behind the ball, open the face before you grip, and swing to a full finish with the chest facing the target; the divot must start on the line and stay shallow.',
    },
    {
      name: 'Bladed over the green',
      symptom: 'A thin click and the ball rockets low across the green into the far bunker.',
      cause: 'The leading edge struck the ball because the club entered too close to it, skipped off firm sand with too much bounce, or the body lifted and raised the low point.',
      fix: 'Dig the feet in, keep the chest down through impact, enter two inches behind the ball, and on firm sand square the face a little so the bounce cannot skip.',
    },
    {
      name: 'Ball starts right of the flag',
      symptom: 'A well-struck splash that comes out on the line the face was pointing, well right of the hole.',
      cause: 'The face controls start direction; an open face that is not matched by a body aimed left sends the ball right of the target.',
      fix: 'Open the face until it points at the flag, then aim feet, hips and shoulders left of the target, and swing along your body line.',
    },
    {
      name: 'Low pull that digs',
      symptom: 'The ball comes out low and left with almost no height and the divot is deep.',
      cause: 'The toe rolled over through impact and closed the face, which removes the bounce, lets the leading edge dig, and starts the ball left.',
      fix: 'Hold the face open through impact with the clubface and trail palm facing the sky at the finish; swing with a light grip and feel the handle stay quiet while the body turns.',
    },
    {
      name: 'Deceleration',
      symptom: 'Inconsistent results from the same lie, a short finish, and a swing that feels careful.',
      cause: 'Fear of the thin shot makes the arms slow the club into the sand, so the cushion is not thrown and the ball comes out short or stays in.',
      fix: 'Commit to a full finish on every shot and control distance with swing length and entry point; make ten swings without a ball, splashing sand onto the green, before you hit one.',
    },
    {
      name: 'Fairway bunker heavy',
      symptom: 'A full swing from a fairway bunker travels half its usual distance with a spray of sand.',
      cause: 'The low point moved behind the ball because the feet sank too far, the lower body slid, or the ball was too far forward.',
      fix: 'Dig in only lightly, grip down to match, play the ball a touch back, keep the legs quiet and the chest tall, and aim to strike the ball first, even fractionally thin.',
    },
  ],
  drills: [
    {
      name: 'Line in the sand',
      goal: 'Groove a consistent entry point two inches behind the ball.',
      steps: [
        'Draw a straight line in the sand with the grip end of the club, perpendicular to the target.',
        'Set up with the line two inches behind where the ball would be, ball forward in your stance.',
        'Make ten swings with no ball, splashing the line out of the sand each time and finishing fully.',
        'Place balls on the target side of the line and repeat; every divot must start on the line.',
      ],
      reps: '10 swings, then 10 balls',
    },
    {
      name: 'Dollar bill divot',
      goal: 'Take a shallow, consistent slice of sand under the ball.',
      steps: [
        'Draw a rectangle six inches long and three inches wide around the ball, with the ball two inches from the back edge.',
        'Open the face before gripping and set up with weight on the lead foot.',
        'Swing to remove the whole rectangle in one shallow scoop, no deeper than an inch.',
        'Check the crater: deep at the back means you dug; starting at the ball means you were too close.',
      ],
      reps: '3 sets of 8',
    },
    {
      name: 'Ball on a buried tee',
      goal: 'Feel the club slide under the ball rather than at it.',
      steps: [
        'Push a tee into the sand so its head sits a finger-width below the surface, and place the ball on it.',
        'Set up open-faced and splash the tee out with the ball.',
        'If the tee stays in the sand you entered too close or too shallow; if it flies out far behind the ball, you dug.',
        'Repeat until the tee and ball leave together on every swing.',
      ],
      reps: '2 sets of 10',
    },
    {
      name: 'Three-length ladder',
      goal: 'Control distance with swing length and full speed rather than deceleration.',
      steps: [
        'Place towels at roughly 8, 15 and 25 yards on the green.',
        'Hit three balls to each towel using 7:30, 9:00 and 10:30 swings with the same two-inch entry and a full finish.',
        'Then hit three to the middle towel entering one inch, two inches and three inches behind the ball.',
        'Note which combination you trust most and use it as your stock shot.',
      ],
      reps: '18 balls per session',
    },
  ],
  checklist: [
    'Feet wriggled an inch into the sand, grip down an inch',
    'Stance shoulder width, knees flexed, weight 60% on the lead foot',
    'Ball opposite the inside of the lead heel',
    'Face opened before the grip is taken; handle level, no forward lean',
    'Body aimed left until the face points at the flag',
    'Entry spot chosen two inches behind the ball',
    'Swing length matched to the distance, never the speed',
    'Full finish, face and trail palm to the sky',
  ],
  quiz: [
    {
      question: 'What does the clubface strike on a standard greenside bunker shot?',
      options: [
        'The ball, then the sand',
        'The sand about two inches behind the ball',
        'The sand directly under the ball',
        'The ball on the upswing',
      ],
      answer: 1,
      explanation: 'The club enters two inches behind the ball and a cushion of sand lifts the ball out; the face never touches the ball.',
    },
    {
      question: 'Why do you open the clubface before taking your grip?',
      options: [
        'To hit the ball further',
        'So the face stays open at impact and the bounce is exposed, rather than your hands returning it to square',
        'To make the shaft lean forward',
        'To reduce loft',
      ],
      answer: 1,
      explanation: 'If you grip first and twist your hands, they return to neutral at impact and square the face, which removes the bounce you wanted.',
    },
    {
      question: 'Which sand suits a high-bounce sand wedge?',
      options: ['Firm, wet sand', 'Soft, deep, fluffy sand', 'A plugged lie', 'Bare hardpan'],
      answer: 1,
      explanation: 'High bounce stops the club digging in soft sand; on firm or wet sand it skips, so lower bounce and a squarer face are better.',
    },
    {
      question: 'How should you hit a greenside bunker shot shorter?',
      options: [
        'Swing slower',
        'Shorten the swing or take a little more sand while keeping full speed',
        'Close the face',
        'Move the ball back and lean the shaft forward',
      ],
      answer: 1,
      explanation: 'Deceleration leaves the ball in the sand; distance is controlled by swing length and entry point with the club always accelerating.',
    },
    {
      question: 'What changes for a plugged, fried-egg lie?',
      options: [
        'Open the face more and swing softly',
        'Square or slightly close the face, dig the leading edge in an inch behind the ball, and expect it to run',
        'Play the ball off the lead toe',
        'Use a putter',
      ],
      answer: 1,
      explanation: 'A buried ball cannot be splashed out with bounce, so you square the face, dig in behind it, and plan for a low, spinless shot that runs.',
    },
  ],
  next: 'putting',
};
