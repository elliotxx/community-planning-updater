import { generatePlanningContent } from '../src/templates/defaultTemplate';

describe('Planning Content Generation', () => {
  it('should generate correct planning content', () => {
    const milestone = {
      title: 'Test Milestone',
      due_on: '2025-12-31',
      description: 'Test Description'
    };
    
    const issues = [
      { 
        title: 'Bug 1',
        number: 1,
        state: 'open',
        labels: [{ name: 'bug' }],
        assignee: { login: 'user1' }
      },
      {
        title: 'Feature 1',
        number: 2,
        state: 'closed',
        labels: [{ name: 'feature' }]
      }
    ];
    
    const categories = ['bug', 'feature'];
    
    const content = generatePlanningContent(milestone, issues, categories);
    
    // Basic content checks
    expect(content).toContain('Test Milestone');
    expect(content).toContain('Total Issues: 2');
    expect(content).toContain('Test Description');
    
    // Category checks
    expect(content).toContain('bug (1)');
    expect(content).toContain('feature (1)');
    
    // Issue details checks
    expect(content).toContain('#1 Bug 1');
    expect(content).toContain('@user1');
    expect(content).toContain('#2 Feature 1');
    
    // Status checks
    expect(content).toContain('[ ] #1'); // open issue
    expect(content).toContain('[x] #2'); // closed issue
  });
});
