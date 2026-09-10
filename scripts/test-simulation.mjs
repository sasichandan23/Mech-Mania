// Automated Level Progression & Question 6 Transition Test
// Simulates answering all 5 questions in Level 1, transitioning to Level 2, and answering Question 6 and Question 7

const PORT = 3010;
const BASE_URL = `http://localhost:${PORT}`;

async function runSimulation() {
  console.log("⚙️ =====================================================");
  console.log("⚙️ TEST: LEVEL 1 TO LEVEL 2 TRANSITION VERIFICATION");
  console.log("⚙️ =====================================================");

  // 1. Register
  console.log("\n[STEP 1] Registering participant...");
  const regRes = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Siddharth Rao",
      register_number: "23ME2001",
      department: "Mechanical Engineering",
      year: "4th Year",
      email: "siddharth.rao@college.edu",
    }),
  });

  const regData = await regRes.json();
  if (!regRes.ok) throw new Error(`Reg failed: ${JSON.stringify(regData)}`);

  const attemptId = regData.attempt.id;
  let sessionToken = regData.session_token;
  console.log(`✅ Registered! Attempt ID: ${attemptId}, Total Questions: ${regData.attempt.question_ids.length}`);

  // Fetch initial session
  const sessRes = await fetch(`${BASE_URL}/api/quiz/session?attempt_id=${attemptId}`, {
    headers: { "x-session-token": sessionToken },
  });
  const sessData = await sessRes.json();
  let currentQ = sessData.current_question;
  let qNum = sessData.current_question_number;

  console.log(`\n[STEP 2] Answering Questions 1 through 5 (Level 1: MECH BASICS)...`);

  // Answer Questions 1 to 5
  for (let i = 1; i <= 5; i++) {
    console.log(`  -> Answering Question ${qNum} (ID: ${currentQ.id})...`);
    const ansRes = await fetch(`${BASE_URL}/api/quiz/submit-answer`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-session-token": sessionToken,
      },
      body: JSON.stringify({
        attempt_id: attemptId,
        question_id: currentQ.id,
        selected_option: 0,
        time_spent: 3,
        session_token: sessionToken,
      }),
    });

    const ansData = await ansRes.json();
    if (!ansRes.ok) {
      throw new Error(`Submission failed at Q${qNum}: ${JSON.stringify(ansData)}`);
    }

    if (ansData.session_token) sessionToken = ansData.session_token;

    if (i === 5) {
      // Question 5 should trigger level_completed!
      if (!ansData.level_completed) {
        throw new Error("Question 5 did not trigger level_completed!");
      }
      console.log(`  🎉 LEVEL 1 COMPLETED!`);
      console.log(`  🏆 Sector summary:`, ansData.level_completed);
      console.log(`  ➡️ Next level: Level ${ansData.next_level}`);
      if (!ansData.next_question) {
        throw new Error("next_question was missing from level_completed response!");
      }
      console.log(`  ✅ Next Question prepared: ${ansData.next_question.id} (Level ${ansData.next_question.level})`);
      currentQ = ansData.next_question;
      qNum += 1;
    } else {
      currentQ = ansData.next_question;
      qNum += 1;
    }
  }

  // 3. Now verify Question 6 (Level 2: WORKSHOP) can be answered cleanly!
  console.log(`\n[STEP 3] Answering Question 6 in LEVEL 2 (ID: ${currentQ.id})...`);
  const ansRes6 = await fetch(`${BASE_URL}/api/quiz/submit-answer`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-session-token": sessionToken,
    },
    body: JSON.stringify({
      attempt_id: attemptId,
      question_id: currentQ.id,
      selected_option: 1,
      time_spent: 4,
      session_token: sessionToken,
    }),
  });

  const ansData6 = await ansRes6.json();
  if (!ansRes6.ok) {
    throw new Error(`Question 6 failed to submit: ${JSON.stringify(ansData6)}`);
  }
  console.log(`✅ Question 6 submitted and evaluated successfully!`);
  console.log(`✅ Result: is_correct = ${ansData6.is_correct}, Points: ${ansData6.points_earned}, Total Score: ${ansData6.current_score}`);
  console.log(`✅ Next Question 7 prepared: ${ansData6.next_question.id}`);

  // 4. Answering Question 7
  console.log(`\n[STEP 4] Answering Question 7 in LEVEL 2 (ID: ${ansData6.next_question.id})...`);
  const ansRes7 = await fetch(`${BASE_URL}/api/quiz/submit-answer`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-session-token": ansData6.session_token || sessionToken,
    },
    body: JSON.stringify({
      attempt_id: attemptId,
      question_id: ansData6.next_question.id,
      selected_option: 0,
      time_spent: 2,
      session_token: ansData6.session_token || sessionToken,
    }),
  });

  const ansData7 = await ansRes7.json();
  if (!ansRes7.ok) {
    throw new Error(`Question 7 failed to submit: ${JSON.stringify(ansData7)}`);
  }
  console.log(`✅ Question 7 evaluated successfully! Total Score: ${ansData7.current_score}`);

  console.log("\n⚙️ =====================================================");
  console.log("⚙️ LEVEL TRANSITIONS ARE 100% OPERATIONAL WITH ZERO STUCK STATES!");
  console.log("⚙️ =====================================================");
}

runSimulation().catch((err) => {
  console.error("❌ Simulation Error:", err);
  process.exit(1);
});
