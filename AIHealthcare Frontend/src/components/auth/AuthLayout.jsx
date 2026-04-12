import { APP_NAME } from '../../common/constants';

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="min-h-screen bg-surface p-4 sm:p-6 lg:p-12 flex items-center justify-center">
      <div className="mx-auto grid w-full max-w-[64rem] overflow-hidden rounded border border-slate-300 bg-white shadow-xl lg:grid-cols-2">
        <section className="hidden border-r border-slate-300 bg-slate-50 px-12 py-16 text-slate-800 lg:flex lg:flex-col lg:justify-between relative">
          <div className="absolute top-0 w-full h-1 bg-medicalBlue left-0"></div>
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-widest text-medicalBlue">Medical Intelligence</p>
            <h1 className="mt-6 font-serif text-4xl font-semibold leading-tight text-slate-900 border-b border-slate-200 pb-6">{APP_NAME}</h1>
            <p className="mt-8 font-serif text-lg italic text-slate-600 leading-relaxed">
              Enterprise-grade assistant for prescription digitization, semantic search, and AI-based patient support.
            </p>
          </div>

          <div className="mt-12 space-y-4 font-sans text-sm text-slate-700">
            <p className="border-l-4 border-medicalBlue bg-white px-4 py-3 shadow-sm">
              <strong className="block text-slate-900 font-serif mb-1">Secure & Private</strong>
              HIPAA-aware style interface with secure token-based session handling.
            </p>
            <p className="border-l-4 border-medicalBlue bg-white px-4 py-3 shadow-sm">
              <strong className="block text-slate-900 font-serif mb-1">Advanced AI</strong>
              Structured prescription extraction, historical views, and contextual AI chat.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 bg-white">
          <div className="w-full max-w-sm">
            <h2 className="font-serif text-3xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-3 font-serif text-slate-500 italic">{subtitle}</p>
            <div className="mt-10">{children}</div>
            {footer ? <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-600">{footer}</div> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
