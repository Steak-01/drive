import type { LucideIcon } from "lucide-react";
import { BookOpen, SignpostBig, Car, ScrollText } from "lucide-react";

export interface StudyGuide {
  icon: LucideIcon;
  title: string;
  summary: string;
  points: string[];
}

export const studyGuides: StudyGuide[] = [
  {
    icon: ScrollText,
    title: "Rules of the Road",
    summary:
      "The legal rules every driver must know — right of way, following distances, speed limits and parking.",
    points: [
      "General urban speed limit is 60 km/h unless a sign says otherwise.",
      "On a public road outside an urban area the limit is 100 km/h; on a freeway it is 120 km/h.",
      "Keep a following distance of at least 2 seconds behind the vehicle in front.",
      "At a 4-way stop, the vehicle that stopped first proceeds first.",
      "Always yield to pedestrians at a pedestrian crossing.",
    ],
  },
  {
    icon: SignpostBig,
    title: "Road Signs & Signals",
    summary: "Regulatory, warning and information signs — plus road markings and traffic signals.",
    points: [
      "Red, octagonal sign means STOP — come to a complete stop every time.",
      "Triangular signs warn you of hazards ahead, such as a sharp curve.",
      "Round signs give commands you must obey, such as 'no entry'.",
      "A solid white line in your lane means you may not cross or overtake.",
      "A flashing red traffic light is treated like a stop sign.",
    ],
  },
  {
    icon: Car,
    title: "Vehicle Controls (K53)",
    summary:
      "The controls test: clutch, brake, accelerator, mirrors, and the observation routine examiners look for.",
    points: [
      "Always do a 360° observation and check blind spots before pulling off.",
      "Use mirrors first, then signal, then move — 'mirror, signal, manoeuvre'.",
      "Hold the clutch at biting point to control the vehicle on a slope (hill start).",
      "Apply the handbrake whenever the vehicle is stationary for more than a moment.",
      "Steering should be smooth — feed the wheel, don't cross your hands.",
    ],
  },
  {
    icon: BookOpen,
    title: "Learner's Licence Prep",
    summary: "How the learner's test works and how to prepare so you pass on your first attempt.",
    points: [
      "The learner's test has three sections: rules of the road, road signs and vehicle controls.",
      "You must pass all three sections in the same sitting to get your learner's.",
      "Bring your ID and the required eye-test result on test day.",
      "Practise the signs daily — most failures come from the signs section.",
      "Our learner's package includes printed notes and a mock test.",
    ],
  },
];

export interface PracticeQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 1,
    category: "Rules of the Road",
    question: "What is the general speed limit in an urban area unless otherwise indicated?",
    options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
    answerIndex: 1,
    explanation: "The default speed limit in built-up urban areas is 60 km/h.",
  },
  {
    id: 2,
    category: "Rules of the Road",
    question: "At a four-way stop, who has the right of way?",
    options: [
      "The largest vehicle",
      "The vehicle on the left",
      "The vehicle that arrived and stopped first",
      "The fastest vehicle",
    ],
    answerIndex: 2,
    explanation: "The vehicle that comes to a complete stop first has the right to proceed first.",
  },
  {
    id: 3,
    category: "Road Signs",
    question: "A red octagonal sign means:",
    options: ["Yield", "No entry", "Stop", "Speed limit"],
    answerIndex: 2,
    explanation: "An octagonal red sign always means STOP — a complete stop is required.",
  },
  {
    id: 4,
    category: "Road Signs",
    question: "What does a triangular road sign usually indicate?",
    options: [
      "A command you must obey",
      "A warning of a hazard ahead",
      "General information",
      "A parking area",
    ],
    answerIndex: 1,
    explanation: "Triangular signs warn drivers of a potential hazard ahead.",
  },
  {
    id: 5,
    category: "Vehicle Controls",
    question: "Before pulling off from the side of the road, you should first:",
    options: [
      "Sound the hooter",
      "Do a 360° observation including blind spots",
      "Switch on the radio",
      "Rev the engine",
    ],
    answerIndex: 1,
    explanation: "A full 360° observation, including blind spots, is required before moving off.",
  },
  {
    id: 6,
    category: "Rules of the Road",
    question: "The recommended minimum following distance is:",
    options: ["Half a second", "1 second", "2 seconds", "5 seconds"],
    answerIndex: 2,
    explanation: "A following distance of at least 2 seconds gives you time to react.",
  },
  {
    id: 7,
    category: "Road Signs",
    question: "A solid white line in your lane means you may:",
    options: ["Overtake freely", "Not cross or overtake", "Park anywhere", "Reverse"],
    answerIndex: 1,
    explanation: "A solid line indicates you may not cross it or overtake.",
  },
  {
    id: 8,
    category: "Vehicle Controls",
    question: "When stopping at a robot for more than a moment, you should:",
    options: [
      "Stay in gear with the clutch down",
      "Apply the handbrake and select neutral",
      "Switch the engine off",
      "Keep your foot on the accelerator",
    ],
    answerIndex: 1,
    explanation:
      "Apply the handbrake and select neutral when stationary to stay safely in control.",
  },
  {
    id: 9,
    category: "Rules of the Road",
    question: "A flashing red traffic light should be treated as:",
    options: ["A green light", "A yield sign", "A stop sign", "No signal at all"],
    answerIndex: 2,
    explanation: "A flashing red light is treated exactly like a stop sign.",
  },
  {
    id: 10,
    category: "Rules of the Road",
    question: "At a pedestrian crossing you must:",
    options: [
      "Speed up to clear it",
      "Yield to pedestrians",
      "Hoot to warn them",
      "Only stop at night",
    ],
    answerIndex: 1,
    explanation: "Pedestrians always have right of way at a marked crossing.",
  },
  {
    id: 11,
    category: "Vehicle Controls",
    question: "The correct sequence before changing lanes is:",
    options: [
      "Signal, manoeuvre, mirror",
      "Mirror, signal, manoeuvre",
      "Manoeuvre, mirror, signal",
      "Signal only",
    ],
    answerIndex: 1,
    explanation: "Always check mirrors, then signal, then manoeuvre.",
  },
  {
    id: 12,
    category: "Road Signs",
    question: "Round signs with a red border generally:",
    options: [
      "Give a command or prohibition you must obey",
      "Warn of hazards",
      "Provide tourist information",
      "Mark a freeway exit",
    ],
    answerIndex: 0,
    explanation: "Round signs are regulatory — they give commands you must obey.",
  },
];
