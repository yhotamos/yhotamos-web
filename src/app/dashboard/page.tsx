export default async function Page() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-(--font-geist-sans)">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-lg">This is the dashboard page.</p>
        <a href="/">Go back to home page</a>
      </main>
    </div>
  );
}
