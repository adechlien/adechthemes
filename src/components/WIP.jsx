export default function WIP() {
  return (
    <section className="">
      <div className="flex flex-col-reverse sm:flex-row items-center sm:items-start justify-between gap-6 max-w-3xl bg-adech-swamp-2 p-8 rounded-xl mx-auto my-8">
        <div className="min-w-0 text-center sm:text-left">
          <h2 className="text-2xl font-semibold text-adech-boulevard-1">
            Work in progress
          </h2>
          <p className="text-sm text-adech-boulevard-4">
            This section is still being built. Check back soon.
          </p>
        </div>

        <img src="/wip.svg" alt="Work in progress" className="size-32" />
      </div>
    </section>
  );
}
