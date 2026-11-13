export const GITHUB_REPO_URL = 'https://github.com/aleksandrTestAccount/demo-interval-solver'

export const EXTERNAL_DOCS = Object.freeze([
  { title: 'Docs', url: `${GITHUB_REPO_URL}/blob/main/docs/language-spec.md` },
  { title: 'Source', url: `${GITHUB_REPO_URL}` }
])

export const DEFAULT_SOURCE_CODE = `// Fibonacci sequence

v10 < 64

v9 + v8 = v10
v8 + v7 = v9
v7 + v6 = v8
v6 + v5 = v7
v5 + v4 = v6
v4 + v3 = v5
v3 + v2 = v4
v2 + v1 = v3

v1 < v2

v1 >= 0

size 7 0`

// Automatically load all raw HTML files from the content directory
const contentFiles = import.meta.glob('../content/**/*.html', {
  query: '?raw',
  import: 'default',
  eager: true
})

const buildMenuChunks = (folder, sections) => {
  return sections.map(({ id, title, file }) => {
    const fileName = file || id
    return {
      id,
      title,
      contentHtml: contentFiles[`../content/${folder}/${fileName}.html`] || ''
    }
  })
}

export const DEFAULT_PAGE_ID = 'doc'

export const APP_PAGES = Object.freeze([
  { id: 'doc', title: 'Documentation' },
  { id: 'examples', title: 'Examples' },
  { id: 'generators', title: 'Generators' }
])

export const PAGE_CONTENT_MAP = Object.freeze({
  doc: buildMenuChunks('docs', [
    { id: 'intro', title: '01. Introduction' },
    { id: 'examples', title: '02. Simple Examples' },
    { id: 'types', title: '03. Supported Types' },
    { id: 'equations', title: '04. Equations Rules' },
    { id: 'binary-operators', title: '05. Binary Operators', file: 'binaryOperators' },
    { id: 'functions', title: '06. Unary Operators & Functions' },
    { id: 'conditions', title: '07. Conditions' },
    { id: 'search', title: '08. Binary Search' },
    { id: 'generator', title: '09. Code Generator' },
    { id: 'configs', title: '10. Configuration' },
    { id: 'examples2', title: '11. Advanced Examples' }
  ]),

  examples: buildMenuChunks('examples', [
    { id: 'max-sat', title: 'MaxSAT' },
    { id: 'weighted-partial-max-sat', title: 'Weighted Partial MaxSAT' },
    { id: 'sat-min-true-vars', title: 'SAT with minimum TRUE variables' },
    { id: 'knapsack-01', title: '0-1 Knapsack' },
    { id: 'quadratic-programming', title: 'Quadratic programming' },
    { id: 'closest-string', title: 'Closest string' },
    { id: 'shortest-vector', title: 'Shortest Vector' },
    { id: 'closest-vector', title: 'Closest Vector' },
    { id: 'hash', title: 'Hash' },
    { id: 'job-shop', title: 'Job shop' },
    { id: 'clauses-generator', title: 'Clauses generator' },
    { id: 'multiple-sequence-alignment', title: 'Multiple Sequence Alignment' },
    { id: 'longest-common-subsequence', title: 'Longest common subsequence' },
    { id: 'shortest-common-supersequence', title: 'Shortest common supersequence' },
    { id: 'travelling-salesman', title: 'Travelling Salesman' },
    { id: 'the-3n-plus-1-problem', title: 'The 3n+1 problem' },
    { id: 'sudoku', title: 'Sudoku' },
    { id: 'eight-queens-puzzle', title: 'Eight queens puzzle' },
    { id: 'addition-chain', title: 'Addition chain' },
    { id: 'constant-multiplication', title: 'Constant multiplication' },
    { id: 'lwe', title: 'LWE' },
    { id: 'golomb-ruler', title: 'Golomb ruler' },
    { id: 'verbal-arithmetic', title: 'Verbal arithmetic' },
    { id: 'binary-linear-code', title: 'Binary linear code' },
    { id: 'discrete-square-roots', title: 'Discrete Square Roots' },
    { id: 'modular-multiplicative-inverse', title: 'Modular Multiplicative Inverse' },
    { id: 'chinese-remainder-theorem', title: 'Chinese Remainder Theorem' },
    { id: 'binary-exponentiation-discrete-logarithm', title: 'Discrete Logarithm' },
    { id: 'elliptic-curves', title: 'Elliptic Curves' },
    { id: 'sum-of-two-prime-numbers', title: 'Sum of Two Prime Numbers' },
    { id: 'extended-euclidean-algorithm', title: 'Extended Euclidean Algorithm' },
    { id: 'karp-01-satisfiability', title: "Karp's 1. Satisfiability" },
    { id: 'karp-02-01-integer-programming', title: "Karp's 2. 0-1 Integer Programming" },
    { id: 'karp-03-clique', title: "Karp's 3. Clique" },
    { id: 'karp-04-set-packing', title: "Karp's 4. Set packing" },
    { id: 'karp-05-vertex-cover', title: "Karp's 5. Node cover" },
    { id: 'karp-06-set-covering', title: "Karp's 6. Set covering" },
    { id: 'karp-09-directed-hamilton-circuit', title: "Karp's 9. Directed Hamilton circuit" },
    { id: 'karp-10-undirected-hamilton-circuit', title: "Karp's 10. Undirected Hamilton" },
    { id: 'karp-11-sat3', title: "Karp's 11. SAT3" },
    { id: 'karp-12-chromatic-number', title: "Karp's 12. Chromatic number" },
    { id: 'karp-13-clique-cover', title: "Karp's 13. Clique cover" },
    { id: 'karp-14-exact-cover', title: "Karp's 14. Exact cover" },
    { id: 'karp-15-hitting-set', title: "Karp's 15. Hitting set" },
    { id: 'karp-16-steiner-tree', title: "Karp's 16. Steiner tree" },
    { id: 'karp-17-3d-matching', title: "Karp's 17. 3-dimensional matching" },
    { id: 'karp-18-subset-sum', title: "Karp's 18. Subset sum (Knapsack)" },
    { id: 'karp-19-job-sequencing', title: "Karp's 19. Job sequencing" },
    { id: 'karp-20-partition', title: "Karp's 20. Partition" },
    { id: 'karp-21-max-cut', title: "Karp's 21. Max cut" }
  ]),

  generators: buildMenuChunks('generators', [
    { id: 'factor', title: 'Factorization' },
    { id: 'dlog', title: 'Discrete Logarithm' },
    { id: 'knapsack', title: '0-1 Knapsack' },
    { id: 'subset-sum', title: 'Subset Sum' },
    { id: 'sudoku', title: 'Sudoku Grid' },
    { id: 'tsp', title: 'Travelling Salesman' }
  ])
})
