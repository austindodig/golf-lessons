export default {
  slug: 'setup',
  number: 1,
  title: 'The Setup',
  kicker: 'Fundamentals',
  tagline: 'Everything the swing does, the setup decides first.',
  summary: "Grip, stance, posture, alignment and ball position: the five static checkpoints that give every swing a fair chance before the club ever moves.",
  duration: '20 min',
  level: 'Beginner to Intermediate',
  hero: {
    image: 'setup',
    stats: [
      { label: 'Grip pressure', value: '4 out of 10' },
      { label: 'Lead-hand knuckles', value: 'Two to two and a half' },
      { label: 'Ball position, driver', value: 'Inside lead heel' },
    ],
  },
  sections: [
    {
      id: 'why-the-setup-comes-first',
      heading: 'Why the setup comes first',
      body: [
        "The setup is the only part of golf you perform standing still, which makes it the only part you can check completely before you commit. Once the club moves, takeaway to impact takes barely more than a second, and almost nothing can be corrected inside that window. So the shot you get is largely decided before you move: where the clubface points, where the low point of your arc will fall, and how freely your body can turn. A poor setup asks the swing to fix it in flight. A sound setup asks nothing of it.",
        "The same patterns repeat on every range: the golfer who slices is usually aimed left with a weak grip, the golfer who hits it fat has the ball too far forward, and the golfer who tops it is standing too tall. None of those swings are broken. Their starting positions are. Treat the five checkpoints that follow as a routine you rebuild on every shot, not a lesson you learn once. Everything here is written for a right-handed golfer. If you play left-handed, mirror every reference: your lead side is your right side and your trail side is your left.",
      ],
      keyPoints: [
        "Face aim, low point and freedom to turn are all fixed before the club moves",
        "Most slices, fat shots and tops begin at address, not in the swing",
        "Rebuild the checkpoints on every shot; they drift without you noticing",
      ],
    },
    {
      id: 'grip',
      heading: 'The grip',
      body: [
        "Hold the club in the fingers of your lead hand, not the palm. Lay the grip diagonally from the base of the little finger across the middle joint of the index finger, then close the hand with the heel pad on top of the handle. Looking down, you should see **two to two and a half knuckles**, and the V between your thumb and index finger should point at your **trail shoulder**. That is a neutral grip. Three or four knuckles with the V outside the shoulder is strong and helps the face close. One knuckle with the V at your chin is weak and leaves the face open.",
        "Add the trail hand from the side, palm facing the target, so its lifeline covers the lead thumb and its V also points at the trail shoulder. Then choose how the hands connect. **Overlap** rests the trail little finger in the channel between the lead index and middle fingers, and suits most adult hands. **Interlock** hooks those two fingers together and suits smaller hands or anyone who feels the club slipping. **Ten-finger** keeps every finger on the handle and gives juniors and golfers with weaker hands more leverage. None of the three is wrong. Pick the one that makes the hands feel like a single unit.",
        "Grip pressure is where most golfers lose speed before they start. Hold the club at about **four out of ten**: firm enough that the head could not twist if someone tapped it, soft enough that your forearms stay quiet. Waggle the club and watch your wrists; if they cannot hinge freely, you are squeezing. Pressure lives mainly in the last three fingers of the lead hand and the middle two fingers of the trail hand, and it stays constant from address to finish rather than tightening at the top, which is exactly when most golfers clamp down.",
      ],
      keyPoints: [
        "Lead hand in the fingers, heel pad on top, two to two and a half knuckles showing",
        "Both Vs point at the trail shoulder",
        "Overlap, interlock or ten-finger: choose whichever unifies the hands",
        "Pressure four out of ten, constant from address to finish",
      ],
      callout: {
        title: 'Build it in the air',
        text: "Hold the club out in front of you at hip height with the leading edge vertical, form the grip, then lower the club behind the ball. Building the grip on the ground, with the face already twisted by the way the club happens to be resting, is how most bad grips begin.",
      },
    },
    {
      id: 'stance-and-posture',
      heading: 'Stance and posture',
      body: [
        "Measure stance width from the insides of your heels. For a mid iron they sit about **shoulder width** apart, narrow enough to turn freely and wide enough to stay balanced. Widen gradually as the clubs get longer, until the driver has the heels a touch outside the shoulders, and come in slightly narrower than shoulder width for wedges. Flare the lead foot 20 to 30 degrees toward the target so the hips can clear in the follow-through, and keep the trail foot closer to square so the backswing turns against a stable trail leg instead of sliding past it.",
        "Posture starts from the hips, not the shoulders. Stand tall with the club held out in front of you, then **hinge from the hips** until the clubhead reaches the ground, letting your backside move behind you as your chest tilts forward. Only then soften the knees a little. Keep the spine long from tailbone to the back of the head, chin off the chest so the shoulders have room to turn beneath it. Weight sits over the middle of the feet, neither on the heels nor the toes. A mirror down the line should show your shoulders stacked over the balls of your feet.",
        "Now let the arms hang. From a correct hinge the hands fall almost straight down from the shoulders, leaving about a **hand's width** between the butt of the grip and your thighs with an iron, and a little more with a driver, because you stand further from the ball. Because the trail hand sits lower on the grip than the lead hand, the trail shoulder sits lower too, tilting the spine a few degrees away from the target. Keep that tilt; it is what lets you stay behind the ball. Reaching for the ball, or pulling the hands in against the body, changes the swing plane before you start.",
      ],
      keyPoints: [
        "Insides of the heels at shoulder width for a mid iron; wider for driver, narrower for wedges",
        "Hinge from the hips first, then soften the knees",
        "Arms hang under the shoulders, a hand's width from the thighs",
        "Trail shoulder a little lower than the lead, spine tilted slightly away from the target",
      ],
      module: {
        type: 'swing-viewer',
        preset: { club: 'iron', camera: 'down-the-line', highlight: [1] },
        caption: 'Address from down the line: shoulders over the balls of the feet, arms hanging beneath the shoulders, spine long.',
      },
    },
    {
      id: 'alignment',
      heading: 'Alignment',
      body: [
        "Picture two railroad tracks running to the target. The ball and the clubface sit on the outer rail, which points at the target. Your feet, knees, hips and shoulders sit on the inner rail, which runs **parallel to the target line** and therefore points a little left of the target itself. The most common alignment error is aiming the body at the flag. That sets the whole system to the right of where you want the ball to finish, and it invites an over-the-top move to drag the ball back, which is where a great many slices are born.",
        "Aim the face before you aim the body. Stand behind the ball, pick the target, then find an **intermediate target** a foot or two in front of the ball on that line: a discoloured blade of grass, an old divot, a leaf. Walk in, set the clubface square to that spot, and only then build your stance around the face. Aiming at something a foot away is far more accurate than aiming at something 150 yards away, and it stops your eyes from twisting the face while you settle in.",
        "Check yourself with two alignment sticks or two clubs on the range: one on the target line just outside the ball, one along your toes. Lay them down for the first twenty balls of every session, because alignment drifts without any feeling of change, and a golfer who has slowly started aiming right will soon start swinging left to compensate. If you can only fix one body line, fix the **shoulders**. They have the strongest influence on the path the club swings on, and they are the line that opens first under pressure.",
      ],
      keyPoints: [
        "Clubface on the target line; body on a parallel line to the left",
        "Pick an intermediate target a foot or two ahead of the ball",
        "Set the face first, then build the stance around it",
        "Shoulders matter most; they steer the club path",
      ],
    },
    {
      id: 'ball-position',
      heading: 'Ball position by club',
      body: [
        "Ball position decides where the club meets the ground, and therefore the strike. Your swing arc has a low point roughly beneath your lead shoulder, or a little ahead of it once your weight moves forward through impact. Irons need to reach the ball **before** that low point, so they strike the ball first and the turf second. The driver, sitting on a tee, is best struck just **after** the low point, on the way up. That one idea decides where the ball belongs for every club in the bag, and it is why the position changes from club to club.",
        "Play the driver **inside the lead heel**, roughly under the lead armpit. Fairway woods and hybrids move back a ball from there. Mid irons, the 6, 7 and 8, sit about a ball **forward of centre**. Short irons and wedges sit in the **centre** of the stance. A simple routine builds this the same way every time: set your feet together with the ball off the middle, then step out. Equal steps put a wedge in the centre. A small lead step and a bigger trail step walk the driver forward toward the lead heel and widen the stance at the same time.",
        "The ball will tell you when it drifts. An iron played too far forward meets the club after its low point, so you catch it thin or fat, and the shoulders open to reach it, which pulls the start line left. Played too far back, the club arrives steeply from the inside with the face still open, so shots come out low and push right. A driver played too far back is struck on the way down, launching low with too much spin. When your contact changes over a few days, check ball position before you change the swing.",
      ],
      keyPoints: [
        "Driver inside the lead heel, struck on the upswing",
        "Mid irons a ball forward of centre; wedges in the centre",
        "Feet together, then step out: the same position every time",
      ],
      module: {
        type: 'setup-viewer',
        preset: { club: 'iron' },
        caption: 'Switch clubs and watch the ball move forward, the stance widen and the spine tilt grow as the club gets longer.',
      },
    },
    {
      id: 'the-routine',
      heading: 'A routine you can trust',
      body: [
        "Put the pieces in order and the whole setup takes about fifteen seconds. Behind the ball: choose the target, choose the intermediate target, picture the shot. Walk in and set the **clubface** to the intermediate target. Take the grip, or confirm the one you have already built. Step the trail foot to set the ball position, then the lead foot to set the width. Hinge, let the arms hang, look at the target once or twice, and go. The order matters, because the face and the ball position are the two settings everything else is built around.",
        "Practise the routine as a skill in its own right. On the range, hit ten balls where the only goal is to arrive at the checkpoints in the same order at the same pace, regardless of where the ball goes. Then hit ten more with a friend or a phone camera checking a single item, such as knuckles showing or shoulder line, from face-on or down the line. A setup that survives a camera will survive the first tee, where nerves shorten your routine and tighten your hands before you notice.",
      ],
      callout: {
        title: 'On the course',
        text: "When a shot goes wrong, run the checkpoints backwards before you blame the swing: ball position, alignment, posture, stance, grip. More often than not the fix is standing there.",
      },
    },
  ],
  faults: [
    {
      name: 'Weak-grip slice',
      symptom: "Ball starts near the target line or left of it, then curves right, high and short.",
      cause: "With one knuckle showing and the V at your chin, the lead hand returns to impact with the face open to the path. The face-to-path gap adds slice spin, and the flight is weak because an open face adds loft.",
      fix: "Rotate the lead hand until two and a half knuckles show and both Vs point at the trail shoulder. Then hold the club at hip height and confirm the leading edge is vertical before you ground it.",
    },
    {
      name: 'Strong-grip hook',
      symptom: "Ball starts right of the target, or straight, then dives left and runs.",
      cause: "Three or four knuckles and a trail hand tucked under the grip return the face closed to the path at impact. The more the path travels in to out, the further right the ball starts before it hooks.",
      fix: "Weaken both hands to neutral, with the trail palm facing the target and its V at the trail shoulder. Check the face on the way through: at hip height the toe should point up, not at the ground.",
    },
    {
      name: 'Aiming right',
      symptom: "Shots start right of the target and stay there, or you pull them to compensate.",
      cause: "The body lines point at the flag instead of parallel left of it, so the path and the face are both aimed right. Over time the shoulders open early to steer the ball back, which turns a push into a pull.",
      fix: "Lay one stick along your toes and one outside the ball on the target line for the first twenty balls of every session, and always set the face to an intermediate target before your feet move.",
    },
    {
      name: 'Ball too far forward',
      symptom: "The same swing produces fat shots one day and thin ones the next, often pulled.",
      cause: "The ball sits past the low point of the arc, so the club has already bottomed out and is rising when it arrives. The shoulders also open to reach it, which sends the path out to in.",
      fix: "Use the feet-together routine: ball off the middle, then step out. For a 7-iron the ball should finish a ball forward of centre, no more; with a wedge it sits dead centre.",
    },
    {
      name: 'Standing too tall',
      symptom: "Topped or thin shots, and a feeling of reaching for the ball at impact.",
      cause: "Without enough hip hinge the arms have to stretch to reach the ball and the bottom of the arc sits above it. Any lift of the body in the downswing then leaves the leading edge striking the top half of the ball.",
      fix: "Rebuild posture from a tall stand: hinge from the hips until the clubhead reaches the ground, then soften the knees. Check down the line that the shoulders sit over the balls of the feet.",
    },
    {
      name: 'Death grip',
      symptom: "Short, weak shots that fly straight or fade, with tired forearms after a session.",
      cause: "Grip pressure of eight or nine out of ten locks the wrists so the club cannot hinge or release. Clubhead speed drops and the face tends to arrive open, which adds loft and a fade.",
      fix: "Set pressure at four out of ten and test it with a free waggle before every shot. If the wrists cannot move, loosen until they can, and keep the pressure the same at the top of the swing.",
    },
  ],
  drills: [
    {
      name: 'Feet together, step out',
      goal: "A repeatable ball position and stance width for every club.",
      steps: [
        "Set the clubface behind the ball, square to an intermediate target a foot ahead.",
        "Bring your feet together with the ball opposite the middle of them.",
        "Step the lead foot a little toward the target, then the trail foot away from it: equal steps for a wedge, a bigger trail step for the driver.",
        "Lay a club across your toes and check the ball position and the width against the club you are holding.",
      ],
      reps: '10 setups each with a wedge, a 7-iron and the driver',
    },
    {
      name: 'Two-stick station',
      goal: "Face aim and body alignment that match the target line.",
      steps: [
        "Lay one alignment stick on the target line just outside the ball and a second along your toe line, parallel to it.",
        "Start behind the ball, pick an intermediate target, walk in and set the face before the feet.",
        "Hit 20 balls, checking after each that the feet, hips and shoulders still match the inner stick.",
        "Remove the sticks and hit 10 more, then replace them to see whether your aim has drifted.",
      ],
      reps: '20 balls with sticks, 10 without, every session',
    },
    {
      name: 'Mirror posture',
      goal: "A hip hinge that lets the arms hang under the shoulders.",
      steps: [
        "Stand tall side-on to a mirror with the club held out in front of you.",
        "Hinge from the hips until the clubhead reaches the ground, keeping the spine long, then soften the knees.",
        "Check the mirror: shoulders over the balls of the feet, hands hanging under the shoulders, chin off the chest.",
        "Hold for ten seconds, stand up, and rebuild it without looking until it feels familiar.",
      ],
      reps: '10 reps, morning and evening',
    },
    {
      name: 'Grip rebuild',
      goal: "A neutral grip at four out of ten pressure.",
      steps: [
        "Hold the club out in front of you at hip height with the leading edge vertical.",
        "Place the lead hand in the fingers, heel pad on top, two and a half knuckles showing, V at the trail shoulder.",
        "Add the trail hand with its lifeline over the lead thumb and its V matching the lead V.",
        "Squeeze to ten out of ten, release to one, then settle at four and waggle to confirm the wrists are free.",
      ],
      reps: '15 grips before every practice session',
    },
  ],
  checklist: [
    "Two to two and a half knuckles showing, both Vs at the trail shoulder",
    "Grip pressure four out of ten, wrists free to waggle",
    "Face set to an intermediate target before the feet are placed",
    "Feet, hips and shoulders parallel to the target line, not aimed at the flag",
    "Hinge from the hips, spine long, chin up, weight over the middle of the feet",
    "Arms hanging under the shoulders, a hand's width from the thighs",
    "Ball inside the lead heel for the driver, a ball forward of centre for a 7-iron, centre for wedges",
    "Trail shoulder slightly lower than the lead, head a touch behind the ball",
  ],
  quiz: [
    {
      question: "In a neutral grip, where do the Vs formed by each thumb and index finger point?",
      options: ["At your chin", "At your lead shoulder", "At your trail shoulder", "Straight down the shaft"],
      answer: 2,
      explanation: "Both Vs point at the trail shoulder; a V at the chin is weak and one outside the trail shoulder is strong.",
    },
    {
      question: "In the railroad-tracks picture, where does your body line point?",
      options: ["Directly at the target", "Parallel to the target line, a little left of the target", "A little right of the target", "It does not matter as long as the face is square"],
      answer: 1,
      explanation: "The face sits on the outer rail aimed at the target; the body sits on the inner rail, parallel to it and therefore a little left.",
    },
    {
      question: "Where should the ball be positioned for the driver?",
      options: ["In the centre of the stance", "A ball back of centre", "Inside the lead heel", "Opposite the trail heel"],
      answer: 2,
      explanation: "The driver is played inside the lead heel so the club reaches the ball after the low point, on the way up.",
    },
    {
      question: "Which comes first when you build your setup?",
      options: ["Setting the feet, then aiming the face", "Aiming the face at the intermediate target, then setting the feet", "Taking the grip on the ground, then aiming", "Choosing stance width, then the target"],
      answer: 1,
      explanation: "Set the face to the intermediate target first, then build the stance around it; the feet cannot be aligned to a face that is not yet aimed.",
    },
    {
      question: "Good posture begins by doing what?",
      options: ["Bending the knees deeply", "Rounding the shoulders toward the ball", "Hinging forward from the hips with a long spine", "Reaching the arms out to the ball"],
      answer: 2,
      explanation: "Hinge from the hips first with the spine long, then soften the knees; the arms then hang under the shoulders on their own.",
    },
  ],
  next: 'swing',
};
