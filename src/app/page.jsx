async function getData() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/shifts`, {
    cache: 'no-store'
  })
  return res.json();
}

const Page = async () => {
  // const data = await getData();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    {/* {
      data.map(x => {
        return (
          <div key={x.id}>
            <p>{x.location.name}</p>
          </div>
        )
      })
    } */}
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
    <h1 className='text-7xl text-bold text-emerald-500'>Onshift</h1>
      </div>
    </main>
  )
}

export default Page
