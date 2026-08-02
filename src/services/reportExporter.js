// Report Generation and File Exporter Service (PDF, CSV/Excel, Markdown)

// 1. Export as Excel / CSV File
export function downloadCSVReport(project, features) {
  const headers = ['ID', 'Feature Name', 'Module', 'Priority', 'Status', 'Assigned Dev', 'Complexity', 'Deadline', 'Subtasks Count', 'Requirements'];
  
  const rows = features.map(f => {
    const subtaskCount = f.subtasks ? f.subtasks.length : 0;
    const completedSubtasks = f.subtasks ? f.subtasks.filter(s => s.completed).length : 0;
    
    return [
      `"${f.id}"`,
      `"${(f.name || '').replace(/"/g, '""')}"`,
      `"${(f.module || '').replace(/"/g, '""')}"`,
      `"${f.priority || 'Medium'}"`,
      `"${f.status || 'To Do'}"`,
      `"${(f.assignedDev || '').replace(/"/g, '""')}"`,
      `"${f.complexity || '12h'}"`,
      `"${f.deadline || ''}"`,
      `"${completedSubtasks}/${subtaskCount}"`,
      `"${(f.requirements || f.description || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${project.name.toLowerCase().replace(/\s+/g, '_')}_executive_report.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 2. Export as Markdown Document
export function downloadMarkdownReport(project, features, overallProgress, moduleList) {
  const dateStr = new Date().toLocaleDateString();

  let md = `# Executive Status Report — ${project.name}\n\n`;
  md += `**Generated Date:** ${dateStr}  \n`;
  md += `**Overall Completion Progress:** ${overallProgress}%  \n`;
  md += `**Total Features:** ${features.length}  \n\n`;
  md += `> ${project.description}\n\n`;

  md += `--- \n\n## 📊 Module Progress Breakdown\n\n`;
  moduleList.forEach(mName => {
    const modFeats = features.filter(f => f.module === mName);
    const doneFeats = modFeats.filter(f => f.status === 'Done').length;
    md += `- **${mName}**: ${doneFeats}/${modFeats.length} Features Completed\n`;
  });

  md += `\n---\n\n## 📋 Project Features Detail\n\n`;
  md += `| Feature Name | Module | Priority | Status | Assigned Dev | Target Date |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

  features.forEach(f => {
    md += `| ${f.name} | ${f.module} | ${f.priority} | ${f.status} | ${f.assignedDev} | ${f.deadline} |\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${project.name.toLowerCase().replace(/\s+/g, '_')}_report.md`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 3. Trigger Executive Printable PDF Window
export function printExecutivePDFReport(project, features, overallProgress, moduleList) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const dateStr = new Date().toLocaleDateString();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Executive Summary Report — ${project.name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #ffffff; color: #1e293b; padding: 40px; margin: 0; }
          .header { display: flex; justify-content: space-between; align-items: center; border-b: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: 800; color: #4338ca; }
          .meta { font-size: 12px; color: #64748b; text-align: right; }
          .summary-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .metric { text-align: center; }
          .metric-val { font-size: 28px; font-weight: 800; color: #4338ca; }
          .metric-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; }
          h2 { font-size: 16px; color: #0f172a; border-left: 4px solid #6366f1; padding-left: 10px; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th { background: #f1f5f9; color: #334155; text-align: left; padding: 10px; font-weight: 700; border-bottom: 2px solid #cbd5e1; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; }
          .status-done { background: #dcfce7; color: #166534; }
          .status-progress { background: #e0e7ff; color: #3730a3; }
          .status-todo { background: #f1f5f9; color: #475569; }
          .prio-critical { background: #fee2e2; color: #991b1b; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div className="no-print" style="text-align: right; margin-bottom: 20px;">
          <button onclick="window.print()" style="background: #4338ca; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🖨️ Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="logo">Kichu Kori Platform</div>
            <div style="font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 5px;">${project.name}</div>
          </div>
          <div class="meta">
            <div><strong>Report Date:</strong> ${dateStr}</div>
            <div><strong>Scope:</strong> Executive Feature Audit</div>
          </div>
        </div>

        <div class="summary-card">
          <div class="metric">
            <div class="metric-val">${overallProgress}%</div>
            <div class="metric-lbl">Overall Completion</div>
          </div>
          <div class="metric">
            <div class="metric-val">${features.length}</div>
            <div class="metric-lbl">Total Features</div>
          </div>
          <div class="metric">
            <div class="metric-val">${features.filter(f => f.status === 'Done').length}</div>
            <div class="metric-lbl">Completed</div>
          </div>
          <div class="metric">
            <div class="metric-val">${moduleList.length}</div>
            <div class="metric-lbl">Active Modules</div>
          </div>
        </div>

        <h2>Project Features Audit Schedule</h2>
        <table>
          <thead>
            <tr>
              <th>Feature Name</th>
              <th>Module</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned Developer</th>
              <th>Target Date</th>
            </tr>
          </thead>
          <tbody>
            ${features.map(f => `
              <tr>
                <td><strong>${f.name}</strong></td>
                <td>${f.module}</td>
                <td><span class="badge ${f.priority === 'Critical' ? 'prio-critical' : ''}">${f.priority}</span></td>
                <td><span class="badge ${f.status === 'Done' ? 'status-done' : f.status === 'In Progress' ? 'status-progress' : 'status-todo'}">${f.status}</span></td>
                <td>${f.assignedDev}</td>
                <td>${f.deadline || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="margin-top: 40px; font-size: 11px; color: #94a3b8; text-align: center; border-t: 1px solid #e2e8f0; padding-top: 15px;">
          Generated automatically via Kichu Kori Executive Management Engine
        </div>

        <script>
          setTimeout(() => window.print(), 500);
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
