export default {
  slug: 'swing',
  number: 2,
  title: 'The Full Swing',
  kicker: 'Foundations',
  tagline: 'One motion, ten checkpoints, one moment of truth.',
  summary: 'The full swing as a single motion, read through the P1 to P10 checkpoints: plane, sequence, width, tempo, impact, and what your finish tells you.',
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
        "A good golf swing is one continuous motion that takes about a second from the first move to the finish. Nobody swings through positions, and you should not try to. What you can do is read the motion at checkpoints, the way a coach freezes video. The P-system numbers ten of them, P1 at address to P10 at the finish, and gives every golfer and every camera the same vocabulary. When you know what should be true at each number, you can look at a single frame of your own swing and know exactly where it went wrong.",
        "P1 is address. P2 is the takeaway, the moment the shaft is parallel to the ground. P3 is the lead arm parallel to the ground going back. P4 is the top. P5 is the lead arm parallel coming down, P6 is the shaft parallel coming down, and P7 is impact. P8 is the shaft parallel again after the ball, P9 is the trail arm parallel, and P10 is the finish. Four of them matter most when you coach yourself, P1, P4, P7 and P10, because each is still or slow enough to feel and easy to freeze on a phone.",
        "Everything here is written for a right-handed golfer. If you play left-handed, mirror it: your lead side is your right side and every left becomes a right. Film yourself from two angles, face-on and down the line, with the camera at hand height and level with the ball, and pause at each P. The viewer below shows an iron swing with P1, P4, P7 and P10 highlighted. Scrub it slowly, orbit around it, and compare each frame with your own before you read further.",
      ],
      keyPoints: [
        'Ten checkpoints, one motion: use them to diagnose, never to pose.',
        'P1, P4, P7 and P10 are the four a beginner can feel and film.',
        'Left-handed golfers mirror everything: the lead side becomes the right side.',
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
        "At P1 you are simply set up well: neutral grip, hands slightly ahead of the ball with an iron, spine tilted forward from the hips, pressure balanced between both feet. From there the takeaway is a one-piece move of hands, arms and chest together. At P2 the shaft is parallel to the ground and to the target line, the clubhead is in line with or just outside your hands, and the toe points roughly to the sky so the face matches your spine angle. A clubhead well inside your hands means you rolled the forearms; a face pointing at the sky means you cupped the lead wrist open.",
        "By P3 the lead arm is parallel to the ground and the wrists have set the shaft to roughly a right angle with the lead arm. Seen down the line, the butt end of the grip points at the ball-to-target line: that is the picture of a club on plane. The trail elbow has begun to fold and points down, not out behind you. Your chest has turned about halfway, pressure has moved into the inside of the trail foot, and the trail knee still has its flex. Most of the work of the backswing is done here. The rest is turn.",
        "P4, the top, is where one frame tells you the most. The lead wrist is flat or slightly bowed, so the clubface matches the lead forearm rather than hanging open toward the ground. The shaft points roughly parallel to the target line. The trail elbow sits below the hands, the shoulders have turned about 90 degrees and the hips about half that, and well over half of your pressure is in the trail foot without the hips sliding past it. Length is not the goal. A full turn with the arms still in front of the chest is.",
      ],
      keyPoints: [
        'P2: shaft parallel to the ground and the target line, clubhead over or just outside the hands.',
        'P3: wrists set, butt of the grip pointing at the target line, trail elbow pointing down.',
        'P4: flat lead wrist, shoulders about 90 degrees, pressure in the trail foot, hips centred.',
      ],
      callout: {
        title: 'Feel it',
        text: 'From P1 to P2, feel club, hands and chest move as one unit for the first metre. The wrists then set almost on their own as the momentum of the clubhead catches up with the slower turn of your chest. You never have to lift the club.',
      },
    },
    {
      id: 'swing-plane',
      heading: 'The swing plane',
      body: [
        "Imagine a pane of glass resting on your shoulders and passing through the ball, tilted at the angle of the shaft at address. The old image was that a swing stays under the glass; the useful version is that the shaft should lie on that inclined plane, or point at its base, at each checkpoint. Down the line, the test at P2 and P6 is that the shaft is parallel to the target line. At P3 and P5 it is that the butt end of the grip points at the target line. Pointing at your feet means steep, above the plane. Pointing beyond the ball means flat, below it.",
        "The plane is not one fixed sheet of glass. Almost every good player takes the club back slightly steeper than they bring it down. In transition the shaft shallows onto a flatter plane, which is why a well-struck iron approaches the ball from a little inside with the hands leading. What you want to avoid is the reverse: a flat, inside takeaway followed by a steep downswing. That is the signature of the over-the-top move and the reason so many golfers pull and slice.",
        "Steep and flat each carry a family of tendencies. A steep delivery arrives from outside the line, digs deep divots, and pairs with an out-to-in path: pulls, slices and heel strikes. A flat delivery comes from too far inside, catches the ground behind the ball or thins it, and pairs with an in-to-out path: blocks, hooks and toe strikes. Neither is a character flaw. Find which one you are, then work on the checkpoint that governs it, P2 for the takeaway and P6 for the delivery, until the shaft points back at the target line.",
      ],
      keyPoints: [
        'On plane at P3 and P5: the butt of the grip points at the target line.',
        'On plane at P2 and P6: the shaft is parallel to the target line.',
        'Butt pointing at your feet means steep; pointing beyond the ball means flat.',
        'Good players go back slightly steep and come down slightly flatter, never the reverse.',
      ],
    },
    {
      id: 'kinematic-sequence',
      heading: 'Transition and the kinematic sequence',
      body: [
        "Speed is built from the ground up, in order. The feet push against the ground, the hips rotate first, the torso follows and overtakes them, the arms follow the torso, and the club, last of all, whips through with the speed of everything beneath it. Each segment accelerates and then slows as it hands its speed to the next. Measured on a tour player this appears as four peaks in a strict order: pelvis, thorax, arms, club. The order matters more than the effort. A golfer who starts down with the arms has skipped the first two steps and has only the arms left to hit with.",
        "The least intuitive fact about the sequence is when it begins. Transition starts from the ground while the arms and club are still finishing the backswing. Somewhere between P3 and P4 your pressure begins to move into the lead foot and the hips begin to unwind, even though the club has not reached the top. Freeze a good player at P4 and the lower body already looks like it is going down while the club looks like it is still going back. That brief stretch between the two is where the swing loads, and it is what your arms are waiting for.",
        "Read the result at P5 and P6. At P5, the lead arm parallel on the way down, the hips are already open to the target line, the trail elbow has dropped in front of the trail hip, and the shaft is a touch flatter than it was at P3. At P6 the shaft is parallel to the ground and parallel to the target line, the clubhead is behind the hands rather than outside them, and the wrists still hold most of their angle. If your P6 shows the clubhead outside your hands, the arms won the race and everything after it is a rescue.",
      ],
      callout: {
        title: 'Feel it',
        text: 'Feel your lead heel press into the ground and your belt buckle begin to turn while your hands are still going up. Two things at once is the whole feeling of transition. It will feel early. It is not.',
      },
    },
    {
      id: 'width-arc-tempo',
      heading: 'Width, arc and tempo',
      body: [
        "Width is the distance between your hands and your chest, and between the clubhead and your body. Keep the lead arm long but not locked, let the trail arm fold late, and the clubhead travels a wide arc with room to gather speed. Narrow swings, where the hands pull in toward the trail shoulder by P3, produce a short arc, a steep chop and lost distance. The checks are a straight line from lead shoulder to clubhead at P2 and the hands well away from the head at P4. The arc narrows briefly through transition, then reaches its widest point after the ball, at P8, with both arms extended.",
        "Tempo is the total time the swing takes; rhythm is how that time is divided. Nearly every good player, fast or slow, divides it the same way: about three parts backswing to one part downswing. In real time that is about three quarters of a second to the top and a quarter of a second down. A quick backswing is not the villain people think it is; a backswing so laboured that it never connects to the downswing is. Count *one, two, three* to the top and *four* at the ball, and let the count set the speed.",
        "Rhythm also keeps the sequence honest. A backswing rushed by the hands is usually finished by the hands, because there was never time for the lower body to start first. If you fight the over-the-top move, smoothing the first metre of the takeaway does more for your transition than any thought about the downswing itself.",
      ],
      keyPoints: [
        'Width: lead arm long, hands away from the chest, widest point of the arc at P8.',
        'Rhythm: three counts back, one count down, at whatever speed is natural for you.',
        'A hurried takeaway is the most common reason the arms start the downswing.',
      ],
    },
    {
      id: 'impact-and-finish',
      heading: 'Impact, and the finish that explains it',
      body: [
        "P7 is the only checkpoint the ball ever sees. With an iron the hands are ahead of the clubhead, so the shaft leans toward the target and the club reaches the ball with several degrees less loft than is stamped on it. Roughly 80 percent or more of your pressure is in the lead foot, the hips are open by around 40 degrees with the shoulders closer to square, and the head is still behind the ball rather than chasing it toward the target. The clubhead is still travelling downward, about 4 degrees for a mid-iron, so the ball is struck first and the divot begins after it.",
        "P8 to P10 is momentum, and momentum tells the truth about what came before. At P8 the shaft is parallel to the ground again, both arms are extended, and the toe of the club points up. At P9 the trail arm is parallel, the lead elbow has folded softly, and the trail foot is up on its toe. P10 is the finish: chest and belt buckle facing the target or left of it, nearly all your weight on a flat lead foot, the trail knee beside the lead knee, the club resting behind your neck, and you able to hold the pose for three seconds without a wobble.",
        "Treat that finish as your diagnostic. Falling backward means your weight never left the trail side. A finish that stumbles toward the ball line means the hips stalled and the upper body dived at the ball. A short, blocked finish with the arms out in front of the chest points to an in-to-out swing that had to hold the face. A full, quiet, balanced finish is very hard to reach unless the sequence was close to right, which is why practising the finish is practising the swing.",
        "The ball never sees a checkpoint. It sees roughly half a millisecond of contact and reports the face angle, the path, the strike point and the speed it found there. The grid below connects the two languages: the motion you can feel and film, and the flight that grades it.",
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
      symptom: 'Ball starts left of the target and slices back to the right; divots point left; strikes drift toward the heel.',
      cause: 'The arms and shoulders start the downswing before the lower body, throwing the shaft outside the plane at P6. The path is out-to-in and the face, though it may be square to the target, is open to that path, so the ball starts left and curves right.',
      fix: 'Pump drill: swing to P4, pump the hands down to P6 twice while the belt buckle turns and the trail elbow drops in front of the trail hip, then hit on the third pump. The clubhead must sit behind the hands at P6.',
    },
    {
      name: 'Reverse pivot',
      symptom: 'Weight leans toward the target at the top and falls away from it through the ball; thin and fat strikes, weak high slices, a finish that falls backward.',
      cause: 'The spine tilts toward the target during the backswing instead of the pressure loading into the trail foot, so the only way down is to fall back. Low point moves behind the ball and the club arrives shallow and open.',
      fix: 'At P3, check that the inside of the trail foot carries the pressure and the head has stayed over the ball, not ahead of it. Practise with a ball under the outside of the trail foot to feel the load stay inside it.',
    },
    {
      name: 'Early extension',
      symptom: 'A two-way miss of blocks and hooks, strikes toward the heel and the occasional shank, a finish that stands tall with the hips ahead of the chest.',
      cause: 'The pelvis thrusts toward the ball in the downswing and the spine loses its forward tilt. The arms are trapped behind the body and the hands must flip to reach the ball, so the face is wild and the path swings far in-to-out.',
      fix: 'Chair drill: set up with your backside touching a chair or wall, swing, and keep the trail cheek in contact through impact. Ten slow swings with contact, then ten balls, with the feeling that the hips turn rather than move forward.',
    },
    {
      name: 'Casting',
      symptom: 'High, weak shots with no compression, fat and thin strikes on the same day, and a big distance gap between the long irons and the wedges.',
      cause: 'The wrists unhinge at the start of the downswing, so the clubhead passes the hands before impact. Low point moves behind the ball, dynamic loft rises and clubhead speed is spent before the strike.',
      fix: 'Impact bag or a rolled towel: from P6, hit the bag with the hands ahead of the clubhead and the shaft leaning forward, holding the position for two seconds. Feel the trail wrist still bent back at the moment of contact.',
    },
    {
      name: 'Sway',
      symptom: 'Contact wanders between fat and thin from swing to swing, the ball flight is unpredictable, and the trail hip drifts outside the trail foot at P4.',
      cause: 'The hips slide away from the target instead of turning, so the low point of the swing moves back too. Returning it to the ball demands a compensating slide forward that seldom arrives on time.',
      fix: 'Push an alignment stick into the ground just outside your trail hip at address. Turn to P4 without touching it and feel the trail hip move back and around, with the pressure staying inside the trail foot.',
    },
  ],
  drills: [
    {
      name: 'Mirror checkpoints',
      goal: 'Learn what P2, P3 and P4 feel like so you can trust them without a camera.',
      steps: [
        'Set up side-on to a mirror or a phone at hand height, down the line.',
        'Swing to P2 and stop: shaft parallel to the ground and the target line, clubhead over the hands, toe up.',
        'Continue to P3 and stop: wrists set, butt of the grip pointing at the target line, trail elbow down.',
        'Continue to P4 and stop: flat lead wrist, shoulders turned 90 degrees, pressure inside the trail foot.',
        'Rehearse each stop three times in slow motion, then make one full swing and feel the same shapes flow together.',
      ],
      reps: '3 rounds of the sequence, then 10 balls',
    },
    {
      name: 'Step-through sequence',
      goal: 'Train the lower body to start the downswing before the arms finish the backswing.',
      steps: [
        'Address a ball on a tee with a mid-iron, feet together, ball opposite your trail foot.',
        'Start the backswing with the feet together.',
        'As the club reaches P3, step the lead foot out to its normal stance width and plant it before the club reaches the top.',
        'Swing through to a full P10 and hold the finish for three seconds.',
      ],
      reps: '2 sets of 10 balls, then 10 with a normal stance',
    },
    {
      name: 'Pump to P6',
      goal: 'Shallow the shaft in transition and keep the clubhead behind the hands into delivery.',
      steps: [
        'Swing to P4 and pause for one second.',
        'Pump the hands down to P6 while the belt buckle turns and the trail elbow drops in front of the trail hip, then return to P4.',
        'Pump a second time and check that the shaft is parallel to the target line with the clubhead behind the hands.',
        'On the third pump, swing through and hit the ball at about three-quarter speed.',
      ],
      reps: '3 sets of 8 balls',
    },
    {
      name: 'Three-to-one count',
      goal: 'Set a repeatable rhythm with a longer backswing than downswing.',
      steps: [
        'Count *one, two, three* slowly and evenly, then *four* at the same pace.',
        'Start the takeaway on *one*, reach P4 on *three*, and strike the ball on *four*.',
        'Make ten swings without a ball at the count, then ten balls, without changing the pace of the count.',
        'If the ball flight worsens, slow the count rather than speeding it up.',
      ],
      reps: '10 rehearsals, then 10 balls',
    },
  ],
  checklist: [
    'P1: neutral grip, hands slightly ahead of the ball with an iron, pressure balanced.',
    'P2: shaft parallel to the ground and the target line, clubhead over the hands, toe up.',
    'P3: butt of the grip points at the target line, trail elbow down, pressure inside the trail foot.',
    'P4: flat lead wrist, shoulders turned about 90 degrees, hips centred, arms in front of the chest.',
    'Transition: lead heel presses and hips unwind while the club is still finishing the backswing.',
    'P6: shaft parallel to the target line with the clubhead behind the hands.',
    'P7: hands ahead with an iron, shaft leaning forward, pressure in the lead foot, head behind the ball.',
    'P10: chest at the target, weight on a flat lead foot, held for three seconds.',
  ],
  quiz: [
    {
      question: 'At P2, seen down the line, where should the clubhead be relative to your hands?',
      options: [
        'Well inside the hands',
        'In line with or just outside the hands',
        'Well outside the hands and above the plane',
        'It does not matter at P2',
      ],
      answer: 1,
      explanation: 'A clubhead over or just outside the hands at P2 shows a one-piece takeaway; well inside means the forearms rolled.',
    },
    {
      question: 'Which part of the body starts the downswing in a good kinematic sequence?',
      options: ['The arms', 'The shoulders', 'The lower body, pressing into the ground', 'The hands'],
      answer: 2,
      explanation: 'Speed is built from the ground up: hips first, then torso, arms and finally the club.',
    },
    {
      question: 'Roughly what ratio of backswing time to downswing time do good players share?',
      options: ['1:1', '2:1', '3:1', '5:1'],
      answer: 2,
      explanation: 'Nearly all good players take about three parts of time going back to one part coming down.',
    },
    {
      question: 'Down the line at P3, the butt end of the grip points at your feet. What does that tell you?',
      options: ['The club is on plane', 'The club is flat, below the plane', 'The club is steep, above the plane', 'The face is open'],
      answer: 2,
      explanation: 'On plane, the butt points at the target line; pointing at your feet means the shaft is steeper than the plane.',
    },
    {
      question: 'Which statement describes impact with an iron?',
      options: [
        'Hands behind the clubhead and pressure on the trail foot',
        'Hands ahead of the clubhead, shaft leaning forward, most pressure in the lead foot',
        'Head ahead of the ball with the weight evenly balanced',
        'Clubhead moving upward through the ball',
      ],
      answer: 1,
      explanation: 'Irons are struck with forward shaft lean, the pressure in the lead foot and the head still behind the ball, so the clubhead is descending.',
    },
  ],
  next: 'driver',
};
