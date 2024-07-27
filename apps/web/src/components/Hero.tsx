import Image from 'next/image';

function Hero() {
  return (

    <section
      id="hero"
      className="w-full h-[93vh] relative self-center shadow-lg drop-shadow-2xl bg-black rounded-br-[20rem] mb-28"
    >
      <div style={{position: 'relative', minHeight: '100%', minWidth: '100vw'}}>
        <Image
          className="top-0 left-0 w-full h-[93vh] object-cover rounded-br-[20rem] shadow-2xl relative"
          src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="/"
          fill={true}
          sizes="100vw"
          priority
        />
      </div>
      <div className="bg-black/80 absolute top-0 left-0 w-full h-[93vh] rounded-br-[20rem]" />
      <div className="absolute top-0 w-full h-full flex flex-col justify-center text-slate-100 items-center ">
        <div className="max-w-[1100px] absolute p-4 m-4 ">
          <p className="font-medium">Easy to</p>
          <h1 className="font-bold text-5xl md:text-7xl drop-shadow-2xl rounded-br-[20rem]">
            Make Your Idea Comes True
          </h1>
          <p className="max-w-[600px] drop-shadow-2xl py-2 text-xl leading-loose">
          managing event cannot be so easy even for first time organizers, while powerful and flexible for large events.
          </p>
        </div>
      </div>
    </section>
  );
}
export { Hero };
