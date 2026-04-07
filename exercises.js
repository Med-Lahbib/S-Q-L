// ═══════════ EXERCISE DATA ═══════════
const CHAPTERS = [
  {
    name: "Basics", icon: "📋", color: "#3b82f6",
    lessons: [
      {
        id: 0, title: "SELECT *", xp: 10,
        desc: "The most fundamental SQL command. <code>SELECT</code> retrieves data from a table. The asterisk <code>*</code> means \"all columns\".",
        task: "Select all columns from the <b>employees</b> table.",
        hint: "Try: SELECT * FROM employees",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => cols.length >= 4 && rows.length === 5,
        solution: "SELECT * FROM employees",
        visType: "highlight-all"
      },
      {
        id: 1, title: "SELECT Columns", xp: 10,
        desc: "Instead of grabbing everything, pick specific columns by listing their names after <code>SELECT</code>.",
        task: "Select only <b>name</b> and <b>salary</b> from employees.",
        hint: "List column names: SELECT name, salary FROM ...",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => cols.map(c=>c.toLowerCase()).includes('name') && cols.map(c=>c.toLowerCase()).includes('salary') && cols.length === 2,
        solution: "SELECT name, salary FROM employees",
        visType: "highlight-cols"
      },
      {
        id: 2, title: "WHERE", xp: 15,
        desc: "<code>WHERE</code> filters rows. Only rows matching the condition survive. Think of it as a bouncer at a club.",
        task: "Get employees in the <b>Engineering</b> department.",
        hint: "WHERE department = 'Engineering'",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 2 && rows.every(r => { const i = cols.findIndex(c=>c.toLowerCase()==='department'); return i>=0 && r[i]==='Engineering'; }),
        solution: "SELECT * FROM employees WHERE department = 'Engineering'",
        visType: "filter-rows",
        visConfig: { filterCol: "department", filterVal: "Engineering" }
      },
      {
        id: 3, title: "AND & OR", xp: 15,
        desc: "Combine multiple conditions with <code>AND</code> (both must be true) or <code>OR</code> (either can be true).",
        task: "Find employees in <b>Engineering</b> who earn more than <b>86000</b>.",
        hint: "WHERE department = 'Engineering' AND salary > 86000",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 1,
        solution: "SELECT * FROM employees WHERE department = 'Engineering' AND salary > 86000",
        visType: "filter-rows",
        visConfig: { filterCol: "department", filterVal: "Engineering" }
      },
      {
        id: 4, title: "ORDER BY", xp: 15,
        desc: "<code>ORDER BY</code> sorts your results. <code>ASC</code> = lowest first (default). <code>DESC</code> = highest first.",
        task: "List all employees ordered by salary, <b>highest first</b>.",
        hint: "ORDER BY salary DESC",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => { const s = cols.findIndex(c=>c.toLowerCase()==='salary'); if(s<0||rows.length!==5)return false; for(let i=1;i<rows.length;i++)if(rows[i][s]>rows[i-1][s])return false; return true; },
        solution: "SELECT * FROM employees ORDER BY salary DESC",
        visType: "sort-rows"
      },
      {
        id: 5, title: "LIMIT", xp: 10,
        desc: "<code>LIMIT</code> restricts how many rows come back. Perfect for previewing large tables or getting \"top N\" results.",
        task: "Get only the <b>top 3</b> highest-paid employees.",
        hint: "ORDER BY salary DESC LIMIT 3",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => { const s = cols.findIndex(c=>c.toLowerCase()==='salary'); return rows.length===3 && rows[0][s]>=rows[1][s] && rows[1][s]>=rows[2][s]; },
        solution: "SELECT * FROM employees ORDER BY salary DESC LIMIT 3",
        visType: "limit-rows"
      },
      {
        id: 6, title: "DISTINCT", xp: 10,
        desc: "<code>DISTINCT</code> removes duplicate values from your results. Each unique value appears only once.",
        task: "List all unique <b>departments</b>.",
        hint: "SELECT DISTINCT department FROM employees",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 3 && cols.length === 1,
        solution: "SELECT DISTINCT department FROM employees",
        visType: "highlight-cols"
      },
      {
        id: 7, title: "Aliases", xp: 10,
        desc: "Use <code>AS</code> to give columns or tables a temporary nickname. It makes output more readable.",
        task: "Select name and salary, but rename salary as <b>annual_pay</b>.",
        hint: "SELECT name, salary AS annual_pay FROM ...",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => cols.map(c=>c.toLowerCase()).includes('annual_pay') && rows.length === 5,
        solution: "SELECT name, salary AS annual_pay FROM employees",
        visType: "highlight-cols"
      }
    ]
  },
  {
    name: "Filtering", icon: "🔍", color: "#8b5cf6",
    lessons: [
      {
        id: 8, title: "BETWEEN", xp: 15,
        desc: "<code>BETWEEN</code> checks if a value falls within a range (inclusive on both ends).",
        task: "Find employees with salary <b>between 70000 and 88000</b>.",
        hint: "WHERE salary BETWEEN 70000 AND 88000",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 3,
        solution: "SELECT * FROM employees WHERE salary BETWEEN 70000 AND 88000",
        visType: "filter-rows",
        visConfig: { filterCol: "salary", filterVal: "70000-88000" }
      },
      {
        id: 9, title: "IN", xp: 15,
        desc: "<code>IN</code> lets you check if a value matches any item in a list. Cleaner than multiple ORs.",
        task: "Find employees in <b>Engineering</b> or <b>HR</b>.",
        hint: "WHERE department IN ('Engineering', 'HR')",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 3,
        solution: "SELECT * FROM employees WHERE department IN ('Engineering', 'HR')",
        visType: "filter-rows",
        visConfig: { filterCol: "department", filterVal: "Engineering/HR" }
      },
      {
        id: 10, title: "LIKE", xp: 20,
        desc: "<code>LIKE</code> matches text patterns. <code>%</code> = any number of characters. <code>_</code> = exactly one character.",
        task: "Find employees whose name <b>starts with 'A'</b>.",
        hint: "WHERE name LIKE 'A%'",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 1,
        solution: "SELECT * FROM employees WHERE name LIKE 'A%'",
        visType: "filter-rows",
        visConfig: { filterCol: "name", filterVal: "A%" }
      },
      {
        id: 11, title: "IS NULL", xp: 15,
        desc: "<code>NULL</code> means \"no value\". You can't compare it with <code>=</code>; use <code>IS NULL</code> or <code>IS NOT NULL</code>.",
        task: "Find employees who have <b>no manager</b> assigned.",
        hint: "WHERE manager_id IS NULL",
        schema: { employees: ["id INT","name TEXT","department TEXT","manager_id INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, manager_id INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',NULL),(2,'Bob','Marketing',1),(3,'Carol','Engineering',1),(4,'Dave','HR',NULL),(5,'Eve','Marketing',2);`,
        validate: (cols, rows) => rows.length === 2,
        solution: "SELECT * FROM employees WHERE manager_id IS NULL",
        visType: "filter-rows",
        visConfig: { filterCol: "manager_id", filterVal: "NULL" }
      },
      {
        id: 12, title: "NOT", xp: 15,
        desc: "<code>NOT</code> inverts a condition. Works with IN, LIKE, BETWEEN, NULL, and boolean expressions.",
        task: "Find employees <b>NOT</b> in Marketing.",
        hint: "WHERE department NOT IN ('Marketing') or WHERE NOT department = 'Marketing'",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 3,
        solution: "SELECT * FROM employees WHERE department != 'Marketing'",
        visType: "filter-rows",
        visConfig: { filterCol: "department", filterVal: "!Marketing" }
      },
      {
        id: 13, title: "Comparison Ops", xp: 15,
        desc: "SQL supports <code>=</code>, <code>!=</code> (or <code>&lt;&gt;</code>), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.",
        task: "Find employees earning <b>more than 75000</b>.",
        hint: "WHERE salary > 75000",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 2,
        solution: "SELECT * FROM employees WHERE salary > 75000",
        visType: "filter-rows",
        visConfig: { filterCol: "salary", filterVal: ">75000" }
      }
    ]
  },
  {
    name: "Aggregation", icon: "📊", color: "#06d6a0",
    lessons: [
      {
        id: 14, title: "COUNT", xp: 15,
        desc: "<code>COUNT(*)</code> counts all rows. <code>COUNT(column)</code> counts non-NULL values in that column.",
        task: "Count the <b>total number</b> of employees.",
        hint: "SELECT COUNT(*) FROM employees",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 1 && rows[0].includes(5),
        solution: "SELECT COUNT(*) FROM employees",
        visType: "aggregate"
      },
      {
        id: 15, title: "SUM & AVG", xp: 15,
        desc: "<code>SUM()</code> totals a numeric column. <code>AVG()</code> computes the average.",
        task: "Show the <b>total</b> salary of all employees.",
        hint: "SELECT SUM(salary) FROM employees",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 1 && rows[0].includes(380000),
        solution: "SELECT SUM(salary) FROM employees",
        visType: "aggregate"
      },
      {
        id: 16, title: "MIN & MAX", xp: 15,
        desc: "<code>MIN()</code> finds the smallest value. <code>MAX()</code> finds the largest.",
        task: "Find the <b>highest salary</b> in the company.",
        hint: "SELECT MAX(salary) FROM employees",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 1 && rows[0].includes(90000),
        solution: "SELECT MAX(salary) FROM employees",
        visType: "aggregate"
      },
      {
        id: 17, title: "GROUP BY", xp: 20,
        desc: "<code>GROUP BY</code> groups rows sharing a value, so you can aggregate each group separately.",
        task: "Count how many employees are in <b>each department</b>.",
        hint: "SELECT department, COUNT(*) FROM employees GROUP BY department",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 3,
        solution: "SELECT department, COUNT(*) FROM employees GROUP BY department",
        visType: "group-by",
        visConfig: { groupCol: "department" }
      },
      {
        id: 18, title: "AVG per Group", xp: 20,
        desc: "Combine <code>GROUP BY</code> with <code>AVG()</code> to get averages for each group.",
        task: "Show the <b>average salary</b> per department.",
        hint: "SELECT department, AVG(salary) FROM employees GROUP BY department",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => { const h = cols.some(c=>c.toLowerCase().includes('avg')||c.toLowerCase().includes('salary')); return rows.length===3 && h; },
        solution: "SELECT department, AVG(salary) FROM employees GROUP BY department",
        visType: "group-by",
        visConfig: { groupCol: "department" }
      },
      {
        id: 19, title: "HAVING", xp: 25,
        desc: "<code>HAVING</code> filters groups after <code>GROUP BY</code> — like <code>WHERE</code> but for aggregated results.",
        task: "Show departments that have <b>more than 1</b> employee.",
        hint: "HAVING COUNT(*) > 1",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 2,
        solution: "SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 1",
        visType: "group-by",
        visConfig: { groupCol: "department" }
      }
    ]
  },
  {
    name: "Joins", icon: "🔗", color: "#ec4899",
    lessons: [
      {
        id: 20, title: "INNER JOIN", xp: 25,
        desc: "<code>INNER JOIN</code> combines rows from two tables where the join condition matches. Non-matching rows are excluded from both sides.",
        task: "Get each employee's <b>name</b> and their <b>project name</b>.",
        hint: "JOIN projects p ON e.id = p.employee_id",
        schema: { employees: ["id INT","name TEXT","dept TEXT"], projects: ["id INT","employee_id INT","project_name TEXT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, dept TEXT);
INSERT INTO employees VALUES (1,'Alice','Eng'),(2,'Bob','Mkt'),(3,'Carol','Eng'),(4,'Dave','HR');
CREATE TABLE projects (id INT, employee_id INT, project_name TEXT);
INSERT INTO projects VALUES (1,1,'Data Pipeline'),(2,1,'ML Model'),(3,2,'Ad Campaign'),(4,3,'API Redesign');`,
        validate: (cols, rows) => { const n=cols.some(c=>c.toLowerCase().includes('name')); const p=cols.some(c=>c.toLowerCase().includes('project')); return n&&p&&rows.length===4; },
        solution: "SELECT e.name, p.project_name FROM employees e JOIN projects p ON e.id = p.employee_id",
        visType: "join",
        visConfig: { joinType: "inner" }
      },
      {
        id: 21, title: "LEFT JOIN", xp: 25,
        desc: "<code>LEFT JOIN</code> keeps all rows from the left table. If no match in the right table, those columns become NULL.",
        task: "List <b>all employees</b> and their projects (including ones with no project).",
        hint: "LEFT JOIN projects p ON e.id = p.employee_id",
        schema: { employees: ["id INT","name TEXT","dept TEXT"], projects: ["id INT","employee_id INT","project_name TEXT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, dept TEXT);
INSERT INTO employees VALUES (1,'Alice','Eng'),(2,'Bob','Mkt'),(3,'Carol','Eng'),(4,'Dave','HR');
CREATE TABLE projects (id INT, employee_id INT, project_name TEXT);
INSERT INTO projects VALUES (1,1,'Data Pipeline'),(2,1,'ML Model'),(3,2,'Ad Campaign'),(4,3,'API Redesign');`,
        validate: (cols, rows) => rows.length === 5,
        solution: "SELECT e.name, p.project_name FROM employees e LEFT JOIN projects p ON e.id = p.employee_id",
        visType: "join",
        visConfig: { joinType: "left" }
      },
      {
        id: 22, title: "Self JOIN", xp: 30,
        desc: "A table can join <b>itself</b>. Use aliases to treat one table as two. Great for hierarchies like org charts.",
        task: "Show each employee and their <b>manager's name</b>.",
        hint: "JOIN employees m ON e.manager_id = m.id",
        schema: { employees: ["id INT","name TEXT","manager_id INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, manager_id INT);
INSERT INTO employees VALUES (1,'Alice',NULL),(2,'Bob',1),(3,'Carol',1),(4,'Dave',2),(5,'Eve',2);`,
        validate: (cols, rows) => rows.length >= 4 && cols.length >= 2,
        solution: "SELECT e.name AS employee, m.name AS manager FROM employees e JOIN employees m ON e.manager_id = m.id",
        visType: "join",
        visConfig: { joinType: "self" }
      },
      {
        id: 23, title: "Multiple JOINs", xp: 30,
        desc: "You can chain multiple JOINs to connect 3 or more tables together.",
        task: "Show employee <b>name</b>, <b>department name</b>, and <b>project name</b>.",
        hint: "JOIN departments d ON e.dept_id = d.id JOIN projects p ON e.id = p.employee_id",
        schema: { employees: ["id INT","name TEXT","dept_id INT"], departments: ["id INT","dept_name TEXT"], projects: ["id INT","employee_id INT","project_name TEXT"] },
        seed: `CREATE TABLE departments (id INT, dept_name TEXT);
INSERT INTO departments VALUES (1,'Engineering'),(2,'Marketing');
CREATE TABLE employees (id INT, name TEXT, dept_id INT);
INSERT INTO employees VALUES (1,'Alice',1),(2,'Bob',2),(3,'Carol',1);
CREATE TABLE projects (id INT, employee_id INT, project_name TEXT);
INSERT INTO projects VALUES (1,1,'Data Pipeline'),(2,2,'Ad Campaign'),(3,3,'API Redesign');`,
        validate: (cols, rows) => rows.length === 3 && cols.length >= 3,
        solution: "SELECT e.name, d.dept_name, p.project_name FROM employees e JOIN departments d ON e.dept_id = d.id JOIN projects p ON e.id = p.employee_id",
        visType: "join",
        visConfig: { joinType: "multi" }
      },
      {
        id: 24, title: "CROSS JOIN", xp: 20,
        desc: "<code>CROSS JOIN</code> produces the Cartesian product — every combination of rows from both tables.",
        task: "Show all possible <b>employee-project</b> combinations.",
        hint: "SELECT * FROM employees CROSS JOIN projects",
        schema: { employees: ["id INT","name TEXT"], projects: ["id INT","project_name TEXT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT);
INSERT INTO employees VALUES (1,'Alice'),(2,'Bob');
CREATE TABLE projects (id INT, project_name TEXT);
INSERT INTO projects VALUES (1,'Alpha'),(2,'Beta'),(3,'Gamma');`,
        validate: (cols, rows) => rows.length === 6,
        solution: "SELECT e.name, p.project_name FROM employees e CROSS JOIN projects p",
        visType: "join",
        visConfig: { joinType: "cross" }
      }
    ]
  },
  {
    name: "Subqueries", icon: "🧩", color: "#f59e0b",
    lessons: [
      {
        id: 25, title: "WHERE Subquery", xp: 25,
        desc: "A subquery is a query inside another. In <code>WHERE</code>, it can compute a value to compare against.",
        task: "Find employees earning <b>above the average</b> salary.",
        hint: "WHERE salary > (SELECT AVG(salary) FROM employees)",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 2,
        solution: "SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees)",
        visType: "subquery"
      },
      {
        id: 26, title: "IN Subquery", xp: 25,
        desc: "Use a subquery with <code>IN</code> to filter based on a list generated by another query.",
        task: "Find employees who work on <b>any project</b>.",
        hint: "WHERE id IN (SELECT employee_id FROM projects)",
        schema: { employees: ["id INT","name TEXT","dept TEXT"], projects: ["id INT","employee_id INT","project_name TEXT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, dept TEXT);
INSERT INTO employees VALUES (1,'Alice','Eng'),(2,'Bob','Mkt'),(3,'Carol','Eng'),(4,'Dave','HR');
CREATE TABLE projects (id INT, employee_id INT, project_name TEXT);
INSERT INTO projects VALUES (1,1,'Pipeline'),(2,2,'Campaign'),(3,1,'ML Model');`,
        validate: (cols, rows) => rows.length === 2,
        solution: "SELECT * FROM employees WHERE id IN (SELECT employee_id FROM projects)",
        visType: "subquery"
      },
      {
        id: 27, title: "EXISTS", xp: 30,
        desc: "<code>EXISTS</code> returns true if the subquery returns any rows. Often faster than <code>IN</code> for large datasets.",
        task: "Find employees who have <b>at least one project</b> using EXISTS.",
        hint: "WHERE EXISTS (SELECT 1 FROM projects WHERE projects.employee_id = employees.id)",
        schema: { employees: ["id INT","name TEXT","dept TEXT"], projects: ["id INT","employee_id INT","project_name TEXT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, dept TEXT);
INSERT INTO employees VALUES (1,'Alice','Eng'),(2,'Bob','Mkt'),(3,'Carol','Eng'),(4,'Dave','HR');
CREATE TABLE projects (id INT, employee_id INT, project_name TEXT);
INSERT INTO projects VALUES (1,1,'Pipeline'),(2,2,'Campaign'),(3,1,'ML Model');`,
        validate: (cols, rows) => rows.length === 2,
        solution: "SELECT * FROM employees WHERE EXISTS (SELECT 1 FROM projects WHERE projects.employee_id = employees.id)",
        visType: "subquery"
      },
      {
        id: 28, title: "Derived Tables", xp: 30,
        desc: "A subquery in the <code>FROM</code> clause creates a temporary \"derived table\" you can query against.",
        task: "Find the <b>department</b> with the <b>highest average salary</b>.",
        hint: "FROM (SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department) sub ORDER BY avg_sal DESC LIMIT 1",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 1,
        solution: "SELECT * FROM (SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department) sub ORDER BY avg_sal DESC LIMIT 1",
        visType: "subquery"
      }
    ]
  },
  {
    name: "Data Manipulation", icon: "✏️", color: "#ef4444",
    lessons: [
      {
        id: 29, title: "INSERT INTO", xp: 20,
        desc: "<code>INSERT INTO</code> adds new rows to a table. Specify columns and values.",
        task: "Add a new employee: <b>id=6, name='Frank', department='HR', salary=65000</b>.",
        hint: "INSERT INTO employees VALUES (6, 'Frank', 'HR', 65000)",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows, db) => { try { const r = db.exec("SELECT COUNT(*) FROM employees"); return r[0].values[0][0] === 6; } catch(e) { return false; } },
        solution: "INSERT INTO employees VALUES (6, 'Frank', 'HR', 65000)",
        visType: "dml",
        visConfig: { action: "insert" }
      },
      {
        id: 30, title: "UPDATE", xp: 25,
        desc: "<code>UPDATE</code> modifies existing rows. Always use <code>WHERE</code> to target specific rows!",
        task: "Give <b>Alice</b> a raise — set her salary to <b>95000</b>.",
        hint: "UPDATE employees SET salary = 95000 WHERE name = 'Alice'",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows, db) => { try { const r = db.exec("SELECT salary FROM employees WHERE name = 'Alice'"); return r[0].values[0][0] === 95000; } catch(e) { return false; } },
        solution: "UPDATE employees SET salary = 95000 WHERE name = 'Alice'",
        visType: "dml",
        visConfig: { action: "update" }
      },
      {
        id: 31, title: "DELETE", xp: 25,
        desc: "<code>DELETE FROM</code> removes rows. Without <code>WHERE</code>, it deletes everything — be careful!",
        task: "Remove <b>Dave</b> from the employees table.",
        hint: "DELETE FROM employees WHERE name = 'Dave'",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows, db) => { try { const r = db.exec("SELECT COUNT(*) FROM employees"); return r[0].values[0][0] === 4; } catch(e) { return false; } },
        solution: "DELETE FROM employees WHERE name = 'Dave'",
        visType: "dml",
        visConfig: { action: "delete" }
      },
      {
        id: 32, title: "UPDATE Multiple", xp: 25,
        desc: "You can update multiple columns at once and affect multiple rows with broader WHERE conditions.",
        task: "Give a <b>10% raise</b> to all Engineering employees.",
        hint: "UPDATE employees SET salary = salary * 1.1 WHERE department = 'Engineering'",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows, db) => { try { const r = db.exec("SELECT salary FROM employees WHERE name = 'Alice'"); return r[0].values[0][0] === 99000; } catch(e) { return false; } },
        solution: "UPDATE employees SET salary = salary * 1.1 WHERE department = 'Engineering'",
        visType: "dml",
        visConfig: { action: "update" }
      }
    ]
  },
  {
    name: "Table Design", icon: "🏗️", color: "#14b8a6",
    lessons: [
      {
        id: 33, title: "CREATE TABLE", xp: 20,
        desc: "<code>CREATE TABLE</code> defines a new table with columns, types, and optional constraints.",
        task: "Create a table <b>products</b> with columns: <b>id (INTEGER PRIMARY KEY), name (TEXT), price (REAL)</b>.",
        hint: "CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL)",
        schema: {},
        seed: "",
        validate: (cols, rows, db) => { try { db.exec("SELECT id, name, price FROM products"); return true; } catch(e) { return false; } },
        solution: "CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL)",
        visType: "ddl"
      },
      {
        id: 34, title: "Constraints", xp: 25,
        desc: "Constraints enforce rules: <code>NOT NULL</code>, <code>UNIQUE</code>, <code>DEFAULT</code>, <code>CHECK</code>.",
        task: "Create a <b>users</b> table: <b>id (INTEGER PRIMARY KEY), email (TEXT NOT NULL UNIQUE), age (INT CHECK(age >= 18))</b>.",
        hint: "CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, age INT CHECK(age >= 18))",
        schema: {},
        seed: "",
        validate: (cols, rows, db) => { try { db.exec("INSERT INTO users VALUES (1, 'test@test.com', 20)"); try { db.exec("INSERT INTO users VALUES (2, NULL, 20)"); return false; } catch(e) { return true; } } catch(e) { return false; } },
        solution: "CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT NOT NULL UNIQUE, age INT CHECK(age >= 18))",
        visType: "ddl"
      },
      {
        id: 35, title: "ALTER TABLE", xp: 20,
        desc: "<code>ALTER TABLE</code> modifies an existing table — add columns, rename, etc.",
        task: "Add a <b>email</b> column (TEXT) to the employees table.",
        hint: "ALTER TABLE employees ADD COLUMN email TEXT",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000);`,
        validate: (cols, rows, db) => { try { const r = db.exec("PRAGMA table_info(employees)"); return r[0].values.some(v => v[1] === 'email'); } catch(e) { return false; } },
        solution: "ALTER TABLE employees ADD COLUMN email TEXT",
        visType: "ddl"
      },
      {
        id: 36, title: "DROP TABLE", xp: 15,
        desc: "<code>DROP TABLE</code> permanently deletes a table and all its data. Use with extreme caution!",
        task: "Drop the <b>temp_data</b> table.",
        hint: "DROP TABLE temp_data",
        schema: { temp_data: ["id INT","value TEXT"], employees: ["id INT","name TEXT"] },
        seed: `CREATE TABLE temp_data (id INT, value TEXT);
INSERT INTO temp_data VALUES (1,'test');
CREATE TABLE employees (id INT, name TEXT);
INSERT INTO employees VALUES (1,'Alice');`,
        validate: (cols, rows, db) => { try { db.exec("SELECT * FROM temp_data"); return false; } catch(e) { return true; } },
        solution: "DROP TABLE temp_data",
        visType: "ddl"
      }
    ]
  },
  {
    name: "Advanced", icon: "🚀", color: "#a855f7",
    lessons: [
      {
        id: 37, title: "CASE", xp: 25,
        desc: "<code>CASE</code> adds conditional logic to your queries — like if/else inside SQL.",
        task: "Categorize employees as <b>'High'</b> (salary > 80000), <b>'Mid'</b> (> 65000), or <b>'Low'</b>.",
        hint: "CASE WHEN salary > 80000 THEN 'High' WHEN salary > 65000 THEN 'Mid' ELSE 'Low' END",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => { return rows.length === 5 && cols.length >= 2; },
        solution: "SELECT name, CASE WHEN salary > 80000 THEN 'High' WHEN salary > 65000 THEN 'Mid' ELSE 'Low' END AS tier FROM employees",
        visType: "highlight-all"
      },
      {
        id: 38, title: "UNION", xp: 20,
        desc: "<code>UNION</code> stacks results from two queries vertically. <code>UNION ALL</code> keeps duplicates.",
        task: "Combine <b>Engineering</b> and <b>HR</b> employees into one list (use UNION).",
        hint: "SELECT ... WHERE department='Engineering' UNION SELECT ... WHERE department='HR'",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 3,
        solution: "SELECT * FROM employees WHERE department = 'Engineering' UNION SELECT * FROM employees WHERE department = 'HR'",
        visType: "highlight-all"
      },
      {
        id: 39, title: "String Functions", xp: 20,
        desc: "SQL has built-in string functions: <code>UPPER()</code>, <code>LOWER()</code>, <code>LENGTH()</code>, <code>SUBSTR()</code>, <code>||</code> (concat).",
        task: "Show all employee names in <b>uppercase</b>.",
        hint: "SELECT UPPER(name) FROM employees",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.every(r => r[0] === r[0].toUpperCase()) && rows.length === 5,
        solution: "SELECT UPPER(name) FROM employees",
        visType: "highlight-all"
      },
      {
        id: 40, title: "COALESCE", xp: 20,
        desc: "<code>COALESCE()</code> returns the first non-NULL value from a list. Great for providing default values.",
        task: "Show employee names with their manager's name, replacing NULL managers with <b>'No Manager'</b>.",
        hint: "COALESCE(m.name, 'No Manager')",
        schema: { employees: ["id INT","name TEXT","manager_id INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, manager_id INT);
INSERT INTO employees VALUES (1,'Alice',NULL),(2,'Bob',1),(3,'Carol',1),(4,'Dave',NULL);`,
        validate: (cols, rows) => rows.length === 4 && rows.some(r => r.includes('No Manager')),
        solution: "SELECT e.name, COALESCE(m.name, 'No Manager') AS manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id",
        visType: "highlight-all"
      },
      {
        id: 41, title: "Window: ROW_NUMBER", xp: 35,
        desc: "<code>ROW_NUMBER()</code> assigns a unique number to each row within a partition. It's a window function.",
        task: "Rank employees by salary within each department (number them 1, 2, ...).",
        hint: "ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC)",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 5 && cols.length >= 3,
        solution: "SELECT name, department, salary, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank FROM employees",
        visType: "highlight-all"
      },
      {
        id: 42, title: "CTE (WITH)", xp: 35,
        desc: "<code>WITH</code> (Common Table Expression) creates a named temporary result set. Makes complex queries readable.",
        task: "Using a CTE, find departments where the <b>average salary exceeds 72000</b>.",
        hint: "WITH dept_avg AS (SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department) SELECT * FROM dept_avg WHERE avg_sal > 72000",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000);`,
        validate: (cols, rows) => rows.length === 2,
        solution: "WITH dept_avg AS (SELECT department, AVG(salary) as avg_sal FROM employees GROUP BY department) SELECT * FROM dept_avg WHERE avg_sal > 72000",
        visType: "highlight-all"
      }
    ]
  },
  {
    name: "Boss Challenges", icon: "👑", color: "#fbbf24",
    lessons: [
      {
        id: 43, title: "🏆 Department Report", xp: 50,
        desc: "A real-world report query! Combine joins, aggregation, and formatting to create a department summary.",
        task: "Show each department with its <b>employee count</b> and <b>total salary</b>, sorted by total salary DESC.",
        hint: "SELECT department, COUNT(*) as emp_count, SUM(salary) as total_sal FROM employees GROUP BY department ORDER BY total_sal DESC",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000),(6,'Frank','Engineering',95000),(7,'Grace','HR',62000);`,
        validate: (cols, rows) => { if(rows.length !== 3) return false; const hasCount = cols.some(c=>c.toLowerCase().includes('count')||c.toLowerCase().includes('emp')); const hasSum = cols.some(c=>c.toLowerCase().includes('sum')||c.toLowerCase().includes('total')); return hasCount && hasSum; },
        solution: "SELECT department, COUNT(*) as emp_count, SUM(salary) as total_sal FROM employees GROUP BY department ORDER BY total_sal DESC",
        visType: "highlight-all"
      },
      {
        id: 44, title: "🏆 Top Earners", xp: 50,
        desc: "Find the highest-paid employee in each department — a classic interview question.",
        task: "Show the <b>name</b>, <b>department</b>, and <b>salary</b> of the highest earner in each department.",
        hint: "Use a subquery or window function to find the max salary per department, then match.",
        schema: { employees: ["id INT","name TEXT","department TEXT","salary INT"] },
        seed: `CREATE TABLE employees (id INT, name TEXT, department TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Engineering',90000),(2,'Bob','Marketing',70000),(3,'Carol','Engineering',85000),(4,'Dave','HR',60000),(5,'Eve','Marketing',75000),(6,'Frank','Engineering',95000),(7,'Grace','HR',62000);`,
        validate: (cols, rows) => rows.length === 3 && cols.length >= 3,
        solution: "SELECT e.name, e.department, e.salary FROM employees e WHERE e.salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.department = e.department)",
        visType: "highlight-all"
      },
      {
        id: 45, title: "🏆 Full Company View", xp: 50,
        desc: "The ultimate query: bring together employees, their departments, projects, and managers in one view.",
        task: "Show each employee's <b>name</b>, <b>department name</b>, <b>project name</b> (or 'None'), and <b>manager name</b> (or 'CEO').",
        hint: "Use multiple LEFT JOINs and COALESCE for NULL handling.",
        schema: { employees: ["id INT","name TEXT","dept_id INT","mgr_id INT"], departments: ["id INT","name TEXT"], projects: ["id INT","emp_id INT","name TEXT"] },
        seed: `CREATE TABLE departments (id INT, name TEXT);
INSERT INTO departments VALUES (1,'Engineering'),(2,'Marketing'),(3,'HR');
CREATE TABLE employees (id INT, name TEXT, dept_id INT, mgr_id INT);
INSERT INTO employees VALUES (1,'Alice',1,NULL),(2,'Bob',2,1),(3,'Carol',1,1),(4,'Dave',3,2);
CREATE TABLE projects (id INT, emp_id INT, name TEXT);
INSERT INTO projects VALUES (1,1,'Data Pipeline'),(2,2,'Ad Campaign'),(3,3,'API Redesign');`,
        validate: (cols, rows) => rows.length === 4 && cols.length >= 4,
        solution: "SELECT e.name, d.name AS department, COALESCE(p.name, 'None') AS project, COALESCE(m.name, 'CEO') AS manager FROM employees e LEFT JOIN departments d ON e.dept_id = d.id LEFT JOIN projects p ON e.id = p.emp_id LEFT JOIN employees m ON e.mgr_id = m.id",
        visType: "highlight-all"
      }
    ]
  }
];

const ACHIEVEMENTS = [
  { id: 'first_query', emoji: '🎯', name: 'First Query', desc: 'Run your very first SQL query', check: (s) => s.completed.size >= 1 },
  { id: 'basics_done', emoji: '📋', name: 'SQL Novice', desc: 'Complete all Basics exercises', check: (s) => [0,1,2,3,4,5,6,7].every(i => s.completed.has(i)) },
  { id: 'filter_master', emoji: '🔍', name: 'Filter Master', desc: 'Complete all Filtering exercises', check: (s) => [8,9,10,11,12,13].every(i => s.completed.has(i)) },
  { id: 'agg_pro', emoji: '📊', name: 'Aggregation Pro', desc: 'Complete all Aggregation exercises', check: (s) => [14,15,16,17,18,19].every(i => s.completed.has(i)) },
  { id: 'join_wizard', emoji: '🔗', name: 'Join Wizard', desc: 'Complete all Joins exercises', check: (s) => [20,21,22,23,24].every(i => s.completed.has(i)) },
  { id: 'sub_ninja', emoji: '🧩', name: 'Subquery Ninja', desc: 'Complete all Subqueries exercises', check: (s) => [25,26,27,28].every(i => s.completed.has(i)) },
  { id: 'data_surgeon', emoji: '✏️', name: 'Data Surgeon', desc: 'Complete all Data Manipulation exercises', check: (s) => [29,30,31,32].every(i => s.completed.has(i)) },
  { id: 'architect', emoji: '🏗️', name: 'Architect', desc: 'Complete all Table Design exercises', check: (s) => [33,34,35,36].every(i => s.completed.has(i)) },
  { id: 'advanced', emoji: '🚀', name: 'SQL Rocket', desc: 'Complete all Advanced exercises', check: (s) => [37,38,39,40,41,42].every(i => s.completed.has(i)) },
  { id: 'boss_slayer', emoji: '👑', name: 'Boss Slayer', desc: 'Complete all Boss Challenges', check: (s) => [43,44,45].every(i => s.completed.has(i)) },
  { id: 'no_hints5', emoji: '🧠', name: 'Big Brain', desc: 'Complete 5 exercises without hints', check: (s) => s.noHintCount >= 5 },
  { id: 'streak3', emoji: '🔥', name: 'On Fire', desc: 'Complete 3 exercises in a row', check: (s) => s.streak >= 3 },
  { id: 'half', emoji: '⭐', name: 'Halfway There', desc: 'Complete 50% of all exercises', check: (s) => s.completed.size >= 23 },
  { id: 'master', emoji: '🏆', name: 'SQL Master', desc: 'Complete ALL exercises', check: (s) => s.completed.size >= 46 },
  { id: 'xp100', emoji: '💎', name: 'XP Collector', desc: 'Earn 100 XP', check: (s) => s.xp >= 100 },
  { id: 'xp500', emoji: '💰', name: 'XP Hoarder', desc: 'Earn 500 XP', check: (s) => s.xp >= 500 },
];
