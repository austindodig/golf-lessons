export default {
  slug: 'swing',
  number: 2,
  title: 'The Full Swing',
  kicker: 'Foundations',
  tagline: 'Ten places to check a swing that only lasts a second.',
  summary: "The full swing as one motion, read through the P1 to P10 checkpoints. Plane, sequence, width, tempo, impact, and what your finish can tell you about all of it.",
  duration: '35 min',
  level: 'Beginner to Intermediate',
  hero: {
    image: 'swing',
    stats: [
      { label: 'Checkpoints', value: 'P1 to P10' },
      { label: 'Rhythm', value: '3:1 back to down' },
      { label: 'Sequence', value: 'Ground, hips, torso, arms, club' },
    ],
  },
  sections: [
    {
      id: 'one-motion',
      heading: 'One motion, read at ten checkpoints',
      body: [
        "A good golf swing is one continuous motion, about a second from the first move to the finish. Nobody swings through a set of positions, and I don't want you trying to. What you can do is read the motion at checkpoints, the way a coach freezes video. The P-system numbers ten of them, from P1 at address to P10 at the finish, so every golfer and every camera is talking the same language. Once you know what should be true at each number, you can look at one frame of your own swing and see where it went wrong.",
        "P1 is address. P2 is the takeaway, the moment the shaft is parallel to the ground. P3 is the lead arm parallel to the ground going back, and P4 is the top. P5 is the lead arm parallel coming down, P6 is the shaft parallel coming down, and P7 is impact. P8 is the shaft parallel again after the ball, P9 is the trail arm parallel, and P10 is the finish. When you're coaching yourself, the four that matter most are P1, P4, P7 and P10. They're still or slow enough to feel, and they're easy to freeze on a phone.",
        "Everything here is written for a right-handed golfer. If you play left-handed, mirror it, so your lead side is your right side and every left becomes a right. Film yourself from two angles, face-on and down the line, with the camera at hand height and level with the ball, and pause at each P. The viewer below shows an iron swing with P1, P4, P7 and P10 highlighted. Scrub through it slowly, orbit around it, and compare each frame with your own before you read on. Honestly, ten minutes doing that is time well spent.",
      ],
      keyPoints: [
        "Ten checkpoints in one motion. Use them to diagnose, not to pose.",
        "P1, P4, P7 and P10 are the four a beginner can feel and film.",
        "Left-handed golfers mirror everything, so the lead side becomes the right side.",
      ],
      module: {
        type: 'swing-viewer',
        preset: { club: 'iron', highlight: [1, 4, 7, 10] },
        caption: 'Scrub the iron swing. The highlighted frames are P1, P4, P7 and P10. Orbit to down-the-line to see the plane pane.',
      },
    },
    {
      id: 'backswing-p1-p4',
      heading: 'The backswing: P1 to P4',
      body: [
        "At P1 you're simply set up well. Neutral grip, hands slightly ahead of the ball with an iron, spine tilted forward from the hips, pressure balanced between both feet. From there the takeaway is a one-piece move, with the hands, arms and chest going together. At P2 the shaft is parallel to the ground and to the target line, the clubhead is in line with or just outside your hands, and the toe points roughly at the sky so the face matches your spine angle. If the clubhead is well inside your hands, you rolled the forearms. If the face is pointing at the sky, you've cupped the lead wrist open.",
        "By P3 the lead arm is parallel to the ground and the wrists have set the shaft to roughly a right angle with the lead arm. Down the line, the butt end of the grip points at the ball-to-target line, and that's what a club on plane looks like. The trail elbow has started to fold and points down, not out behind you. Your chest has turned about halfway, pressure has moved into the inside of the trail foot, and the trail knee still has its flex. Most of the backswing's work is done by now. What's left is just turning.",
        "P4, the top, is where a single frame tells you the most. The lead wrist is flat or slightly bowed, so the clubface matches the lead forearm instead of hanging open toward the ground. The shaft points roughly parallel to the target line. The trail elbow sits below the hands, the shoulders have turned about 90 degrees and the hips about half that, and well over half your pressure is in the trail foot without the hips sliding past it. Don't go chasing length here. You want a full turn with the arms still in front of the chest, and that's enough.",
      ],
      keyPoints: [
        "P2: shaft parallel to the ground and the target line, clubhead over or just outside the hands.",
        "P3: wrists set, butt of the grip pointing at the target line, trail elbow pointing down.",
        "P4: flat lead wrist, shoulders about 90 degrees, pressure in the trail foot, hips centred.",
      ],
      callout: {
        title: 'Feel it',
        text: "From P1 to P2, feel the club, hands and chest move as one unit for the first metre. After that the wrists set almost on their own, as the momentum of the clubhead catches up with the slower turn of your chest. You never have to lift the club yourself.",
      },
    },
    {
      id: 'swing-plane',
      heading: 'The swing plane',
      body: [
        "Imagine a pane of glass resting on your shoulders and passing through the ball, tilted at the angle of the shaft at address. The old picture had the swing staying under the glass. I'd rather you think of it this way: the shaft should lie on that tilted plane, or point at the base of it, at each checkpoint. Down the line, the test at P2 and P6 is that the shaft is parallel to the target line. At P3 and P5 the test is that the butt end of the grip points at the target line. If it points at your feet you're steep, above the plane. If it points beyond the ball you're flat, below it.",
        "The plane isn't one fixed sheet of glass, though. Almost every good player takes the club back slightly steeper than they bring it down. In transition the shaft shallows onto a flatter plane, and that's how a well-struck iron ends up approaching the ball from a little inside with the hands leading. The one you want to avoid is the reverse, a flat, inside takeaway followed by a steep downswing. That's the over-the-top move, and it's where most of the pulls and slices I see come from.",
        "Steep and flat each come with their own family of misses. A steep delivery arrives from outside the line, digs deep divots and pairs with an out-to-in path, so you get pulls, slices and heel strikes. A flat delivery comes from too far inside, catches the ground behind the ball or thins it, and pairs with an in-to-out path, so you get blocks, hooks and toe strikes. Work out which one you are, then spend your time on the checkpoint that governs it, P2 for the takeaway and P6 for the delivery, until the shaft is pointing back at the target line. Don't try to fix both at once.",
      ],
      keyPoints: [
        "On plane at P3 and P5: the butt of the grip points at the target line.",
        "On plane at P2 and P6: the shaft is parallel to the target line.",
        "Butt pointing at your feet means steep; pointing beyond the ball means flat.",
        "Good players go back slightly steep and come down slightly flatter, never the reverse.",
      ],
    },
    {
      id: 'kinematic-sequence',
      heading: 'Transition and the kinematic sequence',
      body: [
        "Speed gets built from the ground up, in order. The feet push against the ground, the hips rotate first, the torso follows and overtakes them, the arms follow the torso, and the club, last of all, whips through with the speed of everything underneath it. Each segment speeds up and then slows down as it hands its speed on to the next one. Measure it on a tour player and you see four peaks in a strict order, pelvis, thorax, arms, club. Getting that order right does more for you than trying harder ever will. Start down with the arms and you've skipped the first two steps, so the arms are all you've got left to hit with.",
        "The part people find hardest to believe is when the sequence begins. Transition starts from the ground while the arms and club are still finishing the backswing. Somewhere between P3 and P4 your pressure starts moving into the lead foot and the hips start to unwind, even though the club hasn't reached the top yet. Freeze a good player at P4 and the lower body already looks like it's going down while the club still looks like it's going back. That brief stretch between the two is where the swing loads, and it's what your arms are waiting for.",
        "You read the result at P5 and P6. At P5, lead arm parallel on the way down, the hips are already open to the target line, the trail elbow has dropped in front of the trail hip, and the shaft is a touch flatter than it was at P3. At P6 the shaft is parallel to the ground and to the target line, the clubhead is behind the hands rather than outside them, and the wrists still hold most of their angle. If your P6 shows the clubhead outside your hands, the arms won the race, and everything from there on is a rescue job.",
      ],
      callout: {
        title: 'Feel it',
        text: "Feel your lead heel press into the ground and your belt buckle start to turn while your hands are still going up. Two things at once. That's the whole feeling of transition, and it'll seem early to you, but it isn't.",
      },
    },
    {
      id: 'width-arc-tempo',
      heading: 'Width, arc and tempo',
      body: [
        "Width is the distance between your hands and your chest, and between the clubhead and your body. Keep the lead arm long but not locked, let the trail arm fold late, and the clubhead travels a wide arc with room to gather speed. A narrow swing, where the hands pull in toward the trail shoulder by P3, gives you a short arc, a steep chop and lost distance. Check for a straight line from lead shoulder to clubhead at P2, and for the hands well away from your head at P4. The arc narrows briefly through transition, then gets to its widest point after the ball, at P8, with both arms extended.",
        "Tempo is the total time the swing takes, and rhythm is how that time gets divided up. Nearly every good player, fast or slow, divides it the same way, about three parts backswing to one part downswing. In real time that's roughly three quarters of a second to the top and a quarter of a second down. A quick backswing isn't the villain people think it is. What really hurts you is a backswing so laboured it never connects to the downswing. Count *one, two, three* to the top and *four* at the ball, and let the count set the speed.",
        "Rhythm also keeps the sequence honest. If the hands rush the backswing, the hands usually finish it too, because the lower body never had time to get going first. If you're fighting the over-the-top move, smoothing out the first metre of the takeaway will do more for your transition than any thought about the downswing itself.",
      ],
      keyPoints: [
        "Width: lead arm long, hands away from the chest, widest point of the arc at P8.",
        "Rhythm: three counts back, one count down, at whatever speed feels natural to you.",
        "A hurried takeaway is the most common reason the arms start the downswing.",
      ],
    },
    {
      id: 'impact-and-finish',
      heading: 'Impact, and the finish that explains it',
      body: [
        "P7 is the only checkpoint the ball ever sees. With an iron the hands are ahead of the clubhead, so the shaft leans toward the target and the club reaches the ball with several degrees less loft than is stamped on it. Roughly 80 percent or more of your pressure is in the lead foot, the hips are open by around 40 degrees with the shoulders closer to square, and the head is still behind the ball rather than chasing it toward the target. The clubhead is still travelling downward, about 4 degrees with a mid-iron, so you strike the ball first and the divot starts after it.",
        "P8 to P10 is just momentum, and momentum can't lie about what came before it. At P8 the shaft is parallel to the ground again, both arms are extended and the toe of the club points up. At P9 the trail arm is parallel, the lead elbow has folded softly and the trail foot is up on its toe. P10 is the finish. Chest and belt buckle facing the target or left of it, nearly all your weight on a flat lead foot, the trail knee beside the lead knee, the club resting behind your neck, and you should be able to hold it for three seconds without a wobble.",
        "Use that finish to diagnose yourself. If you fall backward, your weight never left the trail side. If you stumble toward the ball line, the hips stalled and the upper body dived at the ball. A short, blocked finish with the arms out in front of the chest points to an in-to-out swing that had to hold the face off. It's very hard to reach a full, quiet, balanced finish unless the sequence was close to right, so when you practise the finish you're really practising the swing.",
        "The ball doesn't see any of the checkpoints. All it gets is roughly half a millisecond of contact, and it reports back the face angle, the path, the strike point and the speed it found there. The grid below joins up the two languages, the motion you can feel and film and the flight that grades it.",
      ],
      module: {
        type: 'flight-laws',
        preset: {},
        caption: 'The nine flights. Start direction comes mostly from the face, curve from the path relative to the face. Every P7 lands somewhere on this grid.',
      },
    },
  ],
  faults: [
    {
      name: 'Over the top',
      symptom: "Ball starts left of the target and slices back to the right; divots point left; strikes drift toward the heel.",
      cause: "The arms and shoulders start the downswing before the lower body and throw the shaft outside the plane at P6. The path is out-to-in, and the face, even if it's square to the target, is open to that path, so the ball starts left and curves right.",
      fix: "Pump drill. Swing to P4, pump the hands down to P6 twice while the belt buckle turns and the trail elbow drops in front of the trail hip, then hit on the third pump. Check that the clubhead is sitting behind the hands at P6.",
    },
    {
      name: 'Reverse pivot',
      symptom: "Weight leans toward the target at the top and falls away from it through the ball; thin and fat strikes, weak high slices, a finish that falls backward.",
      cause: "The spine tilts toward the target during the backswing instead of the pressure loading into the trail foot, so the only way down is to fall back. The low point moves behind the ball and the club arrives shallow and open.",
      fix: "At P3, check that the inside of the trail foot is carrying the pressure and your head has stayed over the ball, not ahead of it. Practise with a ball under the outside of the trail foot and you'll feel the load stay on the inside.",
    },
    {
      name: 'Early extension',
      symptom: "A two-way miss of blocks and hooks, strikes toward the heel and the occasional shank, a finish that stands tall with the hips ahead of the chest.",
      cause: "The pelvis thrusts toward the ball in the downswing and the spine loses its forward tilt. The arms get trapped behind the body and the hands have to flip to reach the ball, so the face is wild and the path swings a long way in-to-out.",
      fix: "Chair drill. Set up with your backside touching a chair or a wall, swing, and keep the trail cheek in contact through impact. Ten slow swings with contact, then ten balls, feeling the hips turn rather than push forward.",
    },
    {
      name: 'Casting',
      symptom: "High, weak shots with no compression, fat and thin strikes on the same day, and a big distance gap between the long irons and the wedges.",
      cause: "The wrists unhinge at the start of the downswing, so the clubhead passes the hands before impact. The low point moves behind the ball, dynamic loft goes up and the clubhead speed is spent before the strike.",
      fix: "Use an impact bag or a rolled towel. From P6, hit the bag with the hands ahead of the clubhead and the shaft leaning forward, and hold the position for two seconds. You want to feel the trail wrist still bent back at the moment of contact.",
    },
    {
      name: 'Sway',
      symptom: "Contact wanders between fat and thin from swing to swing, the ball flight is unpredictable, and the trail hip drifts outside the trail foot at P4.",
      cause: "The hips slide away from the target instead of turning, so the low point of the swing moves back with them. Getting it back to the ball needs a compensating slide forward, and that seldom arrives on time.",
      fix: "Push an alignment stick into the ground just outside your trail hip at address. Turn to P4 without touching it. You'll feel the trail hip move back and around, with the pressure staying inside the trail foot.",
    },
  ],
  drills: [
    {
      name: 'Mirror checkpoints',
      goal: "Learn what P2, P3 and P4 feel like so you can trust them without a camera.",
      steps: [
        "Set up side-on to a mirror or a phone at hand height, down the line.",
        "Swing to P2 and stop. Shaft parallel to the ground and the target line, clubhead over the hands, toe up.",
        "Continue to P3 and stop. Wrists set, butt of the grip pointing at the target line, trail elbow down.",
        "Continue to P4 and stop. Flat lead wrist, shoulders turned 90 degrees, pressure inside the trail foot.",
        "Rehearse each stop three times in slow motion, then make one full swing and feel the same shapes flow together.",
      ],
      reps: '3 rounds of the sequence, then 10 balls',
    },
    {
      name: 'Step-through sequence',
      goal: "Teach the lower body to start the downswing before the arms have finished the backswing.",
      steps: [
        "Address a ball on a tee with a mid-iron, feet together, ball opposite your trail foot.",
        "Start the backswing with the feet together.",
        "As the club reaches P3, step the lead foot out to its normal stance width and plant it before the club reaches the top.",
        "Swing through to a full P10 and hold the finish for three seconds.",
      ],
      reps: '2 sets of 10 balls, then 10 with a normal stance',
    },
    {
      name: 'Pump to P6',
      goal: "Shallow the shaft in transition and keep the clubhead behind the hands into delivery.",
      steps: [
        "Swing to P4 and pause for one second.",
        "Pump the hands down to P6 while the belt buckle turns and the trail elbow drops in front of the trail hip, then go back to P4.",
        "Pump a second time and check that the shaft is parallel to the target line with the clubhead behind the hands.",
        "On the third pump, swing through and hit the ball at about three-quarter speed.",
      ],
      reps: '3 sets of 8 balls',
    },
    {
      name: 'Three-to-one count',
      goal: "Set a rhythm you can repeat, with a longer backswing than downswing.",
      steps: [
        "Count *one, two, three* slowly and evenly, then *four* at the same pace.",
        "Start the takeaway on *one*, reach P4 on *three*, and strike the ball on *four*.",
        "Make ten swings without a ball at the count, then ten balls, without changing the pace of the count.",
        "If the ball flight gets worse, slow the count down rather than speeding it up.",
      ],
      reps: '10 rehearsals, then 10 balls',
    },
  ],
  checklist: [
    "P1: neutral grip, hands slightly ahead of the ball with an iron, pressure balanced.",
    "P2: shaft parallel to the ground and the target line, clubhead over the hands, toe up.",
    "P3: butt of the grip points at the target line, trail elbow down, pressure inside the trail foot.",
    "P4: flat lead wrist, shoulders turned about 90 degrees, hips centred, arms in front of the chest.",
    "Transition: lead heel presses and hips unwind while the club is still finishing the backswing.",
    "P6: shaft parallel to the target line with the clubhead behind the hands.",
    "P7: hands ahead with an iron, shaft leaning forward, pressure in the lead foot, head behind the ball.",
    "P10: chest facing the target, weight on a flat lead foot, held for three seconds.",
  ],
  quiz: [
    {
      question: "At P2, seen down the line, where should the clubhead be relative to your hands?",
      options: [
        "Well inside the hands",
        "In line with or just outside the hands",
        "Well outside the hands and above the plane",
        "It doesn't matter at P2",
      ],
      answer: 1,
      explanation: "A clubhead over or just outside the hands at P2 shows a one-piece takeaway. Well inside means the forearms rolled.",
    },
    {
      question: "Which part of the body starts the downswing in a good kinematic sequence?",
      options: ["The arms", "The shoulders", "The lower body, pressing into the ground", "The hands"],
      answer: 2,
      explanation: "Speed gets built from the ground up. Hips first, then torso, then arms, and the club last.",
    },
    {
      question: "Roughly what ratio of backswing time to downswing time do good players share?",
      options: ["1:1", "2:1", "3:1", "5:1"],
      answer: 2,
      explanation: "Nearly all good players spend about three parts of the time going back and one part coming down.",
    },
    {
      question: "Down the line at P3, the butt end of the grip points at your feet. What does that tell you?",
      options: ["The club is on plane", "The club is flat, below the plane", "The club is steep, above the plane", "The face is open"],
      answer: 2,
      explanation: "On plane, the butt points at the target line. Pointing at your feet means the shaft is steeper than the plane.",
    },
    {
      question: "Which of these describes impact with an iron?",
      options: [
        "Hands behind the clubhead and pressure on the trail foot",
        "Hands ahead of the clubhead, shaft leaning forward, most pressure in the lead foot",
        "Head ahead of the ball with the weight evenly balanced",
        "Clubhead moving upward through the ball",
      ],
      answer: 1,
      explanation: "Irons are struck with forward shaft lean, the pressure in the lead foot and the head still behind the ball, so the clubhead is on its way down.",
    },
  ],
  next: 'driver',
};
