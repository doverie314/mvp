import { motion } from 'framer-motion';
import { ArrowRight, Brain, GitBranch, Users, Zap, ChevronRight, Star } from 'lucide-react';

interface LandingPageProps {
  onStartDemo: () => void;
}

const features = [
  {
    icon: <Brain size={22} className="text-indigo-400" />,
    title: 'ИИ-структуризация',
    desc: 'Нейросеть автоматически выделяет тезисы, аргументы, контраргументы и выводы из живого диалога',
    color: 'from-indigo-500/10 to-indigo-500/5',
    border: 'border-indigo-500/20',
  },
  {
    icon: <GitBranch size={22} className="text-emerald-400" />,
    title: 'Дерево рассуждений',
    desc: 'Каждая мысль становится узлом интерактивного дерева. Разворачивайте, сворачивайте, прослеживайте цепочки логики',
    color: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/20',
  },
  {
    icon: <Users size={22} className="text-rose-400" />,
    title: 'Командная полемика',
    desc: 'До 20 участников в реальном времени: CEO, эксперты, критики — каждый видит структуру дискуссии',
    color: 'from-rose-500/10 to-rose-500/5',
    border: 'border-rose-500/20',
  },
  {
    icon: <Zap size={22} className="text-amber-400" />,
    title: 'Бизнес-применения',
    desc: 'Стратегические сессии, разбор гипотез, due diligence, брейнштормы, юридические дебаты',
    color: 'from-amber-500/10 to-amber-500/5',
    border: 'border-amber-500/20',
  },
];

const usecases = [
  { emoji: '🏢', title: 'Стратегические сессии', desc: 'Структурируйте обсуждение стратегии компании' },
  { emoji: '⚖️', title: 'Юридические дебаты', desc: 'Карта аргументов и прецедентов' },
  { emoji: '🔬', title: 'Научные дискуссии', desc: 'Связи между гипотезами и данными' },
  { emoji: '💼', title: 'Переговоры', desc: 'Отслеживайте позиции и уступки сторон' },
  { emoji: '🎓', title: 'Образование', desc: 'Сократовский диалог с визуализацией' },
  { emoji: '🚀', title: 'Продуктовые решения', desc: 'Обоснование фич и приоритетов' },
];

const nodeTypes = [
  { type: 'Тезис', icon: '💡', color: 'bg-indigo-600', desc: 'Основное утверждение' },
  { type: 'Аргумент', icon: '✅', color: 'bg-emerald-600', desc: 'Поддерживает тезис' },
  { type: 'Контраргумент', icon: '⚡', color: 'bg-rose-600', desc: 'Опровергает утверждение' },
  { type: 'Вопрос', icon: '❓', color: 'bg-amber-500', desc: 'Уточнение или вызов' },
  { type: 'Вывод', icon: '🏁', color: 'bg-violet-600', desc: 'ИИ-синтез позиций' },
];

export default function LandingPage({ onStartDemo }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <GitBranch size={14} className="text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">ThinkTree</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-medium">beta</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#how" className="hover:text-white transition-colors">Как работает</a>
            <a href="#cases" className="hover:text-white transition-colors">Применения</a>
            <a href="#pricing" className="hover:text-white transition-colors">Тарифы</a>
          </div>
          <button
            onClick={onStartDemo}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium transition-colors"
          >
            Попробовать →
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/3 w-[400px] h-[300px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-6">
              <Zap size={13} className="text-indigo-400" />
              Интерактивная карта рассуждений с ИИ
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Превращайте споры
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-rose-400 bg-clip-text text-transparent">
                в структуру знаний
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Ведите диалог — ИИ в реальном времени выделяет тезисы, аргументы и контраргументы, 
              строя интерактивное дерево рассуждений для вашей команды.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                onClick={onStartDemo}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-lg shadow-indigo-900/50 transition-colors"
              >
                Запустить демо <ArrowRight size={16} />
              </motion.button>
              <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white transition-colors font-medium">
                Смотреть видео →
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-4">Бесплатно до 5 сессий · Без регистрации в демо</p>
          </motion.div>
        </div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-5xl mx-auto mt-16 relative"
        >
          <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/50 bg-slate-900">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 border-b border-slate-800">
              <div className="w-3 h-3 rounded-full bg-rose-500/70" />
              <div className="w-3 h-3 rounded-full bg-amber-500/70" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              <div className="flex-1 mx-4 h-5 rounded bg-slate-800 flex items-center px-3">
                <span className="text-xs text-slate-500">thinktree.ai/session/strategy-2025</span>
              </div>
            </div>
            {/* Fake tree preview */}
            <div className="h-80 bg-slate-950 relative overflow-hidden p-6">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #475569 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              {/* Mini tree preview */}
              <div className="relative z-10 flex items-start gap-8 pt-4 pl-4 scale-90 origin-top-left">
                {/* Root */}
                <div className="flex flex-col items-center gap-2">
                  <div className="px-4 py-2.5 rounded-xl bg-slate-700 border border-slate-600 w-48">
                    <div className="text-xs text-slate-400 mb-1">🎯 Тема</div>
                    <div className="text-sm font-medium text-white">Выход на европейский рынок</div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 pt-4">
                  {/* Thesis */}
                  <div className="flex items-start gap-8">
                    <div className="px-3 py-2 rounded-xl bg-indigo-600/80 border border-indigo-500 w-44">
                      <div className="text-xs text-indigo-200 mb-0.5">💡 Тезис</div>
                      <div className="text-xs font-medium text-white">Начать с Германии и Польши</div>
                    </div>
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="px-3 py-2 rounded-xl bg-emerald-600/80 border border-emerald-500 w-40">
                        <div className="text-xs text-emerald-200 mb-0.5">✅ Аргумент</div>
                        <div className="text-xs font-medium text-white">Берлинский партнёр</div>
                      </div>
                      <div className="flex items-start gap-6">
                        <div className="px-3 py-2 rounded-xl bg-rose-600/80 border border-rose-500 w-40">
                          <div className="text-xs text-rose-200 mb-0.5">⚡ Контраргумент</div>
                          <div className="text-xs font-medium text-white">Бюджет $2M/год</div>
                        </div>
                        <div className="flex flex-col gap-2 pt-1">
                          <div className="px-3 py-2 rounded-xl bg-emerald-600/80 border border-emerald-500 w-36">
                            <div className="text-xs text-emerald-200 mb-0.5">✅ Ответ</div>
                            <div className="text-xs font-medium text-white">AWS EU Frankfurt</div>
                          </div>
                          <div className="px-3 py-2 rounded-xl bg-violet-600/80 border border-violet-500 w-36">
                            <div className="text-xs text-violet-200 mb-0.5">🏁 Вывод</div>
                            <div className="text-xs font-medium text-white">Польша — первый шаг</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* SVG lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" style={{ zIndex: 5 }}>
                <path d="M 230 90 C 270 90 270 115 310 115" stroke="#818cf8" strokeWidth="1.5" fill="none" />
                <path d="M 230 90 C 270 90 270 165 310 165" stroke="#818cf8" strokeWidth="1.5" fill="none" />
                <path d="M 455 115 C 495 115 495 140 535 140" stroke="#34d399" strokeWidth="1.5" fill="none" />
                <path d="M 455 165 C 495 165 495 195 535 195" stroke="#fb7185" strokeWidth="1.5" strokeDasharray="4 2" fill="none" />
                <path d="M 675 195 C 715 195 715 215 755 215" stroke="#34d399" strokeWidth="1.5" fill="none" />
                <path d="M 675 195 C 715 195 715 255 755 255" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
              </svg>
              {/* AI badge */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-600/30 border border-violet-500/40">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs text-violet-300 font-medium">ИИ структурирует...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Node types legend */}
      <section className="py-12 px-6 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm text-slate-500 mb-6 uppercase tracking-wider font-medium">Типы узлов в дереве рассуждений</p>
          <div className="flex flex-wrap justify-center gap-3">
            {nodeTypes.map(nt => (
              <div key={nt.type} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${nt.color} border border-white/10`}>
                <span className="text-sm">{nt.icon}</span>
                <span className="text-xs font-semibold text-white">{nt.type}</span>
                <span className="text-xs text-white/60">{nt.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Как это работает</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Диалог превращается в живую карту знаний автоматически</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} hover:border-opacity-50 transition-all`}
              >
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="cases" className="py-20 px-6 bg-slate-900/40 border-y border-slate-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Для кого это</h2>
            <p className="text-slate-400">Везде, где важна структура мышления и прозрачность решений</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {usecases.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-colors"
              >
                <div className="text-3xl mb-3">{uc.emoji}</div>
                <h3 className="font-semibold text-white text-sm mb-1">{uc.title}</h3>
                <p className="text-xs text-slate-500">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">Тарифы</h2>
            <p className="text-slate-400">Начните бесплатно, масштабируйтесь с командой</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Free', price: '0', period: 'навсегда', features: ['5 сессий', '3 участника', 'Базовые типы узлов', 'Экспорт PNG'], cta: 'Начать', highlight: false },
              { name: 'Team', price: '2 900', period: '/мес', features: ['Безлимитные сессии', 'До 20 участников', 'ИИ-структуризация live', 'Экспорт PDF / Miro', 'История версий'], cta: 'Попробовать 14 дней', highlight: true },
              { name: 'Enterprise', price: 'Запрос', period: '', features: ['White-label', 'API интеграции', 'SSO / LDAP', 'Приватное облако', 'SLA 99.9%'], cta: 'Написать нам', highlight: false },
            ].map((plan, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${plan.highlight
                  ? 'bg-indigo-600 border-indigo-500 shadow-xl shadow-indigo-900/40'
                  : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                {plan.highlight && (
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-yellow-300 font-medium">Популярный</span>
                  </div>
                )}
                <div className="mb-4">
                  <div className={`text-sm font-medium mb-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.price !== '0' && plan.price !== 'Запрос' && <span className="text-sm text-slate-400">₽</span>}
                    <span className={`text-sm ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <ChevronRight size={13} className={plan.highlight ? 'text-indigo-200' : 'text-slate-500'} />
                      <span className={plan.highlight ? 'text-white' : 'text-slate-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  plan.highlight
                    ? 'bg-white text-indigo-700 hover:bg-indigo-50'
                    : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 mb-6 shadow-lg shadow-indigo-900/40">
            <Brain size={28} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Готовы структурировать мышление?</h2>
          <p className="text-slate-400 mb-8">Запустите демо прямо сейчас — без регистрации. Увидите, как работает ИИ-структуризация в реальном диалоге.</p>
          <motion.button
            onClick={onStartDemo}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-lg text-white shadow-lg shadow-indigo-900/50 transition-colors"
          >
            Открыть демо <ArrowRight size={18} />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/50 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <GitBranch size={11} className="text-white" />
          </div>
          <span className="text-sm font-bold text-slate-400">ThinkTree</span>
        </div>
        <p className="text-xs text-slate-600">© 2025 ThinkTree. Интерактивные карты рассуждений для бизнеса.</p>
      </footer>
    </div>
  );
}
