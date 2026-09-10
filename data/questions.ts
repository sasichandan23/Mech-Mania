import { Question } from "@/types/game";

// Comprehensive Technical Mechanical Engineering Question Bank
// 36 curated questions across 6 levels (6 questions per level).
// Game engine dynamically selects 5 per level per attempt and shuffles options.
// SVG schematics are built-in vectors ensuring zero broken image links.

export const QUESTION_BANK: Question[] = [
  // ==========================================
  // LEVEL 1: MECH BASICS (Confidence Builders)
  // ==========================================
  {
    id: "q-l1-01",
    level: 1,
    category: "Mechanics of Solids",
    question_type: "multiple_choice",
    difficulty: "easy",
    points: 100,
    time_limit: 25,
    question_text: "In the linear elastic region of a ductile material, what is the ratio of tensile stress to tensile strain known as?",
    options: [
      "Modulus of Rigidity (G)",
      "Young's Modulus of Elasticity (E)",
      "Bulk Modulus (K)",
      "Poisson's Ratio (ν)"
    ],
    correct_answer: 1,
    explanation: "Young's Modulus (E = σ / ε) defines the stiffness of an elastic material under uniaxial tensile or compressive stress according to Hooke's Law."
  },
  {
    id: "q-l1-02",
    level: 1,
    category: "Fluid Mechanics Basics",
    question_type: "multiple_choice",
    difficulty: "easy",
    points: 100,
    time_limit: 25,
    question_text: "What is the SI unit of dynamic viscosity (η)?",
    options: [
      "Pascal-second (Pa·s) or N·s/m²",
      "Square meter per second (m²/s)",
      "Poiseuille per meter (P/m)",
      "Joule per kilogram (J/kg)"
    ],
    correct_answer: 0,
    explanation: "Dynamic viscosity is measured in Pa·s (Pascal-seconds) or N·s/m² in SI units. (m²/s is the unit for kinematic viscosity)."
  },
  {
    id: "q-l1-03",
    level: 1,
    category: "Basic Machines",
    question_type: "multiple_choice",
    difficulty: "easy",
    points: 100,
    time_limit: 25,
    question_text: "A lever has its fulcrum positioned between the effort and the load. Which class of lever is this?",
    options: [
      "Class 1 Lever (e.g., Crowbar, Scissors)",
      "Class 2 Lever (e.g., Wheelbarrow)",
      "Class 3 Lever (e.g., Tweezers, Human Bicep)",
      "Class 4 Compound Mechanism"
    ],
    correct_answer: 0,
    explanation: "In a Class 1 lever, the fulcrum lies between the input effort and output load. Class 2 has load in middle; Class 3 has effort in middle."
  },
  {
    id: "q-l1-04",
    level: 1,
    category: "Thermodynamics Basics",
    question_type: "speed_round",
    difficulty: "easy",
    points: 100,
    time_limit: 15,
    question_text: "Which law of thermodynamics establishes the concept and definition of temperature as a fundamental property?",
    options: [
      "Zeroth Law of Thermodynamics",
      "First Law of Thermodynamics",
      "Second Law of Thermodynamics",
      "Third Law of Thermodynamics"
    ],
    correct_answer: 0,
    explanation: "The Zeroth Law states that if body A is in thermal equilibrium with B, and B with C, then A is in thermal equilibrium with C, providing the basis for temperature measurement."
  },
  {
    id: "q-l1-05",
    level: 1,
    category: "Materials Science",
    question_type: "multiple_choice",
    difficulty: "easy",
    points: 100,
    time_limit: 25,
    question_text: "What is the theoretical maximum upper limit for Poisson's ratio (ν) for isotropic linear-elastic materials?",
    options: [
      "0.25",
      "0.33",
      "0.50 (e.g., Rubber / Incompressible)",
      "1.00"
    ],
    correct_answer: 2,
    explanation: "For an isotropic linear-elastic material, Poisson's ratio lies between -1.0 and 0.5. At 0.5, the material is perfectly incompressible with infinite bulk modulus (e.g., rubber)."
  },
  {
    id: "q-l1-06",
    level: 1,
    category: "Engineering Mechanics",
    question_type: "fun_mech",
    difficulty: "easy",
    points: 100,
    time_limit: 20,
    question_text: "If a torque of 50 N·m is applied at a radius of 0.25 m, what is the tangential force generated at the circumference?",
    options: [
      "12.5 N",
      "100 N",
      "200 N",
      "500 N"
    ],
    correct_answer: 2,
    explanation: "Torque T = Force × Radius => Force = T / r = 50 N·m / 0.25 m = 200 N."
  },

  // ==========================================
  // LEVEL 2: WORKSHOP & MANUFACTURING
  // ==========================================
  {
    id: "q-l2-01",
    level: 2,
    category: "Machine Tools & Lathe",
    question_type: "machine_id",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "In lathe operations, which operation involves feeding the cutting tool perpendicular to the axis of rotation to generate a flat reference surface on the workpiece end?",
    options: [
      "Facing",
      "Taper Turning",
      "Knurling",
      "Parting Off"
    ],
    correct_answer: 0,
    explanation: "Facing feeds the single-point cutting tool perpendicular to the lathe spindle axis, producing a flat end face on the cylinder."
  },
  {
    id: "q-l2-02",
    level: 2,
    category: "Welding Technology",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "In TIG (GTAW) welding, which type of electrode is utilized and why is an inert shielding gas essential?",
    options: [
      "Consumable copper electrode; prevents slag inclusions",
      "Non-consumable tungsten electrode; prevents atmospheric oxidation",
      "Coated rutile electrode; produces flux blanket",
      "Continuous steel wire reel; acts as autogenous arc initiator"
    ],
    correct_answer: 1,
    explanation: "TIG (Tungsten Inert Gas) uses a non-consumable tungsten electrode (melting point ~3422°C) shielded by inert gas (Argon or Helium) to prevent atmospheric contamination."
  },
  {
    id: "q-l2-03",
    level: 2,
    category: "Machine Elements: Bearings",
    question_type: "image_id",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    schematic_svg: `<svg viewBox="0 0 200 120" class="w-48 h-28 mx-auto stroke-amber-400 fill-none stroke-2"><circle cx="100" cy="60" r="45" stroke-dasharray="4 2" /><circle cx="100" cy="60" r="25" /><circle cx="100" cy="25" r="8" fill="#f59e0b" /><circle cx="135" cy="60" r="8" fill="#f59e0b" /><circle cx="100" cy="95" r="8" fill="#f59e0b" /><circle cx="65" cy="60" r="8" fill="#f59e0b" /></svg>`,
    question_text: "Which type of bearing primarily sustains loads acting strictly parallel to the axis of the rotating shaft?",
    options: [
      "Radial Ball Bearing",
      "Thrust Bearing",
      "Journal (Sleeve) Bearing",
      "Needle Roller Bearing"
    ],
    correct_answer: 1,
    explanation: "Thrust bearings are specifically designed to support axial (thrust) loads parallel to the shaft axis, whereas radial bearings support perpendicular loads."
  },
  {
    id: "q-l2-04",
    level: 2,
    category: "Milling Operations",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "In 'Up Milling' (conventional milling), how do the cutter tooth velocity and workpiece feed direction interact at the cut contact zone?",
    options: [
      "Cutter teeth and workpiece move in opposite directions; chip thickness starts at zero and increases to maximum",
      "Cutter teeth and workpiece move in the same direction; chip thickness starts at maximum",
      "Cutter plunges vertically with zero longitudinal relative movement",
      "Workpiece feeds faster than cutter tangential velocity causing tool engagement chatter"
    ],
    correct_answer: 0,
    explanation: "In Up Milling, the cutter rotates against the feed direction. The chip starts at zero thickness and increases toward the exit, tending to lift the workpiece."
  },
  {
    id: "q-l2-05",
    level: 2,
    category: "Metrology & Inspection",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 20,
    question_text: "A standard metric micrometer has a pitch of 0.5 mm and 50 circular divisions on its thimble. What is its least count?",
    options: [
      "0.1 mm",
      "0.05 mm",
      "0.01 mm",
      "0.001 mm"
    ],
    correct_answer: 2,
    explanation: "Least Count = Pitch / Number of Thimble Divisions = 0.5 mm / 50 = 0.01 mm (10 micrometers)."
  },
  {
    id: "q-l2-06",
    level: 2,
    category: "Gears & Transmission",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "Which gear type enables power transmission between two non-intersecting and non-parallel (skew) shafts with high reduction ratios and self-locking capability?",
    options: [
      "Spur Gear",
      "Helical Gear",
      "Bevel Gear",
      "Worm and Worm Wheel"
    ],
    correct_answer: 3,
    explanation: "Worm gear drives transmit power between perpendicular non-intersecting shafts, provide large speed reduction in a single stage, and can prevent back-driving (self-locking)."
  },

  // ==========================================
  // LEVEL 3: AUTOMOBILE & IC ENGINES
  // ==========================================
  {
    id: "q-l3-01",
    level: 3,
    category: "Engine Thermodynamic Cycles",
    question_type: "scenario",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "In an internal combustion engine operating on the theoretical Diesel cycle, how is heat added to the working fluid?",
    options: [
      "Reversibly at constant volume",
      "Reversibly at constant pressure",
      "Isothermally at maximum temperature",
      "Polytropically with index n = 1.3"
    ],
    correct_answer: 1,
    explanation: "The ideal Diesel cycle introduces heat at constant pressure (as fuel is injected during initial piston descent), unlike the Otto cycle which adds heat at constant volume."
  },
  {
    id: "q-l3-02",
    level: 3,
    category: "Automotive Transmission",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "What is the fundamental mechanical function of the Differential gear assembly in an automobile drive axle during cornering?",
    options: [
      "To increase engine RPM by 50% during sharp turns",
      "To allow outer drive wheels to rotate faster than inner wheels while distributing engine torque",
      "To disengage the clutch automatically when lateral acceleration exceeds 0.5g",
      "To reverse drive shaft direction without shifting transmission gears"
    ],
    correct_answer: 1,
    explanation: "When turning, the outer wheel travels along an arc with a larger radius than the inner wheel. The differential allows differential rotation speeds while maintaining torque delivery."
  },
  {
    id: "q-l3-03",
    level: 3,
    category: "Forced Induction Systems",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "How does a Turbocharger differ fundamentally from a Supercharger in terms of its mechanical drive source?",
    options: [
      "A turbocharger is driven by high-energy engine exhaust gas; a supercharger is driven mechanically by the engine crankshaft",
      "A turbocharger is driven directly by an auxiliary 12V electric motor; a supercharger uses flywheel inertia",
      "A turbocharger compresses only fuel; a supercharger compresses intake air",
      "A supercharger only functions during deceleration, while turbochargers work at idle"
    ],
    correct_answer: 0,
    explanation: "Turbochargers harness waste kinetic and thermal energy from exhaust gases via a turbine, while superchargers are mechanically belt/gear-driven from the crankshaft."
  },
  {
    id: "q-l3-04",
    level: 3,
    category: "Braking Dynamics",
    question_type: "speed_round",
    difficulty: "medium",
    points: 100,
    time_limit: 15,
    question_text: "Why do automotive disc brakes exhibit significantly higher resistance to 'brake fade' compared to drum brakes?",
    options: [
      "Discs are made of rubber polymers that harden when heated",
      "Discs are openly exposed to surrounding airflow, providing superior convective heat dissipation",
      "Discs do not use friction pads to slow the vehicle",
      "Hydraulic pressure automatically drops to zero when discs reach 200°C"
    ],
    correct_answer: 1,
    explanation: "Disc brakes dissipate heat directly into ambient cooling air. Drum brakes trap friction heat inside the drum enclosure, leading to thermal expansion and brake fade."
  },
  {
    id: "q-l3-05",
    level: 3,
    category: "Engine Mechanics",
    question_type: "scenario",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "A 4-cylinder 4-stroke engine runs at 3000 RPM. How many total power (expansion) strokes are produced per minute across all cylinders?",
    options: [
      "1500 power strokes",
      "3000 power strokes",
      "6000 power strokes",
      "12000 power strokes"
    ],
    correct_answer: 2,
    explanation: "In a 4-stroke engine, each cylinder produces 1 power stroke every 2 revolutions (RPM / 2 = 1500 strokes/min/cylinder). For 4 cylinders: 4 × 1500 = 6000 power strokes/min."
  },
  {
    id: "q-l3-06",
    level: 3,
    category: "Suspension Dynamics",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 20,
    question_text: "What is the primary role of an anti-roll (stabilizer) bar in a vehicle suspension system?",
    options: [
      "To absorb high-frequency road bumps directly into the chassis",
      "To resist body roll and transfer cornering load during lateral turns via torsional stiffness",
      "To adjust steering rack alignment automatically",
      "To eliminate the need for hydraulic dampers"
    ],
    correct_answer: 1,
    explanation: "An anti-roll bar connects opposite suspension links through a torsion spring. As the body rolls during cornering, the bar twists to distribute load and reduce vehicle lean."
  },

  // ==========================================
  // LEVEL 4: ENGINEERING CHALLENGE
  // ==========================================
  {
    id: "q-l4-01",
    level: 4,
    category: "Thermodynamics",
    question_type: "scenario",
    difficulty: "hard",
    points: 100,
    time_limit: 30,
    question_text: "A reversible Carnot heat engine operates between a heat source at 727°C and a sink at 227°C. What is its theoretical thermal efficiency?",
    options: [
      "68.7%",
      "50.0%",
      "45.2%",
      "31.2%"
    ],
    correct_answer: 1,
    explanation: "Convert to Kelvin: T_H = 727 + 273 = 1000 K; T_L = 227 + 273 = 500 K. Carnot Efficiency η = 1 - (T_L / T_H) = 1 - (500 / 1000) = 0.50 (50.0%)."
  },
  {
    id: "q-l4-02",
    level: 4,
    category: "Fluid Mechanics",
    question_type: "multiple_choice",
    difficulty: "hard",
    points: 100,
    time_limit: 30,
    question_text: "In steady, incompressible, frictionless flow along a streamline, which three energy heads remain constant according to Bernoulli's equation?",
    options: [
      "Pressure Head (P/ρg), Velocity Head (v²/2g), and Elevation/Datum Head (z)",
      "Thermal Head, Enthalpy Head, and Entropy Head",
      "Frictional Head, Surface Tension Head, and Acoustic Head",
      "Viscous Head, Reynolds Head, and Mach Head"
    ],
    correct_answer: 0,
    explanation: "Bernoulli's equation states: P/(ρg) + v²/(2g) + z = constant along a streamline for inviscid, steady, incompressible flow."
  },
  {
    id: "q-l4-03",
    level: 4,
    category: "Machine Design: Mohr's Circle",
    question_type: "image_id",
    difficulty: "hard",
    points: 100,
    time_limit: 30,
    schematic_svg: `<svg viewBox="0 0 200 120" class="w-48 h-28 mx-auto stroke-cyan-400 fill-none stroke-2"><line x1="10" y1="60" x2="190" y2="60" stroke-width="1.5" /><line x1="100" y1="10" x2="100" y2="110" stroke-width="1.5" /><circle cx="110" cy="60" r="40" stroke="#06b6d4" stroke-width="2.5" /><circle cx="110" cy="60" r="3" fill="#06b6d4" /><text x="180" y="55" fill="#94a3b8" font-size="10">σ</text><text x="105" y="20" fill="#94a3b8" font-size="10">τ</text></svg>`,
    question_text: "In a 2D state of plane stress, the center of Mohr's circle along the normal stress (σ) axis is mathematically located at which point?",
    options: [
      "((σ_x - σ_y)/2, 0)",
      "((σ_x + σ_y)/2, 0)",
      "(τ_xy, 0)",
      "(√(σ_x² + σ_y²), 0)"
    ],
    correct_answer: 1,
    explanation: "The center of Mohr's circle coordinates on the σ-τ plane are always C = ((σ_x + σ_y)/2, 0), representing the average normal stress."
  },
  {
    id: "q-l4-04",
    level: 4,
    category: "Heat Transfer",
    question_type: "multiple_choice",
    difficulty: "hard",
    points: 100,
    time_limit: 30,
    question_text: "What dimensionless number represents the ratio of convective to conductive heat transfer across a fluid boundary layer?",
    options: [
      "Prandtl Number (Pr)",
      "Nusselt Number (Nu)",
      "Reynolds Number (Re)",
      "Grashof Number (Gr)"
    ],
    correct_answer: 1,
    explanation: "Nusselt number (Nu = h·L / k) is the ratio of convective to conductive heat transfer across a boundary. (Pr is momentum vs thermal diffusivity; Re is inertial vs viscous forces)."
  },
  {
    id: "q-l4-05",
    level: 4,
    category: "Strength of Materials: Beams",
    question_type: "scenario",
    difficulty: "hard",
    points: 100,
    time_limit: 30,
    question_text: "A simply supported beam of span L carries a concentrated point load W at mid-span. What is the maximum bending moment occurring in the beam?",
    options: [
      "W·L / 8",
      "W·L / 4",
      "W·L / 2",
      "W·L² / 12"
    ],
    correct_answer: 1,
    explanation: "For a simply supported beam with midpoint concentrated load W, reactions are W/2 each. M_max = (W/2) × (L/2) = W·L / 4."
  },
  {
    id: "q-l4-06",
    level: 4,
    category: "Dynamics of Machinery",
    question_type: "multiple_choice",
    difficulty: "hard",
    points: 100,
    time_limit: 25,
    question_text: "When the natural frequency of an oscillating mechanical system matches the frequency of an external periodic driving force, which critical phenomenon occurs?",
    options: [
      "Damped Harmonization",
      "Resonance (unbounded amplitude surge)",
      "Cavitation",
      "Gyroscopic Precession Nullification"
    ],
    correct_answer: 1,
    explanation: "Resonance occurs when excitation frequency equals natural frequency (ω = ω_n), leading to severe vibration amplitude amplification and potential catastrophic structural failure."
  },

  // ==========================================
  // LEVEL 5: FUTURE ENGINEERING & ROBOTICS
  // ==========================================
  {
    id: "q-l5-01",
    level: 5,
    category: "Robotics & Automation",
    question_type: "machine_id",
    difficulty: "medium",
    points: 100,
    time_limit: 30,
    question_text: "In industrial robotics, how many Degrees of Freedom (DOF) are fundamentally required for a manipulator arm to achieve arbitrary positioning (X, Y, Z) and arbitrary orientation (Roll, Pitch, Yaw) in 3D Euclidean space?",
    options: [
      "4 DOF",
      "5 DOF",
      "6 DOF",
      "8 DOF"
    ],
    correct_answer: 2,
    explanation: "3 translational DOF are required for position (X, Y, Z) and 3 rotational DOF for spatial orientation (Roll, Pitch, Yaw), totaling 6 DOF minimum."
  },
  {
    id: "q-l5-02",
    level: 5,
    category: "Additive Manufacturing (3D Printing)",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 30,
    question_text: "Which additive manufacturing technology utilizes a high-power laser beam to selectively fuse powdered metal or polymer particles layer-by-layer without requiring sacrificial support structures for overhangs?",
    options: [
      "Fused Deposition Modeling (FDM)",
      "Stereolithography (SLA)",
      "Selective Laser Sintering (SLS)",
      "Direct Ink Writing (DIW)"
    ],
    correct_answer: 2,
    explanation: "In Selective Laser Sintering (SLS), the surrounding un-sintered powder bed naturally supports overhangs and cavities, eliminating the requirement for separate support structures."
  },
  {
    id: "q-l5-03",
    level: 5,
    category: "Electric Vehicles (EV)",
    question_type: "scenario",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "During regenerative braking in an electric vehicle, in what operational quadrant mode does the primary traction motor operate?",
    options: [
      "Forward Motoring (Quadrant I)",
      "Reverse Motoring (Quadrant III)",
      "Forward Generating / Dynamic Braking (Quadrant II)",
      "Stalled Rotor Lockup"
    ],
    correct_answer: 2,
    explanation: "In regenerative braking, the vehicle moves forward while negative braking torque is applied, functioning as a generator (Quadrant II) to recharge the high-voltage battery pack."
  },
  {
    id: "q-l5-04",
    level: 5,
    category: "Automotive Mechatronics",
    question_type: "speed_round",
    difficulty: "medium",
    points: 100,
    time_limit: 20,
    question_text: "Which robust differential 2-wire serial bus communication protocol standard is universally deployed in modern vehicles to interconnect ECUs without dedicated point-to-point wiring?",
    options: [
      "CAN Bus (Controller Area Network)",
      "I2C (Inter-Integrated Circuit)",
      "RS-232 Serial Standard",
      "SPI (Serial Peripheral Interface)"
    ],
    correct_answer: 0,
    explanation: "CAN bus (ISO 11898) uses a differential twisted pair (CAN-H and CAN-L) with message arbitration, delivering high noise immunity across automotive sensors and controllers."
  },
  {
    id: "q-l5-05",
    level: 5,
    category: "Industry 4.0 & Digital Twin",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "In Industry 4.0 smart manufacturing, what does a 'Digital Twin' primarily refer to?",
    options: [
      "A backup 3D printer that mirrors print jobs",
      "A real-time virtual simulation model of a physical asset continuously updated with live IoT sensor telemetry",
      "A clone of the company website hosted on cloud servers",
      "An automated optical inspection camera with two lenses"
    ],
    correct_answer: 1,
    explanation: "A Digital Twin is a high-fidelity virtual representation of a physical system fed by continuous IoT sensor telemetry for predictive maintenance, optimization, and lifecycle analysis."
  },
  {
    id: "q-l5-06",
    level: 5,
    category: "CAD/CAM & FEA",
    question_type: "multiple_choice",
    difficulty: "medium",
    points: 100,
    time_limit: 25,
    question_text: "In Finite Element Analysis (FEA) of ductile metallic structural components, which yield criterion is predominantly evaluated to predict plastic deformation?",
    options: [
      "Rankine Maximum Normal Stress Criterion",
      "Von Mises (Distortion Energy) Equivalent Stress",
      "Mohr-Coulomb Criterion",
      "Griffith Brittle Fracture Theory"
    ],
    correct_answer: 1,
    explanation: "The Von Mises (distortion energy) yield criterion is the most accurate predictor of yield inception in ductile materials under multi-axial stress states."
  },

  // ==========================================
  // LEVEL 6: FINAL BOSS (MECHANICAL MASTERMIND)
  // High XP: 300 points each, high difficulty!
  // ==========================================
  {
    id: "q-l6-01",
    level: 6,
    category: "Machine Design & Fatigue Analysis",
    question_type: "scenario",
    difficulty: "boss",
    points: 300,
    time_limit: 35,
    question_text: "According to the Goodman diagram for fatigue design with fluctuating stress, if the alternating stress is σ_a, mean stress is σ_m, endurance limit is S_e, and ultimate tensile strength is S_ut, what is the design relationship for infinite life (Factor of Safety = 1)?",
    options: [
      "(σ_a / S_e) + (σ_m / S_ut) = 1",
      "(σ_a / S_ut) + (σ_m / S_e) = 1",
      "(σ_a / S_e)² + (σ_m / S_ut) = 1 (Gerber Parabola)",
      "(σ_a + σ_m) / S_e = 0.5"
    ],
    correct_answer: 0,
    explanation: "The modified Goodman fatigue criterion defines: (σ_a / S_e) + (σ_m / S_ut) ≤ 1/n, providing a conservative linear design boundary between endurance limit and ultimate tensile strength."
  },
  {
    id: "q-l6-02",
    level: 6,
    category: "Advanced Epicyclic Gear Trains",
    question_type: "puzzle",
    difficulty: "boss",
    points: 300,
    time_limit: 35,
    schematic_svg: `<svg viewBox="0 0 200 120" class="w-52 h-28 mx-auto stroke-red-500 fill-none stroke-2"><circle cx="100" cy="60" r="50" stroke="#f59e0b" stroke-dasharray="3 3" /><circle cx="100" cy="60" r="20" stroke="#ef4444" fill="#1f2937" /><circle cx="100" cy="25" r="15" stroke="#06b6d4" fill="#111827" /><text x="92" y="64" fill="#ef4444" font-size="9" font-weight="bold">SUN</text><text x="82" y="27" fill="#06b6d4" font-size="8">PLANET</text><text x="75" y="118" fill="#f59e0b" font-size="8">RING GEAR</text></svg>`,
    question_text: "In a planetary gear train, Sun gear S has 20 teeth, and Ring gear R has 60 teeth. If Ring gear R is held stationary (fixed) and Sun gear S rotates at +1200 RPM clockwise, what is the rotational speed and direction of the Planet Carrier Arm?",
    options: [
      "+300 RPM Clockwise",
      "-400 RPM Counter-Clockwise",
      "+600 RPM Clockwise",
      "+150 RPM Clockwise"
    ],
    correct_answer: 0,
    explanation: "Gear ratio: N_arm = N_sun / (1 + T_ring / T_sun) = 1200 / (1 + 60/20) = 1200 / (1 + 3) = 1200 / 4 = +300 RPM in the same (clockwise) direction."
  },
  {
    id: "q-l6-03",
    level: 6,
    category: "Compressible Fluid Dynamics: Nozzles",
    question_type: "scenario",
    difficulty: "boss",
    points: 300,
    time_limit: 35,
    question_text: "In a Convergent-Divergent (de Laval) supersonic nozzle operating under designed choked flow conditions, what is the Mach number at the minimum throat area, and what happens to fluid velocity in the expanding divergent duct?",
    options: [
      "Mach = 0.5 at throat; velocity decreases in divergence",
      "Mach = 1.0 (sonic) at throat; flow accelerates to supersonic velocities (Mach > 1) in divergence",
      "Mach = 2.0 at throat; flow undergoes normal shock at exit plane",
      "Mach remains constant at 0.8 throughout the entire nozzle length"
    ],
    correct_answer: 1,
    explanation: "At the throat of a choked de Laval nozzle, Mach number reaches exactly 1.0 (sonic velocity). In supersonic flow (M > 1), increasing cross-sectional area causes acceleration (dA/A = (M² - 1)·dV/V)."
  },
  {
    id: "q-l6-04",
    level: 6,
    category: "Combined Stress: Maximum Shear Theory",
    question_type: "puzzle",
    difficulty: "boss",
    points: 300,
    time_limit: 35,
    question_text: "A solid circular drive shaft of diameter d is subjected simultaneously to a bending moment M and a torsional twisting moment T. What is the equivalent twisting moment (T_e) according to Guest's (Tresca / Maximum Shear Stress) theory?",
    options: [
      "T_e = M + T",
      "T_e = √(M² + T²)",
      "T_e = ½ [M + √(M² + T²)]",
      "T_e = √(M² + 4T²)"
    ],
    correct_answer: 1,
    explanation: "According to Tresca's Maximum Shear Stress theory, the equivalent twisting moment is T_e = √(M² + T²). (Option C is equivalent bending moment M_e under maximum normal stress theory)."
  },
  {
    id: "q-l6-05",
    level: 6,
    category: "Advanced Materials & Creep",
    question_type: "scenario",
    difficulty: "boss",
    points: 300,
    time_limit: 35,
    question_text: "In gas turbine nickel-superalloy blades operating under high mechanical stress at temperatures above 0.5 times their absolute melting point (T_homologous > 0.5), which time-dependent plastic deformation mechanism dominates failure?",
    options: [
      "Fatigue Galling",
      "Creep Deformation (diffusion and dislocation climb)",
      "Hydrogen Embrittlement",
      "Cold Work Hardening"
    ],
    correct_answer: 1,
    explanation: "At homologous temperatures above 0.4 - 0.5 T_m, metals experience Creep—progressive, time-dependent permanent deformation under constant mechanical stress driven by vacancy diffusion and dislocation climb."
  },
  {
    id: "q-l6-06",
    level: 6,
    category: "Kinematics: Coriolis Acceleration",
    question_type: "scenario",
    difficulty: "boss",
    points: 300,
    time_limit: 35,
    question_text: "In a Quick Return Mechanism (e.g., Shaper machine), a slider moves with relative linear velocity 'v' along a slotted link rotating with angular velocity 'ω'. What is the magnitude of the Coriolis acceleration component?",
    options: [
      "v · ω",
      "2 · v · ω",
      "½ · v · ω²",
      "4 · v · ω"
    ],
    correct_answer: 1,
    explanation: "Coriolis acceleration a_c = 2·(ω × v). Its scalar magnitude is 2·v·ω, acting perpendicular to the rotating slotted link in the direction of link rotation."
  },
];

// Helper to get client-safe question (stripping secret answer and explanation)
export function getSafeQuestion(q: Question) {
  return {
    id: q.id,
    level: q.level,
    category: q.category,
    question_type: q.question_type,
    difficulty: q.difficulty,
    points: q.points,
    time_limit: q.time_limit,
    question_text: q.question_text,
    options: [...q.options],
    image_url: q.image_url,
    schematic_svg: q.schematic_svg,
  };
}

// Generate randomized but structured 30 questions for an attempt (5 from each level)
export function generateAttemptQuestions(): string[] {
  const selectedIds: string[] = [];
  for (let lvl = 1; lvl <= 6; lvl++) {
    const levelQuestions = QUESTION_BANK.filter((q) => q.level === lvl);
    // Shuffle level questions
    const shuffled = [...levelQuestions].sort(() => Math.random() - 0.5);
    // Select first 5
    const chosen = shuffled.slice(0, 5);
    selectedIds.push(...chosen.map((q) => q.id));
  }
  return selectedIds;
}
