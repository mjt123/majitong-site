import type { ArticleDoc } from '@/types';

/**
 * 博客正文数据 —— slug 对应 blogPosts 中的条目。
 * 约定：段落支持 **加粗** 与 $行内公式$ 标记；公式编号 label 与正文引用保持一致。
 */
export const blogArticles: Record<string, ArticleDoc> = {
  'motion-planning-sampling-lattice-notes': {
    blocks: [
      {
        type: 'para',
        text: '规划回答「沿哪条几何路径走」，控制回答「如何精确跟踪这条轨迹」。这篇笔记把**运动规划**的骨干压成一条线：问题定义 → 规划器性质 → 搜索方法 → 轨迹生成。主角是两类思路迥异的方法 —— 把规划交给「搜索」的随机采样方法（RRT / RRT*），和把规划交给「评分」的 Lattice Planner；理解了它们的分工，也就理解了结构化道路与非结构化场景为什么长出两套完全不同的规划栈。',
      },
      { type: 'heading', text: '问题定义与规划器性质', en: 'Problem Statement & Planner Properties' },
      {
        type: 'para',
        text: '局部规划器（Local Planner）位于自动驾驶软件栈的中游：上游 Mission / Route Planning 给定全局路由，Behavior Planner 做出语义决策（跟车、变道、停车），**运动规划器则在构型空间中搜索一条满足车辆约束的无碰撞轨迹**，交给运动控制执行，见图 1。',
      },
      { type: 'figure', src: '/images/blog/planning-01-hierarchy.webp', caption: '运动规划在系统栈中的位置：行为决策之后、运动控制之前，输出局部轨迹。' },
      {
        type: 'para',
        text: '评价一个规划器，先看它被什么约束、再谈它有多好。路径约束分三类：**局部约束**（避开静态障碍物）、**微分约束**（曲率与转向角有界 —— 车辆是典型的非完整系统）、**全局约束**（如最短路要求）。在此之上，规划器有四个形式化维度：',
      },
      {
        type: 'list',
        items: [
          '**完备性**：完全完备（只要解存在必能找到）、分辨率完备、概率完备（采样次数趋于无穷时找到解的概率趋于 1）三级递减；',
          '**最优性**：全局最优、渐近最优（解随计算资源增加收敛到最优）、次优（可接受的近似）三级；',
          '**算法效率**：以复杂度阶 $O(n)$ 度量，对输入规模的比例关系；',
          '**约束表达能力**：能否编码微分约束，决定了方法能不能直接用于车辆。',
        ],
      },
      { type: 'figure', src: '/images/blog/planning-02-properties.webp', caption: '规划器的形式化性质分类：完备性、算法效率、最优性、复杂度与约束表达。' },
      { type: 'heading', text: '组合式与采样式：两条搜索路线', en: 'Combinatorial vs. Sampling-based' },
      {
        type: 'para',
        text: '组合式方法（如可视图 Visibility Graph）在二维多边形空间里给出**精确且完备**的解，但向高维连续构型空间推广时遭遇维数灾难，工程上很少直接用于车辆。采样式方法用「在构型空间里撒点」代替「构造精确结构」，又分两支：**确定性采样**（均匀网格，分辨率完备）与**随机采样**（概率完备）。路图（Roadmap）适合多查询场景，树（RRT）适合单查询 —— 这也是车辆运动规划几乎都基于树的原因：环境每次都不一样。',
      },
      { type: 'heading', text: 'RRT：快速探索随机树', en: 'Rapidly-exploring Random Trees' },
      {
        type: 'para',
        text: 'RRT 的核心循环极简：采样 $x_{rand}$，找到树上最近点 $x_{near}$，向采样点步进得到 $x_{new}$，无碰撞则把新边挂到树上（图 3）。「快速探索」来自一个概率性质：树上的节点越多，被采到稠密区域的概率越大，扩展自然偏向**尚未探索的空旷区域**。',
      },
      { type: 'figure', src: '/images/blog/planning-03-rrt.webp', caption: 'RRT 扩展示意：Sample → Nearest → Steer → CollisionFree → AddNode 的循环，重复采样直到树到达目标区域。' },
      {
        type: 'para',
        text: '运行时间的支配项是碰撞检查。工程上把障碍物近似为圆或凸多边形：对圆形障碍，用「代数距离判据」快速排除——若新边两端点到障碍中心的投影距离都超过半径 $\\varepsilon$ 则直接判无碰撞；对多边形，先做同侧快速排除，再做线段相交检查。这些常数因子的优化，往往比换更聪明的采样策略更有效。',
      },
      { type: 'heading', text: 'RRT*：渐近最优性从何而来', en: 'Asymptotic Optimality' },
      {
        type: 'para',
        text: '标准 RRT 得到的树**概率完备但非最优**：路径质量取决于采样的偶然性，树不会主动优化已有路径。RRT* 在同样的循环里加了两个算子：**ChooseParent**——新节点的父节点不再取最近点，而是在近邻集合中取「到达代价」最小者；**Rewire**——新节点挂载后，检查近邻节点经由新节点到达是否更便宜，是则重新布线。Karaman 与 Frazzoli 证明：只要近邻半径按',
      },
      { type: 'equation', tex: '\\mathcal{X}_{\\text{near}} = \\left\\{ x \\in \\mathcal{T} : \\| x - x_{\\text{new}} \\| \\le \\gamma \\left( \\frac{\\log n}{n} \\right)^{1/d} \\right\\}', label: '(1)', note: 'd 为构型空间维数，γ 为正常数。半径随样本数 n 收缩，使近邻集规模保持 O(log n)。' },
      {
        type: 'para',
        text: '收缩，则树以概率 1 渐近收敛到最优解，同时近邻查询的开销可控 —— 这是渐近最优性与计算开销之间的平衡点（图 4）。另一个常被忽略的事实：**RRT 与 RRT* 的每次迭代成本几乎相同**，RRT* 的「最优性」不是用更高的单步复杂度换来的，而是靠 Rewire 让历史信息持续发挥作用。',
      },
      { type: 'figure', src: '/images/blog/planning-04-rrtstar.webp', caption: 'RRT*：考虑历史代价而非局部信息。右上为代价收敛曲线（RRT* 随样本增加单调下降），下为两种树在相同采样数下的形态对比。' },
      {
        type: 'para',
        text: '围绕 RRT* 的工程改进可以按「算法的哪一步」归档：',
      },
      {
        type: 'list',
        items: [
          '**边的性质**：Dubins / Reeds-Shepp 边编码车辆最小转弯半径，样条（Clothoid / Bézier）边保证曲率连续 —— 让树本身就满足微分约束；',
          '**偏置采样**（Bias Sampling）：以一定概率直接向目标采样，加速早期收敛；',
          '**采样剔除**（Sample Rejection）：不满足代价阈值的样本直接丢弃；',
          '**树剪枝**（Tree Pruning）与**图稀疏化**（Graph Sparsification）：控制树的规模与近邻查询成本；',
          '**延迟碰撞检查**（Delay Collision Check）：按代价排序邻居，找到一条可行边即停止；',
          '**Anytime RRT / Informed RRT***：先返回可行解，再在以当前最优代价定义的椭圆域内继续采样优化。',
        ],
      },
      { type: 'heading', text: 'Lattice Planner：Frenet 坐标下的轨迹族', en: 'Lattice Planner in the Frenet Frame' },
      {
        type: 'para',
        text: '结构化道路上的主流工程路线走了另一个方向：**不做自由空间搜索，而是沿参考线生成一族候选轨迹，再逐条评分筛选**。前提是有一套顺手的坐标系 —— Frenet 坐标：以参考线为横轴建立移动标架，车辆状态用纵向弧长 $s$ 与横向偏移 $l$（及其各阶导数）表达，规划问题从二维平面搜索降维成「横向 + 纵向」两条一维曲线的设计。',
      },
      {
        type: 'para',
        text: 'Frenet 与笛卡尔坐标的双向变换是 Lattice 的数学门槛。正向合成即 $\\vec r = \\vec r_r + l\\,\\vec n_r$；反向投影（图 5）给出横摆角、速度、加速度与曲率的完整映射，其中最常用的两条是横向偏移与其时间导数：',
      },
      { type: 'equation', tex: 'l = \\pm\\sqrt{(x - x_r)^2 + (y - y_r)^2}, \\qquad \\dot s = \\frac{v\\cos(\\theta_x - \\theta_r)}{1 - \\kappa_r l}, \\qquad \\dot l = v \\sin(\\theta_x - \\theta_r)', label: '(2)', note: '下标 r 表示参考线上的投影点，κ_r 为参考线曲率。分母 (1 − κ_r l) 是曲率带来的非均匀弧长伸缩 —— 参考线弯曲时，同样的 v 会在 s 方向投影出不同的 ṡ。' },
      { type: 'figure', src: '/images/blog/planning-05-frenet.webp', caption: 'Frenet 标架下的投影几何：车辆位姿沿参考线分解为弧长 s 与横向偏移 l，t_r/n_r 与 t_c/n_c 分别为轨迹与中心线标架。' },
      {
        type: 'para',
        text: '轨迹族用**多项式闭式拟合**：横向取五次多项式 $l(s)$，用六个边界条件（初始的 $d_0, d\'_0, d\'\'_0$ 与采样目标的 $d_1, d\'_1, d\'\'_1$）唯一确定六个系数；纵向 $s(t)$ 同理，巡航保持工况下四阶即可（末态只约束速度，不约束位置），全停止工况则需要五阶（图 6、图 7）。对目标偏移、目标速度、到达时间做网格化采样，就得到一族几百条、可以**解析求值**的候选轨迹 —— 没有迭代，没有数值求解，这是 Lattice 在工程上长盛不衰的根本原因。',
      },
      { type: 'equation', tex: 'l(s) = k_1 s^5 + k_2 s^4 + k_3 s^3 + k_4 s^2 + k_5 s + k_6', label: '(3)', note: '对 s 求一阶、二阶导即横向速度与加速度，代价函数可直接以解析形式评估。' },
      { type: 'figure', src: '/images/blog/planning-06-lateral-poly.webp', caption: '横向轨迹族：不同目标偏移下的五次多项式曲线族，每个采样点对应一组边界条件。' },
      { type: 'figure', src: '/images/blog/planning-07-speed-poly.webp', caption: '纵向速度规划：巡航工况的四阶多项式族，绿色为当前最优轨迹。蓝/绿点为起点与候选末态。' },
      {
        type: 'para',
        text: '筛选分两层。硬约束层：碰撞、曲率上限、加速度/加加速度包线，任何一条越界即整条淘汰；软代价层：',
      },
      { type: 'equation', tex: 'J = w_{\\text{lat}} \\cdot J_{\\text{lat}} + w_{\\text{lon}} \\cdot J_{\\text{lon}}', label: '(4)', note: '横向项惩罚偏离中心线与高阶导数（舒适性），纵向项惩罚偏离目标速度/位置与 jerk；权重即「驾驶风格」的参数化。' },
      { type: 'heading', text: '结语：两条路线的分工', en: 'Closing Remarks' },
      {
        type: 'para',
        text: '把这批笔记压缩成一句话：**采样式方法把规划交给「搜索」，Lattice 把规划交给「评分」**。前者通用性强 —— 非结构化道路、泊车、越野，凡是参考线缺席的场景都是它的主场，代价是碰撞检查主导的计算开销与质量随机的解；后者依赖结构化参考线，把二维搜索压缩为一维曲线设计，闭式轨迹族让候选生成近乎免费，是结构化道路 ADAS / AD 的工程主流。两条路线并非竞争，而是对应「探索未知空间」与「在已知走廊内优化」两类不同性质的问题。',
      },
      {
        type: 'para',
        text: '轨迹定下来之后，问题就交给了控制：如何以最小的横向偏差与执行器负担跟踪它 —— 那是下一篇 MPC 笔记的主题。',
      },
      {
        type: 'references',
        items: [
          'T. M. Howard, C. J. Green, and A. Kelly, "State Space Sampling of Feasible Motions for High-Performance Mobile Robot Navigation in Complex Environments," Journal of Field Robotics, vol. 25, no. 6-7, 2008.',
          'S. M. LaValle and J. J. Kuffner, "Randomized Kinodynamic Planning," The International Journal of Robotics Research, vol. 20, no. 5, 2001.',
          'S. Karaman and E. Frazzoli, "Sampling-based Algorithms for Optimal Motion Planning," The International Journal of Robotics Research, vol. 30, no. 7, 2011.',
          'J. D. Gammell, S. S. Srinivasa, and T. D. Barfoot, "Informed RRT*: Optimal Sampling-based Path Planning Focused via Direct Sampling of an Admissible Ellipsoidal Heuristic," in Proc. IEEE/RSJ IROS, 2014.',
          'M. Werling, J. Ziegler, S. Kammel, and S. Thrun, "Optimal Trajectory Generation for Dynamic Street Scenarios in a Frenet Frame," in Proc. IEEE ICRA, 2010.',
          'H. Fan, F. Zhu, C. Liu, et al., "Baidu Apollo EM Motion Planner," arXiv:1807.08048, 2018.',
        ],
      },
    ],
  },

  'vehicle-mpc-design-notes': {
    blocks: [
      {
        type: 'para',
        text: 'MPC 的吸引力在于它把车辆控制的四个经典难题 —— 模型失配、多目标权衡、约束处理、时滞补偿 —— 统一进同一个滚动优化框架；而工程落地的难度也恰恰在于：这四个环节的每一个设计决策都会互相牵制。这篇笔记按设计链路把 MPC 拆开：预测模型怎么选、目标函数怎么加权、约束如何软化、以及毫秒级预算下 QP 怎么求解。',
      },
      { type: 'heading', text: '控制架构：MPC 在回路中的位置', en: 'Architecture' },
      {
        type: 'para',
        text: 'MPC 接收规划器下发的参考轨迹，在有限时域 $N$ 上做**迭代轨迹优化**，得到最优控制序列后只执行首拍，下一拍以新量测重新求解 —— 即滚动时域（receding horizon），见图 1。两个工程细节值得记录：其一，MPC 的输出可以是执行器的**二阶导数**（转向角速度、加速度→制动压力变化率），把执行器动态也纳入预测；其二，低级控制器（Low-Level Controller）仍然存在，MPC 负责「想清楚」，执行层负责「做到位」，两层解耦是量产方案的常态。',
      },
      { type: 'figure', src: '/images/blog/mpc-01-architecture.webp', caption: '车辆运动控制架构：MPC 以车辆模型为过程模型滚动优化，输出最优控制序列；planner 的边界编码为约束，驾驶风格由目标函数塑造。' },
      {
        type: 'para',
        text: '与 LQR / PID 的本质区别不在「最优」而在**显式处理约束**：道路边界、障碍物、执行器物理极限都以不等式的形式进入问题，控制器在「合法动作集合」内寻优 —— 这是无约束方法原则上做不到的。',
      },
      { type: 'heading', text: '预测模型：在 Fast 与 Accuracy 之间', en: 'Prediction Model' },
      {
        type: 'para',
        text: '第一个设计决策是模型。运动学单车模型用几何关系（ISA 假设：无侧向滑移）描述车辆，结构简单、参数少，低速可信；动力学单车模型引入侧偏刚度 $C_f / C_r$、转动惯量 $I_z$ 与前/后轴距 $l_f / l_r$，能表达轮胎侧偏，中高速必须用它（图 2）。以横向误差 $e_y$、航向误差 $e_\\varphi$ 及其变化率为状态、前轮转角为输入，动力学模型在小偏差下线性化得到时变线性系统：',
      },
      {
        type: 'equation',
        tex: '\\dot{\\boldsymbol{x}} = A(v)\\,\\boldsymbol{x} + B\\,\\boldsymbol{u}, \\quad \\boldsymbol{x} = [e_y,\\ \\dot e_y,\\ e_\\varphi,\\ \\dot e_\\varphi]^{\\mathsf T},\\quad A(v) = \\begin{bmatrix} 0 & 1 & 0 & 0 \\\\ 0 & -\\tfrac{C_f + C_r}{m v} & \\tfrac{C_f + C_r}{m} & \\tfrac{l_r C_r - l_f C_f}{m v} \\\\ 0 & 0 & 0 & 1 \\\\ 0 & \\tfrac{l_r C_r - l_f C_f}{I_z v} & \\tfrac{l_f C_f - l_r C_r}{I_z} & -\\tfrac{l_f^2 C_f + l_r^2 C_r}{I_z v} \\end{bmatrix},\\quad B = \\begin{bmatrix} 0 \\\\ \\tfrac{C_f}{m} \\\\ 0 \\\\ \\tfrac{l_f C_f}{I_z} \\end{bmatrix}',
        label: '(5)',
        note: '这正是 LQR 横向控制器使用的那套误差动力学（我此前的 CARLA / ROS 2 LQR 作业即基于同一模型：m=1845 kg，L=2.852 m，Cf=Cr≈1.55×10⁵ N/rad，Δt=10 ms）。LQR 是它的无约束解析解，MPC 是带约束的数值解 —— 两者是同一个模型的两种解法。',
      },
      { type: 'figure', src: '/images/blog/mpc-02-models.webp', caption: '运动学与动力学单车模型的几何：前者以瞬时转向中心（ICR）描述轮速关系，后者引入轮胎侧偏与前后轴载荷。' },
      {
        type: 'para',
        text: '第二个维度是坐标系。Frenet / 曲线坐标模型以参考线弧长 $s$ 为纵轴，把「纵向 + 横向」放进同一组状态（图 3）：进度 $s$、速度 $\\dot s$、横向误差 $d$、航向误差 $\\theta_e$、加速度与转向角，输入取 [$\\dot s$ 的 jerk, $\\delta$]。它天然对接规划输出，但引入了曲率耦合项，模型更非线性。于是得到经典的工程分水岭（图 4）：**解耦 + 线性 + 运动学**换求解速度（QP 规模小、实时性有保障），**耦合 + 非线性 + 动力学**换精度 —— 竞速机器人可以耦合，量产车道保持几乎都解耦。',
      },
      { type: 'figure', src: '/images/blog/mpc-03-curvilinear.webp', caption: '曲线坐标（Frenet）车辆模型：沿参考线建立弧长轴，横向偏移 n 与相对航向构成优化变量的自然坐标。' },
      { type: 'figure', src: '/images/blog/mpc-04-tradeoff.webp', caption: '模型选择的天平：Fast（线性 / 运动学 / 解耦）对 Accuracy（非线性 / 动力学 / 耦合），MPC 模型选择即在天平上定位。' },
      {
        type: 'para',
        text: '数值实现上，$A(v)$ 逐拍以当前车速更新（线性时变，LTV），再做离散化。前向欧拉 $A_d \\approx I + A\\Delta t$ 在侧偏刚度带来的刚性动态下容易出数值问题，工程上更常用后向欧拉型离散：',
      },
      { type: 'equation', tex: '\\boldsymbol{x}_{k+1} = A_d\\,\\boldsymbol{x}_k + B_d\\,\\boldsymbol{u}_k, \\qquad A_d \\approx \\left( I - A\\,\\Delta t \\right)^{-1}, \\quad B_d \\approx B\\,\\Delta t', label: '(6)', note: 'Δt 取 10–20 ms。后向欧拉对刚性系统更稳；预测视野 N 与 Δt 一起决定 MPC「看得多远、算多快」。' },
      { type: 'heading', text: '目标函数：驾驶行为的三项分解', en: 'Objective Function' },
      {
        type: 'para',
        text: '目标函数是塑造驾驶行为最根本的机制，可以拆成**跟踪、舒适、安全**三项的加权和。跟踪项对纵向速度、横向偏移与航向误差加权（图 5）：',
      },
      { type: 'equation', tex: 'J_{\\text{tracking}} = w_s \\left( s - s_{\\text{ref}} \\right)^2 + w_v \\, \\eta^2 + w_\\theta \\left( \\mu + \\beta \\right)^2', label: '(7)', note: 'η 为速度误差，μ+β 为航向误差组合。权重即「跟得紧不紧」的直接旋钮。' },
      { type: 'figure', src: '/images/blog/mpc-05-tracking-cost.webp', caption: '跟踪目标的几何图像：车辆位姿沿参考轨迹分解，纵、横向误差与航向误差分别进入代价函数。' },
      {
        type: 'para',
        text: '完整形式叠加控制量与控制增量项，再加终端项：',
      },
      { type: 'equation', tex: '\\min_{\\boldsymbol{u}_{0:N-1}} \\; \\sum_{k=1}^{N} \\left( \\| \\boldsymbol{x}_k - \\boldsymbol{x}_k^{\\text{ref}} \\|_Q^2 + \\| \\boldsymbol{u}_k \\|_R^2 + \\| \\Delta \\boldsymbol{u}_k \\|_S^2 \\right) + J_{\\text{terminal}}', label: '(8)', note: 'Q 对准跟踪精度，R 对执行器负担，S 对平顺性 —— 与 LQR 的 Q/R 整定一脉相承，只是多了增量项与约束。' },
      {
        type: 'para',
        text: '关于视野与迭代的工程观察也值得记录：**数值最优性过了某个阈值之后，对闭环性能的边际收益极小**。MPC solver 的迭代上限（max iteration）不必设成「真最优」，实时性反而要求「足够好的解」；把目标定为 optimal 而非 feasible，往往意味着要用实时迭代（如 RTI）类的策略去换时间。',
      },
      { type: 'heading', text: '约束设计：硬约束、软约束与松弛', en: 'Constraints & Slack' },
      {
        type: 'para',
        text: '约束的物理来源决定它该硬还是该软：**输入限幅**（转向角、制动压力）由执行器物理决定，通常硬；**状态/输出边界**（车间距、加速度包线）来自运行规则的限制，工业实现里通常软化。硬约束的陷阱在于：扰动或噪声一旦把量测状态推到可行域外，QP 直接无解 —— 而控制器必须输出「合理的动作」而非「最优的动作」。',
      },
      { type: 'equation', tex: 'c_i^{\\text{soft}}(\\boldsymbol{x}, \\boldsymbol{u}) \\le \\lambda_i, \\qquad J_{\\text{safety}} = \\boldsymbol{\\lambda}_{\\text{soft}}^{\\mathsf T} E\\,\\boldsymbol{\\lambda}_{\\text{soft}} + \\boldsymbol{\\lambda}_{\\text{hard}}^{\\mathsf T} H\\,\\boldsymbol{\\lambda}_{\\text{hard}}', label: '(9)', note: '对硬约束也引入高价松弛（H ≫ E）以保证数学可行；松弛是「违约代价」而非「违约许可」，权重通常比正常代价高 1–2 个量级。' },
      {
        type: 'para',
        text: '空间约束的几个代表：碰撞约束可以把速度硬界沿弧长**积分成 station 约束**（$s \\in [s - d_{\\text{min}},\\ s + d_{\\text{min}}]$）表达；横向用**空间管道约束**（tube）限制 $|d|$ 不越过道路几何允许的宽度；总加速度用**椭圆约束**贴近轮胎摩擦圆的物理形态（图 6）：',
      },
      { type: 'equation', tex: '\\sqrt{ \\frac{a_{\\text{tangent}}^2}{a_{\\text{tangent,max}}^2} + \\frac{a_{\\text{lateral}}^2}{a_{\\text{lateral,max}}^2} } \\; - \\; 1 - \\lambda_a \\; \\le \\; 0', label: '(10)', note: '纵向（tangent）与横向（lateral）加速度合成的椭圆包线；λ_a 为高价松弛。舒适性约束则对前进/后退方向分别设软界。' },
      { type: 'figure', src: '/images/blog/mpc-07-elliptical.webp', caption: '最大加速度的椭圆约束：纵向、横向加速度合成在摩擦圆形态的包线内，由外向内依次为非线性轮胎区、线性轮胎区与舒适区。' },
      { type: 'heading', text: '终端代价与稳定性', en: 'Terminal Cost & Stability' },
      {
        type: 'para',
        text: '有限时域 MPC 的理论暗礁是**短视**：预测视野之外的信息完全丢失，标准 finite-horizon MPC 既不保证可行、也不保证稳定。经典补救是**终端集 + 终端代价**：给末态加一个不变集约束 $\\boldsymbol{x}_N \\in \\mathcal{X}_f$ 与二次终端代价，可行性与稳定性就有了充分条件。终端集的吸引域（RoA）随视野 $N$ 增大而扩大，但 $N$ 又受算力约束 —— 所以工程上常退而求其次：小视野下放宽终端集，用「采样 + 数值验证」确认闭环可用（图 7）。',
      },
      { type: 'equation', tex: 'J_{\\text{terminal}} = \\| \\boldsymbol{x}_N \\|_P^2, \\qquad \\boldsymbol{x}_N \\in \\mathcal{X}_f', label: '(11)', note: 'P 常取无限时域 LQR 的 Riccati 解 P_∞ —— 这是 MPC 与 LQR 的理论接口：无约束 + 终端代价取 P_∞ 时，MPC 退化为等价的 LQR。' },
      { type: 'figure', src: '/images/blog/mpc-06-terminal.webp', caption: '终端域与吸引域：有限视野外以终端集 Ω 与终端代价补齐，可行域随视野 N 扩大。' },
      { type: 'heading', text: '从动态规划看 MPC 与 LQR 的统一', en: 'MPC Meets LQR via Dynamic Programming' },
      {
        type: 'para',
        text: '把无约束 MPC 按视野展开成批量形式（batch）后，代价函数是 $\\boldsymbol{z}$ 的标准二次型，动力学等式约束可以消元吸收，最优解有解析形式 $\\boldsymbol{z}^* = -H^{-1}F^{\\mathsf T}\\boldsymbol{x}_0$ —— 代价是求一个大矩阵的逆，这是「Batch 解析法」的痛点。另一条路是 **Bellman 最优性原理**：「最优策略的剩余部分，对于先前的状态与决策而言仍是最优的」。把问题按时间打断、从末端倒推，每步只解一个小问题：',
      },
      { type: 'equation', tex: 'J_{N-1}^{*}(x_{N-1}) = \\min_{u_{N-1}}\\; \\underbrace{x_{N-1}^{\\mathsf T} Q\\, x_{N-1} + u_{N-1}^{\\mathsf T} R\\, u_{N-1}}_{\\text{immediate cost}} + \\underbrace{J_{N}^{*}\\!\\left( A\\, x_{N-1} + B\\, u_{N-1} \\right)}_{\\text{cost-to-go}}', note: '对余项做二次型假设 J*(x) = xᵀPx，对 u 求导置零并回代，倒推一步即得式 (12) 的差分 Riccati 迭代 —— 这就是 LQR 的动态规划来路。' },
      { type: 'equation', tex: 'P = Q + A^{\\mathsf T} P A - A^{\\mathsf T} P B \\left( R + B^{\\mathsf T} P B \\right)^{-1} B^{\\mathsf T} P A, \\qquad K = \\left( R + B^{\\mathsf T} P B \\right)^{-1} B^{\\mathsf T} P A', label: '(12)', note: '差分 Riccati 方程（DARE）有两条完全不同的来路：正向的 LQR 不动点，或反向的动态规划递推。MPC 取有限 N、带约束；LQR 取 N→∞、无约束 —— 同一优化结构在两个方向的极限。' },
      {
        type: 'para',
        text: '所以「MPC 还是 LQR」并不是二选一：**无约束 + 长视野时，MPC 收敛到 LQR**；一旦约束变紧或视野变短，二者才真正分道扬镳。这个视角也解释了为什么 MPC 的终端代价常取 $P_\\infty$（式 11）—— 相当于把「视野之外」的信息用 LQR 的解析解补齐。',
      },
      { type: 'heading', text: '实时求解：从 QP 到求解器生态', en: 'Real-time Solving' },
      {
        type: 'para',
        text: '把滚动优化按视野展开、消去状态后，线性 MPC 就是一个标准 QP：',
      },
      { type: 'equation', tex: '\\min_{\\boldsymbol{z}} \\; \\tfrac{1}{2} \\boldsymbol{z}^{\\mathsf T} H \\boldsymbol{z} + \\boldsymbol{x}^{\\mathsf T} F \\boldsymbol{z} \\quad \\text{s.t.} \\quad G \\boldsymbol{z} \\le \\boldsymbol{W} + S \\boldsymbol{x}', label: '(13)', note: '复杂度随状态维数、约束数与视野 N 增长；车载毫秒级预算下，求解器选型本身就是工程决策。' },
      { type: 'figure', src: '/images/blog/mpc-11-qp.webp', caption: 'QP 求解的两类经典方法：有效集法（active set，沿约束组合迭代）与内点法（interior point，更一般、每步代价更高）。' },
      {
        type: 'table',
        headers: ['求解器', '年份', '目标问题', '许可证'],
        rows: [
          ['ACADO Codegen', '2009', 'NMPC', 'LGPL v3'],
          ['qpOASES', '2006', 'QP', 'LGPL v2.1'],
          ['FORCES', '2011', 'QP, QPQP', 'proprietary'],
          ['FORCES NLP', '2017', 'NMPC', 'proprietary'],
          ['OSQP', '2017', 'QP', 'Apache 2.0'],
          ['acados', '2018', 'NMPC', '2-clause BSD'],
        ],
        caption: '常见 MPC 求解器生态：按目标问题类型与许可证对照。',
      },
      {
        type: 'para',
        text: '另有一条把「在线优化」整体搬走的路线：**显式 MPC**。对参数化 QP 离线求解多参数规划（mpQP），由 KKT 条件证明最优控制量是状态的**分段仿射函数** $\\boldsymbol{u} = \\boldsymbol{u}_i^*(\\boldsymbol{x})$，在线只剩区域查找。代价同样直白：区域数量随约束的活跃组合指数增长，存储与查表开销把适用性限制在低维、短视野的问题（图 9）。于是「让 MPC 更快」的清单可以完整列出：降模型阶数、缩视野、减约束、低精度数据表示 —— 以及系统化的显式 MPC。',
      },
      { type: 'figure', src: '/images/blog/mpc-09-explicit.webp', caption: '显式 MPC：分段仿射解把参数空间切成多面体区域，区域数随约束组合指数增长，存储与查找开销随之失控。' },
      { type: 'heading', text: '结语：四个设计决策', en: 'Closing Remarks' },
      {
        type: 'para',
        text: 'MPC 的设计空间可以压缩成四个决策：**模型**（准到什么程度）、**代价**（行为如何加权）、**约束**（硬软如何取舍）、**求解**（毫秒预算怎么花）。它们彼此耦合 —— 模型越准约束越非线性，约束越软代价越复杂，视野越长求解越重。从 LQR 走到 MPC，理论上只是「无约束 → 带约束」一步之遥；工程上则是实时性、数值鲁棒性与行为设计的全面重构。这与上一篇规划笔记合起来，恰好覆盖了「轨迹从哪里来」与「轨迹如何被执行」两个半场。',
      },
      {
        type: 'references',
        items: [
          'F. Borrelli, A. Bemporad, and M. Morari, Predictive Control for Linear and Hybrid Systems. Cambridge University Press, 2017.',
          'A. Liniger, A. Domahidi, and M. Morari, "Optimization-Based Autonomous Racing of 1:43 Scale RC Cars," Optimal Control Applications and Methods, vol. 36, no. 5, 2015.',
          'R. Rajamani, Vehicle Dynamics and Control, 2nd ed. Springer, 2012.',
          'H. J. Ferreau, C. Kirches, A. Potschka, G. Bock, and M. Diehl, "qpOASES: A Parametric Active-Set Algorithm for Quadratic Programming," Mathematical Programming Computation, vol. 6, no. 4, 2014.',
          'R. Verschueren, G. Frison, D. Kouzoupis, et al., "acados: A Modular Open-Source Framework for Fast Embedded Optimal Control," Mathematical Programming Computation, vol. 14, 2022.',
        ],
      },
    ],
  },

  'lateral-control-geometric-to-lqr': {
    blocks: [
      {
        type: 'para',
        text: '横向控制是自动驾驶控制算法里最「经典」的部分：几何方法（Pure Pursuit、Stanley）靠几何关系直接写出转角，最优方法（LQR）靠误差动力学与二次型代价给出全状态反馈，中间隔着一整套建模与稳定性语言。这篇笔记沿着「模型越来越真、反馈越来越全」的谱线走一遍：从运动学自行车模型的手工推导，到动力学模型与参数辨识，再到 LQR 轨迹跟踪与预瞄控制。文中的误差动力学与《MPC 设计空间》笔记里的式 (5) 是同一套模型，两篇笔记互为注脚。',
      },
      { type: 'heading', text: '运动学自行车模型', en: 'Kinematic Bicycle Model' },
      {
        type: 'para',
        text: '一切从四条假设开始：车辆被限制在 X-Y 平面内；左右车轮合并成一个「自行车轮」（轴距 $L = l_f + l_r$）；轮胎无侧滑，速度矢量沿车轮朝向；车身是刚体。前后轮都可转向时，对前后轴与瞬时转向中心构成的两个三角形分别用正弦定理：',
      },
      { type: 'equation', tex: '\\tan(\\delta_f)\\,\\cos\\beta - \\sin\\beta = \\frac{l_f}{R}, \\qquad \\tan(\\delta_r)\\,\\cos\\beta + \\sin\\beta = \\frac{l_r}{R} \\;\\;\\Longrightarrow\\;\\; \\big(\\tan\\delta_f - \\tan\\delta_r\\big)\\cos\\beta = \\frac{L}{R}', note: '两式相加消去 R 得瞬时转向半径；再结合质心处速度的方向投影，即解出滑移角与横摆角速度 —— 式 (1)。' },
      { type: 'equation', tex: '\\beta = \\tan^{-1}\\!\\left( \\frac{l_r \\tan(\\delta_f) + l_f \\tan(\\delta_r)}{l_f + l_r} \\right), \\qquad \\dot\\psi = \\frac{v \\cos(\\beta)}{l_f + l_r} \\left( \\tan(\\delta_f) - \\tan(\\delta_r) \\right)', label: '(1)', note: '后轮不转向（δ_r = 0）时退化为最常见的 κ = tan(δ_f)/L。全局坐标下的位姿更新 Ẋ = v·cos(ψ+β)、Ẏ = v·sin(ψ+β)。' },
      {
        type: 'para',
        text: '模型的适用边界要心里有数：它假设「瞬时转向中心存在」，即左右转向角相同 —— 实际上由于阿克曼几何，内外轮转角差正比于**平均转角平方**；高速或极急转弯时假设崩塌。所以运动学模型的用武之地是低速场景：泊车、掉头、中等转弯，与后续动力学模型的分工泾渭分明。',
      },
      { type: 'heading', text: 'Pure Pursuit：一个圆弧的几何学', en: 'Pure Pursuit' },
      {
        type: 'para',
        text: 'Pure Pursuit 的想法极简：在后轴与路径上**预瞄点**之间画一条圆弧，让车沿着圆弧走。对预瞄点、后轴与圆心构成的三角形再用一次正弦定理，转向角有闭式解：',
      },
      { type: 'equation', tex: '\\delta(t) = \\tan^{-1}\\!\\left( \\frac{2 L \\sin(\\alpha)}{l_d} \\right)', label: '(2)', note: 'l_d 为预瞄距离，α 为预瞄点相对车辆朝向的方位角。一句话点破本质：Pure Pursuit 是作用在横向误差上的比例控制器，预瞄距离在车辆前方、增益为 2/l_d²。' },
      { type: 'figure', src: '/images/blog/lat-pure-pursuit.webp', caption: 'Pure Pursuit 几何：后轴、预瞄点与瞬时圆心构成的三角形，预瞄距离 l_d 与方位角 α 唯一确定转向圆弧。' },
      {
        type: 'para',
        text: '调参的三角权衡是这一节的重点：**短预瞄**跟踪紧但稳定性差（k 过小时会追不上误差的符号翻转）；**长预瞄**平滑但会切弯角。更麻烦的是它对路径不连续性敏感 —— 预瞄点跳过拐角时转角指令突变。这也是后面 Stanley 与 LQR 想修掉的东西。',
      },
      { type: 'heading', text: 'Stanley：航向与横向误差的组合', en: 'The Stanley Method' },
      { type: 'equation', tex: '\\delta(t) = \\theta_e + \\tan^{-1}\\!\\left( \\frac{k\\, e}{v + k_s} \\right), \\qquad \\delta \\in [\\delta_{\\min},\\ \\delta_{\\max}]', label: '(3)', note: 'θ_e 为航向误差项（对齐航向），k·e/v 为横向误差项（消除横向偏差），k_s 为低速软化项防止 1/v 数值发散，限幅模拟饱和转向。' },
      {
        type: 'para',
        text: '误差动态是漂亮的指数收敛：小误差时 $\\dot e = -k\\,e$（相位图上是一条收敛的螺旋线）。直接拿来用还有三个标准补丁：**低速软化**（分母加 $k_s$，20 m/s 以下避免数值发散）；**额外阻尼**（高航向误差下横摆过冲）；**恒定曲率前馈**（进弯时先给航向前馈）。与 Pure Pursuit 相比，Stanley 调参更直观、也不会切弯，且可以被「过调」到特定赛道以追求极限表现 —— 但稳态弯道误差在中等速度下依然存在，因为它没有显式的预瞄能力。',
      },
      { type: 'heading', text: '动力学自行车模型与参数辨识', en: 'Dynamic Bicycle Model' },
      {
        type: 'para',
        text: '速度上来之后，轮胎侧偏再也不能装看不见。动力学模型把侧偏角 $\\alpha_f$、$\\alpha_r$ 与侧向轮胎力的线性关系 $F_{yf} = 2 C_f(\\delta - \\theta_{vf})$、$F_{yr} = 2 C_r(-\\theta_{vr})$ 代入质心的侧向力矩平衡，得到二自由度（$v_y$, $r$）模型 —— 线性化后正是《MPC 设计空间》笔记里的式 (5)，此处不再重复。更有工程味道的是**参数从哪来**：质心位置用力矩平衡从轴荷估计；转动惯量把车身近似成两质点＋无质量杆（$I_z = m_l l_f^2 + m_r l_r^2$）；侧偏刚度则把模型离散成欧拉形式，化为**最小二乘问题**从实车数据回归 —— 模型参数从来不是查表抄来的，是辨识出来的。',
      },
      { type: 'heading', text: 'LQR：最优反馈的解析解', en: 'Linear Quadratic Regulator' },
      {
        type: 'para',
        text: 'LQR 的引入不需要矩阵，只需要一张「通勤方式」的表：$Q$ 是时间、$R$ 是钱，$J = \\int_0^\\infty (x^{\\mathsf T} Q x + u^{\\mathsf T} R u)\\,dt$ 是二者的加权总和，直升机快但贵、自行车慢但免费 —— 最优控制就是在状态误差与控制量之间定一个可调的折中。对 $\\dot x = Ax + Bu$ 取二次型代价，配方法（对 $u = -Kx$ 令被积函数配成完全平方）得到代数 Riccati 方程：',
      },
      { type: 'equation', tex: "A^{\\mathsf T} P + P A + Q - P B R^{-1} B^{\\mathsf T} P = 0, \\qquad K = R^{-1} B^{\\mathsf T} P, \\qquad u = -K x", label: '(4)', note: '反馈增益 K 由 Q、R 唯一决定，且天然带 60° 以上相位裕度 —— LQR 的鲁棒性是「送」的。调参直觉：Q 大 → 状态误差惩罚重 → 响应快；R 大 → 控制量节制 → 响应慢。' },
      { type: 'equation', tex: '\\dot x^{\\mathsf T}\\! P x + x^{\\mathsf T} P \\dot x \\;=\\; -\\,x^{\\mathsf T} Q x - u^{\\mathsf T} R u, \\qquad u = -Kx,\\ \\ \\dot x = (A - BK)\\,x', note: 'CARE 的配方法来路：把闭环代入「代价沿最优轨迹的导数 = 负速率项」，合并同类项、按二次型逐项配平，即得上式。' },
      {
        type: 'para',
        text: '数值实现落在离散时间：采样周期 $\\Delta t$ 下用后向欧拉离散 $A_d \\approx (I - A\\Delta t)^{-1}$（对侧偏刚度带来的刚性动态更稳），代价求和后解差分 Riccati 方程。这套流程与我在 CARLA / ROS 2 里实现的 LQR 横向控制器完全一致 —— 理论与工程实践在这一步合流。',
      },
      { type: 'heading', text: 'LQR 轨迹跟踪：误差动力学的全过程', en: 'Trajectory Tracking with LQR' },
      {
        type: 'para',
        text: '把 LQR 用到轨迹跟踪，关键是写出**路径坐标下的误差动力学**：以参考线为标架，取质心横向误差 $\\epsilon_{cg}$、其变化率、航向误差 $\\psi_e$ 及其变化率四个状态（恒定纵向速度 $v_r$ 假设下线性化）。设计前先做两件容易被跳过的事：**校验能控性**（$[B\\ AB\\ A^2B\\ A^3B]$ 满秩）与**离散化**，然后套全状态反馈：',
      },
      { type: 'equation', tex: '\\delta = -K \\xi = -k_1\\, \\epsilon_{cg} - k_2\\, \\dot\\epsilon_{cg} - k_3\\, \\psi_e - k_4\\, \\dot\\psi_e + \\delta_f', label: '(5)', note: 'ξ = [ε_cg, ε̇_cg, ψ_e, ψ̇_e]ᵀ；δ_f 为曲率前馈项。四个增益就是 Q/R 权衡在四个误差通道上的投影。' },
      { type: 'heading', text: 'Preview Control：给 LQR 一双眼睛', en: 'Trajectory Tracking with Preview Control' },
      {
        type: 'para',
        text: 'LQR 只用「当前」误差，遇到 U 型弯必然手忙脚乱 —— 等误差出现再打方向，已经晚了。预瞄控制的做法是把**未来一段参考路径**增广进状态：$y_N(k+1) = A_N y_N + B_N y_{road}$ 与车辆误差模型串成一个增广系统 $\\bar X = [\\xi;\\ y_{r1},\\ \\dots,\\ y_{rN}]$，再用 QP 把车辆模型与道路模型的代价耦合起来：',
      },
      { type: 'equation', tex: 'J = \\sum_{k=0}^{N} \\bar X(k)^{\\mathsf T} R_1 \\bar X(k) + R_2\\, \\delta^2(k), \\qquad R_1 = C^{\\mathsf T} Q C', label: '(6)', note: 'q₁ 对应横向参考跟踪、q₂ 对应航向参考跟踪；R₂ 惩罚转角。预瞄长度有饱和点：超过曲率变化所需的长度后收益归零。' },
      {
        type: 'para',
        text: '对预瞄控制的定位需要克制：它给 LQR 补上了「看未来」的能力，**性能接近 MPC 而实现简单得多** —— 没有在线求解器、没有约束处理，代价是牺牲了显式约束。这恰好是通向 MPC 的最后一级台阶：先有模型、代价、预瞄，再补上约束，就是模型预测控制。',
      },
      { type: 'heading', text: '横向控制器对比', en: 'Controller Comparison' },
      {
        type: 'para',
        text: '四种横向控制器放在同一张表里（表 1），差异收敛到三个维度：**横向误差表现**、**对参考线的要求**、**鲁棒性与适用场景**。方法没有高下，只有场景匹配 —— 这句总结朴实，但确实是横向控制工程选型的全部逻辑。',
      },
      {
        type: 'table',
        headers: ['控制器', '横向误差表现', '参考线要求', '鲁棒性', '适用场景'],
        rows: [
          ['Pure Pursuit', '高速稳态误差大（过冲）', '无连续性要求', '高', '低速驾驶、不连通路径'],
          ['Stanley', '误差随速度增加而增大', '要求连续参考线', '中', '平滑高速场景'],
          ['LQR', '弯道误差较大、直道优秀', '要求连续参考线', '低', '高速公路驾驶'],
          ['Preview Control', '全程跟踪性能好', '要求连续参考线', '中', '高速公路与城市道路'],
        ],
        caption: '四种横向控制器对照：横向误差、参考线要求、鲁棒性与适用场景。',
      },
      {
        type: 'para',
        text: '横向控制的谱系到此闭环：几何方法给直觉，动力学模型给保真度，LQR 给最优性与稳定性语言，预瞄给未来信息 —— 而约束与在线优化，留给 MPC（见《MPC 设计空间》笔记）。',
      },
      {
        type: 'references',
        items: [
          'R. C. Coulter, "Implementation of the Pure Pursuit Path Tracking Algorithm," CMU-RI-TR-92-01, Robotics Institute, Carnegie Mellon University, 1992.',
          'G. Hoffmann, C. Tomlin, M. Montemerlo, and S. Thrun, "Autonomous Automobile Trajectory Tracking for Off-Road Driving: Controller Design, Experimental Validation and Racing," in Proc. American Control Conference, 2007.',
          'R. Rajamani, Vehicle Dynamics and Control, 2nd ed. Springer, 2012.',
        ],
      },
    ],
  },

  'longitudinal-control-acc-notes': {
    blocks: [
      {
        type: 'para',
        text: '纵向控制常被视为横向控制「附带的」问题，其实它的物理链条更长：从轮胎滑移率到滚动阻力，从油门标定到自适应巡航的车队稳定性，每一环都有自己的动力学。这篇笔记沿「一个定速巡航是怎么做出来的」这条线走完整个纵向链路：纵向受力分析、经典控制与 PID、分层纵向控制器，一直到 ACC 的恒定时间间隙策略。',
      },
      { type: 'heading', text: '纵向受力：阻力从哪里来', en: 'Longitudinal Dynamics' },
      {
        type: 'para',
        text: '纵向控制的第一性问题是：车在纵向上到底受哪些力。前后轮驱/制动力 $F_{xf}, F_{xr}$ 之外，还有三项「敌人」：**气动阻力**随速度平方增长，**坡度重力分量** $mg\\sin\\theta$，以及**滚动阻力**。轮胎能提供多大的力由滑移率决定：',
      },
      { type: 'equation', tex: '\\sigma_x = \\begin{cases} \\dfrac{r_{eff}\\,\\omega_w - v_x}{v_x}, & \\text{驱动（}\\ r_{eff}\\omega_w > v_x\\ \\text{）} \\\\[6pt] \\dfrac{r_{eff}\\,\\omega_w - v_x}{r_{eff}\\,\\omega_w}, & \\text{制动（}\\ r_{eff}\\omega_w < v_x\\ \\text{）} \\end{cases}', label: '(1)', note: '滑移率为零 = 纯滚动；车轮抱死（v_x = 0, ω ≠ 0）或打滑时滑移率失去定义。小滑移区内纵向轮胎力近似线性 F_x ≈ C_σ·σ_x，C_σ 为纵向轮胎刚度。' },
      { type: 'figure', src: '/images/blog/lon-slip.webp', caption: '纵向滑移率：制动时轮速低于车速、驱动时高于车速，两种工况下定义的分母不同；右下为抱死与打滑实拍。' },
      {
        type: 'para',
        text: '气动阻力 $F_{aero} = \\tfrac{1}{2}\\rho C_d A (v_x + v_{wind})^2$ 里风速取带符号（逆风为正）。滚动阻力常被简化成 $R_x + R_{rf} = f(F_{zf} + F_{zr})$，系数 $f \\approx 0.015$（子午线轮胎轿车）；但值得把它推导得更认真（图 2）：把轴荷分配、质心高度 $h$、坡角都写进受力平衡，解出前后轴法向载荷 $F_{zf}, F_{zr}$ 的完整表达 —— 质心越高、减速越猛，前轴载荷转移越大，滚动阻力与制动力的分配随之变化。',
      },
      { type: 'equation', tex: 'm \\ddot x = F_{xf} + F_{xr} - F_{aero} - m g \\sin(\\theta) - R_x', label: '(2)', note: '纵向控制的「被控对象」就这一行：控制的本质是让轮胎力沿这条方程把车速/加速度带到期望值。' },
      { type: 'figure', src: '/images/blog/lon-rolling.webp', caption: '纵向受力示意：驱动/制动力、气动阻力 F_aero、滚动阻力 R_x 与坡度分量在车身上的合成，h_aero 为气动阻力作用高度。' },
      { type: 'heading', text: '经典控制速览：PID 与它的工程修正', en: 'Classical Control & PID' },
      {
        type: 'para',
        text: '纵向控制器的主角仍是 PID。复习一下解析底盘：Laplace 变换（冲激、阶跃、斜坡、指数四件套），从开环传函 $G_{op} = C(s)P(s)$ 走到闭环，再用二阶系统把「欠阻尼振荡、过阻尼迟缓、临界阻尼最优」一次讲清：',
      },
      { type: 'equation', tex: 'G_{cl}(s) = \\frac{G_{op}(s)}{1 + G_{op}(s)}, \\qquad \\frac{C(s)}{R(s)} = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}, \\qquad \\omega_n = \\sqrt{\\tfrac{k}{m}},\\ \\ \\zeta = \\frac{b}{2\\sqrt{mk}}', note: '质量-弹簧-阻尼的二阶标准化：欠阻尼 0<ζ<1 振荡、过阻尼 ζ>1 迟缓，ζ≈0.7 是工程甜点。' },
      {
        type: 'para',
        text: '真正区分「教科书 PID」与「量产 PID」的是**积分饱和**的处理。执行器饱和时积分仍在累积，退饱和需要几百毫秒的「回卷」。三种修正按实现难度排列（图 3）：**设定值限幅**（控制器输出永不触及执行器边界，代价是牺牲一点跟踪）；**Clamping**（饱和时冻结积分，最常用）；**反计算**（back-calculation，按饱和深度的比例回吐积分，等效于限制控制量变化率）。',
      },
      { type: 'figure', src: '/images/blog/lon-antiwindup.webp', caption: '含执行器饱和与 Anti-Windup 回路的 PID 结构：积分按饱和深度受到抑制，控制信号变化率同时被限制。' },
      {
        type: 'para',
        text: '参数整定收尾于 **Ziegler–Nichols 振荡法**：先只留 P，增大 $K_{P}$ 至系统持续等幅振荡，记下临界增益 $K_{P,MAX}$ 与振荡周期 $t_0$；P 控制取 $0.5K_{P,MAX}$，PI 取 $0.45K_{P,MAX}$、$K_I = 1.2K_{P}/t_0$，PID 取 $0.6K_{P,MAX}$、$K_I = K_P/t_0$、$K_D = K_P t_0/8$。粗暴、危险（要逼系统振荡）、但在没有模型时依然好用。',
      },
      { type: 'heading', text: '分层纵向控制：上层 PI + 下层标定', en: 'Two-Level Controller' },
      {
        type: 'para',
        text: '实车上的纵向控制是两层的。**上层控制器**输出期望加速度：由于下层带宽有限，用一阶系统 $P(s) = 1/(\\tau s + 1)$ 建模「加速度指令 → 实际加速度」，PI 控制器在这个 plant 上闭环。**下层控制器**把期望加速度翻译成油门/制动：两条路线，要么建立车辆模型从原理推，要么直接标定油门/制动 MAP —— 工程上几乎总是后者（图 4）。发动机侧还有一个一阶 ODE：净扭矩 $T_{net}$ 由发动机转速 $\\omega_e$ 的一阶动态决定，有效惯量 $J_e = l_e(m r_{eff}^2 + I_e)R^2$ 把整车质量折算到发动机轴上。',
      },
      { type: 'figure', src: '/images/blog/lon-hierarchy.webp', caption: '下层控制器的标定 MAP：加速度指令到油门（throttle）与制动（brake）开度的查表曲面。' },
      { type: 'heading', text: 'ACC：从定速巡航到跟车', en: 'Adaptive Cruise Control' },
      {
        type: 'para',
        text: 'ACC 在巡航之上加入雷达/视觉对前车的量测，输入多出三样：前车速度、相对距离、相对速度。控制律按工况**切换**：无前车或前车远时做**速度控制** $\\dot x_{des} = -k_p(v_{ego} - v_{set})$；有前车且近时做**间距控制** $\\dot x_{des} = -k_p(D_{ref} - D) - k_I \\int (v_{ego} - v_{lead})\\,dt$，两式共享同一组增益骨架（图 5）。',
      },
      { type: 'equation', tex: 'D_{ref} = D_{default} + \\tau_{gap} \\times v_{ego}', label: '(7)', note: '恒定时间间隙策略：期望间距随自车速度线性增长。D_default 为停车站默认间距，τ_gap 为时间间隙（time gap）。' },
      { type: 'figure', src: '/images/blog/lon-acc.webp', caption: 'ACC 的两种工况：速度控制（Goal: V_ego = V_set）与间距控制（Goal: D_rel = D_safe），Safe distance 与 Relative distance 共同决定期望间距。' },
      {
        type: 'para',
        text: '为什么用时间间隙而不是恒定间距？答案是**字队稳定性（string stability）**：车队里如果间距策略不当，前车的速度扰动会沿车队**逐车放大**，第 N 辆车可能完全停下。恒定时间间隙策略可以同时保证单车稳定性（间距误差收敛到零）与字队稳定性（误差不沿车队放大）—— 这是 ACC 标定里最值钱的一条性质。本节小结恰是对这一天的注脚：纵向动力学、经典控制、PID、定速与自适应巡航，一条线走完「从受力分析到量产功能」。',
      },
      {
        type: 'para',
        text: '把这一天压成一句话：**纵向控制是「一条合力方程 + 一套 PID 工程学 + 一个切换律」**。它没有横向控制那样繁多的方法流派，却把执行器、标定与功能安全这些「脏活」暴露得最充分 —— 而这正是它作为入门自动驾驶控制第一课的价值。',
      },
      {
        type: 'references',
        items: [
          'R. Rajamani, Vehicle Dynamics and Control, 2nd ed. Springer, 2012.',
          'J. Y. Wong, Theory of Ground Vehicles, 4th ed. Wiley, 2008.',
          'P. A. Ioannou and C. C. Chien, "Autonomous Intelligent Cruise Control," IEEE Transactions on Vehicular Technology, vol. 42, no. 4, 1993.',
          'K. J. Åström and T. Hägglund, PID Controllers: Theory, Design, and Tuning, 2nd ed. ISA, 1995.',
        ],
      },
    ],
  },

  'decision-making-bt-mdp-il-notes': {
    blocks: [
      {
        type: 'para',
        text: '规控栈里最「玄学」的一层是决策：变道还是跟车、让行还是抢行，规则写不全、模型建不准。把决策层的三种范式摆在一起看最清楚 —— **行为树**（规则派的现代形态）、**MDP/POMDP**（决策问题的概率语言）、**模仿学习**（数据派）。这篇笔记刻意少放公式，重心放在三种范式各自的适用边界与相互的对比上。',
      },
      { type: 'heading', text: '行为树：可维护的规则系统', en: 'Behavior Trees' },
      {
        type: 'para',
        text: '行为树用一棵树组织决策：**叶节点**是可执行行为（Action 做事、Condition 判断），**内部节点**控制遍历（Selector 依次尝试直到一个成功、Sequence 依次执行直到一个失败、Parallel 并行、Decorator 包装重试/取反）。整棵树以固定频率被 **tick**，每个节点向父节点返回 Success / Failure / Running 三态（图 1）。语义简单到可以在代码评审里逐行讨论 —— 这正是它在游戏 AI 与机器人行为层流行的原因。',
      },
      { type: 'figure', src: '/images/blog/dec-bt-terms.webp', caption: '行为树术语：执行节点（Action / Condition）与控制节点（Selector / Sequence / Parallel / Decorator），tick 机制与三态返回。' },
      {
        type: 'para',
        text: '与有限状态机（FSM）的对比是绕不开的一题（图 2）：FSM 的转移边会随状态数**组合爆炸**，「从任一状态回到正常」这类需求要画 $O(n)$ 条边；BT 把「检查来车」做成一个可复用的子树，模块化与可组合性显著更好。公允的结论是：**BT 强在模块化地组合行为，FSM 强在显式地表达反应性**，大型设计里二者常常混用。',
      },
      { type: 'figure', src: '/images/blog/dec-bt-fsm.webp', caption: '行为树 vs 有限状态机：同一「超车」场景的两种表达，红字标注了 FSM 中组合爆炸的转移边。' },
      { type: 'heading', text: '从 Markov 链到 POMDP', en: 'Markov Models' },
      {
        type: 'para',
        text: '概率决策的语言从 **Markov 性质**开始：「下一状态只由当前状态决定」，$P(S_{t+1}|S_t) = P(S_{t+1}|S_1,\\dots,S_t)$。在此基础上按两个正交维度展开（表 1 的四象限一目了然）：**是否控制转移**（不加动作 → Markov 链 / HMM；加动作 → MDP / POMDP）、**状态是否完全可观测**（完全 → 链 / MDP；部分 → HMM / POMDP）。自动驾驶的状态里有他车意图、遮挡目标，天然是 POMDP；但工程上常退化成 MDP 近似求解。',
      },
      {
        type: 'table',
        headers: ['', '状态转移不受控', '状态转移受控'],
        rows: [
          ['状态完全可观测', 'Markov 链（Markov Chain）', 'MDP（马尔可夫决策过程）'],
          ['状态部分可观测', 'HMM（隐马尔可夫模型）', 'POMDP（部分可观测马尔可夫决策过程）'],
        ],
        caption: 'Markov 模型四象限：是否控制状态转移 × 状态是否完全可观测。',
      },
      {
        type: 'para',
        text: '自动驾驶的 MDP 定义为五元组 $(S, A, P, R, \\gamma)$：状态含车道、环境与世界信息；动作含跟车、变道、左转右转与停车。奖励函数是全部难点 —— 要同时编码**到达**（偏离路线受罚）、**安全**（避障）与**舒适**（轨迹平稳）。这里有一句清醒的注脚值得记下：reward 的设计没有系统方法，「工业界并不常用 MDP 做决策，部分原因就在于 reward 与转移函数难以定义」。方法之美与落地之难，隔着一张表。',
      },
      { type: 'heading', text: '模仿学习：向人类司机要策略', en: 'Imitation Learning' },
      {
        type: 'para',
        text: '模仿学习把决策变成监督学习：人类司机的 $(o_t, u_t)$ 对就是标注数据，最直接的形态是行为克隆 —— 经典的 NVIDIA 管线用三路相机图像进 CNN、输出转向角（图 3）。它的死穴是**分布偏移**：策略一旦犯错，之后看到的状态分布是训练数据里没有的，错误会滚雪球。',
      },
      { type: 'figure', src: '/images/blog/dec-il.webp', caption: '模仿学习：行为克隆的监督学习形态 —— 量测相机图像 o_t，拟合专家转向指令 π_g(u_t|o_t)。' },
      {
        type: 'para',
        text: '**DAgger**（Dataset Aggregation）是对症的经典药方：迭代地用当前策略跑真实场景，把**策略自己遇到的状态**交给专家重新标注，再聚合进训练集 —— 让训练分布逼近策略分布。代价也很直白：要执行不安全的半成品策略、要反复打扰专家。模仿学习内部还分两条大路线：**直接法**（监督学 policy，即行为克隆）与**间接法**（学未知的 reward/目标，再由它导出策略，即逆强化学习）—— 后者留给「数据驱动决策」的下一站。',
      },
      { type: 'heading', text: '结语：三条路线的分工', en: 'Closing Remarks' },
      {
        type: 'para',
        text: '规则式决策逻辑清晰、稳定、算力友好、可按层扩展，但行为不连续、规则可能互相打架、长尾场景写不完；学习式决策场景覆盖靠数据、网络化表达天然处理连续性，但不可解释、难以在线修正、性能受数据质量牵制。三种范式在同一辆车上其实是**分层共存**的：行为树管结构化的正常流程，MDP/POMDP 给交互场景提供推理语言，模仿学习在数据充足的动作模式上做拟合。决策层的工程现状，是「知道每种方法的边界」比「押注某一种方法」重要得多。',
      },
      {
        type: 'references',
        items: [
          'M. Colledanchise and P. Ögren, Behavior Trees in Robotics and AI. CRC Press, 2018.',
          'S. Ross, G. J. Gordon, and J. A. Bagnell, "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning," in Proc. AISTATS, 2011.',
          'M. L. Puterman, Markov Decision Processes: Discrete Stochastic Dynamic Programming. Wiley, 1994.',
        ],
      },
    ],
  },

  'route-planning-dijkstra-astar-notes': {
    blocks: [
      {
        type: 'para',
        text: '已有的运动规划笔记（采样式方法与 Lattice）讲的是局部规划：在参考线附近找一条能开的轨迹。这篇笔记补上更上游的一层 —— **全局 / 任务级路径规划**：在车道拓扑图上找到一条从起点到终点的「路」。主线是四段：任务规划的栈内定位、Dijkstra 与 A* 的逐步图解、车道级代价的设计，以及把一套 ROS routing 实现真正跑起来的实验记录。',
      },
      { type: 'heading', text: '任务规划在栈中的位置', en: 'Mission Planning' },
      {
        type: 'para',
        text: '任务规划回答「走哪条路」：输入起点、终点与车道图（lane graph），输出一条由车道段组成的有向序列，交给行为决策与局部规划。常用工具与局部规划共享 —— 图搜索（Dijkstra、A* 等）—— 但图的对象从连续空间变成了**车道段与连接器**（图 1）。设计的三个关键点：图的边/节点怎么定义（按 lane/connector 而不是路口）、代价函数怎么设计（惩罚变道、转向、窄道）、下游接口给什么（中间目标点，还是代价值）。',
      },
      { type: 'figure', src: '/images/blog/route-mission.webp', caption: '任务规划的功能定位：起点、目标、车道图经代价函数进入路由搜索，输出车道段序列。' },
      { type: 'heading', text: 'Dijkstra：单源最短路', en: 'Dijkstra' },
      {
        type: 'para',
        text: 'Dijkstra 维护每个顶点的当前最短距离估计 $d[v]$（初始 $d[s] = 0$、其余 $\\infty$）与一个「已确定」标记集；每轮选未标记顶点中 $d[\\cdot]$ 最小者，对其所有边做**松弛**：',
      },
      { type: 'equation', tex: 'd[v] \\leftarrow \\min\\{\\, d[v],\\ d[u] + w(u, v) \\,\\}', label: '(1)', note: 'n 轮迭代后所有顶点的 d[·] 即为从 s 出发的最短路。朴素实现每轮线性扫最小值，复杂度 O(n²)；稀疏图上用优先队列得 O((n + m)·log n)。' },
      { type: 'heading', text: 'A*：给搜索一个方向感', en: 'A* Search' },
      {
        type: 'para',
        text: 'Dijkstra 向所有方向均匀扩张，浪费在「离终点反方向」的顶点上。A* 给每个节点加一个启发式估计，按 $f(n) = g(n) + h(n)$ 排序扩张 —— $g$ 是已走代价，$h$ 是到终点的乐观估计。网格地图上最常用的 $h$ 是曼哈顿距离（图 2）：$h = |dx| + |dy|$。只要 $h$ **可采纳**（admissible，从不高估真实代价），A* 找到的就是最优解；$h$ 越接近真值，扩张的节点越少。',
      },
      { type: 'equation', tex: 'f(n) = g(n) + h(n), \\qquad 0 \\le h(n) \\le h^*(n)', label: '(2)', note: 'h*(n) 为真实剩余代价。open 表用优先队列实现；close 表记录已扩张节点。A* 一定会找到解（若存在），且不必访问全部顶点。' },
      { type: 'figure', src: '/images/blog/route-astar-heur.webp', caption: '曼哈顿距离启发下的网格搜索：颜色越浅代价估计越低，搜索沿 h 的指引直奔目标。' },
      { type: 'figure', src: '/images/blog/route-astar-example.webp', caption: '带权网格上的 A* 扩张：从起点出发按 f = g + h 的优先级逐节点逼近目标（红字为 open/close 集合标注）。' },
      { type: 'heading', text: '车道级拓扑图与代价设计', en: 'Topo Map & Lane Graph Cost' },
      {
        type: 'para',
        text: '落到自动驾驶的地图上，A* 搜的图来自**高精地图 → 拓扑地图**的转换：把车道中心线抽成节点与边，先在拓扑图上定位起终点，再做全局搜索。有意思的是代价函数的设计空间（表 1）：直行后接右转代价 5、直行后接左转 8、单纯的右转/左转机动只给 2 / 3、保持在原车道 1、**变道高达 10** —— 每一条都是一个「驾驶常识」的数值化。启发式距离一变，最终路径就可能不同：代价设计即行为设计，在任务层已经成立。',
      },
      {
        type: 'table',
        headers: ['机动（Maneuver）', '代价'],
        rows: [
          ['直行后接右转', '5'],
          ['直行后接左转', '8'],
          ['右转机动', '2'],
          ['左转机动', '3'],
          ['保持原车道', '1'],
          ['变道', '10'],
        ],
        caption: '车道图的机动代价表：转向、保持车道与变道的代价值。',
      },
      { type: 'heading', text: '跑起来：一次 routing 实验', en: 'Hands-on' },
      {
        type: 'para',
        text: '把一套 ROS routing 实现跑了一遍：RViz 里订阅全局规划的可视化话题，绿色高亮即为在车道拓扑图上搜出的全局路径（图 4）。算法从纸面上的表格走到 ROS 话题，中间隔着的正是拓扑图构建与代价值标定这些工程细节 —— 这段实验的价值不在算法本身（A* 五分钟就能写出来），而在确认「图」的来源与语义。',
      },
      { type: 'figure', src: '/images/blog/route-rviz.webp', caption: 'routing 实验的运行记录：RViz 中高亮路径为车道拓扑图上的全局搜索结果。' },
      { type: 'heading', text: '结语', en: 'Closing Remarks' },
      {
        type: 'para',
        text: '任务级规划的算法内核（Dijkstra / A*）半小时就能学会，真正的复杂度藏在图里：拓扑怎么抽、代价怎么标、和行为决策的接口给什么。与局部规划笔记对照着看，规划栈的分工是 —— **任务层找「路」，局部层找「轨迹」**：前者在离散车道图上用图搜索，后者在连续空间里用采样或参数化曲线族；前者输出一条语义序列，后者输出一条时变的运动轨迹。两层之间以「参考线 + 代价」交接，恰好是 Lattice 与 MPC 各自的输入。',
      },
      {
        type: 'references',
        items: [
          'E. W. Dijkstra, "A Note on Two Problems in Connexion with Graphs," Numerische Mathematik, vol. 1, 1959.',
          'P. E. Hart, N. J. Nilsson, and B. Raphael, "A Formal Basis for the Heuristic Determination of Minimum Cost Paths," IEEE Transactions on Systems Science and Cybernetics, vol. 4, no. 2, 1968.',
        ],
      },
    ],
  },

  'numerical-optimization-unconstrained-notes': {
    blocks: [
      {
        type: 'para',
        text: '规控栈里所有「最优」二字 —— LQR、MPC、曲率平滑、标定回归 —— 最后都落到同一件事：解一个优化问题。这篇笔记把无约束优化的主干完整过一遍：从凸性语言、梯度下降、线搜索，一路到 BFGS / L-BFGS 与牛顿 - 共轭梯度，最后落在一个规划应用上。行文按「问题 → 一阶方法 → 二阶与拟牛顿 → 无 Hessian 的规模化 → 一个规划应用」组织。',
      },
      { type: 'heading', text: '优化问题与机器人中的应用版图', en: 'Optimization in Robotics' },
      { type: 'equation', tex: '\\min_{x \\in \\mathbb{R}^n} f(x) \\quad \\text{s.t.} \\quad g(x) \\le 0, \\quad h(x) = 0', label: '(1)', note: 'f 为目标函数，g、h 分别为不等式/等式约束；最优解 x* 是满足约束的向量中 f 最小者。' },
      {
        type: 'para',
        text: '机器人领域几乎是「优化方法的应用博物馆」（图 1）：建图与平滑是**非线性最小二乘**，配准是**半定规划**，轨迹规划是**非线性规划**，时间最优参数化是**二阶锥规划**。这块知识天然分两线展开 —— 先立凸性的语言，再处理非凸世界的局部方法。',
      },
      { type: 'figure', src: '/images/blog/opt-applications.webp', caption: '优化在机器人中的应用版图：NLS 建图、SDP 配准、NLP 轨迹规划、SOCP 时间最优参数化，红字标注了各章对应关系。' },
      { type: 'heading', text: '凸性的语言', en: 'Convex Sets & Functions' },
      {
        type: 'para',
        text: '凸集的定义是组合封闭：$\\theta x_1 + (1-\\theta) x_2 \\in C$ 对任意 $\\theta \\in [0,1]$ 成立；凸包是集合的最小凸超集。重要的凸集一族是**锥**：二阶锥 $C_2 = \\{(x,t) : \\|x\\| \\le t\\}$、半定锥（PSD 矩阵全体），以及它们的仿射组合（图 2）。凸函数则用**上图（epigraph）**刻画 —— 凸函数等价于凸上图；它带来一条决定性性质：**任何极小值都是全局极小**，一阶条件 $\\nabla f(x) = 0$ 即最优性（图 3）。',
      },
      { type: 'figure', src: '/images/blog/opt-cones.webp', caption: '二阶锥 $C_2 = \\{(x,t) : \\|x\\| \\le t\\}$ 的几何：锥对非负缩放封闭（红字批注的推导）。' },
      { type: 'equation', tex: 'f(y) \\ge f(x) + \\nabla f(x)^{\\mathsf T}(y - x) \\quad \\forall x, y, \\qquad \\nabla^2 f(x) \\succeq m I \\ \\Rightarrow\\ f(y) \\ge f(x) + \\nabla f(x)^{\\mathsf T}(y-x) + \\tfrac{m}{2}\\|y-x\\|^2', label: '(2)', note: '一阶条件（下界切线）与强凸性（切线下方再加曲率项）。强凸保证条件数有界，是收敛速度分析的基石。' },
      { type: 'figure', src: '/images/blog/opt-first-order.webp', caption: '非凸函数的极值地形：局部极大、局部极小与鞍点共存 —— 凸世界里「任何极小值都是全局极小」。' },
      {
        type: 'para',
        text: '非光滑情形下梯度换成**次微分** $\\partial f(x) = \\{g : f(y) > f(x) + (y-x)^{\\mathsf T} g, \\forall y\\}$，最优性条件写成 $0 \\in \\partial f(x^*)$（图 4）。一个反直觉的细节：负次梯度方向**不一定**是下降方向，最速下降要取负次微分中范数最小的那个。',
      },
      { type: 'figure', src: '/images/blog/opt-subdiff.webp', caption: '次微分与切线：不可导点处的支撑切线族，切线斜率的取值范围即次微分。' },
      { type: 'heading', text: '梯度下降与线搜索', en: 'Gradient Descent & Line Search' },
      { type: 'equation', tex: 'x^{k+1} = x^k + \\tau d^k, \\qquad d^k = -\\nabla f(x^k), \\qquad f(x^k) - f(x^k + \\tau d^k) \\ge -c\\, \\tau\\, \\nabla f(x^k)^{\\mathsf T} d^k', label: '(3)', note: 'Armijo 条件（充分下降）：步长要足够大以取得进展、又不能过大越过谷底。回溯法（backtracking）从 τ=1 开始反复折半直至满足，实现只有几行。' },
      {
        type: 'para',
        text: '步长策略按「智能程度」排列：常数步长（不智能）、递减步长（$\\tau = c/k$，Robbins–Monro，适合随机/昂贵函数）、精确线搜索（一维最小化，通常不划算）、非精确线搜索（Armijo / Wolfe，工程默认）。梯度下降的死穴是**病态**（ill-conditioning）：等高线越扁，锯齿越严重 —— 曲率信息正是为此而生（图 5）。',
      },
      { type: 'figure', src: '/images/blog/opt-armijo.webp', caption: '回溯线搜索的几何：步长 τ 的可行区间由函数值下降量与切线斜率共同界定（Armijo 充分下降条件）。' },
      { type: 'heading', text: '牛顿法与它的实用化', en: 'Newton\'s Method' },
      {
        type: 'para',
        text: '牛顿法用二阶泰勒展开替代一阶：最小化二次近似 $f(x) + \\nabla f(x)^{\\mathsf T}(z - x) + \\tfrac{1}{2}(z-x)^{\\mathsf T} \\nabla^2 f(x)(z-x)$，得到牛顿步 $x^{+} = x - [\\nabla^2 f(x)]^{-1} \\nabla f(x)$ —— 对二次函数一步到位。实用化要处理三件事：Hessian 不正定时的修正（$M = \\nabla^2 f + \\epsilon I$ 或 Bunch–Kaufman 分解，保持下降方向）、线性方程组用 **Cholesky 分解**代替求逆、以及全局化（外层套 Armijo 线搜索）。检验理解最好的办法是把 Armijo 梯度下降扔到 Rosenbrock 函数上跑一遍 —— 香蕉谷就是给「病态」准备的教科书案例。',
      },
      { type: 'heading', text: '拟牛顿：不要 Hessian，要曲率的感觉', en: 'Quasi-Newton & BFGS' },
      {
        type: 'para',
        text: 'Hessian 的代价是三重的：混合偏导 $O(N^2)$、线性求解 $O(N^3)$，且非凸时不定 Hessian 会给出上升步。拟牛顿的思路是**从梯度差里恢复曲率**：要求近似矩阵满足割线条件 $B\\,\\Delta x = \\Delta g$（$\\Delta x = x^{k+1}-x^k$，$\\Delta g = \\nabla f(x^{k+1}) - \\nabla f(x^k)$），在满足割线条件的矩阵中取与 $B^k$ 最近者（凸 + 尺度不变的最小化），闭式解即 **BFGS 更新**（式 4）：',
      },
      { type: 'equation', tex: 'B^{k+1} = \\left( I - \\frac{\\Delta x \\Delta g^{\\mathsf T}}{\\Delta g^{\\mathsf T} \\Delta x} \\right) B^k \\left( I - \\frac{\\Delta g \\Delta x^{\\mathsf T}}{\\Delta g^{\\mathsf T} \\Delta x} \\right) + \\frac{\\Delta g \\Delta g^{\\mathsf T}}{\\Delta g^{\\mathsf T} \\Delta x}', label: '(4)', note: 'BFGS 更新保持正定性的充分条件是 ΔgᵀΔx > 0 —— 这正是线搜索要用（强）Wolfe 条件的原因：充分下降 + 曲率条件。' },
      {
        type: 'para',
        text: '两个工程注记值得单独记录：其一，Wolfe 条件也**不能保证** BFGS 全局收敛，非凸光滑问题上要用谨慎更新（cautious update，Li & Fukushima 2001）加温和条件；其二，非光滑函数上 L-BFGS **实践上可用**（Lewis & Overton 2013），条件是把线搜索退化为弱 Wolfe + 插值 —— 理论与工程在此各让一步。',
      },
      { type: 'heading', text: 'L-BFGS 与无 Hessian 的规模化', en: 'L-BFGS, CG & Newton-CG' },
      {
        type: 'para',
        text: 'BFGS 存 $B^k$ 需要 $O(n^2)$ 内存，大问题存不起。**L-BFGS** 的洞察：$x^{k}$ 处的曲率信息只有最近 $m$ 对 $(s^i, y^i)$ 有用 —— 不显式存矩阵，用**两循环递归**（two-loop recursion）直接算出搜索方向：先用最近 $m$ 对 $(y^i, s^i)$ 从后往前遍历累加，再用 $(s^i, y^i)$ 从前往后遍历缩放，两趟循环即得等价于 $B^{-1}g$ 的搜索方向，每迭代只花 $O(mn)$。它几乎是光滑非凸大规模问题的默认首选：每迭代开销与梯度法同阶，收敛却接近拟牛顿。',
      },
      {
        type: 'para',
        text: '另一条无 Hessian 路线是 **Newton-CG**：用 Hessian-向量积 $\\nabla^2 f \\cdot v \\approx [\\nabla f(x+\\delta v) - \\nabla f(x)]/\\delta$ 作接口，把牛顿方程 $\\nabla^2 f\\, d = -\\nabla f$ 交给共轭梯度法解 —— CG 只需要「矩阵乘向量」，且对二次函数至多 n 步精确收敛；遇到负曲率方向就**截断**（truncated CG）。方法谱系上（便宜 → 昂贵）：GD → 加速法 → CG → 拟牛顿 → Newton-CG → 牛顿法，工程甜点区在后三者。',
      },
      { type: 'heading', text: '回到规划：平滑一条 RRT* 路径', en: 'Application: Smooth Path Generation' },
      {
        type: 'para',
        text: '收尾的应用恰好把优化与上一篇规划笔记接上了：RRT*-类规划器输出的路径低维高效但不光滑，直接给控制器会暴露曲率不连续。做法是**三次样条（最小拉伸能量）参数化**：每段 $p_i(s) = a_i + b_i s + c_i s^2 + d_i s^3$，$C^2$ 连续 + 静止边界条件给出三弯矩方程，所有系数由路径点唯一决定；于是能量 $\\sum_i \\int \\|p_i^{(2)}(s)\\|^2 ds$ 成为路径点的函数，再加障碍势场，整个「平滑 + 避障」就是一个**无约束最小化**（图 6）—— 非光滑的初始路径恰好是现成的初值。无约束优化在规控栈里无处不在，这是一个最好的注脚。',
      },
      { type: 'figure', src: '/images/blog/opt-smooth-path.webp', caption: '三次样条参数化的平滑路径：RRT* 输出的初始折线经最小拉伸能量样条与障碍势场完成避障平滑。' },
      {
        type: 'references',
        items: [
          'J. Nocedal and S. J. Wright, Numerical Optimization, 2nd ed. Springer, 2006.',
          'S. Boyd and L. Vandenberghe, Convex Optimization. Cambridge University Press, 2004.',
          'D. C. Liu and J. Nocedal, "On the Limited Memory BFGS Method for Large Scale Optimization," Mathematical Programming, vol. 45, 1989.',
          'A. S. Lewis and M. L. Overton, "Nonsmooth Optimization via Quasi-Newton Methods," Mathematical Programming, vol. 141, 2013.',
        ],
      },
    ],
  },

  'constrained-optimization-kkt-alm-notes': {
    blocks: [
      {
        type: 'para',
        text: '约束是优化的常态：MPC 的物理限幅、控制分配的执行器边界、碰撞距离的非负性，都是约束。这篇笔记是无约束优化笔记的续篇，把约束优化的主干过一遍：约束问题的分类与复杂度、KKT 条件、罚函数与障碍函数、拉格朗日对偶与增广拉格朗日，最后以三个机器人应用收尾。行文按「语言 → 条件 → 算法 → 应用 → 更一般的问题类」组织。',
      },
      { type: 'heading', text: '约束问题的分类与复杂度', en: 'Category & Complexity' },
      {
        type: 'para',
        text: '约束问题按「凸性 + 约束形态」分类，嵌套关系是 $\\text{LP} \\subset \\text{QP} \\subset \\text{SOCP} \\subset \\text{SDP}$（图 1）：线性规划、二次规划、二阶锥规划、半定规划，一类比一类的约束锥更一般。多项式时间**内点法（IPM）**给凸问题统一了最坏复杂度（LP 约 $O((m+n)^{1.5} n^2 L)$，约束数、维数与位长的多项式），且 Mosesk、Gurobi 等实现成熟 —— 「凸」的含金量正在于此。另一组对比是**精确算法**（单纯形类，有限步最优）与**近似算法**（IPM 类，任意精度渐进）的取舍。',
      },
      { type: 'figure', src: '/images/blog/opt-family.webp', caption: 'LP / SOCP / SDP 的可行域锥：从多面体到二阶锥与半定锥，约束锥逐级一般化。' },
      { type: 'heading', text: 'KKT 条件：最优性在约束下的形态', en: 'KKT Conditions' },
      {
        type: 'para',
        text: '无约束时最优性是 $\\nabla f = 0$；有约束时它推广为 **KKT 条件**四件套：定常（stationarity，$0 \\in \\partial f + \\sum u_i \\partial h_i + \\sum v_j \\partial g_j$）、互补松弛（$u_i h_i = 0$）、原始可行、对偶可行（$u_i \\ge 0$）。几何解释最直观（图 2）：最优点处目标函数的下降方向必须落在所有**积极约束**的法锥之内，无路可走即最优。凸且非退化时 KKT 是充要条件 —— 这是它比「逐点验证」值钱的地方。',
      },
      { type: 'figure', src: '/images/blog/opt-kkt.webp', caption: 'KKT 条件的几何解释：最优点处目标等高线与积极约束的法锥相切 —— 目标函数的下降方向在可行域内无路可走。' },
      { type: 'heading', text: '罚函数与障碍函数', en: 'Penalty & Barrier Methods' },
      {
        type: 'para',
        text: '把约束「卖」进目标函数是最直接的思路。$L_2$ 罚函数 $P_2(x;\\sigma) = f(x) + \\tfrac{\\sigma}{2}\\sum_i c_i^2(x)$ 光滑但**不精确** —— 最优解随 $\\sigma \\to \\infty$ 才逼近真解；$L_1$ 罚 $P_1(x;\\sigma) = f(x) + \\sigma \\sum_i \\max(c_i(x), 0)$ 有限 $\\sigma$ 即可精确，但不可微。**障碍函数**（对数障碍 $-\\sum \\ln(-c_i)$、逆障碍、指数障碍）从可行域内部推着走，天然适配内点法。它们的共同敌人是**病态**：罚权重/障碍参数增大时 Hessian 的条件数爆炸（图 3）—— Newton 步会失灵，必须靠 Warm-start 与参数序列（primal interior point method 的动机）。',
      },
      { type: 'figure', src: '/images/blog/opt-barrier.webp', caption: '罚/障碍函数的病态性：曲率随权重无界增长，右侧标注了内点法「参数序列 + Newton」的应对。' },
      { type: 'heading', text: '拉格朗日对偶、Uzawa 与增广拉格朗日', en: 'Lagrangian Relaxation & ALM' },
      {
        type: 'para',
        text: '对偶视角把「min f 满足约束」改写成鞍点问题 $\\min_x \\max_\\lambda \\mathcal{L}(x, \\lambda)$：拉格朗日函数 $\\mathcal{L} = f + \\lambda^{\\mathsf T}(Ax - b)$ 把约束加权进目标。**Uzawa 方法**固定乘子方向做对偶上升 —— 计算对偶函数的梯度（即约束违反量）再更新 $\\lambda$（图 4）；von Neumann 极小极大定理保证凸连续问题下顺序可交换，但 Uzawa 的缺点同样明显：要求原始问题凸、拉格朗日对原始变量强凸、对偶步长要调、收敛速度不满意。',
      },
      {
        type: 'para',
        text: '**PHR 增广拉格朗日方法（ALM）**把罚项加进拉格朗日：$\\mathcal{L}_\\rho(x,\\lambda) = f(x) + \\lambda^{\\mathsf T}h + \\tfrac{\\rho}{2}\\|h\\|^2$。神奇之处在于：对固定的 $\\lambda$，内层 $\\min_x \\mathcal{L}_\\rho$ 的解在 $\\rho$ 足够大时**精确**恢复原问题最优解 —— 即便原问题非凸！外层只需朴素的交替：',
      },
      { type: 'equation', tex: 'x^{k+1} \\;\\approx\\; \\arg\\min_x \\; \\mathcal{L}_\\rho\\!\\left(x, \\lambda^k\\right), \\qquad \\lambda^{k+1} = \\lambda^k + \\rho\\, h\\!\\left(x^{k+1}\\right)', note: '「原始下降 + 对偶上升」交替；ρ 可取非降正序列，内层不精确求解亦可 —— 这组性质让 ALM 成为 OSQP 等求解器的数学骨架，也是 MPC 约束求解背后最常用的一块积木。' },
      { type: 'heading', text: '三个机器人应用', en: 'Three Applications' },
      {
        type: 'para',
        text: '三个应用把前面的工具逐一落位。**控制分配**（图 4）：过驱动系统（四旋翼 N 个转子只欠 4 个自由度）需要把期望推力/力矩分配到转子转速 —— 以转速增量为决策变量，最小化误差与转速跳变、带执行器限幅，恰好构成一个**严格凸低维 QP**，用低维精确算法可在**线性时间**内解出，嵌入式实时性无忧。**碰撞距离计算**（图 5）：机器人到多面体障碍的碰撞向量，利用凸包的支撑超平面性质，把「最小化碰撞向量长度 / 最大化分离超平面法向」写成两组互为对偶的**低维 QP**，不可行即碰撞。**非线性 MPC**（图 6）：同时控制纵向加速度与转向角跟踪参考轨迹 —— 时变参考、状态与输入约束、非凸目标，一个标准的 NMPC，正是优化方法与规控工程的交汇点。',
      },
      { type: 'figure', src: '/images/blog/opt-ca.webp', caption: '控制分配问题：四旋翼的推力/力矩分配写成严格凸低维 QP，增量决策变量 + 执行器限幅，可线性时间精确求解。' },
      { type: 'figure', src: '/images/blog/opt-collision.webp', caption: '碰撞距离的几何：机器人点 x 到多面体的碰撞向量 y 沿支撑超平面法向，最小化其长度等价于一组低维 QP。' },
      { type: 'figure', src: '/images/blog/opt-nmpc.webp', caption: '非线性 MPC 的车辆案例：纵向加速度与转向角同时跟踪时变参考轨迹（离散化后的状态与输入序列）。' },
      { type: 'heading', text: '锥优化一瞥', en: 'A Glimpse of Conic Optimization' },
      {
        type: 'para',
        text: '最后把「约束锥」推广到一般形态：LP/QP/SOCP/SDP 的约束区域都是**对称锥** —— 正象限（平方锥）、二阶锥、半定锥，三者统一起源于欧若若代数（Euclidean Jordan algebra）的「平方」运算；对称锥自对偶（$K = K^*$），二阶锥可以写成半定表示（Schur 补），许多鲁棒 LP/SOCP 天然落在这一框架（图 7）。锥规划是这一主题的续章 —— 对规控工程师而言，先把 LP/QP/SOCP 用熟，SDP 属于「知道存在、用时再学」的储备。',
      },
      { type: 'figure', src: '/images/blog/opt-symmetric-cone.webp', caption: '锥的几何：椭圆锥的切片、非负正象限的仿射变换，以及对称锥「平方锥」的统一视角。' },
      {
        type: 'para',
        text: '两篇优化笔记合起来，覆盖了规控工程师真正会用到的优化版图：无约束的梯度法 / 拟牛顿 / L-BFGS 负责拟合与平滑，约束的 KKT / ALM / 低维 QP 负责决策与分配。回头看《MPC 设计空间》里的求解器表，每一条产品名录背后都是这里的一个数学对象。',
      },
      {
        type: 'references',
        items: [
          'J. Nocedal and S. J. Wright, Numerical Optimization, 2nd ed. Springer, 2006.',
          'S. Boyd and L. Vandenberghe, Convex Optimization. Cambridge University Press, 2004.',
          'A. Nemirovski, "Advances in Convex Optimization: Conic Programming," in Proc. International Congress of Mathematicians, 2006.',
          'R. T. Rockafellar, "A Dual Approach to Solving Nonlinear Programming Problems by Unconstrained Optimization," Mathematical Programming, vol. 5, 1973.',
        ],
      },
    ],
  },
};
