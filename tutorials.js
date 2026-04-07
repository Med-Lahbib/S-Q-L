// ═══════════ TUTORIAL DATA ═══════════
// Each tutorial has steps. Each step has: text (explanation), visual (what to render), anim (animation type)
// Visual types: 'table' (show table), 'table-highlight' (highlight rows/cols), 'table-filter' (filter animation),
//   'table-transform' (before→after), 'diagram' (conceptual diagram), 'code' (SQL syntax)

const TUTORIALS = {
  // ═══════════ CHAPTER 1: BASICS ═══════════
  0: { // SELECT *
    title: "Understanding SELECT *",
    steps: [
      {
        text: "Every SQL query starts with <b>SELECT</b>. It tells the database: <em>\"I want to read some data!\"</em>",
        visual: "diagram",
        diagram: { type: "concept", content: "YOU → <span class='kw'>SELECT</span> → DATABASE → DATA BACK TO YOU" }
      },
      {
        text: "The database stores data in <b>tables</b> — like spreadsheets with rows and columns.",
        visual: "table",
        table: "employees",
        highlightAll: true,
        animDelay: 0
      },
      {
        text: "The asterisk <code>*</code> means <b>\"give me ALL columns\"</b>. It's a wildcard!",
        visual: "code",
        code: "SELECT <span class='hl'>*</span> FROM employees",
        annotation: "← The * grabs every column"
      },
      {
        text: "When you run <code>SELECT * FROM employees</code>, every row and every column comes back:",
        visual: "table-highlight",
        table: "employees",
        highlightRows: "all",
        highlightCols: "all",
        animType: "sweep"
      },
      {
        text: "The result is a <b>complete copy</b> of the table. All 5 rows, all 4 columns. That's it!",
        visual: "table-transform",
        before: { label: "employees (original)", data: "all" },
        after: { label: "Result", data: "all" },
        animType: "copy"
      }
    ]
  },

  1: { // SELECT columns
    title: "Selecting Specific Columns",
    steps: [
      {
        text: "Instead of <code>*</code>, you can list <b>specific column names</b> to get only the data you need.",
        visual: "diagram",
        diagram: { type: "concept", content: "<span class='kw'>SELECT</span> name, salary → Only those 2 columns" }
      },
      {
        text: "Here's our employees table with 4 columns. But maybe we only care about names and salaries.",
        visual: "table",
        table: "employees",
        highlightAll: false
      },
      {
        text: "We list column names after SELECT, separated by commas:",
        visual: "code",
        code: "SELECT <span class='hl'>name</span>, <span class='hl'>salary</span> FROM employees",
        annotation: "← Pick only what you need"
      },
      {
        text: "Watch: <b>id</b> and <b>department</b> are <em>excluded</em>. Only <b>name</b> and <b>salary</b> survive!",
        visual: "table-highlight",
        table: "employees",
        highlightCols: [1, 3], // name and salary (0-indexed)
        dimCols: [0, 2], // id and department
        animType: "cols-fade"
      },
      {
        text: "The result has just 2 columns — much cleaner when you don't need everything!",
        visual: "table-transform",
        before: { label: "All columns", cols: 4 },
        after: { label: "Selected columns", cols: 2 },
        animType: "shrink"
      }
    ]
  },

  2: { // WHERE
    title: "Filtering with WHERE",
    steps: [
      {
        text: "<code>WHERE</code> is like a <b>bouncer</b> at a club. Only rows that meet the condition get through! 🚪",
        visual: "diagram",
        diagram: { type: "bouncer", content: "ALL ROWS → <span class='kw'>WHERE</span> condition → MATCHING ROWS ONLY" }
      },
      {
        text: "We have 5 employees in different departments. We only want the Engineering people.",
        visual: "table",
        table: "employees",
        highlightAll: false
      },
      {
        text: "Add the <code>WHERE</code> clause after the table name:",
        visual: "code",
        code: "SELECT * FROM employees\n<span class='hl'>WHERE department = 'Engineering'</span>",
        annotation: "← The filter condition"
      },
      {
        text: "The database checks <b>each row</b> one by one. Does <code>department = 'Engineering'</code>?",
        visual: "table-filter",
        table: "employees",
        checkCol: 2, // department column
        checkVal: "Engineering",
        animType: "row-check"
      },
      {
        text: "✅ Alice and Carol pass the check. ❌ Bob, Dave, and Eve are filtered out!",
        visual: "table-transform",
        before: { label: "5 rows", count: 5 },
        after: { label: "2 rows (Engineering only)", count: 2 },
        animType: "filter"
      }
    ]
  },

  3: { // AND & OR
    title: "Combining Conditions with AND & OR",
    steps: [
      {
        text: "<code>AND</code> = <b>both must be true</b>. <code>OR</code> = <b>either can be true</b>.",
        visual: "diagram",
        diagram: { type: "logic", content: "AND: ✅ + ✅ = ✅ &nbsp;|&nbsp; ✅ + ❌ = ❌<br>OR: &nbsp;✅ + ❌ = ✅ &nbsp;|&nbsp; ❌ + ❌ = ❌" }
      },
      {
        text: "We want Engineering employees who <em>also</em> earn more than 86000. That's two conditions!",
        visual: "table",
        table: "employees",
        highlightAll: false
      },
      {
        text: "Use <code>AND</code> to require both conditions at once:",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE department = 'Engineering'\n  <span class='hl'>AND</span> salary > 86000",
        annotation: "← Both must be true!"
      },
      {
        text: "The database checks <b>two</b> conditions per row. Only Alice (Engineering + 90000) passes both!",
        visual: "table-filter",
        table: "employees",
        checkCol: 2,
        checkVal: "Engineering",
        checkCol2: 3,
        checkOp: ">",
        checkVal2: 86000,
        animType: "double-check"
      }
    ]
  },

  4: { // ORDER BY
    title: "Sorting with ORDER BY",
    steps: [
      {
        text: "<code>ORDER BY</code> sorts your results. Think of it like rearranging a deck of cards! 🃏",
        visual: "diagram",
        diagram: { type: "concept", content: "Unsorted → <span class='kw'>ORDER BY</span> column → Sorted! ↕" }
      },
      {
        text: "Our employees are listed in insertion order (id 1, 2, 3...). But what if we want them by salary?",
        visual: "table",
        table: "employees",
        highlightAll: false
      },
      {
        text: "<code>ASC</code> = ascending (small→big, A→Z). <code>DESC</code> = descending (big→small, Z→A).",
        visual: "code",
        code: "SELECT * FROM employees\n<span class='hl'>ORDER BY salary DESC</span>",
        annotation: "← DESC = highest first"
      },
      {
        text: "Watch the rows <b>rearrange</b> themselves — highest salary moves to the top!",
        visual: "table-sort",
        table: "employees",
        sortCol: 3, // salary
        sortDir: "desc",
        animType: "sort-swap"
      }
    ]
  },

  5: { // LIMIT
    title: "LIMIT — Take Only What You Need",
    steps: [
      {
        text: "<code>LIMIT</code> is like saying: <em>\"Just give me the first N rows.\"</em> Perfect for top-N queries!",
        visual: "diagram",
        diagram: { type: "concept", content: "10,000 rows → <span class='kw'>LIMIT 3</span> → Just 3 rows 🎯" }
      },
      {
        text: "We often combine ORDER BY + LIMIT to get \"top N\" results:",
        visual: "code",
        code: "SELECT * FROM employees\nORDER BY salary DESC\n<span class='hl'>LIMIT 3</span>",
        annotation: "← Only return 3 rows"
      },
      {
        text: "After sorting by salary DESC, LIMIT <b>cuts off</b> everything after row 3:",
        visual: "table-limit",
        table: "employees",
        keepRows: 3,
        animType: "cut"
      }
    ]
  },

  6: { // DISTINCT
    title: "DISTINCT — Remove Duplicates",
    steps: [
      {
        text: "<code>DISTINCT</code> is like a <b>unique filter</b>. It removes duplicate values from your results.",
        visual: "diagram",
        diagram: { type: "concept", content: "[A, B, A, B, C] → <span class='kw'>DISTINCT</span> → [A, B, C]" }
      },
      {
        text: "Look at the department column. 'Engineering' appears twice, 'Marketing' appears twice:",
        visual: "table",
        table: "employees",
        highlightAll: false
      },
      {
        text: "<code>SELECT DISTINCT department</code> gives us each department exactly once:",
        visual: "code",
        code: "SELECT <span class='hl'>DISTINCT</span> department\nFROM employees",
        annotation: "← Each value appears once"
      },
      {
        text: "Duplicates are <b>collapsed</b>. 5 rows become 3 unique departments!",
        visual: "table-filter",
        table: "employees",
        animType: "distinct",
        distinctCol: 2
      }
    ]
  },

  7: { // Aliases
    title: "Aliases — Naming Things Your Way",
    steps: [
      {
        text: "<code>AS</code> lets you give columns (or tables) a <b>temporary nickname</b>. It's just cosmetic!",
        visual: "diagram",
        diagram: { type: "concept", content: "salary → <span class='kw'>AS</span> annual_pay → Same data, new name" }
      },
      {
        text: "Useful for making results more readable, or when column names are ugly:",
        visual: "code",
        code: "SELECT name, salary <span class='hl'>AS annual_pay</span>\nFROM employees",
        annotation: "← Rename salary → annual_pay"
      },
      {
        text: "The data is <b>identical</b> — only the column header changes in the result!",
        visual: "table-rename",
        table: "employees",
        oldName: "salary",
        newName: "annual_pay",
        animType: "rename"
      }
    ]
  },

  // ═══════════ CHAPTER 2: FILTERING ═══════════
  8: { // BETWEEN
    title: "BETWEEN — Range Filtering",
    steps: [
      {
        text: "<code>BETWEEN</code> checks if a value is within a range. It's <b>inclusive</b> on both ends!",
        visual: "diagram",
        diagram: { type: "range", content: "60K ····· <span class='hl-range'>[70K ═══ 88K]</span> ····· 90K" }
      },
      {
        text: "Instead of writing <code>salary >= 70000 AND salary <= 88000</code>, just use BETWEEN:",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE salary <span class='hl'>BETWEEN 70000 AND 88000</span>",
        annotation: "← Inclusive on both ends"
      },
      {
        text: "Bob (70K), Eve (75K), and Carol (85K) fall in the range. Alice (90K) and Dave (60K) don't!",
        visual: "table-filter",
        table: "employees",
        checkCol: 3,
        checkVal: "70000-88000",
        animType: "range-check"
      }
    ]
  },

  9: { // IN
    title: "IN — Match a List",
    steps: [
      {
        text: "<code>IN</code> checks if a value matches <b>any item</b> in a list. Cleaner than chaining ORs!",
        visual: "diagram",
        diagram: { type: "concept", content: "value IN (<span class='hl'>item1</span>, <span class='hl'>item2</span>, <span class='hl'>item3</span>) → Match any!" }
      },
      {
        text: "Instead of <code>dept = 'Engineering' OR dept = 'HR'</code>, use IN:",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE department <span class='hl'>IN ('Engineering', 'HR')</span>",
        annotation: "← Match any in the list"
      },
      {
        text: "Each row's department is checked against the list. Engineering? ✅ HR? ✅ Marketing? ❌",
        visual: "table-filter",
        table: "employees",
        checkCol: 2,
        checkVal: "Engineering/HR",
        animType: "row-check"
      }
    ]
  },

  10: { // LIKE
    title: "LIKE — Pattern Matching",
    steps: [
      {
        text: "<code>LIKE</code> matches text patterns. Two wildcards: <code>%</code> = any characters, <code>_</code> = one character.",
        visual: "diagram",
        diagram: { type: "patterns", content: "'A<span class='hl'>%</span>' → Starts with A<br>'<span class='hl'>%</span>son' → Ends with son<br>'<span class='hl'>_</span>ob' → 3 chars ending in ob" }
      },
      {
        text: "Want all names starting with 'A'? Use the % wildcard:",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE name <span class='hl'>LIKE 'A%'</span>",
        annotation: "← A followed by anything"
      },
      {
        text: "Alice starts with 'A' ✅. Bob, Carol, Dave, Eve don't ❌.",
        visual: "table-filter",
        table: "employees",
        checkCol: 1,
        checkVal: "A%",
        animType: "pattern-check"
      }
    ]
  },

  11: { // IS NULL
    title: "IS NULL — Finding Empty Values",
    steps: [
      {
        text: "<code>NULL</code> in SQL means \"<b>no value</b>\" — not zero, not empty string, literally nothing!",
        visual: "diagram",
        diagram: { type: "concept", content: "NULL ≠ 0 &nbsp;|&nbsp; NULL ≠ '' &nbsp;|&nbsp; NULL = <em>unknown</em>" }
      },
      {
        text: "⚠️ You <b>cannot</b> use <code>= NULL</code>. NULL isn't equal to anything, not even itself!",
        visual: "code",
        code: "-- ❌ Wrong!\nWHERE manager_id = NULL\n\n-- ✅ Correct!\nWHERE manager_id <span class='hl'>IS NULL</span>",
        annotation: "← Special syntax for NULL"
      },
      {
        text: "Rows with NULL manager_id are employees with no manager — typically top-level leaders.",
        visual: "table-filter",
        table: "employees",
        checkCol: 3,
        checkVal: "NULL",
        animType: "null-check"
      }
    ]
  },

  12: { // NOT
    title: "NOT — Inverting Conditions",
    steps: [
      {
        text: "<code>NOT</code> flips a condition to its opposite. <b>True becomes false, false becomes true!</b>",
        visual: "diagram",
        diagram: { type: "concept", content: "IN Marketing → <span class='kw'>NOT</span> → NOT in Marketing" }
      },
      {
        text: "Works with many operators: NOT IN, NOT LIKE, NOT BETWEEN, IS NOT NULL…",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE department <span class='hl'>!= 'Marketing'</span>",
        annotation: "← Everyone EXCEPT Marketing"
      },
      {
        text: "Marketing employees are excluded. Everyone else stays!",
        visual: "table-filter",
        table: "employees",
        checkCol: 2,
        checkVal: "!Marketing",
        animType: "invert-check"
      }
    ]
  },

  13: { // Comparison Ops
    title: "Comparison Operators",
    steps: [
      {
        text: "SQL supports all the comparison operators you'd expect from math:",
        visual: "diagram",
        diagram: { type: "operators", content: "<code>=</code> equal &nbsp; <code>!=</code> not equal &nbsp; <code>&lt;</code> less than<br><code>&gt;</code> greater &nbsp; <code>&lt;=</code> less or equal &nbsp; <code>&gt;=</code> greater or equal" }
      },
      {
        text: "Use <code>&gt;</code> to find employees earning more than 75000:",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE salary <span class='hl'>> 75000</span>",
        annotation: "← Strictly greater than"
      },
      {
        text: "Alice (90K) and Carol (85K) are above 75K. The rest are at or below!",
        visual: "table-filter",
        table: "employees",
        checkCol: 3,
        checkVal: ">75000",
        animType: "row-check"
      }
    ]
  },

  // ═══════════ CHAPTER 3: AGGREGATION ═══════════
  14: { // COUNT
    title: "COUNT — Counting Rows",
    steps: [
      {
        text: "<code>COUNT()</code> is an <b>aggregate function</b>. It takes many rows and returns a <b>single number</b>.",
        visual: "diagram",
        diagram: { type: "aggregate", content: "5 rows → <span class='kw'>COUNT(*)</span> → <span class='hl'>5</span>" }
      },
      {
        text: "Think of it as: the database counts all the rows and gives you one answer.",
        visual: "table",
        table: "employees",
        highlightAll: true,
        animDelay: 0
      },
      {
        text: "<code>COUNT(*)</code> counts ALL rows. <code>COUNT(column)</code> counts non-NULL values.",
        visual: "code",
        code: "SELECT <span class='hl'>COUNT(*)</span> FROM employees",
        annotation: "← Returns: 5"
      },
      {
        text: "All 5 rows collapse into a <b>single result</b>: the number 5!",
        visual: "table-aggregate",
        table: "employees",
        aggType: "count",
        result: "5",
        animType: "collapse"
      }
    ]
  },

  15: { // SUM & AVG
    title: "SUM & AVG — Totals and Averages",
    steps: [
      {
        text: "<code>SUM()</code> adds up all values. <code>AVG()</code> gives you the average (mean).",
        visual: "diagram",
        diagram: { type: "aggregate", content: "90K + 70K + 85K + 60K + 75K<br><span class='kw'>SUM</span> = <span class='hl'>380,000</span> &nbsp;|&nbsp; <span class='kw'>AVG</span> = <span class='hl'>76,000</span>" }
      },
      {
        text: "To total up all salaries in the company:",
        visual: "code",
        code: "SELECT <span class='hl'>SUM(salary)</span> FROM employees\n-- Returns: 380000",
        annotation: "← Adds all salary values"
      },
      {
        text: "Watch the salary column values merge into a single total!",
        visual: "table-aggregate",
        table: "employees",
        aggType: "sum",
        aggCol: 3,
        result: "380000",
        animType: "collapse"
      }
    ]
  },

  16: { // MIN & MAX
    title: "MIN & MAX — Extremes",
    steps: [
      {
        text: "<code>MIN()</code> finds the <b>smallest</b> value. <code>MAX()</code> finds the <b>largest</b>.",
        visual: "diagram",
        diagram: { type: "aggregate", content: "[60K, 70K, 75K, 85K, 90K]<br><span class='kw'>MIN</span> = <span class='hl'>60,000</span> &nbsp;|&nbsp; <span class='kw'>MAX</span> = <span class='hl'>90,000</span>" }
      },
      {
        text: "Find the highest salary:",
        visual: "code",
        code: "SELECT <span class='hl'>MAX(salary)</span> FROM employees\n-- Returns: 90000",
        annotation: "← Scans and finds the biggest"
      },
      {
        text: "The database scans every row and picks the highest salary: Alice's 90,000!",
        visual: "table-aggregate",
        table: "employees",
        aggType: "max",
        aggCol: 3,
        result: "90000",
        animType: "scan-pick"
      }
    ]
  },

  17: { // GROUP BY
    title: "GROUP BY — Grouping Rows",
    steps: [
      {
        text: "<code>GROUP BY</code> <b>groups rows</b> that share a value, then lets you aggregate each group independently.",
        visual: "diagram",
        diagram: { type: "group", content: "🔵🟢🔵🟡🟢 → GROUP BY color → 🔵🔵 | 🟢🟢 | 🟡" }
      },
      {
        text: "Our employees belong to 3 departments. GROUP BY department creates 3 groups:",
        visual: "table-group",
        table: "employees",
        groupCol: 2,
        groups: ["Engineering", "Marketing", "HR"],
        animType: "group-split"
      },
      {
        text: "Now COUNT(*) runs <b>separately</b> on each group:",
        visual: "code",
        code: "SELECT department, <span class='hl'>COUNT(*)</span>\nFROM employees\n<span class='hl'>GROUP BY department</span>",
        annotation: "← Count per group"
      },
      {
        text: "Engineering: 2, Marketing: 2, HR: 1. Each group gets its own count!",
        visual: "table-aggregate",
        table: "employees",
        aggType: "group-count",
        groupCol: 2,
        animType: "group-collapse"
      }
    ]
  },

  18: { // AVG per Group
    title: "AVG per Group",
    steps: [
      {
        text: "You can use <b>any aggregate function</b> with GROUP BY — not just COUNT!",
        visual: "diagram",
        diagram: { type: "concept", content: "GROUP BY dept → <span class='kw'>AVG</span>(salary) per group" }
      },
      {
        text: "Calculate the average salary for each department:",
        visual: "code",
        code: "SELECT department, <span class='hl'>AVG(salary)</span>\nFROM employees\n<span class='hl'>GROUP BY department</span>",
        annotation: "← Average per department"
      },
      {
        text: "Engineering: (90K+85K)/2 = 87.5K &nbsp;|&nbsp; Marketing: (70K+75K)/2 = 72.5K &nbsp;|&nbsp; HR: 60K",
        visual: "table-aggregate",
        table: "employees",
        aggType: "group-avg",
        groupCol: 2,
        animType: "group-collapse"
      }
    ]
  },

  19: { // HAVING
    title: "HAVING — Filtering Groups",
    steps: [
      {
        text: "<code>WHERE</code> filters <b>individual rows</b>. <code>HAVING</code> filters <b>groups</b> after GROUP BY.",
        visual: "diagram",
        diagram: { type: "pipeline", content: "Rows → <span class='kw'>WHERE</span> (filter rows) → <span class='kw'>GROUP BY</span> → <span class='kw'>HAVING</span> (filter groups)" }
      },
      {
        text: "After grouping by department, we want only departments with <b>more than 1</b> employee:",
        visual: "code",
        code: "SELECT department, COUNT(*)\nFROM employees\nGROUP BY department\n<span class='hl'>HAVING COUNT(*) > 1</span>",
        annotation: "← Filter after grouping"
      },
      {
        text: "Engineering (2) ✅ Marketing (2) ✅ HR (1) ❌ → HR is filtered out!",
        visual: "table-aggregate",
        table: "employees",
        aggType: "having",
        groupCol: 2,
        animType: "group-filter"
      }
    ]
  },

  // ═══════════ CHAPTER 4: JOINS ═══════════
  20: { // INNER JOIN
    title: "INNER JOIN — Combining Tables",
    steps: [
      {
        text: "<code>JOIN</code> connects two tables based on a matching condition. Think of it as <b>linking spreadsheets</b>!",
        visual: "diagram",
        diagram: { type: "join", content: "TABLE A ←<span class='kw'>JOIN</span>→ TABLE B<br>Match on: A.id = B.employee_id" }
      },
      {
        text: "We have <b>employees</b> and <b>projects</b> as separate tables. IDs link them together:",
        visual: "two-tables",
        tables: ["employees", "projects"],
        linkCols: [0, 1],
        animType: "show-link"
      },
      {
        text: "<code>INNER JOIN</code> only returns rows where a match exists in <b>both</b> tables:",
        visual: "code",
        code: "SELECT e.name, p.project_name\nFROM employees e\n<span class='hl'>JOIN projects p ON e.id = p.employee_id</span>",
        annotation: "← Match employees to their projects"
      },
      {
        text: "Each employee is linked to their projects. Dave has no project, so he's <b>excluded</b>!",
        visual: "join-anim",
        joinType: "inner",
        animType: "connect-rows"
      }
    ]
  },

  21: { // LEFT JOIN
    title: "LEFT JOIN — Keep All from Left",
    steps: [
      {
        text: "<code>LEFT JOIN</code> keeps <b>ALL rows from the left table</b>, even if there's no match on the right.",
        visual: "diagram",
        diagram: { type: "join", content: "<span class='hl'>ALL of Table A</span> ← LEFT JOIN → Matching from Table B<br>No match? → NULL" }
      },
      {
        text: "With INNER JOIN, Dave (no project) was dropped. LEFT JOIN keeps him!",
        visual: "code",
        code: "SELECT e.name, p.project_name\nFROM employees e\n<span class='hl'>LEFT JOIN</span> projects p\n  ON e.id = p.employee_id",
        annotation: "← Dave appears with NULL project"
      },
      {
        text: "Dave stays in the result. Since he has no project, the project column shows <b>NULL</b>.",
        visual: "join-anim",
        joinType: "left",
        animType: "connect-rows"
      }
    ]
  },

  22: { // Self JOIN
    title: "Self JOIN — A Table Joining Itself",
    steps: [
      {
        text: "A table can join <b>itself</b>! Use <b>aliases</b> to treat one table as if it were two different tables.",
        visual: "diagram",
        diagram: { type: "concept", content: "employees AS <span class='hl'>e</span> (the employee)<br>employees AS <span class='hl'>m</span> (the manager)<br>Same table, two roles!" }
      },
      {
        text: "Each employee has a <code>manager_id</code> pointing to another employee's <code>id</code>:",
        visual: "code",
        code: "SELECT <span class='hl'>e</span>.name AS employee,\n       <span class='hl'>m</span>.name AS manager\nFROM employees <span class='hl'>e</span>\nJOIN employees <span class='hl'>m</span> ON e.manager_id = m.id",
        annotation: "← Two aliases for the same table"
      },
      {
        text: "Bob's manager_id = 1 → Alice (id=1). The table looks up <b>itself</b> to find the name!",
        visual: "join-anim",
        joinType: "self",
        animType: "self-lookup"
      }
    ]
  },

  23: { // Multiple JOINs
    title: "Multiple JOINs — Chaining Tables",
    steps: [
      {
        text: "You can chain <b>multiple JOINs</b> to connect 3+ tables in one query!",
        visual: "diagram",
        diagram: { type: "chain", content: "employees →<span class='kw'>JOIN</span>→ departments →<span class='kw'>JOIN</span>→ projects" }
      },
      {
        text: "Each JOIN adds more columns from another table:",
        visual: "code",
        code: "SELECT e.name, d.dept_name, p.project_name\nFROM employees e\n<span class='hl'>JOIN departments d ON e.dept_id = d.id</span>\n<span class='hl'>JOIN projects p ON e.id = p.employee_id</span>",
        annotation: "← Two JOINs in one query"
      }
    ]
  },

  24: { // CROSS JOIN
    title: "CROSS JOIN — Every Combination",
    steps: [
      {
        text: "<code>CROSS JOIN</code> produces the <b>Cartesian product</b> — every possible combination!",
        visual: "diagram",
        diagram: { type: "cross", content: "2 employees × 3 projects = <span class='hl'>6 combinations</span>" }
      },
      {
        text: "No ON condition needed — it just pairs everything with everything:",
        visual: "code",
        code: "SELECT e.name, p.project_name\nFROM employees e\n<span class='hl'>CROSS JOIN</span> projects p",
        annotation: "← No ON clause!"
      }
    ]
  },

  // ═══════════ CHAPTER 5: SUBQUERIES ═══════════
  25: { // WHERE Subquery
    title: "Subqueries — A Query Inside a Query",
    steps: [
      {
        text: "A <b>subquery</b> is a query nested inside another. The inner query runs first, then feeds its result to the outer query.",
        visual: "diagram",
        diagram: { type: "nesting", content: "Outer: SELECT * FROM employees WHERE salary > (<br>&nbsp;&nbsp;Inner: <span class='hl'>SELECT AVG(salary) FROM employees</span><br>)" }
      },
      {
        text: "The inner query calculates: AVG salary = 76,000. Then the outer uses that number!",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE salary > <span class='hl'>(SELECT AVG(salary) FROM employees)</span>",
        annotation: "← Inner query → 76000, then WHERE salary > 76000"
      },
      {
        text: "Step 1: Inner query runs → 76000. Step 2: Outer filters rows where salary > 76000.",
        visual: "table-filter",
        table: "employees",
        checkCol: 3,
        checkVal: ">76000",
        animType: "subquery-steps"
      }
    ]
  },

  26: { // IN Subquery
    title: "IN with Subquery",
    steps: [
      {
        text: "Instead of a hardcoded list, <code>IN</code> can use a <b>subquery</b> to generate the list dynamically!",
        visual: "diagram",
        diagram: { type: "concept", content: "IN (1, 2) ← hardcoded<br>IN (<span class='hl'>SELECT employee_id FROM projects</span>) ← dynamic!" }
      },
      {
        text: "The subquery finds all employee IDs that have projects. Then IN checks against that list.",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE id <span class='hl'>IN (SELECT employee_id FROM projects)</span>",
        annotation: "← Subquery returns [1, 2]"
      }
    ]
  },

  27: { // EXISTS
    title: "EXISTS — Does It Exist?",
    steps: [
      {
        text: "<code>EXISTS</code> returns true if the subquery returns <b>any rows at all</b>. It doesn't care about the values!",
        visual: "diagram",
        diagram: { type: "concept", content: "EXISTS (subquery returns rows?) → <span class='hl'>TRUE</span><br>EXISTS (subquery returns nothing?) → <span class='hl'>FALSE</span>" }
      },
      {
        text: "For each employee, check if they have at least one project:",
        visual: "code",
        code: "SELECT * FROM employees\nWHERE <span class='hl'>EXISTS</span> (\n  SELECT 1 FROM projects\n  WHERE projects.employee_id = employees.id\n)",
        annotation: "← Correlated: references outer query"
      }
    ]
  },

  28: { // Derived Tables
    title: "Derived Tables (Subquery in FROM)",
    steps: [
      {
        text: "A subquery in the <code>FROM</code> clause creates a <b>temporary table</b> you can query against!",
        visual: "diagram",
        diagram: { type: "concept", content: "FROM (<span class='hl'>subquery that creates a temp table</span>) AS alias" }
      },
      {
        text: "First compute avg salary per department, then filter that result:",
        visual: "code",
        code: "SELECT * FROM (\n  <span class='hl'>SELECT department, AVG(salary) as avg_sal</span>\n  <span class='hl'>FROM employees GROUP BY department</span>\n) sub\nORDER BY avg_sal DESC LIMIT 1",
        annotation: "← Subquery creates a temp table"
      }
    ]
  },

  // ═══════════ CHAPTER 6: DATA MANIPULATION ═══════════
  29: { // INSERT
    title: "INSERT INTO — Adding Data",
    steps: [
      {
        text: "<code>INSERT INTO</code> adds <b>new rows</b> to a table. You specify the values for each column.",
        visual: "diagram",
        diagram: { type: "dml", content: "Table: 5 rows → <span class='kw'>INSERT</span> → Table: <span class='hl'>6 rows</span> ✨" }
      },
      {
        text: "Provide values in the same order as the columns:",
        visual: "code",
        code: "<span class='hl'>INSERT INTO</span> employees\n<span class='hl'>VALUES</span> (6, 'Frank', 'HR', 65000)",
        annotation: "← New row added to the table"
      },
      {
        text: "A brand new row appears at the bottom. The table now has 6 employees!",
        visual: "table-dml",
        action: "insert",
        newRow: [6, "Frank", "HR", 65000],
        animType: "row-insert"
      }
    ]
  },

  30: { // UPDATE
    title: "UPDATE — Modifying Data",
    steps: [
      {
        text: "<code>UPDATE</code> changes existing data. ⚠️ <b>Always use WHERE</b> or you'll update every row!",
        visual: "diagram",
        diagram: { type: "dml", content: "Alice: 90K → <span class='kw'>UPDATE SET</span> salary = 95K → Alice: <span class='hl'>95K</span>" }
      },
      {
        text: "Target specific rows with WHERE:",
        visual: "code",
        code: "<span class='hl'>UPDATE</span> employees\n<span class='hl'>SET</span> salary = 95000\n<span class='hl'>WHERE</span> name = 'Alice'",
        annotation: "← Only Alice is affected!"
      },
      {
        text: "Alice's salary changes from 90000 to 95000. Everyone else stays the same.",
        visual: "table-dml",
        action: "update",
        targetRow: 0,
        targetCol: 3,
        oldVal: 90000,
        newVal: 95000,
        animType: "cell-update"
      }
    ]
  },

  31: { // DELETE
    title: "DELETE — Removing Data",
    steps: [
      {
        text: "<code>DELETE FROM</code> removes rows. ⚠️ <b>Without WHERE, it deletes EVERYTHING!</b>",
        visual: "diagram",
        diagram: { type: "dml", content: "5 rows → <span class='kw'>DELETE WHERE</span> name='Dave' → <span class='hl'>4 rows</span>" }
      },
      {
        text: "Be surgical with your WHERE clause:",
        visual: "code",
        code: "<span class='hl'>DELETE FROM</span> employees\n<span class='hl'>WHERE</span> name = 'Dave'",
        annotation: "← Only Dave is removed"
      },
      {
        text: "Dave's row vanishes! The table now has 4 employees.",
        visual: "table-dml",
        action: "delete",
        targetRow: 3,
        animType: "row-delete"
      }
    ]
  },

  32: { // UPDATE Multiple
    title: "UPDATE Multiple Rows",
    steps: [
      {
        text: "A single UPDATE can affect <b>multiple rows</b> if the WHERE matches more than one row.",
        visual: "diagram",
        diagram: { type: "dml", content: "All Engineering salaries → × 1.1 → <span class='hl'>10% raise!</span>" }
      },
      {
        text: "Use expressions in SET to compute new values:",
        visual: "code",
        code: "<span class='hl'>UPDATE</span> employees\n<span class='hl'>SET salary = salary * 1.1</span>\nWHERE department = 'Engineering'",
        annotation: "← salary = salary × 1.1"
      }
    ]
  },

  // ═══════════ CHAPTER 7: TABLE DESIGN ═══════════
  33: { // CREATE TABLE
    title: "CREATE TABLE — Building Structure",
    steps: [
      {
        text: "<code>CREATE TABLE</code> defines a new table. You specify column names and their data types.",
        visual: "diagram",
        diagram: { type: "concept", content: "Nothing → <span class='kw'>CREATE TABLE</span> → <span class='hl'>New empty table!</span>" }
      },
      {
        text: "Common types: <code>INTEGER</code>, <code>TEXT</code>, <code>REAL</code> (decimal), <code>BLOB</code> (binary)",
        visual: "code",
        code: "<span class='hl'>CREATE TABLE</span> products (\n  id <span class='type'>INTEGER PRIMARY KEY</span>,\n  name <span class='type'>TEXT</span>,\n  price <span class='type'>REAL</span>\n)",
        annotation: "← Defines structure"
      }
    ]
  },

  34: { // Constraints
    title: "Constraints — Rules for Data",
    steps: [
      {
        text: "Constraints enforce <b>rules</b> on your data. They prevent bad data from entering the table!",
        visual: "diagram",
        diagram: { type: "concept", content: "<span class='kw'>NOT NULL</span> → Must have a value<br><span class='kw'>UNIQUE</span> → No duplicates<br><span class='kw'>CHECK</span> → Custom validation<br><span class='kw'>DEFAULT</span> → Fallback value" }
      },
      {
        text: "Combine constraints on columns:",
        visual: "code",
        code: "CREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT <span class='hl'>NOT NULL UNIQUE</span>,\n  age INT <span class='hl'>CHECK(age >= 18)</span>\n)",
        annotation: "← Database rejects invalid data"
      }
    ]
  },

  35: { // ALTER TABLE
    title: "ALTER TABLE — Changing Structure",
    steps: [
      {
        text: "<code>ALTER TABLE</code> modifies an existing table — add columns, rename things, etc.",
        visual: "diagram",
        diagram: { type: "concept", content: "Table (3 cols) → <span class='kw'>ALTER TABLE ADD COLUMN</span> → Table (<span class='hl'>4 cols</span>)" }
      },
      {
        text: "Add a new email column to our employees table:",
        visual: "code",
        code: "<span class='hl'>ALTER TABLE</span> employees\n<span class='hl'>ADD COLUMN</span> email TEXT",
        annotation: "← New column, existing rows get NULL"
      }
    ]
  },

  36: { // DROP TABLE
    title: "DROP TABLE — Deleting Tables",
    steps: [
      {
        text: "⚠️ <code>DROP TABLE</code> permanently <b>deletes the entire table</b> and all its data. No undo!",
        visual: "diagram",
        diagram: { type: "danger", content: "Table with data → <span class='kw danger'>DROP TABLE</span> → 💀 Gone forever!" }
      },
      {
        text: "Use it to remove tables you no longer need:",
        visual: "code",
        code: "<span class='hl danger'>DROP TABLE</span> temp_data",
        annotation: "← Table + data = destroyed"
      }
    ]
  },

  // ═══════════ CHAPTER 8: ADVANCED ═══════════
  37: { // CASE
    title: "CASE — Conditional Logic in SQL",
    steps: [
      {
        text: "<code>CASE</code> is like <b>if/else</b> inside a query. It evaluates conditions and returns different values!",
        visual: "diagram",
        diagram: { type: "concept", content: "salary > 80K → <span class='hl'>'High'</span><br>salary > 65K → <span class='hl'>'Mid'</span><br>else → <span class='hl'>'Low'</span>" }
      },
      {
        text: "Create a new computed column using CASE:",
        visual: "code",
        code: "SELECT name,\n  <span class='hl'>CASE</span>\n    <span class='hl'>WHEN</span> salary > 80000 <span class='hl'>THEN</span> 'High'\n    <span class='hl'>WHEN</span> salary > 65000 <span class='hl'>THEN</span> 'Mid'\n    <span class='hl'>ELSE</span> 'Low'\n  <span class='hl'>END</span> AS tier\nFROM employees",
        annotation: "← Creates a new 'tier' column"
      }
    ]
  },

  38: { // UNION
    title: "UNION — Stacking Results",
    steps: [
      {
        text: "<code>UNION</code> combines results from two queries <b>vertically</b> (stacking rows on top of each other).",
        visual: "diagram",
        diagram: { type: "concept", content: "Query 1: [row A, row B]<br>Query 2: [row C, row D]<br><span class='kw'>UNION</span>: [A, B, C, D]" }
      },
      {
        text: "Both queries must have the same number of columns!",
        visual: "code",
        code: "SELECT * FROM employees WHERE dept='Eng'\n<span class='hl'>UNION</span>\nSELECT * FROM employees WHERE dept='HR'",
        annotation: "← Stacks both results together"
      }
    ]
  },

  39: { // String Functions
    title: "String Functions",
    steps: [
      {
        text: "SQL has built-in functions for manipulating text: <code>UPPER()</code>, <code>LOWER()</code>, <code>LENGTH()</code>, and more!",
        visual: "diagram",
        diagram: { type: "concept", content: "'Alice' → <span class='kw'>UPPER()</span> → <span class='hl'>'ALICE'</span><br>'Alice' → <span class='kw'>LENGTH()</span> → <span class='hl'>5</span><br>'Alice' → <span class='kw'>SUBSTR(,1,3)</span> → <span class='hl'>'Ali'</span>" }
      },
      {
        text: "Convert all names to uppercase:",
        visual: "code",
        code: "SELECT <span class='hl'>UPPER(name)</span> FROM employees",
        annotation: "← 'Alice' becomes 'ALICE'"
      }
    ]
  },

  40: { // COALESCE
    title: "COALESCE — Handling NULLs",
    steps: [
      {
        text: "<code>COALESCE()</code> returns the <b>first non-NULL</b> value from a list. Great for default values!",
        visual: "diagram",
        diagram: { type: "concept", content: "COALESCE(<span class='hl-null'>NULL</span>, <span class='hl-null'>NULL</span>, <span class='hl'>'Default'</span>) → <span class='hl'>'Default'</span>" }
      },
      {
        text: "Replace NULL manager names with a friendly default:",
        visual: "code",
        code: "SELECT e.name,\n  <span class='hl'>COALESCE(m.name, 'No Manager')</span>\nFROM employees e\nLEFT JOIN employees m ON e.mgr_id = m.id",
        annotation: "← NULL becomes 'No Manager'"
      }
    ]
  },

  41: { // ROW_NUMBER
    title: "Window Functions — ROW_NUMBER",
    steps: [
      {
        text: "<b>Window functions</b> perform calculations across rows <b>without collapsing them</b> (unlike GROUP BY).",
        visual: "diagram",
        diagram: { type: "concept", content: "GROUP BY: 5 rows → 3 groups<br><span class='kw'>Window</span>: 5 rows → still 5 rows + extra column!" }
      },
      {
        text: "<code>ROW_NUMBER()</code> assigns sequential numbers within each partition:",
        visual: "code",
        code: "SELECT name, department, salary,\n  <span class='hl'>ROW_NUMBER() OVER (</span>\n    <span class='hl'>PARTITION BY department</span>\n    <span class='hl'>ORDER BY salary DESC</span>\n  <span class='hl'>)</span> AS rank\nFROM employees",
        annotation: "← Numbers restart per department"
      }
    ]
  },

  42: { // CTE
    title: "CTE — Common Table Expressions",
    steps: [
      {
        text: "<code>WITH</code> creates a <b>named temporary result</b> you can reference in your main query. Makes complex queries readable!",
        visual: "diagram",
        diagram: { type: "concept", content: "<span class='kw'>WITH</span> temp_name <span class='kw'>AS</span> (query)<br>SELECT * FROM temp_name WHERE ..." }
      },
      {
        text: "Instead of nesting subqueries, give them names:",
        visual: "code",
        code: "<span class='hl'>WITH dept_avg AS (</span>\n  SELECT department, AVG(salary) as avg_sal\n  FROM employees GROUP BY department\n<span class='hl'>)</span>\nSELECT * FROM <span class='hl'>dept_avg</span>\nWHERE avg_sal > 72000",
        annotation: "← Named subquery = CTE"
      }
    ]
  },

  // ═══════════ BOSS CHALLENGES ═══════════
  43: { // Department Report
    title: "🏆 Boss: Department Report",
    steps: [
      {
        text: "Time for a real-world challenge! Create a <b>department summary report</b> combining GROUP BY + aggregation + sorting.",
        visual: "diagram",
        diagram: { type: "concept", content: "Multiple skills: <span class='kw'>GROUP BY</span> + <span class='kw'>COUNT</span> + <span class='kw'>SUM</span> + <span class='kw'>ORDER BY</span>" }
      },
      {
        text: "You'll need to group by department, count employees AND sum salaries, then sort!",
        visual: "code",
        code: "SELECT department,\n  <span class='hl'>COUNT(*)</span> as emp_count,\n  <span class='hl'>SUM(salary)</span> as total_sal\nFROM employees\nGROUP BY department\n<span class='hl'>ORDER BY total_sal DESC</span>",
        annotation: "← Complete report query"
      }
    ]
  },

  44: { // Top Earners
    title: "🏆 Boss: Top Earners",
    steps: [
      {
        text: "A classic interview question! Find the <b>highest-paid person in each department</b>.",
        visual: "diagram",
        diagram: { type: "concept", content: "For each department → Find the MAX salary → Get that person's name" }
      },
      {
        text: "Use a correlated subquery to match each employee against the max in their department:",
        visual: "code",
        code: "SELECT name, department, salary\nFROM employees e\nWHERE salary = <span class='hl'>(\n  SELECT MAX(salary)\n  FROM employees e2\n  WHERE e2.department = e.department\n)</span>",
        annotation: "← Correlated subquery runs per row"
      }
    ]
  },

  45: { // Full Company View
    title: "🏆 Boss: Full Company View",
    steps: [
      {
        text: "The ultimate query! Combine <b>multiple LEFT JOINs</b> + <b>COALESCE</b> to build a complete view.",
        visual: "diagram",
        diagram: { type: "concept", content: "employees ← departments<br>employees ← projects<br>employees ← employees (managers)<br>All with LEFT JOIN + COALESCE!" }
      },
      {
        text: "Chain 3 LEFT JOINs and handle NULLs with COALESCE:",
        visual: "code",
        code: "SELECT e.name,\n  d.name AS department,\n  <span class='hl'>COALESCE</span>(p.name, 'None') AS project,\n  <span class='hl'>COALESCE</span>(m.name, 'CEO') AS manager\nFROM employees e\n<span class='hl'>LEFT JOIN</span> departments d ON e.dept_id = d.id\n<span class='hl'>LEFT JOIN</span> projects p ON e.id = p.emp_id\n<span class='hl'>LEFT JOIN</span> employees m ON e.mgr_id = m.id",
        annotation: "← 3 JOINs in one query!"
      }
    ]
  }
};
