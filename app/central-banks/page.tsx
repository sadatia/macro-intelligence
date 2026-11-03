import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const revalidate = 300;

async function getCentralBanks() {
  try {
    const records = await prisma.centralBank.findMany({
      orderBy: { code: 'asc' },
    });
    return records;
  } catch (error) {
    console.error('Error fetching central bank data:', error);
    return [];
  }
}

export default async function CentralBanksPage() {
  const banks = await getCentralBanks();

  const getStanceBadge = (stance: string) => {
    switch (stance.toUpperCase()) {
      case 'HAWKISH':
        return 'macro-badge-emerald';
      case 'DOVISH':
        return 'macro-badge-rose';
      default:
        return 'macro-badge-amber';
    }
  };

  return (
    <main className="min-h-screen bg-[#06080d] text-slate-100 p-6 md:p-8 font-mono space-y-6 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <h1 className="text-2xl font-bold tracking-wider text-white">
            CENTRAL BANK POLICY MATRIX
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Policy Interest Rates, Hawkish/Dovish Orientations, and Upcoming Policy Decisions
        </p>
      </div>

      {/* MATRIX CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {banks.map((bank) => (
          <div
            key={bank.id}
            className="macro-card p-5 space-y-4 hover:border-slate-700/80 transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 tracking-wider">
                {bank.code}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStanceBadge(
                  bank.stance
                )}`}
              >
                {bank.stance}
              </span>
            </div>

            <div>
              <h2 className="text-sm font-bold text-white leading-snug">{bank.name}</h2>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-slate-800/60">
              <span className="text-xs text-slate-400">Policy Rate:</span>
              <span className="text-xl font-bold text-emerald-400">{bank.rate}</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 text-xs">
              <span className="text-slate-400">Next Decision:</span>
              <span className="text-slate-200 font-bold">
                {new Date(bank.nextDecision).toISOString().split('T')[0]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
