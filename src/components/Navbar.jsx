import React from 'react'

const Navbar = () => {
    return (
        <nav className='bg-slate-800 text-white '>
            {/* h-14 is height of navbar */}
            {/* mycontainer keeps logo and git at centre */}
            <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">

                <div className="logo font-bold text-white text-2xl">
                    <span className='text-yellow-300'> &lt;</span>

                    <span >Key</span><span className='text-yellow-300'>Master🗝&gt;</span>


                </div>
                {/* <ul>
                    <li className='flex gap-4 '>
                        <a className='hover:font-bold' href='/'>Home</a>
                        <a className='hover:font-bold' href='#'>About</a>
                        <a className='hover:font-bold' href='#'>Contact</a>
                    </li>
                </ul> */}
                {/* Rig white gives a default outline , ring-1 for 1px */}
                <button className='text-yellow-300 bg-slate-900  hover:bg-slate-600 my-5 mx-2 rounded-full flex  justify-between items-center ring-yellow-300 ring-1'>
                    {/* padding creates space inside the element
                        margin creates space outside the element */}
                    {/* invert forms negative of image */}
                    <a href="https://github.com/1rishuraj" target="_blank" class="flex items-center">
                    <img class="invert w-10 p-1" src="/icons/github.svg" alt="github logo" />
                    <span class="font-bold px-2">GitHub</span>
                    </a>


                </button>
            </div>
        </nav>
    )
}

export default Navbar