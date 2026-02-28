// utils/narrative-context.js

/**
 * Builds a rich context object from previous sessions for the new narrative structure
 */
export async function buildRichContext(projectId, currentSessionNumber) {
  try {
    // Import database utilities
    const { db } = await import("@/utils/db");
    const { founderNarratives } = await import("@/utils/schema");
    const { eq } = await import("drizzle-orm");

    // Fetch sessions directly from database instead of API
    const sessions = await db
      .select()
      .from(founderNarratives)
      .where(eq(founderNarratives.projectId, projectId))
      .orderBy(founderNarratives.sessionNumber);

    // Sort sessions by creation date
    const sortedSessions = sessions.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    // Build progressive narrative elements
    const context = {
      // Basic info
      projectName: sessions[0]?.projectName || "",
      totalSessions: sessions.length,
      currentSessionNumber,

      // Story Evolution
      yourStory: extractStoryEvolution(sortedSessions),
      storyDepth: calculateStoryDepth(sortedSessions),
      storyVersion:
        sortedSessions[sortedSessions.length - 1]?.storyVersion || 1,

      // The Essence Evolution
      yourTruth: extractYourTruthEvolution(sortedSessions),
      whatDrivesYou: extractWhatDrivesYouEvolution(sortedSessions),

      // Moments That Mattered
      turningPoints: extractEnhancedTurningPoints(sortedSessions),
      doubts: extractDoubts(sortedSessions),
      breakthroughs: extractBreakthroughs(sortedSessions),
      keyMoments: extractKeyMoments(sortedSessions),

      // Founder DNA Evolution
      founderDNA: extractFounderDNAEvolution(sortedSessions),
      personalityTraits: extractPersonalityTraits(sortedSessions),

      // Tell It Your Way Evolution
      tellItYourWay: extractTellItYourWayEvolution(sortedSessions),

      // Emotional and Clarity Journey
      emotionalArc: extractEmotionalArc(sortedSessions),
      clarityScore: extractClarityProgression(sortedSessions),
      narrativeDepth: extractNarrativeDepth(sortedSessions),

      // Themes and Patterns
      themeEvolution: extractThemeEvolution(sortedSessions),

      // Questions and Growth
      questionJourney: extractQuestionJourney(sortedSessions),
      growthMilestones: extractGrowthMilestones(sortedSessions),

      // Summary
      narrativeSummary: buildNarrativeSummary(sortedSessions),

      // Legacy support
      bioEvolution: extractBioEvolution(sortedSessions),
      oneLinerProgression: extractOneLinerProgression(sortedSessions),
      visionEvolution: extractVisionEvolution(sortedSessions),
      challengeTimeline: extractChallengeTimeline(sortedSessions),
    };

    return context;
  } catch (error) {
    console.error("Error building rich context:", error);
    return null;
  }
}

// New extraction functions for the updated structure

function extractStoryEvolution(sessions) {
  const stories = [];

  sessions.forEach((session, index) => {
    if (session.yourStory) {
      stories.push({
        sessionNumber: index + 1,
        story: session.yourStory,
        version: session.storyVersion || 1,
        firstLine: session.yourStory.split(".")[0],
        wordCount: session.yourStory.split(" ").length,
        depth: session.narrativeDepth || 1,
      });
    }
  });

  return {
    history: stories,
    latest: stories[stories.length - 1]?.story || "",
    original: stories[0]?.story || "",
    firstLine: stories[0]?.firstLine || "",
    currentVersion: stories[stories.length - 1]?.version || 1,
    hasEvolved:
      stories.length > 1 &&
      stories[0].story !== stories[stories.length - 1].story,
    growthRate: calculateNarrativeGrowthRate(stories),
  };
}

function extractYourTruthEvolution(sessions) {
  const truths = [];

  sessions.forEach((session, index) => {
    if (session.yourTruth) {
      truths.push({
        sessionNumber: index + 1,
        truth: session.yourTruth,
        context: session.sessionTitle,
        mood: session.mood,
      });
    }
  });

  return {
    history: truths,
    current: truths[truths.length - 1]?.truth || "",
    original: truths[0]?.truth || "",
    refinements: truths.length,
    hasDeepened: analyzeTruthDepth(truths),
  };
}

function extractWhatDrivesYouEvolution(sessions) {
  const driversMap = new Map();

  sessions.forEach((session, index) => {
    if (session.whatDrivesYou && Array.isArray(session.whatDrivesYou)) {
      session.whatDrivesYou.forEach((driver) => {
        const key = driver.theme;
        if (!driversMap.has(key)) {
          driversMap.set(key, {
            theme: driver.theme,
            firstAppeared: index + 1,
            descriptions: [],
            evolved: false,
          });
        }

        driversMap.get(key).descriptions.push({
          sessionNumber: index + 1,
          description: driver.description,
        });

        if (driver.evolved) {
          driversMap.get(key).evolved = true;
        }
      });
    }
  });

  const drivers = Array.from(driversMap.values());

  return {
    current: drivers.map((d) => ({
      theme: d.theme,
      description: d.descriptions[d.descriptions.length - 1]?.description,
    })),
    history: drivers,
    coreDrivers: drivers.filter(
      (d) => d.descriptions.length >= Math.ceil(sessions.length * 0.5)
    ),
    emergingDrivers: drivers.filter(
      (d) => d.firstAppeared > sessions.length - 3
    ),
  };
}

function extractDoubts(sessions) {
  const doubts = [];

  sessions.forEach((session, index) => {
    if (session.theDoubt) {
      doubts.push({
        sessionNumber: index + 1,
        doubt: session.theDoubt.moment,
        context: session.theDoubt.context,
        overcame: session.theDoubt.overcame || false,
        howTheyCopeOrOvercame: session.theDoubt.howTheyCopeOrOvercame,
        mood: session.mood,
        resolution: findDoubtResolution(
          session.theDoubt,
          sessions.slice(index + 1)
        ),
      });
    }
  });

  return {
    all: doubts,
    unresolved: doubts.filter((d) => !d.overcame && !d.resolution.resolved),
    overcome: doubts.filter((d) => d.overcame || d.resolution.resolved),
    patterns: identifyDoubtPatterns(doubts),
  };
}

function extractBreakthroughs(sessions) {
  const breakthroughs = [];

  sessions.forEach((session, index) => {
    if (session.theBreakthrough) {
      breakthroughs.push({
        sessionNumber: index + 1,
        moment: session.theBreakthrough.moment,
        impact: session.theBreakthrough.impact,
        ledTo: session.theBreakthrough.ledTo,
        rippleEffects: findRippleEffects(
          session.theBreakthrough,
          sessions.slice(index + 1)
        ),
      });
    }
  });

  return {
    all: breakthroughs,
    major: breakthroughs.filter((b) => b.rippleEffects.length > 0),
    timeline: breakthroughs.map((b) => ({
      session: b.sessionNumber,
      moment: b.moment.substring(0, 50) + "...",
    })),
  };
}

function extractFounderDNAEvolution(sessions) {
  const dnaHistory = [];

  sessions.forEach((session, index) => {
    if (session.founderDNA) {
      dnaHistory.push({
        sessionNumber: index + 1,
        dna: session.founderDNA,
        traits: session.personalityTraits || [],
        emotionalOpenness: session.emotionalOpenness || 1,
      });
    }
  });

  return {
    history: dnaHistory,
    latest: dnaHistory[dnaHistory.length - 1]?.dna || "",
    original: dnaHistory[0]?.dna || "",
    traitsEvolution: consolidateTraitsEvolution(dnaHistory),
    depthGrowth: calculatePersonalityDepthGrowth(dnaHistory),
  };
}

function extractPersonalityTraits(sessions) {
  const traitsMap = new Map();

  sessions.forEach((session, index) => {
    if (session.personalityTraits && Array.isArray(session.personalityTraits)) {
      session.personalityTraits.forEach((trait) => {
        if (!traitsMap.has(trait)) {
          traitsMap.set(trait, {
            trait,
            firstAppeared: index + 1,
            frequency: 0,
            sessions: [],
          });
        }

        traitsMap.get(trait).frequency++;
        traitsMap.get(trait).sessions.push(index + 1);
      });
    }
  });

  const traits = Array.from(traitsMap.values()).sort(
    (a, b) => b.frequency - a.frequency
  );

  return {
    core: traits.slice(0, 5),
    emerging: traits.filter((t) => t.firstAppeared > sessions.length - 3),
    consistent: traits.filter((t) => t.frequency >= sessions.length * 0.7),
  };
}

function extractTellItYourWayEvolution(sessions) {
  const versions = {
    lightning: [],
    dinnerParty: [],
    websiteBio: [],
    investorPitch: [],
  };

  sessions.forEach((session, index) => {
    if (session.tellItYourWay) {
      Object.keys(versions).forEach((key) => {
        if (session.tellItYourWay[key]) {
          versions[key].push({
            sessionNumber: index + 1,
            content: session.tellItYourWay[key],
          });
        }
      });
    }
  });

  return {
    current: {
      lightning:
        versions.lightning[versions.lightning.length - 1]?.content || "",
      dinnerParty:
        versions.dinnerParty[versions.dinnerParty.length - 1]?.content || "",
      websiteBio:
        versions.websiteBio[versions.websiteBio.length - 1]?.content || "",
      investorPitch:
        versions.investorPitch[versions.investorPitch.length - 1]?.content ||
        "",
    },
    history: versions,
    hasInvestorVersion: versions.investorPitch.length > 0,
  };
}

function extractClarityProgression(sessions) {
  const clarityScores = sessions
    .map((session, index) => ({
      sessionNumber: index + 1,
      clarity: session.clarityScore || 1,
      mood: session.mood,
    }))
    .filter((s) => s.clarity);

  return {
    progression: clarityScores,
    current: clarityScores[clarityScores.length - 1]?.clarity || 1,
    improvement:
      clarityScores.length > 1
        ? clarityScores[clarityScores.length - 1].clarity -
          clarityScores[0].clarity
        : 0,
    trajectory: analyzeClarityTrajectory(clarityScores),
  };
}

function extractNarrativeDepth(sessions) {
  const depths = sessions.map((session, index) => ({
    sessionNumber: index + 1,
    depth: session.narrativeDepth || 1,
    openness: session.emotionalOpenness || 1,
  }));

  return {
    progression: depths,
    current: depths[depths.length - 1]?.depth || 1,
    average: depths.reduce((sum, d) => sum + d.depth, 0) / depths.length,
    trajectory: analyzeDepthTrajectory(depths),
  };
}

function extractGrowthMilestones(sessions) {
  const milestones = [];

  // Identify sessions with significant changes
  for (let i = 1; i < sessions.length; i++) {
    const prev = sessions[i - 1];
    const curr = sessions[i];

    // Check for truth evolution
    if (prev.yourTruth !== curr.yourTruth) {
      milestones.push({
        sessionNumber: i + 1,
        type: "truth_evolution",
        description: `Truth evolved from "${prev.yourTruth}" to "${curr.yourTruth}"`,
      });
    }

    // Check for breakthrough moments
    if (curr.theBreakthrough) {
      milestones.push({
        sessionNumber: i + 1,
        type: "breakthrough",
        description: curr.theBreakthrough.moment,
      });
    }

    // Check for clarity jumps
    if ((curr.clarityScore || 1) - (prev.clarityScore || 1) >= 2) {
      milestones.push({
        sessionNumber: i + 1,
        type: "clarity_jump",
        description: `Major clarity increase from ${
          prev.clarityScore || 1
        } to ${curr.clarityScore || 1}`,
      });
    }

    // Check for narrative depth growth
    if ((curr.narrativeDepth || 1) >= 7 && (prev.narrativeDepth || 1) < 7) {
      milestones.push({
        sessionNumber: i + 1,
        type: "depth_milestone",
        description: "Reached deep narrative maturity",
      });
    }
  }

  return milestones.sort((a, b) => a.sessionNumber - b.sessionNumber);
}

function extractEnhancedTurningPoints(sessions) {
  const turningPoints = [];

  sessions.forEach((session, index) => {
    // Check for explicit turning points
    if (session.turningPoint) {
      turningPoints.push({
        sessionNumber: index + 1,
        moment: session.turningPoint.moment,
        context: session.turningPoint.context,
        impact: session.turningPoint.impact,
        type: "explicit",
      });
    }

    // Also check for implicit turning points in story evolution
    if (index > 0) {
      const prevStory = sessions[index - 1].yourStory || "";
      const currStory = session.yourStory || "";

      if (
        prevStory &&
        currStory &&
        calculateStorySimilarity(prevStory, currStory) < 0.6
      ) {
        turningPoints.push({
          sessionNumber: index + 1,
          moment: "Significant narrative shift detected",
          context: session.sessionTitle,
          impact: "Story direction changed",
          type: "implicit",
        });
      }
    }
  });

  return turningPoints;
}

// Helper functions for analysis

function calculateStoryDepth(sessions) {
  const latestSession = sessions[sessions.length - 1];
  if (!latestSession) return 1;

  // Calculate based on multiple factors
  const factors = {
    sessionCount: Math.min(sessions.length / 10, 1) * 2, // Max 2 points
    narrativeDepth: ((latestSession.narrativeDepth || 1) / 10) * 2, // Max 2 points
    emotionalOpenness: (latestSession.emotionalOpenness || 1) / 10, // Max 1 point
  };

  return Math.ceil(Object.values(factors).reduce((a, b) => a + b, 0));
}

function calculateNarrativeGrowthRate(stories) {
  if (stories.length < 2) return 0;

  const firstWordCount = stories[0].wordCount;
  const lastWordCount = stories[stories.length - 1].wordCount;
  const firstDepth = stories[0].depth;
  const lastDepth = stories[stories.length - 1].depth;

  const wordGrowth = (lastWordCount - firstWordCount) / firstWordCount;
  const depthGrowth = (lastDepth - firstDepth) / firstDepth;

  return {
    wordGrowth: Math.round(wordGrowth * 100),
    depthGrowth: Math.round(depthGrowth * 100),
    overall: Math.round(((wordGrowth + depthGrowth) / 2) * 100),
  };
}

function analyzeTruthDepth(truths) {
  if (truths.length < 2) return false;

  // Simple heuristic: later truths tend to be more specific/personal
  const firstTruth = truths[0].truth;
  const lastTruth = truths[truths.length - 1].truth;

  // Check for personal pronouns, specific details
  const personalWords = ["I", "my", "me", "myself"];
  const firstPersonal = personalWords.filter((w) =>
    firstTruth.includes(w)
  ).length;
  const lastPersonal = personalWords.filter((w) =>
    lastTruth.includes(w)
  ).length;

  return (
    lastPersonal > firstPersonal || lastTruth.length > firstTruth.length * 1.2
  );
}

function findDoubtResolution(doubt, laterSessions) {
  for (const session of laterSessions) {
    // Check if breakthrough addresses the doubt
    if (
      session.theBreakthrough &&
      (session.theBreakthrough.moment
        .toLowerCase()
        .includes(doubt.moment.toLowerCase().split(" ")[0]) ||
        session.theBreakthrough.impact.toLowerCase().includes("overcame") ||
        session.theBreakthrough.impact.toLowerCase().includes("resolved"))
    ) {
      return {
        resolved: true,
        inSession: session.sessionNumber,
        how: session.theBreakthrough.moment,
      };
    }

    // Check if truth evolution suggests resolution
    if (
      (session.yourTruth &&
        session.yourTruth.toLowerCase().includes("despite")) ||
      session.yourTruth.toLowerCase().includes("because of")
    ) {
      return {
        resolved: true,
        inSession: session.sessionNumber,
        how: "Transformed into strength",
      };
    }
  }

  return {
    resolved: false,
    status: "ongoing",
  };
}

function findRippleEffects(breakthrough, laterSessions) {
  const effects = [];

  laterSessions.forEach((session) => {
    // Check if later sessions reference this breakthrough
    if (
      session.yourStory &&
      session.yourStory.includes(breakthrough.moment.substring(0, 20))
    ) {
      effects.push({
        sessionNumber: session.sessionNumber,
        effect: "Referenced in narrative",
      });
    }

    // Check if it led to new themes
    if (
      session.whatDrivesYou &&
      session.whatDrivesYou.some((d) =>
        d.description
          .toLowerCase()
          .includes(breakthrough.moment.toLowerCase().split(" ")[0])
      )
    ) {
      effects.push({
        sessionNumber: session.sessionNumber,
        effect: "Became core driver",
      });
    }
  });

  return effects;
}

function consolidateTraitsEvolution(dnaHistory) {
  const allTraits = new Set();
  const traitTimeline = [];

  dnaHistory.forEach((entry) => {
    entry.traits.forEach((trait) => allTraits.add(trait));
    traitTimeline.push({
      session: entry.sessionNumber,
      traits: entry.traits,
      added: entry.traits.filter(
        (t) =>
          !dnaHistory
            .slice(0, dnaHistory.indexOf(entry))
            .some((e) => e.traits.includes(t))
      ),
    });
  });

  return {
    allTraits: Array.from(allTraits),
    timeline: traitTimeline,
    stable: Array.from(allTraits).filter(
      (t) =>
        dnaHistory.filter((e) => e.traits.includes(t)).length >=
        dnaHistory.length * 0.7
    ),
  };
}

function calculatePersonalityDepthGrowth(dnaHistory) {
  if (dnaHistory.length < 2) return 0;

  const first = dnaHistory[0];
  const last = dnaHistory[dnaHistory.length - 1];

  const wordCountGrowth =
    (last.dna.split(" ").length - first.dna.split(" ").length) /
    first.dna.split(" ").length;
  const opennessGrowth =
    (last.emotionalOpenness - first.emotionalOpenness) / 10;

  return Math.round(((wordCountGrowth + opennessGrowth) / 2) * 100);
}

function analyzeClarityTrajectory(clarityScores) {
  if (clarityScores.length < 2) return "stable";

  const recentScores = clarityScores.slice(-3);
  const avgRecent =
    recentScores.reduce((sum, s) => sum + s.clarity, 0) / recentScores.length;
  const avgEarly =
    clarityScores.slice(0, 3).reduce((sum, s) => sum + s.clarity, 0) /
    Math.min(3, clarityScores.length);

  if (avgRecent > avgEarly + 1) return "ascending";
  if (avgRecent < avgEarly - 1) return "questioning";
  return "stable";
}

function analyzeDepthTrajectory(depths) {
  if (depths.length < 2) return "emerging";

  const recent = depths.slice(-3);
  const avgRecent = recent.reduce((sum, d) => sum + d.depth, 0) / recent.length;

  if (avgRecent >= 8) return "profound";
  if (avgRecent >= 5) return "deepening";
  if (avgRecent >= 3) return "developing";
  return "emerging";
}

function identifyDoubtPatterns(doubts) {
  const patterns = {
    recurring: [],
    seasonal: [],
    resolved: [],
  };

  // Group doubts by theme
  const doubtThemes = new Map();
  doubts.forEach((doubt) => {
    const theme = extractDoubtTheme(doubt.doubt);
    if (!doubtThemes.has(theme)) {
      doubtThemes.set(theme, []);
    }
    doubtThemes.get(theme).push(doubt);
  });

  // Identify patterns
  doubtThemes.forEach((doubts, theme) => {
    if (doubts.length > 1) {
      patterns.recurring.push({
        theme,
        occurrences: doubts.length,
        sessions: doubts.map((d) => d.sessionNumber),
      });
    }
  });

  return patterns;
}

function extractDoubtTheme(doubtText) {
  // Simple theme extraction based on keywords
  const themes = {
    ability: ["can", "able", "capable", "skill", "competent"],
    worth: ["worth", "value", "deserve", "good enough"],
    direction: ["right", "path", "direction", "way", "choice"],
    impact: ["matter", "difference", "impact", "change"],
    timing: ["ready", "time", "soon", "late"],
  };

  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some((keyword) => doubtText.toLowerCase().includes(keyword))) {
      return theme;
    }
  }

  return "general";
}

function calculateStorySimilarity(story1, story2) {
  // Simple word overlap similarity
  const words1 = new Set(
    story1
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 3)
  );
  const words2 = new Set(
    story2
      .toLowerCase()
      .split(" ")
      .filter((w) => w.length > 3)
  );

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

// Keep the legacy functions that are still needed
function extractBioEvolution(sessions) {
  // Map from founderDNA for backward compatibility
  const dnaEvolution = extractFounderDNAEvolution(sessions);

  return {
    history: dnaEvolution.history.map((h) => ({
      sessionNumber: h.sessionNumber,
      bio: h.dna,
      sessionTitle: sessions[h.sessionNumber - 1]?.sessionTitle,
      date: sessions[h.sessionNumber - 1]?.createdAt,
      mood: sessions[h.sessionNumber - 1]?.mood,
    })),
    latest: dnaEvolution.latest,
    firstBio: dnaEvolution.original,
    hasEvolved: dnaEvolution.latest !== dnaEvolution.original,
  };
}

function extractOneLinerProgression(sessions) {
  // Map from yourTruth for backward compatibility
  const truthEvolution = extractYourTruthEvolution(sessions);

  return {
    history: truthEvolution.history.map((h) => ({
      sessionNumber: h.sessionNumber,
      oneLiner: h.truth,
      context: h.context,
      date: sessions[h.sessionNumber - 1]?.createdAt,
    })),
    current: truthEvolution.current,
    original: truthEvolution.original,
    refinements: truthEvolution.refinements,
  };
}

function extractKeyMoments(sessions) {
  const moments = [];

  sessions.forEach((session, index) => {
    // Extract from new keyQuotes array
    if (session.keyQuotes && Array.isArray(session.keyQuotes)) {
      session.keyQuotes.forEach((kq) => {
        moments.push({
          sessionNumber: index + 1,
          quote: kq.quote,
          context: kq.context,
          sessionTitle: session.sessionTitle,
          significance: kq.significance || "insight",
        });
      });
    }

    // Also include breakthrough moments
    if (session.theBreakthrough) {
      moments.push({
        sessionNumber: index + 1,
        quote: session.theBreakthrough.moment,
        context: "Breakthrough moment",
        sessionTitle: session.sessionTitle,
        significance: "breakthrough",
      });
    }
  });

  return moments;
}

function extractThemeEvolution(sessions) {
  // Reuse the whatDrivesYou evolution
  const driversEvolution = extractWhatDrivesYouEvolution(sessions);

  return {
    coreThemes: driversEvolution.coreDrivers.map((d) => ({
      theme: d.theme,
      firstAppeared: d.firstAppeared,
      appearances: d.descriptions.map((desc) => ({
        sessionNumber: desc.sessionNumber,
        howItShowedUp: desc.description,
        sessionTitle: sessions[desc.sessionNumber - 1]?.sessionTitle,
      })),
    })),
    allThemes: driversEvolution.history,
    totalUniqueThemes: driversEvolution.history.length,
    mostPersistentTheme: driversEvolution.coreDrivers[0] || null,
  };
}

function extractEmotionalArc(sessions) {
  const arc = sessions.map((session, index) => ({
    sessionNumber: index + 1,
    mood: session.mood,
    emotionalTone: session.emotionalOpenness || 1,
    sessionTitle: session.sessionTitle,
    date: session.createdAt,
  }));

  const moodCounts = {};
  arc.forEach((point) => {
    moodCounts[point.mood] = (moodCounts[point.mood] || 0) + 1;
  });

  return {
    journey: arc,
    dominantMood:
      Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "reflective",
    moodVariety: Object.keys(moodCounts).length,
    currentMood: arc[arc.length - 1]?.mood,
    emotionalShifts: identifyEmotionalShifts(arc),
  };
}

function identifyEmotionalShifts(arc) {
  const shifts = [];
  for (let i = 1; i < arc.length; i++) {
    if (arc[i].mood !== arc[i - 1].mood) {
      shifts.push({
        fromSession: i,
        toSession: i + 1,
        fromMood: arc[i - 1].mood,
        toMood: arc[i].mood,
      });
    }
  }
  return shifts;
}

function extractQuestionJourney(sessions) {
  const questions = [];

  sessions.forEach((session, index) => {
    const feedback = parseFeedback(session.feedbackJson);
    if (feedback.nextPrompt || session.nextSessionPrompt) {
      questions.push({
        sessionNumber: index + 1,
        questionAsked: feedback.nextPrompt || session.nextSessionPrompt,
        wasAnswered: index < sessions.length - 1,
        ledTo: sessions[index + 1]?.sessionTitle,
      });
    }
  });

  return {
    questionsAsked: questions,
    unansweredQuestions: questions.filter((q) => !q.wasAnswered),
    questionProgression: questions.map((q) => q.questionAsked),
  };
}

function extractVisionEvolution(sessions) {
  // Map from tellItYourWay for vision
  const tellItEvolution = extractTellItYourWayEvolution(sessions);

  const visionPoints = [];
  sessions.forEach((session, index) => {
    if (session.tellItYourWay) {
      visionPoints.push({
        sessionNumber: index + 1,
        elevatorPitch:
          session.tellItYourWay.investorPitch ||
          session.tellItYourWay.dinnerParty,
        whyNowWhyMe: session.yourTruth, // Map from truth
        sessionContext: session.sessionTitle,
        stage: session.currentStage || "unknown",
      });
    }
  });

  return {
    visionHistory: visionPoints,
    currentVision: visionPoints[visionPoints.length - 1] || null,
    originalVision: visionPoints[0] || null,
    hasRefinedVision: visionPoints.length > 1,
    majorPivots: identifyVisionPivots(visionPoints),
  };
}

function identifyVisionPivots(visionPoints) {
  const pivots = [];

  for (let i = 1; i < visionPoints.length; i++) {
    const prev = visionPoints[i - 1];
    const curr = visionPoints[i];

    const similarity = calculateStorySimilarity(
      prev.elevatorPitch || "",
      curr.elevatorPitch || ""
    );

    if (similarity < 0.5) {
      pivots.push({
        fromSession: prev.sessionNumber,
        toSession: curr.sessionNumber,
        fromVision: prev.elevatorPitch,
        toVision: curr.elevatorPitch,
        reason: curr.whyNowWhyMe,
      });
    }
  }

  return pivots;
}

function extractChallengeTimeline(sessions) {
  // Map from doubts for challenges
  const doubts = extractDoubts(sessions);

  return doubts.all.map((d) => ({
    sessionNumber: d.sessionNumber,
    sessionTitle: sessions[d.sessionNumber - 1]?.sessionTitle,
    challengeContext: d.doubt,
    mood: d.mood,
    resolution: d.resolution,
  }));
}

function buildNarrativeSummary(sessions) {
  if (sessions.length === 0) return "";

  const first = sessions[0];
  const latest = sessions[sessions.length - 1];

  let summary = `Started with "${
    first.yourTruth || first.oneLiner || first.projectName
  }" in session 1. `;

  if (sessions.length > 2) {
    const breakthroughs = extractBreakthroughs(sessions);
    if (breakthroughs.major.length > 0) {
      summary += `Major breakthrough in session ${
        breakthroughs.major[0].sessionNumber
      }: "${breakthroughs.major[0].moment.substring(0, 50)}...". `;
    }
  }

  if (sessions.length > 1) {
    summary += `Now in session ${sessions.length}: ${
      latest.yourTruth || latest.sessionReflection || "continuing the journey"
    }.`;
  }

  return summary;
}

function parseFeedback(feedbackJson) {
  try {
    return typeof feedbackJson === "string"
      ? JSON.parse(feedbackJson)
      : feedbackJson;
  } catch (error) {
    return {};
  }
}
