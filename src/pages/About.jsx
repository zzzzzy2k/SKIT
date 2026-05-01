import { Link } from 'react-router-dom'

const features = [
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="4" />
        <circle cx="8" cy="8" r="1.5" fill="currentColor" />
        <circle cx="16" cy="8" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="8" cy="16" r="1.5" fill="currentColor" />
        <circle cx="16" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: '随机推荐',
    desc: '不知道吃什么？一键帮你从菜谱库里随机挑一道，选择困难症的救星。',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <path d="M8 11h6" />
      </svg>
    ),
    title: '食材筛选',
    desc: '冰箱里有什么就勾什么，系统会自动匹配能做的菜。支持多食材混合筛选。',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: '难度标识',
    desc: '每道菜都有难度评级，新手可以从简单的开始，逐步挑战高难度菜式。',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: '人数缩放',
    desc: '一个人吃还是请朋友聚餐？调整人数后食材用量自动按比例计算。',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    title: '收藏夹',
    desc: '遇到喜欢的菜谱随手收藏，下次直接从收藏夹里找，不用再翻。',
  },
  {
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
    title: '购物清单',
    desc: '确定要做什么之后，一键生成带数量的购物清单，复制后直接去采购。',
  },
]

const faqs = [
  {
    q: '菜谱数据从哪来？',
    a: '所有菜谱来自开源项目 HowToCook，由社区贡献的家常菜做法，经过结构化解析后展示。',
  },
  {
    q: '食材用量准确吗？',
    a: '用量来自原菜谱的标注数据。约 60% 的食材有精确数量，其余显示为「适量」。调整人数后会自动缩放。',
  },
  {
    q: '收藏的数据会丢失吗？',
    a: '收藏数据保存在浏览器的 localStorage 中，清除浏览器数据会导致丢失。后续会考虑支持云端同步。',
  },
  {
    q: '可以自己添加菜谱吗？',
    a: '目前不支持。如需贡献新菜谱，请前往 HowToCook 仓库提交 PR，本项目会定期同步更新。',
  },
]

function InfoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

export default function About() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3" />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-warm-800 mb-2">关于食刻</h1>
        <p className="text-warm-500 max-w-md mx-auto">
          一个帮你解决「今天吃什么」的小工具，从 358 道家常菜里找到你此刻最想做的那一道。
        </p>
      </div>

      {/* Features */}
      <section>
        <h2 className="font-display text-lg font-semibold text-warm-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary-400 rounded-full" />
          功能介绍
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-4 flex gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-500 flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <h3 className="font-semibold text-warm-700 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-warm-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section>
        <h2 className="font-display text-lg font-semibold text-warm-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-olive-400 rounded-full" />
          使用方法
        </h2>
        <div className="glass-card rounded-xl p-5 space-y-4">
          {[
            { step: '1', text: '在首页勾选你冰箱里已有的食材，或直接点击「随机推荐」' },
            { step: '2', text: '浏览菜谱列表，点击感兴趣的菜谱卡片查看详情' },
            { step: '3', text: '根据用餐人数调整份量，食材用量会自动计算' },
            { step: '4', text: '点击「生成购物清单」，复制后去超市采购缺少的食材' },
            { step: '5', text: '遇到喜欢的菜谱点个收藏，下次直接从收藏夹里找' },
          ].map(({ step, text }) => (
            <div key={step} className="flex gap-3">
              <span className="w-7 h-7 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {step}
              </span>
              <p className="text-sm text-warm-600 leading-relaxed pt-0.5">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="font-display text-lg font-semibold text-warm-700 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-accent-400 rounded-full" />
          常见问题
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="glass-card rounded-xl overflow-hidden group" open={i === 0}>
              <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-warm-700 flex items-center justify-between hover:bg-warm-50/50 transition-colors">
                <span>{faq.q}</span>
                <svg className="w-4 h-4 text-warm-400 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <div className="px-4 pb-3 text-sm text-warm-500 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Data source */}
      <section className="glass-card rounded-xl p-5 flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-warm-600 leading-relaxed">
          <p className="mb-2">
            菜谱数据来自开源项目{' '}
            <a href="https://github.com/Anduin2017/HowToCook" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline font-medium">
              HowToCook
            </a>
            ，遵循 MIT 许可证。如需贡献新菜谱，请直接向原仓库提交 PR。
          </p>
          <p>
            本项目同样采用 MIT 许可证，{' '}
            <Link to="/" className="text-primary-600 hover:underline font-medium">
              返回首页
            </Link>
            {' '}开始探索吧！
          </p>
        </div>
      </section>
    </div>
  )
}
