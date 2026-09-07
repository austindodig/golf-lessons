import { shoot, CLUBS } from '../src/physics/ballFlight.js';
const tour = [
  { club: 'driver', speed: 113, attack: -1.3, target: { carry: 275, apex: 32, land: 38, spin: 2686, ball: 167, launch: 10.9 } },
  { club: '7-iron', speed: 90, attack: -4.3, target: { carry: 172, apex: 32, land: 46, spin: 7097, ball: 120, launch: 16.3 } },
  { club: 'pitching-wedge', speed: 83, attack: -5, target: { carry: 136, apex: 29, land: 50, spin: 9304, ball: 102, launch: 24.2 } },
  { club: '5-iron', speed: 94, attack: -3.7, target: { carry: 194, apex: 31, land: 43, spin: 5361, ball: 132, launch: 12.1 } },
];
for (const t of tour) {
  const r = shoot({ club: t.club, speed: t.speed, attack: t.attack });
  const L = r.launch, F = r.flight;
  console.log(`${t.club.padEnd(15)} ball ${L.ballSpeedMph.toFixed(0)}/${t.target.ball}  launch ${L.launch.toFixed(1)}/${t.target.launch}  spin ${L.spinRpm.toFixed(0)}/${t.target.spin}  carry ${F.carry.toFixed(0)}/${t.target.carry}  apex ${F.apex.toFixed(0)}/${t.target.apex}  land ${F.landAngle.toFixed(0)}/${t.target.land}  total ${F.total.toFixed(0)}  time ${F.time.toFixed(1)}s`);
}
console.log('--- shape tests (driver 100 mph)');
for (const [face, path] of [[0, 0], [3, 0], [-3, 0], [0, 4], [0, -4], [5, -5], [-2, 4], [2, 6], [-5, 5]]) {
  const r = shoot({ club: 'driver', face, path });
  console.log(`face ${String(face).padStart(3)} path ${String(path).padStart(3)} -> start ${r.launch.startDir.toFixed(1).padStart(5)}  axis ${r.launch.axisTilt.toFixed(1).padStart(6)}  curve ${r.flight.curve.toFixed(0).padStart(4)} yd  offline ${r.flight.offline.toFixed(0).padStart(4)}  ${r.shot.name}`);
}
console.log('--- amateur defaults');
for (const c of Object.keys(CLUBS)) { const r = shoot({ club: c }); console.log(`${c.padEnd(15)} ${CLUBS[c].speed} mph -> carry ${r.flight.carry.toFixed(0)} total ${r.flight.total.toFixed(0)} apex ${r.flight.apex.toFixed(0)} spin ${r.launch.spinRpm.toFixed(0)}`); }
