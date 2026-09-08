export default {
  slug: 'setup',
  number: 1,
  title: 'The Setup',
  kicker: 'Fundamentals',
  tagline: 'Most of the shot is settled before you ever move the club.',
  summary: "Grip, stance, posture, alignment and ball position. You can check all five while you're still standing over the ball, and if they're right the swing gets a fair chance before it starts.",
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
        "The setup is the one part of golf you do standing still, which makes it the only part you can check properly before you commit to anything. Once the club starts moving, takeaway to impact takes barely more than a second, and there's not much you can fix in a window that small. Where the face is aimed, where your arc will bottom out, how freely your body can turn, all of that is largely decided while you're still stood there. If the setup's poor, the swing has to rescue it on the way down, and it usually can't.",
        "I see the same patterns on every range. The golfer who slices is usually aimed left with a weak grip. The one hitting it fat has the ball too far forward, and the one topping it is standing too tall. Their swings are fine, honestly. They're just starting from the wrong place. So treat the five checkpoints below as a routine you rebuild on every shot, not something you learn once and put away. Everything here is written for a right-handed golfer. If you play left-handed, mirror every reference, so your lead side is your right side and your trail side is your left.",
      ],
      keyPoints: [
        "Face aim, low point and freedom to turn are all fixed before the club moves",
        "Most slices, fat shots and tops begin at address",
        "Rebuild the checkpoints on every shot, because they drift without you noticing",
      ],
    },
    {
      id: 'grip',
      heading: 'The grip',
      body: [
        "Hold the club in the fingers of your lead hand, not the palm. Lay the grip diagonally from the base of the little finger across the middle joint of the index finger, then close the hand so the heel pad sits on top of the handle. When you look down you should see **two to two and a half knuckles**, and the V between your thumb and index finger should point at your **trail shoulder**. That's a neutral grip. If you can see three or four knuckles and the V is outside the shoulder, that's strong, and it helps the face close. One knuckle with the V at your chin is weak, and it leaves the face open.",
        "Now bring the trail hand in from the side with the palm facing the target, so its lifeline covers the lead thumb and its V points at the trail shoulder as well. Then you need to decide how the hands join. **Overlap** rests the trail little finger in the channel between the lead index and middle fingers, and it suits most adult hands. **Interlock** hooks those two fingers together, which suits smaller hands or anyone who feels the club slipping. **Ten-finger** keeps every finger on the handle and gives juniors and golfers with weaker hands a bit more leverage. I don't mind which one you pick. Go with whichever makes your hands feel like a single unit, and don't overthink it.",
        "Grip pressure is where a lot of golfers lose speed before they've even started. Hold the club at about **four out of ten**. That's firm enough that the head wouldn't twist if someone tapped it, and soft enough that your forearms stay quiet. Waggle the club and watch your wrists. If they can't hinge freely, you're squeezing. Most of the pressure lives in the last three fingers of the lead hand and the middle two fingers of the trail hand, and it should stay the same from address all the way to the finish. Pay particular attention at the top of the backswing, because that's where nearly everyone clamps down.",
      ],
      keyPoints: [
        "Lead hand in the fingers, heel pad on top, two to two and a half knuckles showing",
        "Both Vs point at the trail shoulder",
        "Overlap, interlock or ten-finger, whichever makes the hands feel like one unit",
        "Pressure four out of ten, and the same from address to finish",
      ],
      callout: {
        title: 'Build it in the air',
        text: "Hold the club out in front of you at hip height with the leading edge vertical, form the grip, then lower the club in behind the ball. If you build the grip on the ground, the face is already twisted by however the club happened to be resting, and that's how most bad grips get started.",
      },
    },
    {
      id: 'stance-and-posture',
      heading: 'Stance and posture',
      body: [
        "Measure your stance width from the insides of the heels. With a mid iron they sit about **shoulder width** apart, which is narrow enough that you can turn freely and wide enough that you stay balanced. Widen it a little at a time as the clubs get longer, until with the driver the heels are a touch outside the shoulders, and come in a bit narrower than shoulder width for the wedges. Flare the lead foot 20 to 30 degrees toward the target so the hips can clear in the follow-through. Keep the trail foot closer to square, so the backswing turns against a stable trail leg instead of sliding past it.",
        "Posture starts at the hips. Stand tall with the club held out in front of you, then **hinge from the hips** until the clubhead reaches the ground, letting your backside move behind you as your chest tilts forward. Only then soften the knees a little. Keep the spine long from the tailbone to the back of the head, with the chin off the chest so the shoulders have room to turn under it. Your weight sits over the middle of the feet, not the heels and not the toes. Check it in a mirror down the line and your shoulders should be stacked over the balls of your feet. Most golfers I see do the opposite and slump the shoulders to get down to the ball.",
        "Now let the arms hang. From a good hinge the hands drop almost straight down from the shoulders, which leaves about a **hand's width** between the butt of the grip and your thighs with an iron, and a bit more with a driver because you're standing further from the ball. The trail hand sits lower on the grip than the lead hand, so the trail shoulder sits lower too, and that tilts the spine a few degrees away from the target. Keep that tilt. It's what lets you stay behind the ball. If you reach for the ball, or pull the hands in against your body, you've changed the swing plane before you've started.",
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
        "Picture two railroad tracks running out to the target. The ball and the clubface sit on the outer rail, and that one points at the target. Your feet, knees, hips and shoulders sit on the inner rail, which runs **parallel to the target line**, so it points a little left of the target itself. The alignment mistake I see most often is aiming the body at the flag. That sets the whole system right of where you want the ball to finish, and then you're tempted into an over-the-top move to drag it back, which is where a lot of slices come from.",
        "Aim the face before you aim the body. Stand behind the ball, pick your target, then find an **intermediate target** a foot or two in front of the ball on that line. A discoloured blade of grass, an old divot, a leaf, anything will do. Walk in, set the clubface square to that spot, and only then build the stance around the face. You'll aim far more accurately at something a foot away than at something 150 yards away, and it stops your eyes twisting the face while you settle in.",
        "On the range, check yourself with two alignment sticks or two clubs, one on the target line just outside the ball and one along your toes. Lay them down for the first twenty balls of every session. Alignment drifts without feeling any different, and a golfer who has slowly started aiming right will soon start swinging left to make up for it. If you can only fix one body line, fix the **shoulders**. They have the biggest say in the path the club swings on, and they're the line that opens first when you're under pressure.",
      ],
      keyPoints: [
        "Clubface on the target line; body on a parallel line to the left",
        "Pick an intermediate target a foot or two ahead of the ball",
        "Set the face first, then build the stance around it",
        "Shoulders matter most, because they steer the club path",
      ],
    },
    {
      id: 'ball-position',
      heading: 'Ball position by club',
      body: [
        "Ball position decides where the club meets the ground, so it decides the strike. Your swing arc bottoms out roughly beneath your lead shoulder, or a little ahead of it once your weight moves forward through impact. Irons need to reach the ball **before** that low point, so they hit ball first and turf second. The driver sits on a tee, so you want to strike it just **after** the low point, on the way up. Once that one idea sinks in, you know where the ball belongs for every club in the bag, and why it moves from club to club.",
        "Play the driver **inside the lead heel**, roughly under the lead armpit. Fairway woods and hybrids move back a ball from there. Mid irons, the 6, 7 and 8, sit about a ball **forward of centre**, and short irons and wedges sit in the **centre** of the stance. There's a simple routine that builds this the same way every time. Put your feet together with the ball off the middle, then step out. Equal steps put a wedge in the centre. A small lead step and a bigger trail step walk the driver forward toward the lead heel and widen the stance at the same time.",
        "The ball will tell you when it's drifted. An iron played too far forward meets the club after its low point, so you catch it thin or fat, and the shoulders open to reach it, which pulls the start line left. Play it too far back and the club arrives steeply from the inside with the face still open, so shots come out low and push right. A driver played too far back gets hit on the way down, and launches low with too much spin. If your contact changes over a few days, check ball position before you go changing the swing.",
      ],
      keyPoints: [
        "Driver inside the lead heel, struck on the upswing",
        "Mid irons a ball forward of centre; wedges in the centre",
        "Feet together, then step out, and you get the same position every time",
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
        "Put the pieces in order and the whole setup takes about fifteen seconds. From behind the ball, choose the target, choose the intermediate target and picture the shot. Walk in and set the **clubface** to the intermediate target. Take the grip, or confirm the one you've already built. Step the trail foot to set the ball position, then the lead foot to set the width. Hinge, let the arms hang, look at the target once or twice, and go. The order matters, because the face and the ball position are the two settings everything else gets built around.",
        "Practise the routine as a skill in its own right. On the range, hit ten balls where the only goal is reaching the checkpoints in the same order at the same pace, and don't worry about where the ball goes. Then hit ten more with a friend or a phone camera checking one thing, say knuckles showing or shoulder line, from face-on or down the line. If your setup survives a camera it'll survive the first tee, where nerves shorten the routine and tighten your hands before you've noticed.",
      ],
      callout: {
        title: 'On the course',
        text: "When a shot goes wrong, run the checkpoints backwards before you blame the swing. Ball position, alignment, posture, stance, grip. More often than not you'll find the problem in one of those five and never need to touch the swing.",
      },
    },
  ],
  faults: [
    {
      name: 'Weak-grip slice',
      symptom: "Ball starts on the target line or left of it, then curves right, high and short.",
      cause: "With one knuckle showing and the V at your chin, the lead hand comes back to impact with the face open to the path. That gap between face and path adds slice spin, and the flight is weak because an open face adds loft.",
      fix: "Turn the lead hand until you can see two and a half knuckles and both Vs point at the trail shoulder. Then hold the club at hip height and check the leading edge is vertical before you ground it.",
    },
    {
      name: 'Strong-grip hook',
      symptom: "Ball starts right of the target, or straight, then dives left and runs.",
      cause: "Three or four knuckles and a trail hand tucked under the grip bring the face back closed to the path at impact. The more the path travels in to out, the further right the ball starts before it hooks.",
      fix: "Weaken both hands back to neutral, with the trail palm facing the target and its V at the trail shoulder. Then check the face on the way through. At hip height the toe should be pointing up, not at the ground.",
    },
    {
      name: 'Aiming right',
      symptom: "Shots start right of the target and stay there, or you pull them to make up for it.",
      cause: "The body lines are pointing at the flag instead of parallel left of it, so the path and the face are both aimed right. Over time the shoulders start opening early to steer the ball back, and the push turns into a pull.",
      fix: "Lay one stick along your toes and one outside the ball on the target line for the first twenty balls of every session, and always set the face to an intermediate target before you move your feet.",
    },
    {
      name: 'Ball too far forward',
      symptom: "The same swing gives you fat shots one day and thin ones the next, often pulled.",
      cause: "The ball sits past the low point of the arc, so the club has already bottomed out and is on its way back up when it gets there. The shoulders open to reach it as well, which sends the path out to in.",
      fix: "Use the feet-together routine, ball off the middle, then step out. With a 7-iron the ball should finish a ball forward of centre and no more. With a wedge it sits dead centre.",
    },
    {
      name: 'Standing too tall',
      symptom: "Topped or thin shots, and a feeling of reaching for the ball at impact.",
      cause: "Without enough hip hinge the arms have to stretch to reach the ball, and the bottom of the arc sits above it. If the body lifts at all in the downswing, the leading edge catches the top half of the ball.",
      fix: "Rebuild the posture from standing tall. Hinge from the hips until the clubhead reaches the ground, then soften the knees, and check down the line that the shoulders sit over the balls of the feet.",
    },
    {
      name: 'Death grip',
      symptom: "Short, weak shots that fly straight or fade, and tired forearms after a session.",
      cause: "Grip pressure at eight or nine out of ten locks the wrists, so the club can't hinge or release. Clubhead speed drops and the face tends to arrive open, which adds loft and a fade.",
      fix: "Set the pressure at four out of ten and test it with a free waggle before every shot. If the wrists can't move, loosen off until they can, and keep the pressure the same at the top of the swing.",
    },
  ],
  drills: [
    {
      name: 'Feet together, step out',
      goal: "A ball position and stance width you can repeat with every club.",
      steps: [
        "Set the clubface behind the ball, square to an intermediate target a foot ahead.",
        "Bring your feet together with the ball opposite the middle of them.",
        "Step the lead foot a little toward the target, then the trail foot away from it. Equal steps for a wedge, a bigger trail step for the driver.",
        "Lay a club across your toes and check the ball position and the width against the club you're holding.",
      ],
      reps: '10 setups each with a wedge, a 7-iron and the driver',
    },
    {
      name: 'Two-stick station',
      goal: "Face aim and body alignment that agree with the target line.",
      steps: [
        "Lay one alignment stick on the target line just outside the ball and a second along your toe line, parallel to it.",
        "Start behind the ball, pick an intermediate target, walk in and set the face before the feet.",
        "Hit 20 balls, checking after each one that the feet, hips and shoulders still match the inner stick.",
        "Take the sticks away and hit 10 more, then put them back and see whether your aim has drifted.",
      ],
      reps: '20 balls with sticks, 10 without, every session',
    },
    {
      name: 'Mirror posture',
      goal: "A hip hinge that lets the arms hang under the shoulders.",
      steps: [
        "Stand tall side-on to a mirror with the club held out in front of you.",
        "Hinge from the hips until the clubhead reaches the ground, keeping the spine long, then soften the knees.",
        "Look in the mirror. Shoulders over the balls of the feet, hands hanging under the shoulders, chin off the chest.",
        "Hold it for ten seconds, stand up, and rebuild it without looking until it feels familiar.",
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
        "Squeeze to ten out of ten, let it go to one, then settle at four and waggle to check the wrists are free.",
      ],
      reps: '15 grips before every practice session',
    },
  ],
  checklist: [
    "Two to two and a half knuckles showing, both Vs at the trail shoulder",
    "Grip pressure four out of ten, wrists free to waggle",
    "Face set to an intermediate target before the feet go down",
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
      explanation: "Both Vs point at the trail shoulder. A V at the chin is weak, and one outside the trail shoulder is strong.",
    },
    {
      question: "In the railroad-tracks picture, where does your body line point?",
      options: ["Straight at the target", "Parallel to the target line, a little left of the target", "A little right of the target", "It doesn't matter as long as the face is square"],
      answer: 1,
      explanation: "The face sits on the outer rail, aimed at the target. The body sits on the inner rail, parallel to it, so a little left.",
    },
    {
      question: "Where should the ball be for the driver?",
      options: ["In the centre of the stance", "A ball back of centre", "Inside the lead heel", "Opposite the trail heel"],
      answer: 2,
      explanation: "The driver goes inside the lead heel so the club reaches the ball after the low point, on the way up.",
    },
    {
      question: "What comes first when you build your setup?",
      options: ["Setting the feet, then aiming the face", "Aiming the face at the intermediate target, then setting the feet", "Taking the grip on the ground, then aiming", "Choosing stance width, then the target"],
      answer: 1,
      explanation: "Set the face to the intermediate target first, then build the stance around it. You can't line your feet up to a face that isn't aimed yet.",
    },
    {
      question: "Good posture begins with what?",
      options: ["Bending the knees deeply", "Rounding the shoulders toward the ball", "Hinging forward from the hips with a long spine", "Reaching the arms out to the ball"],
      answer: 2,
      explanation: "Hinge from the hips first with the spine long, then soften the knees. The arms will hang under the shoulders on their own after that.",
    },
  ],
  next: 'swing',
};
