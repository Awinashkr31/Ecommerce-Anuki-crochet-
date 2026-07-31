export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100 prose prose-neutral max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}
