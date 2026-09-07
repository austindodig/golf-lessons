export default {
  slug: 'irons',
  number: 4,
  title: 'Irons',
  kicker: 'Full swing',
  tagline: 'Hit down, take the divot after, watch it rise.',
  summary: "The descending strike that makes irons work: low point ahead of the ball, shaft lean and weight forward at impact, plus honest distance gapping and trajectory control.",
  duration: '25 min',
  level: 'Beginner to Intermediate',
  hero: {
    image: 'irons',
    stats: [
      { label: 'Attack angle', value: '-3° to -5°' },
      { label: 'Divot', value: 'After the ball' },
      { label: 'Tour 7-iron carry', value: '≈ 172 yd' },
    ],
  },
  sections: [
    {
      id: 'hit-down-to-send-it-up',
      heading: 'Hit down to send it up',
      body: [
        "An iron sits on the ground, so the club has to be travelling **downward** when it reaches the ball. There is no need to help the ball into the air; the loft on the face does that, and it does it best when the club is still descending. A well-struck 7-iron on tour arrives about 4 degrees down, launches around 16 degrees and carries about 172 yards. The ball goes up because the club came down. Trying to lift it does the opposite: it moves the low point behind the ball, and either the leading edge catches the ball thin or the turf catches the club first.",
        "The organising idea is the **low point** of your swing arc. With an iron the low point should be two to four inches in front of the ball, on the target side. The club meets the ball first, still descending, then bottoms out and takes a shallow divot beyond where the ball was sitting. Ball, then turf, in that order. Everything in this lesson, from ball position to weight shift to trajectory control, is a way of putting the low point where it belongs, and every thin or fat shot is the low point in the wrong place.",
      ],
      keyPoints: [
        "Irons are struck on the way down; the loft sends the ball up",
        "The low point sits two to four inches ahead of the ball",
        "Ball first, then a shallow divot after it",
        "Thin and fat are the same fault: the low point in the wrong place",
      ],
      module: {
        type: 'ball-flight',
        preset: { club: '7-iron', attack: -4, focus: 'attack' },
        caption: 'A 7-iron arriving 4° down. Slide attack angle toward zero and beyond and watch launch, spin and carry change.',
      },
    },
    {
      id: 'iron-setup',
      heading: 'Setup for a descending strike',
      body: [
        "Ball position decides where the arc bottoms out. Play short irons and wedges in the **centre** of the stance, mid irons, the 6 through 8, about a ball **forward of centre**, and long irons and hybrids a further ball forward. The stance stays around shoulder width, measured at the insides of the heels, and narrows slightly for the wedges. Your hands sit just ahead of the ball, so the shaft leans a few degrees toward the target and the grip end points at the inside of your lead thigh. Left-handers mirror all of it: lead side right, trail side left.",
        "Shaft lean is not a trick; it is the consequence of the hands leading the clubhead into the ball. At address it should be modest, a few degrees, because pressing the hands far forward de-lofts the club and drags the face open. At impact it grows, so the club delivers a few degrees less loft than is stamped on it, which is where the strong, boring flight of a well-struck iron comes from. Set the pressure in your feet at roughly **55 percent on the lead foot**, and let the shoulders sit close to level, far less tilted than they are with the driver.",
      ],
      keyPoints: [
        "Wedges in the centre, mid irons a ball forward of centre, long irons a ball further",
        "Hands slightly ahead, grip end pointing at the inside of the lead thigh",
        "Pressure about 55 percent on the lead foot at address",
        "Shoulders closer to level than with the driver",
      ],
    },
    {
      id: 'the-turn',
      heading: 'The turn: coil around a steady centre',
      body: [
        "The backswing with an iron is a turn, not a shift. Rotate the shoulders around your spine while the head stays close to where it started and pressure moves to the **inside of the trail foot**, not beyond it. If the hips slide away from the target you have swayed, and the low point goes with you, behind the ball. A useful feel is that the lead shoulder turns down and across toward the ball while the trail hip turns back and around behind you, keeping the trail knee flexed. Depth comes from the turn, not from lifting the arms.",
        "How far back? Far enough that the shoulders have turned around 80 to 90 degrees and the lead arm has stayed reasonably straight, but no further than your body can turn without the arms running on alone. Most golfers who struggle with contact overswing, and the extra length costs sequencing. A **three-quarter feeling** with a full turn usually produces the same speed with a more reliable strike, because the club arrives from a position the body can control. The wrists set naturally as the arms pass hip height; you do not have to make the hinge happen.",
      ],
      keyPoints: [
        "Turn around a steady head; pressure to the inside of the trail foot",
        "No sway: the hips rotate, they do not slide",
        "A full turn with a three-quarter feel beats an overswing",
      ],
      callout: {
        title: 'Feel it',
        text: "Set a club across your shoulders and turn until the grip end points at the ball or just outside it. That is a full turn with the head steady. If your head has moved a foot away from the target in the process, you are sliding, not turning.",
      },
    },
    {
      id: 'impact',
      heading: 'Impact: weight forward, hands ahead',
      body: [
        "Impact with an iron looks nothing like address, and that is the point. By the time the club reaches the ball, pressure has moved strongly into the **lead foot**, 80 percent or more, the hips have opened 35 to 45 degrees toward the target, and the chest is over or just ahead of the ball. The hands are ahead of the clubhead, so the shaft leans forward, and the **lead wrist is flat** or slightly bowed while the trail wrist keeps its bend. That combination keeps the loft down, the face square, and the low point ahead of the ball.",
        "The transition creates all of it. From the top, the first move is pressure into the lead heel and the lead hip opening, before the arms have started down. That gets the body ahead of the club so the hands can arrive ahead of the head. If the arms start first, the body hangs back, the club catches up early and throws its loft at the ball, and the low point shifts behind it. Through impact keep the chest turning toward the target. A body that stops turning forces the hands to flip, and a flip adds loft and moves the low point back.",
        "Read the divot as your report card. It should start **at the ball or just after it**, be shallow, a strip of bacon rather than a pork chop, and point at the target or a fraction left of it because the club is travelling slightly around the body. A divot that starts behind the ball is fat, however the shot felt. No divot at all on a normal lie means the low point never reached the ground, which is the thin shot waiting to happen. Practise on grass whenever you can; mats hide fat strikes by bouncing the club into the ball.",
      ],
      keyPoints: [
        "Pressure 80 percent or more on the lead foot at impact",
        "Hands ahead of the clubhead, lead wrist flat, trail wrist bent",
        "The chest keeps turning; a stall makes the hands flip",
        "Divot starts at or after the ball, shallow, pointing at the target",
      ],
      module: {
        type: 'swing-viewer',
        preset: { club: 'iron', highlight: [6, 7, 8] },
        caption: 'P6 to P8: the shaft leans forward at P7, the chest is already open, and the divot begins after the ball.',
      },
    },
    {
      id: 'distance-gapping',
      heading: 'Distance gapping',
      body: [
        "Irons are built as a ladder. Each club has roughly 3 to 4 degrees more loft and about half an inch less shaft than the one before it, which produces a **gap of about 10 to 15 yards** between clubs for most golfers. A typical mid-handicap male carries a 7-iron somewhere around 140 to 150 yards, so his ladder might run: pitching wedge 110, 9-iron 120, 8-iron 132, 7-iron 145, 6-iron 157, 5-iron 168. A tour player's 7-iron carries about 172, and a fast junior or an older golfer may sit 30 yards either side of that 145.",
        "Those numbers are illustrations, not targets. Your gaps depend on your speed, your strike, the lofts on your set, which can vary by 4 or 5 degrees between manufacturers for the same number on the sole, and the ball you play. The only honest way to know your yardages is to measure **carry**, not total, on a launch monitor or a range with accurate markers, hitting 8 to 10 balls with each club and taking the middle of the group rather than the best one. Write the numbers on a card. A golfer who knows a 7-iron carries 143 will beat one who believes it goes 160.",
        "Watch the top of the bag too. Below a certain speed, long irons stop gapping properly: a 4-iron and a 5-iron may fly the same distance because the ball no longer launches high enough to use the loft. If two clubs carry within 5 yards of each other, replace the longer one with a hybrid. Gapping is about spacing, and a hybrid that flies 15 yards further than your 5-iron is doing more work than a 4-iron that does not.",
      ],
      keyPoints: [
        "About 10 to 15 yards between clubs for most golfers",
        "Measure carry, not total, and use the middle of the group",
        "Lofts vary by set, so learn your own numbers",
        "When long irons stop gapping, move to hybrids",
      ],
    },
    {
      id: 'trajectory-control',
      heading: 'Controlling trajectory',
      body: [
        "Trajectory is the loft delivered at impact plus speed. Move the ball **back an inch** and the club reaches it earlier in the arc, with more shaft lean and less dynamic loft, so the flight comes out lower. Move it forward an inch and the reverse happens. Combine ball position with the length of your finish: a knockdown that stops the follow-through at chest height keeps the hands ahead for longer and the face de-lofted, while a full, high finish releases the loft. Those two dials, ball position and finish, cover most of the shots you will ever need.",
        "Into the wind, take one or two more clubs and swing at 80 percent, because a harder swing adds spin and the wind lifts a spinning ball. Play the ball an inch back, hands ahead, and finish low with the club pointing at the target. The ball will fly lower with less curve. Downwind, or to a raised green, play it slightly forward and finish high. Do not try to hit it higher by leaning back or scooping; that moves the low point behind the ball and produces exactly the thin shot you were trying to avoid.",
      ],
      keyPoints: [
        "Ball back plus a shorter finish: lower flight, less spin",
        "Ball forward plus a full finish: higher flight",
        "Into wind, more club and 80 percent speed, never a harder swing",
      ],
    },
    {
      id: 'thin-and-fat',
      heading: 'Why irons go thin and fat',
      body: [
        "Thin and fat are the same mistake read at different moments. Both mean the **low point moved behind the ball**. If the club reaches the bottom of its arc behind the ball and keeps going, it hits the ground first: fat. If it bottoms out behind the ball and is rising by the time it arrives, the leading edge meets the ball's equator: thin. The four usual causes are weight hanging on the trail foot, a ball played too far forward, an early release that throws the clubhead past the hands, and a sway in the backswing.",
        "Standing up through impact, called **early extension**, produces the same errors by a different route: the hips move toward the ball, the spine straightens, and the arms have to bend or the club rises. To fix it, keep your backside back at impact and feel your chest stay down over the ball as it turns. Because every one of these causes shows up in the divot, use the line drill below as your first diagnostic. If the divot starts behind the line, ask whether the pressure moved forward, whether the ball crept forward, and whether the hands led the club.",
      ],
      callout: {
        title: 'On the course',
        text: "After a fat shot the instinct is to swing easier and lift the ball. Do the opposite: play the next one a fraction back in the stance, set 60 percent of your pressure on the lead foot, and commit to a strike that takes turf after the ball.",
      },
    },
  ],
  faults: [
    {
      name: 'Fat',
      symptom: "The club digs behind the ball; the shot comes up 20 yards short with a big divot.",
      cause: "The low point of the arc is behind the ball, most often because pressure stays on the trail foot through impact or the hands release the clubhead early, adding loft and bottoming the arc out too soon.",
      fix: "Set 60 percent of your pressure on the lead foot at address, keep it there through the swing, and practise the line drill until the divot starts in front of the line.",
    },
    {
      name: 'Thin',
      symptom: "A low, stinging shot struck near the ball's equator with no divot; it runs well past the target.",
      cause: "The same low point behind the ball, but the club is already rising when it arrives. Often the body has stood up out of posture or is scooping to lift the ball.",
      fix: "Keep your chest down over the ball through impact and feel the trail shoulder work down and through; pair that with the line drill and a ball a fraction further back in the stance.",
    },
    {
      name: 'Pull',
      symptom: "Ball starts left of the target and flies fairly straight.",
      cause: "An out-to-in path with the face square to that path, so the face is closed to the target. Common when the ball is too far forward and the shoulders open to reach it, or when the arms start the downswing.",
      fix: "Check ball position first, then rehearse a transition where pressure moves to the lead foot before the arms move, and use a headcover outside the ball to stop the path cutting across.",
    },
    {
      name: 'Push',
      symptom: "Ball starts right of the target and stays there, often lower than usual.",
      cause: "An in-to-out path with the face square to that path but open to the target. Usually the body stalls or slides toward the target, so the club drops too far behind and the face never squares.",
      fix: "Feel the chest turn through to face the target with the lead hip clearing behind you rather than sliding; hold a full finish and check the ball is not too far back in the stance.",
    },
    {
      name: 'Scoop',
      symptom: "High, weak shots with little or no divot that fall short, sometimes with a slight fade.",
      cause: "The trail wrist unbends and the lead wrist cups before impact, throwing loft at the ball and moving the low point back; the hands arrive level with or behind the clubhead.",
      fix: "Hit punch shots with a nine-to-three swing, holding a flat lead wrist and a bent trail wrist past impact, with the grip end pointing at your lead hip in the finish.",
    },
    {
      name: 'Shank',
      symptom: "Ball shoots low and hard to the right off the hosel.",
      cause: "The clubhead returns further from you than it started, usually because the hips move toward the ball in the downswing or the arms swing out and away from the body.",
      fix: "Place a headcover an inch outside the toe and hit balls without touching it; keep pressure through the middle of the feet, not the toes, and your backside back through impact.",
    },
  ],
  drills: [
    {
      name: 'Line drill',
      goal: "A low point that sits ahead of the ball.",
      steps: [
        "Spray a straight line on the turf with foot powder or chalk, at right angles to the target line.",
        "Without a ball, make swings that take a divot starting on the target side of the line.",
        "Place a ball on the line and hit it; the divot must still start in front of the line.",
        "Track ten shots and count only those where the divot began ahead of the line.",
      ],
      reps: '10 swings, then 20 balls',
    },
    {
      name: 'Nine to three',
      goal: "Compression with a flat lead wrist and the hands ahead.",
      steps: [
        "Take a 9-iron, ball in the centre of the stance, 60 percent of your pressure on the lead foot.",
        "Swing the lead arm back to hip height, nine o'clock, and through to hip height, three o'clock.",
        "At the finish the shaft points at the target with the lead wrist flat and the trail wrist still bent.",
        "Ball first, then turf, at half speed; listen for a crisp click rather than a thud.",
      ],
      reps: '3 sets of 10',
    },
    {
      name: 'Lead foot only',
      goal: "Pressure forward at impact, not hanging back.",
      steps: [
        "Address a ball with a 7-iron, then draw the trail foot back so only its toe rests on the ground behind you.",
        "Make three-quarter swings with 80 percent of your pressure on the lead foot throughout.",
        "Strike ball then turf; if you fall backward, the pressure moved to the trail side.",
        "Return to a normal stance and keep the feeling of pressure moving forward before the arms come down.",
      ],
      reps: '10 balls on the lead foot, then 10 normal',
    },
    {
      name: 'Gapping session',
      goal: "Honest carry numbers for every iron in the bag.",
      steps: [
        "On a launch monitor or a range with accurate markers, hit 8 to 10 balls with one club at normal effort.",
        "Discard the two best and two worst, then note the carry of the middle group.",
        "Repeat for every iron and hybrid and write the numbers on a card for your bag.",
        "Where two clubs carry within 5 yards of each other, adjust the set or the lofts.",
      ],
      reps: 'Once a season, and after any equipment change',
    },
  ],
  checklist: [
    "Ball in the centre for wedges, a ball forward of centre for mid irons",
    "Hands slightly ahead, grip end at the inside of the lead thigh",
    "Pressure about 55 percent on the lead foot at address",
    "Turn around a steady head; no sway",
    "Pressure to the lead foot before the arms start down",
    "Chest over the ball and still turning at impact",
    "Lead wrist flat, trail wrist bent, shaft leaning forward",
    "Divot starts at or after the ball and points at the target",
  ],
  quiz: [
    {
      question: "Where should the low point of an iron swing be?",
      options: ["Behind the ball", "Exactly under the ball", "Two to four inches ahead of the ball", "Under the trail foot"],
      answer: 2,
      explanation: "The club must still be descending at the ball, so the arc bottoms out two to four inches on the target side of it.",
    },
    {
      question: "A properly struck iron shot takes a divot that starts where?",
      options: ["Behind the ball", "At the ball or just after it", "Only on wet ground", "Nowhere; good iron shots take no divot"],
      answer: 1,
      explanation: "Ball first, then turf: the divot begins at or just after where the ball sat, and it should be shallow.",
    },
    {
      question: "Roughly how much pressure is on the lead foot at impact with an iron?",
      options: ["About 20 percent", "About half", "80 percent or more", "It depends on the club"],
      answer: 2,
      explanation: "Pressure has moved strongly into the lead foot by impact, 80 percent or more, which keeps the low point ahead of the ball.",
    },
    {
      question: "You want a lower flight into the wind. What do you do?",
      options: ["Ball forward, full finish, swing harder", "Ball back an inch, hands ahead, shorter finish, one more club", "Lean back and lift the ball under the wind", "Take a longer iron and swing as hard as possible"],
      answer: 1,
      explanation: "Ball back and hands ahead reduce delivered loft, a shorter finish holds it, and extra club replaces the speed you gave up to keep spin down.",
    },
    {
      question: "Thin and fat shots usually share which cause?",
      options: ["Too much loft on the club", "The low point behind the ball", "Standing too close to the ball", "A grip that is too strong"],
      answer: 1,
      explanation: "Both are the low point in the wrong place: fat when the club is still descending behind the ball, thin when it is already rising.",
    },
  ],
  next: 'wedges',
};
