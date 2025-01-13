interface Issue {
  title: string;
  number: number;
  state: string;
  labels: Array<{ name: string }>;
  assignee?: { login: string };
}

interface Milestone {
  title: string;
  due_on: string | null;
  description: string;
}

interface CategorizedIssues {
  [key: string]: Issue[];
}

export function generatePlanningContent(
  milestone: Milestone,
  issues: Issue[],
  categories: string[]
): string {
  const categorizedIssues: CategorizedIssues = categorizeIssues(issues, categories);
  
  return `
# ${milestone.title} Planning

## Overview
- Total Issues: ${issues.length}
- Completed: ${issues.filter(i => i.state === 'closed').length}
- In Progress: ${issues.filter(i => i.state === 'open').length}
- Due Date: ${milestone.due_on ? new Date(milestone.due_on).toLocaleDateString() : 'Not set'}

${milestone.description ? `## Description\n${milestone.description}\n` : ''}

## Tasks by Category
${generateCategorySection(categorizedIssues)}

> Auto-generated by Auto Milestone Summary Action
> Last Updated: ${new Date().toLocaleString()}
`;
}

function categorizeIssues(issues: Issue[], categories: string[]): CategorizedIssues {
  const categorized: CategorizedIssues = {
    'Uncategorized': []
  };
  
  categories.forEach(category => {
    categorized[category] = [];
  });

  issues.forEach(issue => {
    let issueCategorized = false;
    for (const category of categories) {
      if (issue.labels.some(label => 
        label.name.toLowerCase().includes(category.toLowerCase())
      )) {
        categorized[category].push(issue);
        issueCategorized = true;
        break;
      }
    }
    if (!issueCategorized) {
      categorized['Uncategorized'].push(issue);
    }
  });

  return categorized;
}

function generateCategorySection(categorizedIssues: CategorizedIssues): string {
  return Object.entries(categorizedIssues)
    .filter(([_, issues]) => issues.length > 0)
    .map(([category, issues]) => `
### ${category} (${issues.length})
${issues.map(issue => `- [${issue.state === 'closed' ? 'x' : ' '}] #${issue.number} ${issue.title}${
  issue.assignee ? ` (@${issue.assignee.login})` : ''
}`).join('\n')}
`).join('\n');
}
