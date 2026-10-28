import type { Project } from '@/types';

/** 项目实践 —— 均为真实履历项目，内容与 UI 解耦：新增项目只需追加数组元素 */
export const projects: Project[] = [
  {
    id: 'geely-icc-noa',
    index: '01',
    title: '吉利量产车型 ICC/NOA 规控系统',
    titleEn: 'Geely Production ICC/NOA Planning & Control',
    summary: '作为规控模块负责人带领 6 人小组，负责 TDA4VH 平台量产车型决策、规划、控制与地图处理的技术攻关与迭代。',
    tags: ['C++', 'LQR', 'QP', 'TDA4VH'],
    role: '规控模块负责人 · 6 人团队',
    period: '2021.09 — 至今',
    figure: { type: 'highway', caption: '高速换道工况：参考轨迹与实际跟踪' },
    detail: {
      background:
        '项目由高速公路自动驾驶预研演化而来，是搭载 TDA4VH 计算平台的吉利量产车型项目。本人带领 6 人规控小组，负责决策、规划、控制、地图处理四个部分的持续技术攻关、开发与迭代，支撑 ICC/NOA 功能量产交付。',
      problem:
        '量产车型对规控模块提出了远高于预研的要求：多功能场景（车道保持、nudge、跟车、换道、上下匝道）需长期稳定运行；方向盘转角传感器误差与零偏、载荷与路面带来的参数摄动会直接侵蚀控制精度；纵向规划需在限速、跟车与舒适性约束下稳定可解；同时多人团队的开发节奏与需求质量需要流程保障。',
      objectives: [
        '高速场景横向偏差控制在 ±0.2 m 以内（含传感器误差与零偏）',
        '纵向规划平滑、可解，满足弯道限速与跟车约束',
        '参数摄动下精度不退化，减少车型间重复标定',
        '需求—开发—验证流程化，版本按节点稳定交付',
      ],
      approach: [
        {
          title: '团队与流程管理',
          body: '主导评审需求文档，确保其准确、清晰、完整且符合功能目标；根据成员技能合理分配任务并定期检查进度，保障模块按时交付。',
        },
        {
          title: '环境认知建模',
          body: '主导建立环境认知模块，对周边障碍物进行结构化建模并建立障碍物风险系数，为决策与规划模块提供经过“理解”的信息。',
        },
        {
          title: '纵向规划 QP 化',
          body: '利用贝塞尔曲线的凸包特性建立二次规划模型，将控制点约束线性化后转换为 QP 问题求解，兼顾舒适性与约束满足。',
        },
        {
          title: '横向双环控制攻关',
          body: '采用角度环 LQR + 扭矩环前馈+PID 反馈的双环方案；针对方向盘转角传感器误差及零偏问题提出转角估算方案，从估算值闭环消除静态跑偏。',
        },
        {
          title: '参数自适应',
          body: '应用最小二乘法在线辨识侧偏角与 roll 补偿系数，补偿参数摄动对横向精度的影响。',
        },
        {
          title: '新技术预研',
          body: '预研时空联合规划等新技术，为下一代版本做技术储备。',
        },
      ],
      architecture: {
        blocks: [
          { label: '需求评审', sub: '功能目标' },
          { label: '环境认知', sub: '障碍物 / 风险系数' },
          { label: '纵向规划', sub: '贝塞尔凸包 QP' },
          { label: '横向控制', sub: 'LQR + FF·PID' },
          { label: '执行器', sub: '转向 / 驱动' },
        ],
        feedbackLabel: '闭环反馈 · 方向盘转角 + IMU + 轮速 · 含转角估算',
      },
      models: [
        {
          title: 'State Model — 横向误差动力学（LQR 角度环）',
          equations: [
            {
              label: '(1)',
              tex: String.raw`\dot{x} = A x + B u, \quad x = \begin{bmatrix} e_y & \dot{e}_y & e_\psi & \dot{e}_\psi \end{bmatrix}^{\mathsf T}`,
              note: '运动学 / 动力学误差模型随车速切换',
            },
            {
              label: '(2)',
              tex: String.raw`A^{\mathsf T} P + P A - P B R^{-1} B^{\mathsf T} P + Q = 0, \quad \delta_{\mathrm{lqr}} = -R^{-1} B^{\mathsf T} P\, x`,
            },
          ],
        },
        {
          title: 'Longitudinal QP — 贝塞尔曲线凸包规划',
          equations: [
            {
              label: '(3)',
              tex: String.raw`p(t) = \sum_{i=0}^{n} B_i^n(t)\, P_i \;\Rightarrow\; p(t) \in \mathrm{conv}\{P_i\}`,
              note: '凸包性质：曲线约束可线性化为控制点约束',
            },
            {
              label: '(4)',
              tex: String.raw`\min_{P_i} \sum_k \left\| p(t_k) - p_k^{\mathrm{ref}} \right\|^2 + \lambda \sum_k \left\| \Delta^2 P_i \right\|^2 \;\; \mathrm{s.t.}\;\; P_i \in \mathcal{C}_{\mathrm{safe}}`,
            },
          ],
        },
        {
          title: 'Adaptation — 最小二乘参数辨识',
          equations: [
            {
              label: '(5)',
              tex: String.raw`\hat{\theta} = \left( \Phi^{\mathsf T} \Phi \right)^{-1} \Phi^{\mathsf T} y, \quad \theta = \begin{bmatrix} \beta & k_{\mathrm{roll}} \end{bmatrix}^{\mathsf T}`,
              note: 'β：侧偏角；k_roll：roll 补偿系数',
            },
          ],
          params: [
            { name: '计算平台', value: 'TDA4VH', note: '量产车规芯片' },
            { name: '横向偏差', value: '±0.2 m', note: '高速场景' },
            { name: '双环结构', value: 'LQR + FF·PID' },
            { name: '团队规模', value: '6 人', note: '规控小组' },
          ],
        },
      ],
      pipeline: [
        { title: '需求评审', body: '主导评审需求文档的准确性与完整性，拆解为模块任务并分配到人。' },
        { title: '环境认知', body: '障碍物结构化建模 + 风险系数计算，输出统一的环境理解信息。' },
        { title: '纵向规划', body: '贝塞尔凸包 QP 生成纵向速度 / 位置序列，处理限速、跟车与舒适性约束。' },
        { title: '横向控制', body: 'LQR 角度环 + 前馈 PID 扭矩环，叠加转角估算与参数自适应补偿。' },
        { title: '回归验证', body: '版本节点回归测试与实车验证，问题闭环进入下一迭代。' },
      ],
      results: {
        summary:
          '模块按节点持续交付，支撑 ICC/NOA 功能量产：多功能场景稳定运行，高速横向偏差控制在 ±0.2 m，传感器零偏与参数摄动问题闭环解决。',
        metrics: [
          { label: '高速横向偏差', value: '±0.2 m', note: '含转角零偏补偿' },
          { label: '功能范围', value: 'ICC/NOA', note: '含自主换道 / 上下匝道' },
          { label: '计算平台', value: 'TDA4VH', note: '量产域控' },
          { label: '团队交付', value: '6 人', note: '按节点稳定迭代' },
        ],
        figures: [
          { type: 'highway', caption: '高速换道工况：参考 / 实际轨迹' },
          { type: 'steering', caption: '双环控制：转角指令与执行响应' },
        ],
        figureNotes: [
          '转角估算方案将传感器零偏从闭环中剥离，消除静态跑偏',
          '贝塞尔凸包性质使纵向安全约束线性化，QP 求解稳定可复现',
          '最小二乘在线辨识降低了不同车型配置下的重复标定工作量',
        ],
      },
      challenges: [
        { title: '方向盘转角传感器误差与零偏', body: '零偏直接进入角度环造成静态跑偏。提出转角估算方案，以估算转角替代原始测量闭环，精度与鲁棒性同时提升。' },
        { title: '参数摄动', body: '侧偏刚度随载荷、胎压变化侵蚀 LQR 增益的有效性。最小二乘在线辨识侧偏角与 roll 补偿系数，控制精度自适应恢复。' },
        { title: '纵向规划的实时性与可解性', body: '直接对轨迹离散点施加约束易导致 QP 规模膨胀。利用贝塞尔凸包特性把约束转移到控制点，问题规模与求解时间大幅下降。' },
        { title: '多子模块协同', body: '决策、规划、控制、地图四部分接口耦合。以结构化障碍物模型与风险系数统一信息表达，接口清晰、责任分明。' },
      ],
      outcome: [
        '规控模块按量产节点持续交付，功能覆盖 ICC/NOA 全场景',
        '横向控制方案与参数自适应方案沉淀为可跨车型复用的模板',
        '建立需求评审 — 任务分配 — 进度检查的团队协作流程',
        '时空联合规划完成预研，为下一代版本储备',
      ],
    },
  },
  {
    id: 'highway-preresearch',
    index: '02',
    title: '高速公路自动驾驶系统预研',
    titleEn: 'Highway Autonomous Driving Pre-research',
    summary: '从 0 搭建决策规划与控制模块，实现车道保持、nudge、跟车、拨杆换道、自主换道与自主上下匝道，获吉利睿蓝车型自动驾驶定点。',
    tags: ['C++', 'LQR', 'PID', 'FSM'],
    role: '规控模块开发',
    period: '2020.08 — 2021.09',
    figure: { type: 'urban', caption: '换道轨迹规划与跟踪（拨杆 / 自主换道）' },
    detail: {
      background:
        '公司内部预研项目，目标是为吉利量产车型自动驾驶功能建立技术储备。本人在项目中承担规控模块开发任务，从零开始搭建决策规划与控制模块，最终项目获得吉利高度认可，并获得睿蓝车型自动驾驶定点。',
      problem:
        '预研阶段没有现成模块可参考，需要在仿真与实车环境中建立完整的规控链路：换道决策必须符合驾驶员预期、无误触发；轨迹规划需横纵向解耦且可被控制稳定跟踪；地图参考线的噪声会直接传导为控制抖动。',
      objectives: [
        '实现车道保持、nudge、跟车、拨杆换道、自主换道、自主上下匝道六类功能',
        '换道决策符合驾驶员预期，无误触发与反复横跳',
        '轨迹横纵向解耦、平滑可跟踪',
        '地图参考线平滑，抑制控制输入抖动',
      ],
      approach: [
        {
          title: '换道决策',
          body: '开发基于规则的换道决策模块：以驾驶员不满意度与车道评分机制共同产生换道意图，配合 FSM 状态机管理功能切换。',
        },
        {
          title: '轨迹规划',
          body: '将横纵向规划问题视为 BVP（边值问题），采用五次多项式生成直行与换道轨迹，位置、速度、加速度边界条件天然连续。',
        },
        {
          title: '控制模块',
          body: '对车辆动力学模型建模，横向采用 LQR，纵向采用 PID，构成最小可用的闭环控制组合。',
        },
        {
          title: '地图处理',
          body: '采用 FEM 类平滑算法对地图参考线平滑，并根据地图信息产生匝道汇入汇出决策。',
        },
      ],
      architecture: {
        blocks: [
          { label: '地图参考线', sub: 'FEM 平滑' },
          { label: '换道决策', sub: 'FSM / 车道评分' },
          { label: '轨迹规划', sub: '五次多项式 BVP' },
          { label: '控制', sub: 'LQR + PID' },
          { label: '整车', sub: '线控接口' },
        ],
        feedbackLabel: '闭环反馈 · 定位 + 底盘状态',
      },
      models: [
        {
          title: 'Trajectory — 五次多项式 BVP 轨迹',
          equations: [
            {
              label: '(1)',
              tex: String.raw`p(\tau) = \sum_{i=0}^{5} c_i \, \tau^i, \quad p(0), p'(0), p''(0),\, p(1), p'(1), p''(1) \;\mathrm{given}`,
              note: '边界条件给定起终点位置 / 速度 / 加速度',
            },
            {
              label: '(2)',
              tex: String.raw`\tau = \frac{t - t_0}{t_1 - t_0} \in [0, 1], \quad \Delta p = p(1) - p(0)`,
            },
          ],
        },
        {
          title: 'Decision — 换道意图决策',
          equations: [
            {
              label: '(3)',
              tex: String.raw`D_{\mathrm{lane}} = \omega_1 \frac{v_{\mathrm{lim}} - v}{v_{\mathrm{lim}}} + \omega_2 \, d_{\mathrm{front}} + \omega_3 \, c_{\mathrm{lane}}, \quad D_{\mathrm{lane}} > D_{\mathrm{th}} \Rightarrow \mathrm{LC\ intent}`,
              note: '驾驶员不满意度建模 + 车道评分双机制',
            },
          ],
        },
        {
          title: 'Control — LQR 横向 + PID 纵向',
          equations: [
            {
              label: '(4)',
              tex: String.raw`\delta = -K_{\mathrm{lqr}} x + \delta_{\mathrm{ff}}, \qquad a = K_p e_v + K_i \int e_v\, dt + K_d \dot{e}_v`,
            },
          ],
          params: [
            { name: '功能场景', value: '6 类', note: 'LK / nudge / 跟车 / 换道 / 匝道' },
            { name: '决策机制', value: '不满意度 + 车道评分' },
            { name: '横向控制', value: 'LQR', note: '动力学误差模型' },
            { name: '轨迹曲线', value: '五次多项式' },
          ],
        },
      ],
      pipeline: [
        { title: '参考线平滑', body: 'FEM 类算法平滑地图参考线，消除折线噪声向控制的传导。' },
        { title: '意图决策', body: '结合驾驶员不满意度与车道评分产生换道意图，FSM 管理功能状态。' },
        { title: '轨迹生成', body: '横纵向 BVP 五次多项式轨迹，保证位置 / 速度 / 加速度边界连续。' },
        { title: '闭环控制', body: 'LQR 横向 + PID 纵向稳定跟踪，覆盖全部六类功能场景。' },
        { title: '实车验收', body: '仿真 + 实车双重验证，功能与体验双指标通过客户评审。' },
      ],
      results: {
        summary:
          '从零完成规控全链路搭建，六类功能场景全部跑通实车验证，项目获得吉利高度认可，最终获得睿蓝车型自动驾驶定点，并整体演化为后续量产项目。',
        metrics: [
          { label: '功能场景', value: '6 类', note: '含自主换道 / 上下匝道' },
          { label: '项目里程碑', value: '车型定点', note: '吉利睿蓝' },
          { label: '参考线处理', value: 'FEM 平滑', note: '抑制控制抖动' },
          { label: '模块来源', value: '0 → 1', note: '从零搭建' },
        ],
        figures: [
          { type: 'urban', caption: '自主换道：轨迹规划与跟踪' },
          { type: 'error', caption: '换道过程横向 / 航向误差' },
        ],
        figureNotes: [
          '五次多项式边界连续，换道轨迹无速度 / 加速度突变',
          '双机制决策在拥堵与自由流场景下均无误触发',
          '参考线平滑显著降低高速直行的方向盘持续微修正',
        ],
      },
      challenges: [
        { title: '换道决策误触发', body: '单一阈值决策在车流波动下反复横跳。引入驾驶员不满意度与车道评分双机制并加入意图保持时间，决策稳定。' },
        { title: '参考线噪声', body: '地图折线噪声经控制放大为方向盘抖动。FEM 类平滑 + 曲率约束，从源头抑制激励。' },
        { title: '横纵向耦合', body: '联合规划维度高、求解慢。横纵向解耦为两个 BVP 问题，规划频率提升且跟踪更稳。' },
      ],
      outcome: [
        '获得吉利睿蓝车型自动驾驶定点，项目转化为量产 ICC/NOA',
        '规控模块架构直接演化至量产项目，复用率高',
        '沉淀换道决策、轨迹规划与控制模块的完整设计文档',
      ],
    },
  },
  {
    id: 'mawan-port',
    index: '03',
    title: '深圳妈湾港智慧码头无人集卡',
    titleEn: 'Mawan Smart Port Autonomous Container Trucks',
    summary: '完全自动驾驶内集卡完成货船与堆场间装卸作业；改进满足港口场景特点的速度规划方案，停车精度提升至 ±5 cm。',
    tags: ['C++', '速度规划', '决策规划'],
    role: '决策规划开发',
    period: '2020.03 — 2020.08',
    figure: { type: 'parking', caption: '装卸点精准停靠：末端速度收敛策略' },
    detail: {
      background:
        '深圳妈湾港智慧码头项目，目标是以完全自动驾驶内集卡完成货船与堆场之间的装卸转运作业。港口场景结构化程度高、节拍要求紧，是验证自动驾驶商业化价值的典型场景。本人在项目中参与决策规划模块架构工作。',
      problem:
        '港口作业对规划模块的要求集中在三处：装卸对接点的定位停车精度要求达到厘米级；作业路径由调度系统给定，速度规划必须适配港口限速、弯道与防撞要求；转运效率直接决定码头产能，速度规划不能一味保守。',
      objectives: [
        '实现完全自动驾驶内集卡的装卸作业闭环',
        '装卸点停车精度 ±5 cm',
        '满足港口限速、弯道与防撞约束的前提下提升转运效率',
        '与调度系统稳定交互，支持多车协同作业',
      ],
      approach: [
        {
          title: '决策规划架构',
          body: '参与实现决策规划模块架构：整合上游感知与调度系统信息，为车辆运行提供行为决策与路径规划。',
        },
        {
          title: '港口场景速度规划',
          body: '改进满足港口场景特点的速度规划方案：分段限速 + 弯道 / 防撞约束 + 末端线性收敛的精停段设计。',
        },
        {
          title: '末端精停',
          body: '末端以剩余距离成比例地衰减速度，配合控制同事的执行补偿，把停车精度从分米级提升至 ±5 cm。',
        },
      ],
      architecture: {
        blocks: [
          { label: '调度系统', sub: '作业指令' },
          { label: '决策规划', sub: '行为 / 路径' },
          { label: '速度规划', sub: '港口限速 / 防撞' },
          { label: '末端精停', sub: '±5 cm' },
          { label: '线控底盘', sub: '执行' },
        ],
        feedbackLabel: '闭环反馈 · 定位 + 轮速 + 作业对接状态',
      },
      models: [
        {
          title: 'Speed Planning — 港口速度剖面',
          equations: [
            {
              label: '(1)',
              tex: String.raw`v_{\mathrm{ref}}(s) = \min \left\{ v_{\mathrm{lim}}(s),\; v_{\mathrm{curve}}(s),\; v_{\mathrm{collision}}(s) \right\}`,
              note: '分段限速 / 曲率限速 / 防撞限速取包络',
            },
            {
              label: '(2)',
              tex: String.raw`v_{\mathrm{stop}}(s) = k_{\mathrm{stop}} \cdot \left( s_{\mathrm{end}} - s \right), \quad s \to s_{\mathrm{end}}`,
              note: '末端精停段：速度随剩余距离线性收敛',
            },
          ],
          params: [
            { name: '停车精度', value: '±5 cm', note: '装卸对接点' },
            { name: '作业场景', value: '船 ↔ 堆场', note: '装卸转运' },
            { name: '车型', value: '无人内集卡', note: '完全自动驾驶' },
            { name: '场地', value: '深圳妈湾港', note: '智慧码头' },
          ],
        },
      ],
      pipeline: [
        { title: '指令解析', body: '解析调度系统作业指令，与感知信息整合生成行为决策。' },
        { title: '路径校验', body: '接收调度路径并做可行性校验，异常时上报重调度。' },
        { title: '速度规划', body: '综合港口限速、弯道与防撞约束生成速度剖面。' },
        { title: '末端精停', body: '剩余距离比例衰减策略执行精准对接停车。' },
        { title: '作业闭环', body: '对接状态确认后继续下一循环，支持多车连续作业。' },
      ],
      results: {
        summary:
          '完全自动驾驶内集卡在妈湾港实现货船与堆场间装卸作业闭环，停车精度与转运效率两项关键指标同时达成，有效提升港口集装箱转运效率。',
        metrics: [
          { label: '停车精度', value: '±5 cm', note: '装卸对接点' },
          { label: '作业模式', value: '完全无人', note: '内集卡自动驾驶' },
          { label: '转运效率', value: '有效提升', note: '速度规划改进' },
          { label: '场景类型', value: '港口混行', note: '结构化 + 动态干扰' },
        ],
        figures: [{ type: 'parking', caption: '装卸点精准停靠：速度 — 剩余距离收敛策略' }],
        figureNotes: [
          '末端精停段速度随剩余距离线性收敛，对接成功率稳定',
          '分段限速包络兼顾节拍与安全，效率不因保守而损失',
        ],
      },
      challenges: [
        { title: '厘米级停车精度', body: '定位误差与执行滞后叠加会放大停车偏差。末端速度随剩余距离线性收敛 + 执行补偿，精度提升至 ±5 cm。' },
        { title: '节拍与安全的平衡', body: '港口既要效率又要防撞安全。分段限速包络 + 防撞走廊约束，效率与安全兼得。' },
        { title: '调度协同', body: '多车作业存在路径冲突。与调度系统建立清晰的接口协议，冲突在规划层提前化解。' },
      ],
      outcome: [
        '妈湾港智慧码头无人集卡投入装卸作业验证',
        '停车精度 ±5 cm 成为同类场景的工程标杆',
        '沉淀港口场景速度规划方法，可迁移至封闭园区物流',
      ],
    },
  },
  {
    id: 'baic-platooning',
    index: '04',
    title: '北汽电动图雅诺队列自动驾驶车队',
    titleEn: 'BAIC Tuyano Truck Platooning',
    summary: '商用车队列自动驾驶：CACC / ACC 双模式切换稳定跟驰，头车激烈驾驶实测下理想通讯条件车间距小于 5 m，理论最大纵向距离误差 1 m。',
    tags: ['CACC', 'ACC', 'C++', '最小二乘'],
    role: '决策规划开发',
    period: '2019.06 — 2019.12',
    figure: { type: 'platoon', caption: '商用车队列跟驰：CACC / ACC 双模式' },
    detail: {
      background:
        '商用车队列行驶（Platooning）通过多车紧密跟驰降低风阻与人力成本，是自动驾驶在物流领域的典型应用。项目在北汽电动图雅诺商用车上实现队列自动驾驶，验证多车跟驰决策规划系统的稳定性。',
      problem:
        '队列跟驰的核心难题是纵向稳定性：头车激烈驾驶时，误差沿队列逐车放大将导致追尾风险；V2V 通讯存在延迟与丢包，需要在有通讯（CACC）与无通讯（ACC）两种模式间稳定切换；头车轨迹信号中的噪声也会干扰跟驰控制。',
      objectives: [
        'CACC / ACC 双模式切换稳定队列跟驰',
        '理想通讯条件下车间距小于 5 m',
        '理论最大纵向距离误差不超过 1 m',
        '头车激烈驾驶工况下实测验证',
      ],
      approach: [
        {
          title: '双模式跟驰决策',
          body: '实现 CACC（利用 V2V 通讯获取头车状态做前馈）与 ACC（依赖自身雷达反馈）双模式系统，通讯质量劣化时自动降级切换。',
        },
        {
          title: '间距策略',
          body: '采用时距（Constant Time Gap）策略设定期望车间距，平衡安全裕度与队列紧凑度。',
        },
        {
          title: '头车轨迹平滑',
          body: '使用最小二乘法对头车轨迹进行平滑，抑制通讯与量测噪声向后车控制的传导。',
        },
      ],
      architecture: {
        blocks: [
          { label: '头车状态', sub: 'V2V 通讯' },
          { label: '轨迹平滑', sub: '最小二乘' },
          { label: '跟驰决策', sub: 'CACC / ACC' },
          { label: '纵向控制', sub: '间距 + 速度环' },
          { label: '电驱动执行', sub: '图雅诺' },
        ],
        feedbackLabel: '闭环反馈 · 雷达 + 轮速 + 通讯质量监测',
      },
      models: [
        {
          title: 'Spacing Policy — 时距间距策略',
          equations: [
            {
              label: '(1)',
              tex: String.raw`d_{\mathrm{des}}(t) = d_0 + h \cdot v_i(t), \quad e_i(t) = d_i(t) - d_{\mathrm{des}}(t)`,
              note: 'd₀：静止间距；h：车头时距',
            },
          ],
        },
        {
          title: 'CACC / ACC — 双模式跟驰控制',
          equations: [
            {
              label: '(2)',
              tex: String.raw`a_i = a_{i-1}(t - \tau_{\mathrm{lat}}) + K_p e_i + K_d \dot{e}_i \quad \mathrm{(CACC)}`,
              note: '头车加速度前馈 + 间距误差反馈',
            },
            {
              label: '(3)',
              tex: String.raw`a_i = K_p \left( v_{i-1}^{\mathrm{radar}} - v_i \right) + K_d \dot{e}_i \quad \mathrm{(ACC)}`,
              note: '通讯不可用时降级为雷达反馈',
            },
          ],
        },
        {
          title: 'Smoothing — 头车轨迹最小二乘平滑',
          equations: [
            {
              label: '(4)',
              tex: String.raw`\hat{\theta} = \left( \Phi^{\mathsf T} \Phi \right)^{-1} \Phi^{\mathsf T} y, \quad \hat{s}(t) = \Phi(t)\, \hat{\theta}`,
            },
          ],
          params: [
            { name: '稳定车间距', value: '< 5 m', note: '理想通讯实测' },
            { name: '最大纵向误差', value: '1 m', note: '理论保持值' },
            { name: '跟驰模式', value: 'CACC / ACC' },
            { name: '验证工况', value: '头车激烈驾驶' },
          ],
        },
      ],
      pipeline: [
        { title: '状态接收', body: '通过 V2V 接收头车轨迹与加速度序列，监测通讯质量。' },
        { title: '轨迹平滑', body: '最小二乘拟合平滑头车轨迹，抑制噪声传导。' },
        { title: '模式决策', body: '依据通讯质量在 CACC / ACC 间切换，切换过程平缓过渡。' },
        { title: '跟驰控制', body: '期望间距 + 速度双层误差反馈，输出加速度指令。' },
        { title: '实测验证', body: '头车激烈驾驶工况下实测车间距与误差指标。' },
      ],
      results: {
        summary:
          '多车跟驰系统在实测中表现稳定：理想通讯条件下车间距保持在 5 m 以内，头车激烈驾驶工况下队列未出现发散，验证了双模式跟驰决策规划系统的工程可行性。',
        metrics: [
          { label: '稳定车间距', value: '< 5 m', note: '理想通讯实测' },
          { label: '纵向距离误差', value: '≤ 1 m', note: '理论最大保持值' },
          { label: '跟驰模式', value: 'CACC / ACC', note: '双模式切换' },
          { label: '验证工况', value: '激烈驾驶', note: '头车实测' },
        ],
        figures: [{ type: 'platoon', caption: '队列跟驰：车间距保持与双模式切换' }],
        figureNotes: [
          '头车加速度前馈显著降低跟驰误差的相位滞后',
          '最小二乘平滑有效抑制通讯噪声向后车执行层的传导',
        ],
      },
      challenges: [
        { title: '通讯延迟与丢包', body: 'V2V 链路不稳定会导致前馈失效。通讯质量在线监测 + CACC→ACC 平滑降级，队列不失稳。' },
        { title: '头车轨迹噪声', body: '原始轨迹噪声经误差放大危害稳定性。最小二乘平滑给出连续可导的参考轨迹。' },
        { title: '商用车执行滞后', body: '电驱动商用车动力响应慢。加速度前馈 + 滞后补偿，缩小期望与实际间距的动态偏差。' },
      ],
      outcome: [
        '完成头车激烈驾驶工况下的多车实测验证',
        'CACC / ACC 双模式切换策略成为后续项目的纵向决策模板',
        '为商用车队列物流降本提供完整的技术验证依据',
      ],
    },
  },
];
