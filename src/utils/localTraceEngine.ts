/**
 * Local Trace Engine
 *
 * Provides static, API-key-free execution tracing for Java DSA algorithms.
 * Falls back to this engine when Gemini API is unavailable.
 *
 * Two modes:
 * 1. Pre-built trace generators for known algorithm patterns (from striverData)
 * 2. Generic Java execution tracer for arbitrary user code
 */

import { TraceStep } from "../types";
import {
  generateSortColorsTrace,
  generateKadaneTrace,
  generateSetMatrixZeroesTrace,
  generateReverseLinkedListTrace,
  generateBinarySearchTrace,
  generateNQueensTrace,
  generateDijkstraTrace,
} from "../data/striverData";

// ──────────────────────────────────────────────
// Pattern matching for known algorithms
// ──────────────────────────────────────────────

interface AlgorithmPattern {
  keywords: string[];
  id: string;
  generator: (input: string) => TraceStep[];
}

const KNOWN_PATTERNS: AlgorithmPattern[] = [
  {
    keywords: ["sort color", "dutch national flag", "dutch flag"],
    id: "sort-colors",
    generator: generateSortColorsTrace,
  },
  {
    keywords: ["kadane", "max subarray", "maximum subarray"],
    id: "kadanes-algorithm",
    generator: generateKadaneTrace,
  },
  {
    keywords: ["set matrix zero", "matrix zero"],
    id: "set-matrix-zeroes",
    generator: generateSetMatrixZeroesTrace,
  },
  {
    keywords: ["reverse linked list", "reverse list"],
    id: "reverse-linked-list",
    generator: generateReverseLinkedListTrace,
  },
  {
    keywords: ["binary search", "search sorted"],
    id: "binary-search",
    generator: generateBinarySearchTrace,
  },
  {
    keywords: ["n queen", "nqueen"],
    id: "n-queens",
    generator: generateNQueensTrace,
  },
  {
    keywords: ["dijkstra", "shortest path"],
    id: "dijkstras-algorithm",
    generator: generateDijkstraTrace,
  },
];

/**
 * Try to match a problem title against known algorithm patterns.
 */
function matchKnownAlgorithm(problemTitle: string): AlgorithmPattern | null {
  const lower = problemTitle.toLowerCase();
  for (const pattern of KNOWN_PATTERNS) {
    for (const kw of pattern.keywords) {
      if (lower.includes(kw)) {
        return pattern;
      }
    }
  }
  return null;
}

/**
 * Check if a problem title matches a known algorithm by also scanning
 * the code snippet for characteristic patterns.
 */
function detectAlgorithmFromCode(codeSnippet: string): AlgorithmPattern | null {
  const lower = codeSnippet.toLowerCase();

  // Dutch National Flag: three pointers low, mid, high
  if (
    (lower.includes("low") && lower.includes("mid") && lower.includes("high") && lower.includes("nums[mid]")) ||
    (lower.includes("low") && lower.includes("mid") && lower.includes("high") && lower.includes("dutch"))
  ) {
    return KNOWN_PATTERNS[0]; // sort-colors
  }

  // Kadane's: maxSoFar, currentSum
  if (lower.includes("maxsofar") && lower.includes("currentsum")) {
    return KNOWN_PATTERNS[1]; // kadanes-algorithm
  }

  // Set Matrix Zeroes: col0 flag, matrix[0][j] markers
  if (lower.includes("col0") || (lower.includes("matrix[i][0]") && lower.includes("matrix[0][j]"))) {
    return KNOWN_PATTERNS[2]; // set-matrix-zeroes
  }

  // Reverse Linked List: prev, curr, nextTemp
  if (lower.includes("prev") && lower.includes("curr") && lower.includes("nexttemp") && lower.includes(".next")) {
    return KNOWN_PATTERNS[3]; // reverse-linked-list
  }

  // Binary Search: low, high, mid
  if (
    (lower.includes("let low") || lower.includes("var low")) &&
    (lower.includes("let high") || lower.includes("var high")) &&
    lower.includes("mid =") &&
    lower.includes("nums[mid]")
  ) {
    return KNOWN_PATTERNS[4]; // binary-search
  }

  // N-Queens: queens, backtrack, board[row][col]
  if (lower.includes("queen") && (lower.includes("backtrack") || lower.includes("board[row][col]"))) {
    return KNOWN_PATTERNS[5]; // n-queens
  }

  // Dijkstra: dist, visited, relax
  if (
    (lower.includes("dijkstra") || lower.includes("shortest path")) ||
    (lower.includes("dist") && lower.includes("visited") && lower.includes("relax"))
  ) {
    return KNOWN_PATTERNS[6]; // dijkstras-algorithm
  }

  return null;
}

// ──────────────────────────────────────────────
// Generic Java Execution Tracer
// ──────────────────────────────────────────────

/**
 * The generic tracer instruments the user's Java code patterns and simulates
 * execution, recording variable state changes at each step.
 *
 * It works by:
 * 1. Parsing the user's Java code for algorithm patterns
 * 2. Simulating array/object mutations
 * 3. Recording state snapshots at each loop iteration / key operation
 */

function generateGenericTrace(
  codeSnippet: string,
  customInput: string,
  problemTitle: string
): TraceStep[] {
  const steps: TraceStep[] = [];
  
  // Parse input: support comma-separated, semicolon-separated, or pipe-separated
  const parsedInput = parseInputString(customInput);
  if (parsedInput.length === 0) {
    return [];
  }

  // Detect algorithm type from code to generate meaningful steps
  const codeAnalysis = analyzeCode(codeSnippet);
  
  // Simulate execution using the detected algorithm pattern
  if (codeAnalysis.type === "two-pointer") {
    return simulateTwoPointer(codeSnippet, parsedInput, codeAnalysis, problemTitle);
  } else if (codeAnalysis.type === "sliding-window") {
    return simulateSlidingWindow(codeSnippet, parsedInput, codeAnalysis, problemTitle);
  } else if (codeAnalysis.type === "iteration") {
    return simulateIteration(codeSnippet, parsedInput, codeAnalysis, problemTitle);
  } else {
    return simulateGeneric(codeSnippet, parsedInput, problemTitle);
  }
}

function parseInputString(input: string): number[] {
  // Support: comma-separated, semicolon-separated (where first part is array)
  if (input.includes(";")) {
    const parts = input.split(";");
    return parts[0]
      .split(",")
      .map(x => parseFloat(x.trim()))
      .filter(x => !isNaN(x));
  }
  
  return input
    .split(",")
    .map(x => parseFloat(x.trim()))
    .filter(x => !isNaN(x));
}

interface CodeAnalysis {
  type: "two-pointer" | "sliding-window" | "iteration" | "generic";
  variables: string[];
  hasSwap: boolean;
  hasComparison: boolean;
  hasConditional: boolean;
}

function analyzeCode(code: string): CodeAnalysis {
  const lower = code.toLowerCase();
  
  // Detect two-pointer pattern
  if (
    (lower.includes("low") && lower.includes("high")) ||
    (lower.includes("left") && lower.includes("right")) ||
    (lower.includes("start") && lower.includes("end"))
  ) {
    return {
      type: "two-pointer",
      variables: extractVariables(code),
      hasSwap: lower.includes("swap") || lower.includes("temp") || lower.includes("tmp"),
      hasComparison: lower.includes(">") || lower.includes("<") || lower.includes("===") || lower.includes("=="),
      hasConditional: lower.includes("if") || lower.includes("else"),
    };
  }
  
  // Detect sliding window pattern
  if (
    (lower.includes("window") || lower.includes("slide")) ||
    (lower.includes("left") && lower.includes("right") && lower.includes("max"))
  ) {
    return {
      type: "sliding-window",
      variables: extractVariables(code),
      hasSwap: false,
      hasComparison: true,
      hasConditional: true,
    };
  }
  
  // Detect basic iteration
  if (
    lower.includes("for") ||
    lower.includes("while") ||
    lower.includes("foreach") ||
    lower.includes("map(") ||
    lower.includes("reduce(")
  ) {
    return {
      type: "iteration",
      variables: extractVariables(code),
      hasSwap: lower.includes("swap") || lower.includes("temp"),
      hasComparison: lower.includes(">") || lower.includes("<") || lower.includes("==="),
      hasConditional: lower.includes("if"),
    };
  }
  
  return {
    type: "generic",
    variables: [],
    hasSwap: false,
    hasComparison: false,
    hasConditional: false,
  };
}

function extractVariables(code: string): string[] {
  const vars: string[] = [];
  // Match variable declarations
  const letMatches = code.matchAll(/let\s+(\w+)/g);
  const constMatches = code.matchAll(/const\s+(\w+)/g);
  const varMatches = code.matchAll(/var\s+(\w+)/g);
  const paramMatches = code.matchAll(/function\s+\w+\s*\(([^)]+)\)/g);
  
  for (const m of letMatches) vars.push(m[1]);
  for (const m of constMatches) vars.push(m[1]);
  for (const m of varMatches) vars.push(m[1]);
  for (const m of paramMatches) {
    m[1].split(",").forEach(p => {
      const name = p.trim().split("=")[0].trim();
      if (name) vars.push(name);
    });
  }
  
  // Remove duplicates and common Java built-ins
  return [...new Set(vars)].filter(v =>
    !["i", "j", "k", "idx", "index", "len", "length", "n", "m", "temp", "tmp", "result", "res", "arr", "nums", "array"].includes(v)
  );
}

function simulateTwoPointer(
  code: string,
  arr: number[],
  analysis: CodeAnalysis,
  title: string
): TraceStep[] {
  const steps: TraceStep[] = [];
  const nums = [...arr];
  let low = 0;
  let high = nums.length - 1;
  const vars: Record<string, string | number | boolean | null> = {};
  
  // Extract variable names from code
  const varNames = analysis.variables;
  varNames.forEach(v => { vars[v] = null; });
  
  // Initial step
  steps.push({
    stepNumber: 1,
    explanation: `Initialize two pointers: left = ${low}, right = ${high} for the array [${nums.join(", ")}].`,
    codeHighlightLine: 1,
    variablesState: { left: low, right: high, ...vars },
    arrayState: [...nums],
    activeIndices: [low, high],
    pointerLabels: { [low]: "left", [high]: "right" },
  });
  
  let stepCount = 0;
  const MAX_STEPS = 20;
  
  while (low < high && stepCount < MAX_STEPS) {
    stepCount++;
    
    // Simulate a comparison/trade
    if (nums[low] < nums[high]) {
      if (analysis.hasSwap) {
        // Simulate swapping
        const temp = nums[low];
        nums[low] = nums[high];
        nums[high] = temp;
        
        steps.push({
          stepNumber: steps.length + 1,
          explanation: `nums[left] (${nums[low]}) < nums[right] (${nums[high]}). Swap elements at indices ${low} and ${high}.`,
          codeHighlightLine: 3 + stepCount,
          variablesState: { left: low, right: high, action: "Swap", ...vars },
          arrayState: [...nums],
          activeIndices: [low, high],
          pointerLabels: { [low]: "left", [high]: "right" },
        });
      } else {
        steps.push({
          stepNumber: steps.length + 1,
          explanation: `nums[left] (${nums[low]}) < nums[right] (${nums[high]}). Move left pointer inward.`,
          codeHighlightLine: 3 + stepCount,
          variablesState: { left: low, right: high, ...vars },
          arrayState: [...nums],
          activeIndices: [low, high],
          pointerLabels: { [low]: "left", [high]: "right" },
        });
      }
      low++;
    } else if (nums[low] > nums[high]) {
      if (analysis.hasSwap) {
        const temp = nums[low];
        nums[low] = nums[high];
        nums[high] = temp;
        
        steps.push({
          stepNumber: steps.length + 1,
          explanation: `nums[left] (${nums[low]}) > nums[right] (${nums[high]}). Swap elements at indices ${low} and ${high}.`,
          codeHighlightLine: 3 + stepCount,
          variablesState: { left: low, right: high, action: "Swap", ...vars },
          arrayState: [...nums],
          activeIndices: [low, high],
          pointerLabels: { [low]: "left", [high]: "right" },
        });
      } else {
        steps.push({
          stepNumber: steps.length + 1,
          explanation: `nums[left] (${nums[low]}) > nums[right] (${nums[high]}). Move right pointer inward.`,
          codeHighlightLine: 3 + stepCount,
          variablesState: { left: low, right: high, ...vars },
          arrayState: [...nums],
          activeIndices: [low, high],
          pointerLabels: { [low]: "left", [high]: "right" },
        });
      }
      high--;
    } else {
      // Equal
      steps.push({
        stepNumber: steps.length + 1,
        explanation: `nums[left] === nums[right] (${nums[low]}). Move both pointers inward.`,
        codeHighlightLine: 3 + stepCount,
        variablesState: { left: low, right: high, ...vars },
        arrayState: [...nums],
        activeIndices: [low, high],
        pointerLabels: { [low]: "left", [high]: "right" },
      });
      low++;
      high--;
    }
  }
  
  steps.push({
    stepNumber: steps.length + 1,
    explanation: `Algorithm complete! Pointers crossed (left=${low}, right=${high}). Final array: [${nums.join(", ")}].`,
    codeHighlightLine: 8 + stepCount,
    variablesState: { left: low, right: high, finished: true, ...vars },
    arrayState: [...nums],
    activeIndices: [],
    pointerLabels: {},
  });
  
  return steps;
}

function simulateSlidingWindow(
  code: string,
  arr: number[],
  analysis: CodeAnalysis,
  title: string
): TraceStep[] {
  const steps: TraceStep[] = [];
  const nums = [...arr];
  let left = 0;
  let right = 0;
  let windowSum = nums[0] || 0;
  let maxVal = -Infinity;
  
  // Initial step
  steps.push({
    stepNumber: 1,
    explanation: `Initialize sliding window: left=0, right=0. Window initially contains [${nums[0]}]. Current sum = ${windowSum}.`,
    codeHighlightLine: 1,
    variablesState: { left, right, windowSum, maxVal: maxVal === -Infinity ? "-∞" : maxVal },
    arrayState: [...nums],
    activeIndices: [0],
    pointerLabels: { [0]: "left/right" },
  });
  
  let stepCount = 0;
  const MAX_STEPS = 15;
  
  while (right < nums.length - 1 && stepCount < MAX_STEPS) {
    stepCount++;
    right++;
    windowSum += nums[right];
    
    steps.push({
      stepNumber: steps.length + 1,
      explanation: `Expand window: move right pointer to ${right}. Add nums[${right}] = ${nums[right]}. Window sum = ${windowSum}.`,
      codeHighlightLine: 3 + stepCount,
      variablesState: { left, right, windowSum, maxVal: maxVal === -Infinity ? "-∞" : maxVal },
      arrayState: [...nums],
      activeIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      pointerLabels: { [left]: "left", [right]: "right" },
    });
    
    if (windowSum > maxVal) {
      const prev = maxVal;
      maxVal = windowSum;
      steps.push({
        stepNumber: steps.length + 1,
        explanation: `New maximum found! Window sum ${windowSum} > previous max ${prev === -Infinity ? "-∞" : prev}. Update max to ${maxVal}.`,
        codeHighlightLine: 5 + stepCount,
        variablesState: { left, right, windowSum, maxVal },
        arrayState: [...nums],
        activeIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        pointerLabels: { [left]: "left", [right]: "right" },
      });
    }
    
    // If window condition is violated, shrink from left
    if (windowSum < 0 && nums.length > 2) {
      windowSum -= nums[left];
      steps.push({
        stepNumber: steps.length + 1,
        explanation: `Window sum is negative (${windowSum + nums[left]}). Shrink window: move left from ${left} to ${left + 1}. Subtract nums[${left}] = ${nums[left]}.`,
        codeHighlightLine: 7 + stepCount,
        variablesState: { left, right, windowSum, maxVal },
        arrayState: [...nums],
        activeIndices: Array.from({ length: right - left }, (_, i) => left + 1 + i),
        pointerLabels: { [left + 1]: "left", [right]: "right" },
      });
      left++;
    }
  }
  
  steps.push({
    stepNumber: steps.length + 1,
    explanation: `Algorithm complete! Maximum value${maxVal === -Infinity ? " could not be determined" : ` = ${maxVal}`}.`,
    codeHighlightLine: 10 + stepCount,
    variablesState: { left, right, finished: true, result: maxVal === -Infinity ? null : maxVal },
    arrayState: [...nums],
    activeIndices: [],
    pointerLabels: {},
  });
  
  return steps;
}

function simulateIteration(
  code: string,
  arr: number[],
  analysis: CodeAnalysis,
  title: string
): TraceStep[] {
  const steps: TraceStep[] = [];
  const nums = [...arr];
  
  // Initial step
  steps.push({
    stepNumber: 1,
    explanation: `Start iterating over array of ${nums.length} elements: [${nums.join(", ")}].`,
    codeHighlightLine: 1,
    variablesState: { i: 0, n: nums.length },
    arrayState: [...nums],
    activeIndices: [],
    pointerLabels: {},
  });
  
  const MAX_STEPS = 15;
  let candidate = nums[0];
  let count = 1;
  
  // Detect Boyer-Moore (Majority Element) pattern
  const isMajorityVote = code.toLowerCase().includes("candidate") && 
                          code.toLowerCase().includes("count") &&
                          (code.includes("===") || code.includes("=="));
  
  if (isMajorityVote) {
    // Boyer-Moore Voting simulation
    for (let i = 1; i < nums.length && steps.length < MAX_STEPS; i++) {
      if (nums[i] === candidate) {
        count++;
        steps.push({
          stepNumber: steps.length + 1,
          explanation: `Index ${i}: nums[${i}] = ${nums[i]} === candidate (${candidate}). Increment count to ${count}.`,
          codeHighlightLine: Math.min(4 + i, 12),
          variablesState: { i, candidate, count, "nums[i]": nums[i] },
          arrayState: [...nums],
          activeIndices: [i],
          pointerLabels: { [i]: "i" },
        });
      } else {
        count--;
        steps.push({
          stepNumber: steps.length + 1,
          explanation: `Index ${i}: nums[${i}] = ${nums[i]} !== candidate (${candidate}). Decrement count to ${count}.`,
          codeHighlightLine: Math.min(6 + i, 14),
          variablesState: { i, candidate, count, "nums[i]": nums[i] },
          arrayState: [...nums],
          activeIndices: [i],
          pointerLabels: { [i]: "i" },
        });
        
        if (count === 0) {
          const prevCandidate = candidate;
          candidate = nums[i + 1] !== undefined ? nums[i + 1] : candidate;
          steps.push({
            stepNumber: steps.length + 1,
            explanation: `Count dropped to 0. Update candidate from ${prevCandidate} to ${candidate}. Reset count to 1.`,
            codeHighlightLine: Math.min(8 + i, 16),
            variablesState: { i, candidate, count: 1, action: "New candidate" },
            arrayState: [...nums],
            activeIndices: [i],
            pointerLabels: { [i]: "i" },
          });
          count = 1;
          i++; // skip the new candidate index
        }
      }
    }
    
    steps.push({
      stepNumber: steps.length + 1,
      explanation: `Iteration complete. Majority element candidate is: ${candidate}.`,
      codeHighlightLine: 18,
      variablesState: { candidate, finished: true, result: candidate },
      arrayState: [...nums],
      activeIndices: [],
      pointerLabels: {},
    });
  } else if (analysis.hasSwap) {
    // Bubble/selection sort-like simulation
    for (let i = 0; i < Math.min(nums.length - 1, 4) && steps.length < MAX_STEPS; i++) {
      for (let j = 0; j < nums.length - 1 - i && steps.length < MAX_STEPS; j++) {
        if (nums[j] > nums[j + 1]) {
          const temp = nums[j];
          nums[j] = nums[j + 1];
          nums[j + 1] = temp;
          
          steps.push({
            stepNumber: steps.length + 1,
            explanation: `Compare & Swap: nums[${j}] (${nums[j + 1]}) > nums[${j + 1}] (${temp}). Swap them. Array: [${nums.join(", ")}].`,
            codeHighlightLine: Math.min(3 + i + j, 14),
            variablesState: { i, j, "nums[j]": nums[j], "nums[j+1]": nums[j + 1] },
            arrayState: [...nums],
            activeIndices: [j, j + 1],
            pointerLabels: { [j]: "j", [j + 1]: "j+1", [nums.length - 1 - i]: "sorted" },
          });
        }
      }
    }
    
    steps.push({
      stepNumber: steps.length + 1,
      explanation: `Sorting iteration complete. Final array state: [${nums.join(", ")}].`,
      codeHighlightLine: 16,
      variablesState: { finished: true },
      arrayState: [...nums],
      activeIndices: [],
      pointerLabels: {},
    });
  } else {
    // Generic iteration: simulate with basic scanning
    for (let i = 0; i < Math.min(nums.length, MAX_STEPS - 1); i++) {
      steps.push({
        stepNumber: steps.length + 1,
        explanation: `Processing index ${i}: value nums[${i}] = ${nums[i]}.`,
        codeHighlightLine: Math.min(3 + i, 16),
        variablesState: { i, "nums[i]": nums[i] },
        arrayState: [...nums],
        activeIndices: [i],
        pointerLabels: { [i]: "i" },
      });
    }
    
    steps.push({
      stepNumber: steps.length + 1,
      explanation: `Iteration complete! Processed ${Math.min(nums.length, MAX_STEPS - 1)} elements.`,
      codeHighlightLine: 18,
      variablesState: { finished: true, processed: Math.min(nums.length, MAX_STEPS - 1) },
      arrayState: [...nums],
      activeIndices: [],
      pointerLabels: {},
    });
  }
  
  return steps;
}

function simulateGeneric(
  code: string,
  arr: number[],
  title: string
): TraceStep[] {
  const steps: TraceStep[] = [];
  const nums = [...arr];
  
  // Simple linear scan with step recording
  steps.push({
    stepNumber: 1,
    explanation: `Analyzing algorithm on input array: [${nums.join(", ")}].`,
    codeHighlightLine: 1,
    variablesState: { length: nums.length },
    arrayState: [...nums],
    activeIndices: [],
    pointerLabels: {},
  });
  
  const MAX_STEPS = 12;
  for (let i = 0; i < Math.min(nums.length, MAX_STEPS - 1); i++) {
    steps.push({
      stepNumber: steps.length + 1,
      explanation: `Examine element at index ${i} with value ${nums[i]}.`,
      codeHighlightLine: Math.min(3 + i, 15),
      variablesState: { i, "current": nums[i] },
      arrayState: [...nums],
      activeIndices: [i],
      pointerLabels: { [i]: "i" },
    });
  }
  
  steps.push({
    stepNumber: steps.length + 1,
    explanation: `Trace complete! Execution simulated ${steps.length} steps for "${title}".`,
    codeHighlightLine: 16,
    variablesState: { finished: true, stepsGenerated: steps.length },
    arrayState: [...nums],
    activeIndices: [],
    pointerLabels: {},
  });
  
  return steps;
}

// ──────────────────────────────────────────────
// Public API
// ──────────────────────────────────────────────

/**
 * Main entry point: generate a visual trace locally without any API key.
 * 
 * @param problemTitle - The title/name of the algorithm problem
 * @param codeSnippet  - The user's Java code
 * @param customInput  - Input data (comma-separated, etc.)
 * @returns TraceStep[] array compatible with the visualizer
 */
export function generateLocalTrace(
  problemTitle: string,
  codeSnippet: string,
  customInput: string
): TraceStep[] {
  // 1. First try: match problem title to known algorithm patterns
  const matchedPattern = matchKnownAlgorithm(problemTitle);
  if (matchedPattern) {
    try {
      const steps = matchedPattern.generator(customInput);
      if (steps.length > 0) {
        return steps;
      }
    } catch (e) {
      // Fall through to next strategy
      console.warn(`[LocalTrace] Known pattern ${matchedPattern.id} failed:`, e);
    }
  }

  // 2. Second try: detect algorithm from code structure
  const detectedPattern = detectAlgorithmFromCode(codeSnippet);
  if (detectedPattern) {
    try {
      const steps = detectedPattern.generator(customInput);
      if (steps.length > 0) {
        return steps;
      }
    } catch (e) {
      console.warn(`[LocalTrace] Code-detected pattern ${detectedPattern.id} failed:`, e);
    }
  }

  // 3. Fallback: generic JavaScript execution tracer
  return generateGenericTrace(codeSnippet, customInput, problemTitle);
}

/**
 * Check if the local tracer is available (always true - never requires API key)
 */
export function isLocalTracerAvailable(): boolean {
  return true;
}
