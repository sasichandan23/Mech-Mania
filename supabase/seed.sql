-- ==========================================================
-- MECH-MANIA 2026: SUPABASE DATABASE SEED DATA
-- Inserts 36 curated mechanical engineering questions & event config
-- ==========================================================

INSERT INTO event_settings (key, value) VALUES
('event_config', '{
  "event_name": "MECH-MANIA 2026",
  "tagline": "THINK • PLAY • ENGINEER",
  "college_name": "National Institute of Technology",
  "club_name": "Mechanical Engineering Club",
  "event_year": "2026",
  "total_levels": 6,
  "total_questions": 30,
  "duration_seconds": 1200
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- LEVEL 1: MECH BASICS
INSERT INTO questions (id, level, category, question_type, difficulty, points, time_limit, question_text, options, correct_answer, explanation) VALUES
('q-l1-01', 1, 'Mechanics of Solids', 'multiple_choice', 'easy', 100, 25,
 'In the linear elastic region of a ductile material, what is the ratio of tensile stress to tensile strain known as?',
 '["Modulus of Rigidity (G)", "Young''s Modulus of Elasticity (E)", "Bulk Modulus (K)", "Poisson''s Ratio (ν)"]'::jsonb,
 1,
 'Young''s Modulus (E = σ / ε) defines the stiffness of an elastic material under uniaxial tensile or compressive stress according to Hooke''s Law.'
),
('q-l1-02', 1, 'Fluid Mechanics Basics', 'multiple_choice', 'easy', 100, 25,
 'What is the SI unit of dynamic viscosity (η)?',
 '["Pascal-second (Pa·s) or N·s/m²", "Square meter per second (m²/s)", "Poiseuille per meter (P/m)", "Joule per kilogram (J/kg)"]'::jsonb,
 0,
 'Dynamic viscosity is measured in Pa·s (Pascal-seconds) or N·s/m² in SI units. (m²/s is the unit for kinematic viscosity).'
),
('q-l1-03', 1, 'Basic Machines', 'multiple_choice', 'easy', 100, 25,
 'A lever has its fulcrum positioned between the effort and the load. Which class of lever is this?',
 '["Class 1 Lever (e.g., Crowbar, Scissors)", "Class 2 Lever (e.g., Wheelbarrow)", "Class 3 Lever (e.g., Tweezers, Human Bicep)", "Class 4 Compound Mechanism"]'::jsonb,
 0,
 'In a Class 1 lever, the fulcrum lies between the input effort and output load. Class 2 has load in middle; Class 3 has effort in middle.'
),
('q-l1-04', 1, 'Thermodynamics Basics', 'speed_round', 'easy', 100, 15,
 'Which law of thermodynamics establishes the concept and definition of temperature as a fundamental property?',
 '["Zeroth Law of Thermodynamics", "First Law of Thermodynamics", "Second Law of Thermodynamics", "Third Law of Thermodynamics"]'::jsonb,
 0,
 'The Zeroth Law states that if body A is in thermal equilibrium with B, and B with C, then A is in thermal equilibrium with C, providing the basis for temperature measurement.'
),
('q-l1-05', 1, 'Materials Science', 'multiple_choice', 'easy', 100, 25,
 'What is the theoretical maximum upper limit for Poisson''s ratio (ν) for isotropic linear-elastic materials?',
 '["0.25", "0.33", "0.50 (e.g., Rubber / Incompressible)", "1.00"]'::jsonb,
 2,
 'For an isotropic linear-elastic material, Poisson''s ratio lies between -1.0 and 0.5. At 0.5, the material is perfectly incompressible with infinite bulk modulus (e.g., rubber).'
),
('q-l1-06', 1, 'Engineering Mechanics', 'fun_mech', 'easy', 100, 20,
 'If a torque of 50 N·m is applied at a radius of 0.25 m, what is the tangential force generated at the circumference?',
 '["12.5 N", "100 N", "200 N", "500 N"]'::jsonb,
 2,
 'Torque T = Force × Radius => Force = T / r = 50 N·m / 0.25 m = 200 N.'
)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation;

-- LEVEL 2: WORKSHOP & MFG
INSERT INTO questions (id, level, category, question_type, difficulty, points, time_limit, question_text, options, correct_answer, explanation) VALUES
('q-l2-01', 2, 'Machine Tools & Lathe', 'machine_id', 'medium', 100, 25,
 'In lathe operations, which operation involves feeding the cutting tool perpendicular to the axis of rotation to generate a flat reference surface on the workpiece end?',
 '["Facing", "Taper Turning", "Knurling", "Parting Off"]'::jsonb,
 0,
 'Facing feeds the single-point cutting tool perpendicular to the lathe spindle axis, producing a flat end face on the cylinder.'
),
('q-l2-02', 2, 'Welding Technology', 'multiple_choice', 'medium', 100, 25,
 'In TIG (GTAW) welding, which type of electrode is utilized and why is an inert shielding gas essential?',
 '["Consumable copper electrode; prevents slag inclusions", "Non-consumable tungsten electrode; prevents atmospheric oxidation", "Coated rutile electrode; produces flux blanket", "Continuous steel wire reel; acts as autogenous arc initiator"]'::jsonb,
 1,
 'TIG (Tungsten Inert Gas) uses a non-consumable tungsten electrode (melting point ~3422°C) shielded by inert gas (Argon or Helium) to prevent atmospheric contamination.'
),
('q-l2-03', 2, 'Machine Elements: Bearings', 'image_id', 'medium', 100, 25,
 'Which type of bearing primarily sustains loads acting strictly parallel to the axis of the rotating shaft?',
 '["Radial Ball Bearing", "Thrust Bearing", "Journal (Sleeve) Bearing", "Needle Roller Bearing"]'::jsonb,
 1,
 'Thrust bearings are specifically designed to support axial (thrust) loads parallel to the shaft axis, whereas radial bearings support perpendicular loads.'
),
('q-l2-04', 2, 'Milling Operations', 'multiple_choice', 'medium', 100, 25,
 'In ''Up Milling'' (conventional milling), how do the cutter tooth velocity and workpiece feed direction interact at the cut contact zone?',
 '["Cutter teeth and workpiece move in opposite directions; chip thickness starts at zero and increases to maximum", "Cutter teeth and workpiece move in the same direction; chip thickness starts at maximum", "Cutter plunges vertically with zero longitudinal relative movement", "Workpiece feeds faster than cutter tangential velocity causing tool engagement chatter"]'::jsonb,
 0,
 'In Up Milling, the cutter rotates against the feed direction. The chip starts at zero thickness and increases toward the exit, tending to lift the workpiece.'
),
('q-l2-05', 2, 'Metrology & Inspection', 'multiple_choice', 'medium', 100, 20,
 'A standard metric micrometer has a pitch of 0.5 mm and 50 circular divisions on its thimble. What is its least count?',
 '["0.1 mm", "0.05 mm", "0.01 mm", "0.001 mm"]'::jsonb,
 2,
 'Least Count = Pitch / Number of Thimble Divisions = 0.5 mm / 50 = 0.01 mm (10 micrometers).'
),
('q-l2-06', 2, 'Gears & Transmission', 'multiple_choice', 'medium', 100, 25,
 'Which gear type enables power transmission between two non-intersecting and non-parallel (skew) shafts with high reduction ratios and self-locking capability?',
 '["Spur Gear", "Helical Gear", "Bevel Gear", "Worm and Worm Wheel"]'::jsonb,
 3,
 'Worm gear drives transmit power between perpendicular non-intersecting shafts, provide large speed reduction in a single stage, and can prevent back-driving (self-locking).'
)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation;

-- LEVEL 3: AUTOMOBILE & IC ENGINES
INSERT INTO questions (id, level, category, question_type, difficulty, points, time_limit, question_text, options, correct_answer, explanation) VALUES
('q-l3-01', 3, 'Engine Thermodynamic Cycles', 'scenario', 'medium', 100, 25,
 'In an internal combustion engine operating on the theoretical Diesel cycle, how is heat added to the working fluid?',
 '["Reversibly at constant volume", "Reversibly at constant pressure", "Isothermally at maximum temperature", "Polytropically with index n = 1.3"]'::jsonb,
 1,
 'The ideal Diesel cycle introduces heat at constant pressure (as fuel is injected during initial piston descent), unlike the Otto cycle which adds heat at constant volume.'
),
('q-l3-02', 3, 'Automotive Transmission', 'multiple_choice', 'medium', 100, 25,
 'What is the fundamental mechanical function of the Differential gear assembly in an automobile drive axle during cornering?',
 '["To increase engine RPM by 50% during sharp turns", "To allow outer drive wheels to rotate faster than inner wheels while distributing engine torque", "To disengage the clutch automatically when lateral acceleration exceeds 0.5g", "To reverse drive shaft direction without shifting transmission gears"]'::jsonb,
 1,
 'When turning, the outer wheel travels along an arc with a larger radius than the inner wheel. The differential allows differential rotation speeds while maintaining torque delivery.'
),
('q-l3-03', 3, 'Forced Induction Systems', 'multiple_choice', 'medium', 100, 25,
 'How does a Turbocharger differ fundamentally from a Supercharger in terms of its mechanical drive source?',
 '["A turbocharger is driven by high-energy engine exhaust gas; a supercharger is driven mechanically by the engine crankshaft", "A turbocharger is driven directly by an auxiliary 12V electric motor; a supercharger uses flywheel inertia", "A turbocharger compresses only fuel; a supercharger compresses intake air", "A supercharger only functions during deceleration, while turbochargers work at idle"]'::jsonb,
 0,
 'Turbochargers harness waste kinetic and thermal energy from exhaust gases via a turbine, while superchargers are mechanically belt/gear-driven from the crankshaft.'
),
('q-l3-04', 3, 'Braking Dynamics', 'speed_round', 'medium', 100, 15,
 'Why do automotive disc brakes exhibit significantly higher resistance to ''brake fade'' compared to drum brakes?',
 '["Discs are made of rubber polymers that harden when heated", "Discs are openly exposed to surrounding airflow, providing superior convective heat dissipation", "Discs do not use friction pads to slow the vehicle", "Hydraulic pressure automatically drops to zero when discs reach 200°C"]'::jsonb,
 1,
 'Disc brakes dissipate heat directly into ambient cooling air. Drum brakes trap friction heat inside the drum enclosure, leading to thermal expansion and brake fade.'
),
('q-l3-05', 3, 'Engine Mechanics', 'scenario', 'medium', 100, 25,
 'A 4-cylinder 4-stroke engine runs at 3000 RPM. How many total power (expansion) strokes are produced per minute across all cylinders?',
 '["1500 power strokes", "3000 power strokes", "6000 power strokes", "12000 power strokes"]'::jsonb,
 2,
 'In a 4-stroke engine, each cylinder produces 1 power stroke every 2 revolutions (RPM / 2 = 1500 strokes/min/cylinder). For 4 cylinders: 4 × 1500 = 6000 power strokes/min.'
),
('q-l3-06', 3, 'Suspension Dynamics', 'multiple_choice', 'medium', 100, 20,
 'What is the primary role of an anti-roll (stabilizer) bar in a vehicle suspension system?',
 '["To absorb high-frequency road bumps directly into the chassis", "To resist body roll and transfer cornering load during lateral turns via torsional stiffness", "To adjust steering rack alignment automatically", "To eliminate the need for hydraulic dampers"]'::jsonb,
 1,
 'An anti-roll bar connects opposite suspension links through a torsion spring. As the body rolls during cornering, the bar twists to distribute load and reduce vehicle lean.'
)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation;

-- LEVEL 4: ENGINEERING CHALLENGE
INSERT INTO questions (id, level, category, question_type, difficulty, points, time_limit, question_text, options, correct_answer, explanation) VALUES
('q-l4-01', 4, 'Thermodynamics', 'scenario', 'hard', 100, 30,
 'A reversible Carnot heat engine operates between a heat source at 727°C and a sink at 227°C. What is its theoretical thermal efficiency?',
 '["68.7%", "50.0%", "45.2%", "31.2%"]'::jsonb,
 1,
 'Convert to Kelvin: T_H = 727 + 273 = 1000 K; T_L = 227 + 273 = 500 K. Carnot Efficiency η = 1 - (T_L / T_H) = 1 - (500 / 1000) = 0.50 (50.0%).'
),
('q-l4-02', 4, 'Fluid Mechanics', 'multiple_choice', 'hard', 100, 30,
 'In steady, incompressible, frictionless flow along a streamline, which three energy heads remain constant according to Bernoulli''s equation?',
 '["Pressure Head (P/ρg), Velocity Head (v²/2g), and Elevation/Datum Head (z)", "Thermal Head, Enthalpy Head, and Entropy Head", "Frictional Head, Surface Tension Head, and Acoustic Head", "Viscous Head, Reynolds Head, and Mach Head"]'::jsonb,
 0,
 'Bernoulli''s equation states: P/(ρg) + v²/(2g) + z = constant along a streamline for inviscid, steady, incompressible flow.'
),
('q-l4-03', 4, 'Machine Design: Mohr''s Circle', 'image_id', 'hard', 100, 30,
 'In a 2D state of plane stress, the center of Mohr''s circle along the normal stress (σ) axis is mathematically located at which point?',
 '["((σ_x - σ_y)/2, 0)", "((σ_x + σ_y)/2, 0)", "(τ_xy, 0)", "(√(σ_x² + σ_y²), 0)"]'::jsonb,
 1,
 'The center of Mohr''s circle coordinates on the σ-τ plane are always C = ((σ_x + σ_y)/2, 0), representing the average normal stress.'
),
('q-l4-04', 4, 'Heat Transfer', 'multiple_choice', 'hard', 100, 30,
 'What dimensionless number represents the ratio of convective to conductive heat transfer across a fluid boundary layer?',
 '["Prandtl Number (Pr)", "Nusselt Number (Nu)", "Reynolds Number (Re)", "Grashof Number (Gr)"]'::jsonb,
 1,
 'Nusselt number (Nu = h·L / k) is the ratio of convective to conductive heat transfer across a boundary. (Pr is momentum vs thermal diffusivity; Re is inertial vs viscous forces).'
),
('q-l4-05', 4, 'Strength of Materials: Beams', 'scenario', 'hard', 100, 30,
 'A simply supported beam of span L carries a concentrated point load W at mid-span. What is the maximum bending moment occurring in the beam?',
 '["W·L / 8", "W·L / 4", "W·L / 2", "W·L² / 12"]'::jsonb,
 1,
 'For a simply supported beam with midpoint concentrated load W, reactions are W/2 each. M_max = (W/2) × (L/2) = W·L / 4.'
),
('q-l4-06', 4, 'Dynamics of Machinery', 'multiple_choice', 'hard', 100, 25,
 'When the natural frequency of an oscillating mechanical system matches the frequency of an external periodic driving force, which critical phenomenon occurs?',
 '["Damped Harmonization", "Resonance (unbounded amplitude surge)", "Cavitation", "Gyroscopic Precession Nullification"]'::jsonb,
 1,
 'Resonance occurs when excitation frequency equals natural frequency (ω = ω_n), leading to severe vibration amplitude amplification and potential catastrophic structural failure.'
)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation;

-- LEVEL 5: FUTURE ENGINEERING
INSERT INTO questions (id, level, category, question_type, difficulty, points, time_limit, question_text, options, correct_answer, explanation) VALUES
('q-l5-01', 5, 'Robotics & Automation', 'machine_id', 'medium', 100, 30,
 'In industrial robotics, how many Degrees of Freedom (DOF) are fundamentally required for a manipulator arm to achieve arbitrary positioning (X, Y, Z) and arbitrary orientation (Roll, Pitch, Yaw) in 3D Euclidean space?',
 '["4 DOF", "5 DOF", "6 DOF", "8 DOF"]'::jsonb,
 2,
 '3 translational DOF are required for position (X, Y, Z) and 3 rotational DOF for spatial orientation (Roll, Pitch, Yaw), totaling 6 DOF minimum.'
),
('q-l5-02', 5, 'Additive Manufacturing (3D Printing)', 'multiple_choice', 'medium', 100, 30,
 'Which additive manufacturing technology utilizes a high-power laser beam to selectively fuse powdered metal or polymer particles layer-by-layer without requiring sacrificial support structures for overhangs?',
 '["Fused Deposition Modeling (FDM)", "Stereolithography (SLA)", "Selective Laser Sintering (SLS)", "Direct Ink Writing (DIW)"]'::jsonb,
 2,
 'In Selective Laser Sintering (SLS), the surrounding un-sintered powder bed naturally supports overhangs and cavities, eliminating the requirement for separate support structures.'
),
('q-l5-03', 5, 'Electric Vehicles (EV)', 'scenario', 'medium', 100, 25,
 'During regenerative braking in an electric vehicle, in what operational quadrant mode does the primary traction motor operate?',
 '["Forward Motoring (Quadrant I)", "Reverse Motoring (Quadrant III)", "Forward Generating / Dynamic Braking (Quadrant II)", "Stalled Rotor Lockup"]'::jsonb,
 2,
 'In regenerative braking, the vehicle moves forward while negative braking torque is applied, functioning as a generator (Quadrant II) to recharge the high-voltage battery pack.'
),
('q-l5-04', 5, 'Automotive Mechatronics', 'speed_round', 'medium', 100, 20,
 'Which robust differential 2-wire serial bus communication protocol standard is universally deployed in modern vehicles to interconnect ECUs without dedicated point-to-point wiring?',
 '["CAN Bus (Controller Area Network)", "I2C (Inter-Integrated Circuit)", "RS-232 Serial Standard", "SPI (Serial Peripheral Interface)"]'::jsonb,
 0,
 'CAN bus (ISO 11898) uses a differential twisted pair (CAN-H and CAN-L) with message arbitration, delivering high noise immunity across automotive sensors and controllers.'
),
('q-l5-05', 5, 'Industry 4.0 & Digital Twin', 'multiple_choice', 'medium', 100, 25,
 'In Industry 4.0 smart manufacturing, what does a ''Digital Twin'' primarily refer to?',
 '["A backup 3D printer that mirrors print jobs", "A real-time virtual simulation model of a physical asset continuously updated with live IoT sensor telemetry", "A clone of the company website hosted on cloud servers", "An automated optical inspection camera with two lenses"]'::jsonb,
 1,
 'A Digital Twin is a high-fidelity virtual representation of a physical system fed by continuous IoT sensor telemetry for predictive maintenance, optimization, and lifecycle analysis.'
),
('q-l5-06', 5, 'CAD/CAM & FEA', 'multiple_choice', 'medium', 100, 25,
 'In Finite Element Analysis (FEA) of ductile metallic structural components, which yield criterion is predominantly evaluated to predict plastic deformation?',
 '["Rankine Maximum Normal Stress Criterion", "Von Mises (Distortion Energy) Equivalent Stress", "Mohr-Coulomb Criterion", "Griffith Brittle Fracture Theory"]'::jsonb,
 1,
 'The Von Mises (distortion energy) yield criterion is the most accurate predictor of yield inception in ductile materials under multi-axial stress states.'
)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation;

-- LEVEL 6: FINAL BOSS
INSERT INTO questions (id, level, category, question_type, difficulty, points, time_limit, question_text, options, correct_answer, explanation) VALUES
('q-l6-01', 6, 'Machine Design & Fatigue Analysis', 'scenario', 'boss', 300, 35,
 'According to the Goodman diagram for fatigue design with fluctuating stress, if the alternating stress is σ_a, mean stress is σ_m, endurance limit is S_e, and ultimate tensile strength is S_ut, what is the design relationship for infinite life (Factor of Safety = 1)?',
 '["(σ_a / S_e) + (σ_m / S_ut) = 1", "(σ_a / S_ut) + (σ_m / S_e) = 1", "(σ_a / S_e)² + (σ_m / S_ut) = 1 (Gerber Parabola)", "(σ_a + σ_m) / S_e = 0.5"]'::jsonb,
 0,
 'The modified Goodman fatigue criterion defines: (σ_a / S_e) + (σ_m / S_ut) ≤ 1/n, providing a conservative linear design boundary between endurance limit and ultimate tensile strength.'
),
('q-l6-02', 6, 'Advanced Epicyclic Gear Trains', 'puzzle', 'boss', 300, 35,
 'In a planetary gear train, Sun gear S has 20 teeth, and Ring gear R has 60 teeth. If Ring gear R is held stationary (fixed) and Sun gear S rotates at +1200 RPM clockwise, what is the rotational speed and direction of the Planet Carrier Arm?',
 '["+300 RPM Clockwise", "-400 RPM Counter-Clockwise", "+600 RPM Clockwise", "+150 RPM Clockwise"]'::jsonb,
 0,
 'Gear ratio: N_arm = N_sun / (1 + T_ring / T_sun) = 1200 / (1 + 60/20) = 1200 / (1 + 3) = 1200 / 4 = +300 RPM in the same (clockwise) direction.'
),
('q-l6-03', 6, 'Compressible Fluid Dynamics: Nozzles', 'scenario', 'boss', 300, 35,
 'In a Convergent-Divergent (de Laval) supersonic nozzle operating under designed choked flow conditions, what is the Mach number at the minimum throat area, and what happens to fluid velocity in the expanding divergent duct?',
 '["Mach = 0.5 at throat; velocity decreases in divergence", "Mach = 1.0 (sonic) at throat; flow accelerates to supersonic velocities (Mach > 1) in divergence", "Mach = 2.0 at throat; flow undergoes normal shock at exit plane", "Mach remains constant at 0.8 throughout the entire nozzle length"]'::jsonb,
 1,
 'At the throat of a choked de Laval nozzle, Mach number reaches exactly 1.0 (sonic velocity). In supersonic flow (M > 1), increasing cross-sectional area causes acceleration (dA/A = (M² - 1)·dV/V).'
),
('q-l6-04', 6, 'Combined Stress: Maximum Shear Theory', 'puzzle', 'boss', 300, 35,
 'A solid circular drive shaft of diameter d is subjected simultaneously to a bending moment M and a torsional twisting moment T. What is the equivalent twisting moment (T_e) according to Guest''s (Tresca / Maximum Shear Stress) theory?',
 '["T_e = M + T", "T_e = √(M² + T²)", "T_e = ½ [M + √(M² + T²)]", "T_e = √(M² + 4T²)"]'::jsonb,
 1,
 'According to Tresca''s Maximum Shear Stress theory, the equivalent twisting moment is T_e = √(M² + T²). (Option C is equivalent bending moment M_e under maximum normal stress theory).'
),
('q-l6-05', 6, 'Advanced Materials & Creep', 'scenario', 'boss', 300, 35,
 'In gas turbine nickel-superalloy blades operating under high mechanical stress at temperatures above 0.5 times their absolute melting point (T_homologous > 0.5), which time-dependent plastic deformation mechanism dominates failure?',
 '["Fatigue Galling", "Creep Deformation (diffusion and dislocation climb)", "Hydrogen Embrittlement", "Cold Work Hardening"]'::jsonb,
 1,
 'At homologous temperatures above 0.4 - 0.5 T_m, metals experience Creep—progressive, time-dependent permanent deformation under constant mechanical stress driven by vacancy diffusion and dislocation climb.'
),
('q-l6-06', 6, 'Kinematics: Coriolis Acceleration', 'boss', 'boss', 300, 35,
 'In a Quick Return Mechanism (e.g., Shaper machine), a slider moves with relative linear velocity ''v'' along a slotted link rotating with angular velocity ''ω''. What is the magnitude of the Coriolis acceleration component?',
 '["v · ω", "2 · v · ω", "½ · v · ω²", "4 · v · ω"]'::jsonb,
 1,
 'Coriolis acceleration a_c = 2·(ω × v). Its scalar magnitude is 2·v·ω, acting perpendicular to the rotating slotted link in the direction of link rotation.'
)
ON CONFLICT (id) DO UPDATE SET
  question_text = EXCLUDED.question_text,
  options = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation = EXCLUDED.explanation;
