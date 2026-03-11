struct Params {
  cursorX: f32,
  cursorY: f32,
  cursorRadius: f32,
  cursorStrength: f32,
  decayFactor: f32,
  recoverySpeed: f32,
  friction: f32,
  recoveryMode: u32, // 0 = magnetic, 1 = random
  width: f32,
  height: f32,
}

@group(0) @binding(0) var<storage, read_write> positions: array<vec2<f32>>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec2<f32>>;
@group(0) @binding(2) var<storage, read> targetPositions: array<vec2<f32>>;
@group(0) @binding(3) var<storage, read_write> energy: array<f32>;
@group(0) @binding(4) var<uniform> params: Params;

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let idx = global_id.x;
  if (idx >= arrayLength(&positions)) {
    return;
  }

  var pos = positions[idx];
  var vel = velocities[idx];
  var target = targetPositions[idx];
  var eng = energy[idx];

  // Apply cursor vortex effect
  let dx = pos.x - params.cursorX;
  let dy = pos.y - params.cursorY;
  let dist = sqrt(dx * dx + dy * dy);

  if (dist < params.cursorRadius && dist > 0.1) {
    let influence = (1.0 - dist / params.cursorRadius) * params.cursorStrength;
    let angle = atan2(dy, dx);

    // Vortex: perpendicular force
    vel.x += cos(angle + 1.57) * influence * 0.1;
    vel.y += sin(angle + 1.57) * influence * 0.1;
    eng = min(eng + influence, 1.0);
  }

  // Apply recovery force or random motion
  if (params.recoveryMode == 0u) {
    // Magnetic mode: pull toward target
    let recx = target.x - pos.x;
    let recy = target.y - pos.y;
    let recDist = sqrt(recx * recx + recy * recy);

    if (recDist > 1.0) {
      let recForce = params.recoverySpeed;
      vel.x += (recx / recDist) * recForce;
      vel.y += (recy / recDist) * recForce;
    }
  } else {
    // Random mode: Brownian motion with bounds
    vel.x += (fract(sin(f32(idx) * 12.9898 + pos.x) * 43758.5453) - 0.5) * 0.02;
    vel.y += (fract(sin(f32(idx) * 78.233 + pos.y) * 43758.5453) - 0.5) * 0.02;
  }

  // Apply friction
  vel.x *= params.friction;
  vel.y *= params.friction;

  // Limit velocity
  let velMag = sqrt(vel.x * vel.x + vel.y * vel.y);
  if (velMag > 5.0) {
    vel.x = (vel.x / velMag) * 5.0;
    vel.y = (vel.y / velMag) * 5.0;
  }

  // Update position
  pos.x += vel.x;
  pos.y += vel.y;

  // Boundary conditions (bounce or wrap)
  if (pos.x < 0.0) { pos.x = 0.0; vel.x *= -0.8; }
  if (pos.x > params.width) { pos.x = params.width; vel.x *= -0.8; }
  if (pos.y < 0.0) { pos.y = 0.0; vel.y *= -0.8; }
  if (pos.y > params.height) { pos.y = params.height; vel.y *= -0.8; }

  // Decay energy
  eng *= params.decayFactor;

  // Write back
  positions[idx] = pos;
  velocities[idx] = vel;
  energy[idx] = eng;
}
