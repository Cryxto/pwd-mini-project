
export default function page() {
  return <>
     <div className='flex justify-center mx-10 my-10'>
      {/* {children} */}
      <div role="tablist" className="tabs tabs-lifted max-w-full w-full">
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab font-bold"
          aria-label="Tab 1"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 w-full"
        >
          Tab content 1
        </div>
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Tab 1-1"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6 w-full"
        >
          Tab content 1-1
        </div>

        
      </div>
    </div>
  </>
}