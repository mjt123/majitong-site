/**
 * 生成占位简历 PDF（public/resume.pdf）。
 * ASCII 内容，正式使用时直接替换该文件即可。
 */
import { writeFileSync } from 'node:fs';

const L = (text, { font = 'F2', size = 10.5, x = 72, lead = 0 } = {}) =>
  `BT /${font} ${size} Tf ${x} ${720 - lead} Td (${text.replace(/([()\\])/g, '\\$1')}) Tj ET\n`;

const content =
  L('Zhang Mingyuan', { font: 'F1', size: 21 }) +
  L('Autonomous Driving Control Algorithm Engineer', { size: 12.5, lead: 26 }) +
  L('zhangmingyuan@example.com   |   github.com/zhangmingyuan   |   Beijing, China', { size: 9.5, lead: 46 }) +
  L('PROFILE', { font: 'F1', size: 11, lead: 78 }) +
  L('6 years of R&D experience in autonomous driving control algorithms. Specialized in', { lead: 94 }) +
  L('combining control theory with engineering practice: MPC, adaptive and robust control,', { lead: 108 }) +
  L('trajectory tracking, vehicle dynamics modeling, and production-ready deployment.', { lead: 122 }) +
  L('RESEARCH', { font: 'F1', size: 11, lead: 150 }) +
  L('- Model Predictive Control (MPC) and constrained optimal control', { lead: 166 }) +
  L('- Adaptive & robust control for lateral / longitudinal vehicle control', { lead: 180 }) +
  L('- Trajectory tracking (Frenet-frame error dynamics, feedforward + feedback)', { lead: 194 }) +
  L('- State estimation & multi-sensor fusion (EKF/UKF)', { lead: 208 }) +
  L('SELECTED PROJECTS', { font: 'F1', size: 11, lead: 236 }) +
  L('- Highway Pilot: linear MPC with actuator delay compensation, 60-120 km/h', { lead: 252 }) +
  L('  lateral error RMS reduced by 38% vs LQR baseline', { lead: 266 }) +
  L('- Urban Trajectory Tracking: LQR + adaptive weighting + MPC fallback', { lead: 280 }) +
  L('- Automated Parking: Reeds-Shepp planning + NLP smoothing + kinematic MPC', { lead: 294 }) +
  L('- Vehicle Dynamics Modeling: 3-DOF model, parameter identification, CarSim match', { lead: 308 }) +
  L('SKILLS', { font: 'F1', size: 11, lead: 336 }) +
  L('Control Theory 95 | MPC 90 | C++/Python 90 | Vehicle Dynamics 88 |', { lead: 352 }) +
  L('ROS/ROS2 85 | State Estimation 85 | Optimization 82 | MATLAB/Simulink 80', { lead: 366 }) +
  L('PUBLICATIONS', { font: 'F1', size: 11, lead: 394 }) +
  L('[1] A Robust MPC Framework for Autonomous Vehicle Path Tracking, IEEE T-AC 2022', { lead: 410 }) +
  L('[2] Learning-based Adaptive MPC for Autonomous Driving, IEEE T-ITS 2022', { lead: 424 }) +
  L('(Placeholder resume - replace public/resume.pdf with the real one.)', { size: 8.5, lead: 452 });

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
  `<< /Length ${content.length} >>\nstream\n${content}endstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
];

let pdf = '%PDF-1.4\n';
const offsets = [];
objects.forEach((body, i) => {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});
const xrefPos = pdf.length;
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
offsets.forEach((off) => {
  pdf += `${String(off).padStart(10, '0')} 00000 n \n`;
});
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

writeFileSync(new URL('../public/resume.pdf', import.meta.url), pdf, 'latin1');
console.log('resume.pdf generated:', pdf.length, 'bytes');
