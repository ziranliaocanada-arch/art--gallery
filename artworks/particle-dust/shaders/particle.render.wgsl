struct VertexInput {
  @location(0) position: vec2<f32>,
  @builtin(instance_index) instanceId: u32,
}

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) energy: f32,
}

struct Uniforms {
  viewProj: mat4x4<f32>,
  particleSize: f32,
  glowIntensity: f32,
  width: f32,
  height: f32,
}

@group(0) @binding(0) var<storage, read> positions: array<vec2<f32>>;
@group(0) @binding(1) var<storage, read> energy: array<f32>;
@group(0) @binding(2) var<uniform> uniforms: Uniforms;

@vertex
fn vertexMain(input: VertexInput) -> VertexOutput {
  let idx = input.instanceId;
  let pos = positions[idx];
  let eng = energy[idx];

  // Convert screen coordinates to NDC
  let ndcX = (pos.x / uniforms.width) * 2.0 - 1.0;
  let ndcY = 1.0 - (pos.y / uniforms.height) * 2.0;

  var output: VertexOutput;
  output.position = vec4<f32>(ndcX, ndcY, 0.0, 1.0);
  output.energy = eng;

  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4<f32> {
  let r = distance(vec2<f32>(0.5), vec2<f32>(0.5));
  if (r > 0.5) {
    discard;
  }

  let glow = input.energy * uniforms.glowIntensity;
  let color = vec3<f32>(0.0, 0.8, 1.0); // Cyan
  let alpha = input.energy * 0.8;

  return vec4<f32>(color * (1.0 + glow * 0.5), alpha);
}
