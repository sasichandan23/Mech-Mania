// Central Event Configuration for MECH-MANIA 2026
// The organizer modifies ONLY this file prior to deployment if needed.
// Zero live admin interaction is required during the event.

export const EVENT_CONFIG = {
  // Branding & College Info
  EVENT_NAME: "MECH-MANIA 2026",
  TAGLINE: "THINK • PLAY • ENGINEER",
  SUBTITLE: "The Ultimate Mechanical Engineering Game Quiz",
  COLLEGE_NAME: "National Institute of Technology",
  CLUB_NAME: "Mechanical Engineering Club",
  EVENT_YEAR: "2026",
  EVENT_DATE: "September 2026",
  ORGANIZER_CONTACT: "mechclub@college.edu",
  VENUE: "Online / Computer Center Arena",

  // Game Architecture & Rules
  TOTAL_LEVELS: 6,
  QUESTIONS_PER_LEVEL: 5,
  TOTAL_QUESTIONS: 30,
  TOTAL_QUIZ_DURATION_SECONDS: 20 * 60, // 20 minutes = 1200s
  STARTING_LIVES: 3,

  // Question Per-Level Time Limits (in seconds)
  LEVEL_TIME_LIMITS: {
    1: 25, // Mech Basics
    2: 25, // Workshop
    3: 25, // Automobile
    4: 30, // Engineering Challenge
    5: 30, // Future Engineering
    6: 35, // Final Boss
  } as Record<number, number>,

  // Level Metadata
  LEVELS: [
    {
      level: 1,
      id: "mech-basics",
      name: "MECH BASICS",
      icon: "Wrench",
      color: "from-blue-500 to-cyan-500",
      description: "Fundamental physics, stress-strain, SI units, and basic machines.",
      xpPerQuestion: 100,
    },
    {
      level: 2,
      id: "workshop",
      name: "WORKSHOP & MFG",
      icon: "Hammer",
      color: "from-amber-500 to-orange-500",
      description: "Lathes, milling, welding, machining tools, bearings, and gears.",
      xpPerQuestion: 100,
    },
    {
      level: 3,
      id: "automobile",
      name: "AUTOMOBILE & IC ENGINES",
      icon: "Gauge",
      color: "from-red-500 to-rose-600",
      description: "Engines, 2/4 stroke cycles, transmission, brakes, and suspension.",
      xpPerQuestion: 100,
    },
    {
      level: 4,
      id: "eng-challenge",
      name: "ENGINEERING CHALLENGE",
      icon: "Flame",
      color: "from-purple-500 to-indigo-600",
      description: "Thermodynamics, fluid mechanics, heat transfer, and machine design.",
      xpPerQuestion: 100,
    },
    {
      level: 5,
      id: "future-eng",
      name: "FUTURE ENGINEERING",
      icon: "Cpu",
      color: "from-emerald-500 to-teal-500",
      description: "Robotics, automation, EVs, 3D printing, CAD/CAM, Industry 4.0.",
      xpPerQuestion: 100,
    },
    {
      level: 6,
      id: "final-boss",
      name: "FINAL BOSS: THE MECHANICAL MASTERMIND",
      icon: "Skull",
      color: "from-red-600 to-yellow-500",
      description: "High-voltage mechanical engineering gauntlet. Only true engineers survive.",
      xpPerQuestion: 300,
    },
  ],

  // Scoring Engine Configuration
  SCORING: {
    CORRECT_STANDARD_XP: 100,
    CORRECT_BOSS_XP: 300,
    WRONG_PENALTY_XP: 20,
    TIMEOUT_PENALTY_XP: 10,
    FAST_ANSWER_BONUS_MAX_XP: 50, // Added if answered in < 50% of time limit
    STREAK_3_BONUS_XP: 50,
    STREAK_5_BONUS_XP: 150,
    STREAK_7_BONUS_XP: 300,
    CRITICAL_MODE_MULTIPLIER: 0.5, // When all lives lost, player continues with 50% XP
  },

  // Power-Ups
  INITIAL_POWER_UPS: {
    fiftyFifty: 1,  // Removes 2 incorrect options
    timeFreeze: 1,  // Freezes timer for 10 seconds
    doubleXP: 1,    // 2x XP for next correct answer
    shield: 1,      // Prevents 1 life loss from wrong answer
  },

  // Event Time Window (Optional - Leave null for permanently open)
  EVENT_WINDOW: {
    ENABLED: false,
    START_TIME: "2026-09-10T09:00:00Z",
    END_TIME: "2026-09-10T21:00:00Z",
  },

  // Certifications & Honors Information (No prize money)
  PRIZES: [
    { rank: "1st Place", title: "Grand Champion", award: "Certificate of Excellence + Gold Distinction" },
    { rank: "2nd Place", title: "Master Machinist", award: "Certificate of Excellence + Silver Distinction" },
    { rank: "3rd Place", title: "Apex Engineer", award: "Certificate of Excellence + Bronze Distinction" },
    { rank: "Top 10", title: "Elite Cadre", award: "Official Certificate of Merit" },
    { rank: "All Participants", title: "Certified Contender", award: "Official E-Certificate of Participation" },
  ],
};
